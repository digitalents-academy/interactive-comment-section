export function lstatSafe(path) {
	try {
		return Deno.lstatSync(path);
	} catch (_) {
		return false;
	}
}
