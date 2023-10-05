/*
 * comments backend - crypto backend for Chat.MessageRoot
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

const DELETED_USER = "deleted user";

async function genKeyWithIV() {
	return [
		await crypto.subtle.generateKey({
			name: "AES-GCM",
			length: 256
		}, true, ["encrypt", "decrypt"]),
		
		crypto.getRandomValues(new Uint8Array(12))
	];
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
			[e[0], new CryptUser(e[0], e[1].png, e[1].pwhash)]));
		this.children = obj.chat.map((m, i) => Chat.hydrateMessage(this, this, m, i))
	}

	// override
	addUser(n, p, h) {
		if (!Util.base64valid(h))
			throw new TypeError("invalid base64 password hash");
		if (Util.unbase64(h).length !== 32)
			throw new TypeError("not a 256-bit hash");
		this.users[n] = new CryptUser(n, p, h);
		this.triggerModify();
		return this.users[n];
	}

	async save(force = false) {
		if (this.cryptInvalid && !force) {
			this.#error("will not save due to invalid state (previous error)");
			return false;
		}
		try {
			const enc = await this.encrypt();
			Deno.writeTextFileSync(this.cryptFile, JSON.stringify({
				enc: Util.base64(enc[0]),
				key: Util.base64(enc[1]),
				iv:  Util.base64(enc[2])
			}));
			return true;
		} catch(e) {
			this.#error("encrypt/write error:", e.message);
			return false;
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
			this.#warn("no key");
			return;
		}
		if (!enc?.iv?.length) {
			this.#warn("no IV");
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
			this.#info("successfully initialized with", Object.keys(this.users).length,
				"users and", this.children.length, "root-level messages");
		}
	}

	serializeUser() {
		return {
			messageRoot: true,
			users: Object.fromEntries(Object.entries(this.users).filter(u =>
				u[0] !== DELETED_USER).map(e => [e[0], e[1].serializeUser()])),
			chat: this.children.map(c => c.serialize())
		};
	}

	// override
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

export class CryptUser extends Chat.User {
	constructor(n, p, h) {
		super(n, p);
		if (typeof(h) !== "string")
			throw new TypeError("password must be a base64 string");
		this.pwhash = h;
		this.regenerateToken();
	}

	regenerateToken() {
		this.token = Util.base64(crypto.getRandomValues(new Uint8Array(32)));
	}

	serializeUser() {
		return super.serialize();
	}

	// override
	serialize() {
		return {
			...super.serialize(),
			pwhash: this.pwhash
		}
	}
}
