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
