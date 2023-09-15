import * as Path from 'https://deno.land/std@0.201.0/path/mod.ts';

export { Path };

export function lstatSafe(path) {
	try {
		return Deno.lstatSync(path);
	} catch (_) {
		return false;
	}
}

export function exists(path) {
	try {
		Deno.lstatSync(path);
		return true;
	} catch(e) {
		if (e instanceof Deno.errors.NotFound)
			return false;
		throw e;
	}
}

export function agnosticPath(p) {
	// my syntax highlight doesn't handle regex like this
	// so it thinks this is a comment. I'm furious
	return p.replace(/\//g, Path.SEP);
}
