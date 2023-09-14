export function base64(a) {
	if (!a.length)
		return "";
	return btoa(Array.from(a).map(i =>
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
