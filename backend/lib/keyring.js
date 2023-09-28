/*
 * comments backend - cookie signing keyring for oak
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
import * as Util from '../../common_lib/util.js';
import * as DenoUtil from './deno_util.js';

export default class Keyring {
	// 604800 seconds = 1 week
	constructor(path, size = 8, expire = 604800) {
		this.logger = new Logger("Keyring");
		this.path = path;
		this.ringSize = size;
		this.keys = [];
		this.timestamp = null;
		this.expire = expire;

		this.load();
	}

	#info() {
		this.logger.info(this.path + ":", ...arguments);
	}

	#warn() {
		this.logger.warn(this.path + ":", ...arguments);
	}

	#error() {
		this.logger.error(this.path + ":", ...arguments);
	}

	initialize() {
		this.timestamp = Util.unixTime();
		// this construct seems intuitive but it's actually a
		// weird hack. the first argument counts as "array-like"
		// because it has a length property. this language is bad
		this.keys = Array.from({length: this.ringSize}, _ =>
			crypto.getRandomValues(new Uint8Array(32)));
		this.#info("initialized", this.ringSize, "signing keys");
	}

	load() {
		if (!DenoUtil.exists(this.path)) {
			this.#info("backing file will be created on save");
			this.initialize();
			return;
		}
		try {
			const data = JSON.parse(Deno.readTextFileSync(this.path));
			if (Util.unixTime() - data.timestamp >= this.expire) {
				this.#warn("keyring has expired. regenerating");
				this.initialize();
				return;
			}
			if (data.keys.length !== this.ringSize) {
				this.#warn("wrong size keyring. regenerating");
				this.initialize();
				return;
			}
			this.timestamp = data.timestamp;
			this.keys = data.keys.map(k => Util.unbase64(k));
		} catch(e) {
			this.#error("failed to load, keyring is empty. error:", e.message);
		}
		this.#info("loaded", this.ringSize, "signing keys");
	}

	save() {
		try {
			Deno.writeTextFileSync(this.path, JSON.stringify({
				timestamp: this.timestamp,
				keys: this.keys.map(k => Util.base64(k))
			}));
		} catch(e) {
			this.#error("failed writing keys to file:", e.message);
		} finally {
			this.#info("wrote", this.ringSize, "keys");
		}
	}
}
