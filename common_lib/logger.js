/*
 * comments page common libs - logger
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

import { either, isDeno, denoLogRGB } from './util.js';

export default class Logger {
	constructor(c, s) {
		this.components = Array.isArray(c) ? c : [c];
		this.msgBegin = either(s?.at(0), "[");
		this.msgSeparator = either(s?.at(1), "/");
		this.msgEnd = either(s?.at(2), "]");
		this.msgTag = this.msgBegin +
			this.components.join(this.msgSeparator) +
			this.msgEnd;

		if (isDeno()) {
			this.warnFunc = (...a) => denoLogRGB(0xFFFF00, ...a);
			this.errorFunc = (...a) => denoLogRGB(0xFF0000, ...a);
		} else {
			this.warnFunc = console.warn;
			this.errorFunc = console.error;
		}
	}

	sub(c, s = null) {
		if (s && typeof(s) !== "string" && !Array.isArray(s))
			throw new TypeError("s must be a string or array");
		return new Logger(
			[...this.components, ...(Array.isArray(c) ? c : [c])],
			either(s, [this.msgBegin, this.msgSeparator, this.msgEnd]));
	}

	debug() {
		console.debug(this.msgTag, "DEBUG:", ...arguments);
	}

	info() {
		console.log(this.msgTag, "INFO:", ...arguments);
	}

	warn() {
		this.warnFunc(this.msgTag, "WARN:", ...arguments);
	}

	error() {
		this.errorFunc(this.msgTag, "ERROR:", ...arguments);
	}
}
