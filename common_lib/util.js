/*
 * comments backend - utilities, some of which should be in vanilla JS
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

export function base64valid(a) {
	try {
		void atob(a);
		return true;
	} catch(_) {
		return false;
	}
}

export function base64(a) {
	if (a instanceof ArrayBuffer)
		a = new Uint8Array(a);
	if (!a.length)
		return "";
	return btoa(Array.from(a, i =>
		String.fromCharCode(i)).join(""));
}

export function unbase64(s) {
	if (!s.length)
		return new Uint8Array();
	return new Uint8Array(atob(s).split("").map(c =>
		c.charCodeAt(0)));
}

export function unixTime() {
	return Math.floor(new Date().valueOf() / 1000);
}

export function either(a, b) {
	return a ? a : b;
}

export function denoLogRGB(c) {
	const rc = Array.isArray(c) ? c :
		[ c >> 16 & 0xFF, c >> 8 & 0xFF, c & 0xFF ];
	console.log("\x1b[38;2;" + rc.join(";") + "m" +
		[...arguments].slice(1).join(" ") + "\x1b[39m");
}

export function isDeno() {
	return navigator.userAgent.startsWith("Deno/");
}

export async function sha256(b) {
	return base64(await crypto.subtle.digest("SHA-256", b));
}

export function sha256str(s) {
	return sha256(new TextEncoder().encode(s));
}
