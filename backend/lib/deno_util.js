/*
 * comments backend - Deno-specific utilities
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

// sometimes doing this is necessary. (exit handlers!)
// I have no fucking clue why this needs to be a hack
// when it could be implemented as first-class functionality
export function pending(p) {
	return (Deno.inspect(p) === "Promise { <pending> }") ? true : false;
}

export function resolveRelative(p) {
	return Path.relative(p, Path.resolve(...[...arguments].slice(1)));
}
