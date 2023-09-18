/*
 * comments backend - crypto support for Chat.MessageRoot
 * Copyright (C) 2023  Marisa
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Logger from '../../common_lib/logger.js';
import * as Chat from '../../common_lib/chat.js';
import * as Util from '../../common_lib/util.js';
import * as DenoUtil from './deno_util.js';

async function genKeyWithIV() {
	return [
		await crypto.subtle.generateKey({
			name: "AES-GCM",
			length: 256
		}, true, ["encrypt", "decrypt"]),
		
		crypto.getRandomValues(new Uint8Array(12))
	];
}

function cryptHydrateMessage(r, up, m, i) {
	// r.users[m.user] should be undefined for deleted users
	// which is fine (check Message constructor from ../common_lib/chat.js)
	const a = new CryptMessage(r, up, i,
		r.users[m.user], m.votes, m.content, m.timestamp, m.token);
	for (let i = 0; i < m.children.length; i++)
		a.children.push(cryptHydrateMessage(r, a, m.children[i], i));
	return a;
}

export class CryptMessageRoot extends Chat.MessageRoot {
	constructor(path) {
		super();
		this.logger = new Logger("CryptMessageRoot");
		this.cryptFile = path;
		this.cryptKey = null;
		this.cryptIV  = null; // init vector
		// create/update/delete threshold for save().
		// this can be increased for chat trees that see
		// more activity to prevent server load caused by
		// crypt ops
		this.cryptSaveThreshold = 50;
		this.cryptModifyCount = 0;
		this.cryptInvalid = false;

		this.cryptReady = this.load();
	}
	
	#info() {
		this.logger.info(this.cryptFile + ":", ...arguments);
	}

	#warn() {
		this.logger.warn(this.cryptFile + ":", ...arguments);
	}

	#error() {
		this.logger.error(this.cryptFile + ":", ...arguments);
	}

	// override
	hydrate(obj) {
		if (!obj.messageRoot)
			throw new TypeError("not a serialized MessageRoot");
		this.users = Object.fromEntries(Object.entries(obj.users).map(e =>
			[e[0], new CryptUser(e[0], e[1].png, e[1].pwhash, e[1].token)]));
		this.children = obj.chat.map((m, i) => cryptHydrateMessage(this, this, m, i))
	}

	// override
	addUser(n, p, h) {
		if (!Util.base64valid(h)) {
			this.#error("addUser(): invalid base64 password hash");
			return;
		}
		this.users[n] = new CryptUser(n, p, h);
		this.triggerModify();
	}

	async save(force = false) {
		if (this.cryptInvalid && !force) {
			this.#error("will not save due to invalid state (previous error)");
			return;
		}
		try {
			const enc = await this.encrypt();
			Deno.writeTextFileSync(this.cryptFile, JSON.stringify({
				enc: Util.base64(enc[0]),
				key: Util.base64(enc[1]),
				iv:  Util.base64(enc[2])
			}));
		} catch(e) {
			this.#error("encrypt/write error:", e.message);
		} finally {
			this.#info("written successfully");
		}
	}

	async load() {
		[this.cryptKey, this.cryptIV] = await genKeyWithIV();
		if (!DenoUtil.exists(this.cryptFile)) {
			this.#warn("crypt file not found, using new");
			return;
		}
		if (!DenoUtil.lstatSafe(this.cryptFile).isFile) {
			this.#error("existing non-file object at", this.cryptFile);
			this.cryptInvalid = true;
			return;
		}
		const enc = JSON.parse(Deno.readTextFileSync(this.cryptFile));
		if (!enc?.enc?.length) {
			this.#warn("no data");
			return;
		}
		if (!enc?.key?.length) {
			this.#warn("no key, initialized empty");
			return;
		}
		if (!enc?.iv?.length) {
			this.#warn("no IV, initialized empty");
			return;
		}
		try {
			const key = await crypto.subtle.importKey("raw", Util.unbase64(enc.key),
				"AES-GCM", true, ["encrypt", "decrypt"]);
			const iv = Util.unbase64(enc.iv);
			const dec = JSON.parse(new TextDecoder().decode(
				await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key,
					Util.unbase64(enc.enc))));
			this.hydrate(dec);
		} catch(e) {
			this.#error("decryption error:", e.message);
			this.cryptInvalid = true;
			return;
		} finally {
			this.#info("successfully initialized with", this.users.length,
				"users and", this.children.length, "root-level messages");
		}
	}

	serializeUser() {
		return {
			messageRoot: true,
			users: Object.fromEntries(Object.entries(this.users).filter(u =>
				u[0] !== DELETED_USER).map(e => [e[0], e[1].serializeUser()])),
			chat: this.children.map(c => c.serializeUser())
		};
	}

	// if this returns non-null, you should destroy this
	// object and make a new one, using the elements of
	// the returned array as arguments to the new one.
	async triggerModify() {
		this.cryptModifyCount++;
		if (this.cryptModifyCount < this.cryptSaveThreshold)
			return super.triggerModify();
		this.#info("Refreshing! modify count", this.cryptModifyCount,
			">=", this.cryptSaveThreshold);
		await this.save();
		[this.cryptKey, this.cryptIV] = await genKeyWithIV();
		this.cryptModifyCount = 0;
	}

	async encrypt() {
		// how am I supposed to indent this???
		return [await crypto.subtle.encrypt({
			name: "AES-GCM",
			iv: this.cryptIV
		}, this.cryptKey,
			new TextEncoder().encode(this.serializeString())),
			await crypto.subtle.exportKey("raw", this.cryptKey), this.cryptIV];
	}
}

export class CryptMessage extends Chat.Message {
	constructor(r, p, i, u, v, t, ts, tok) {
		super(r, p, i, u, v, t, ts);
		this.token = tok;
	}

	serializeUser() {
		return super.serialize();
	}

	serialize() {
		return {
			...super.serialize(),
			token: this.token
		}
	}
}

export class CryptUser extends Chat.User {
	constructor(n, p, h, t = null) {
		super(n, p);
		if (typeof(h) !== "string")
			throw new TypeError("password must be a base64 string");
		this.pwhash = h;
		this.token = (t === null) ? Util.base64(crypto.getRandomValues(new Uint8Array(32))) : t;
	}

	serializeUser() {
		return super.serialize();
	}

	serialize() {
		return {
			...super.serialize(),
			pwhash: this.pwhash,
			token: this.token
		}
	}
}
