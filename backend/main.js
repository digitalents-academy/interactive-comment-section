/*
 * comments backend - main
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

import * as Oak from 'https://deno.land/x/oak@v12.6.1/mod.ts';

import * as Chat from './chat.js';

function cryptLoad(path) {
	// I want to flatten the person who decided that
	// all the stats should return an error for file not found
	try {
		var fi = Deno.lstatSync(path);
	} catch(_) {
		fi = { isFile: false };
	}
	if (!fi.isFile)
		return new Chat.CryptMessageRoot();
	const d = JSON.parse(Deno.readTextFileSync(path));
	const data = new TextEncoder().encode(atob(d.enc));
	const key  = new TextEncoder().encode(atob(d.key));
	const iv   = new TextEncoder().encode(atob(d.iv));
	return new Chat.CryptMessageRoot(data, key, iv);
}

async function cryptSave(path) {
	const enc = await chat.encrypt();
	Deno.writeTextFileSync(path, JSON.stringify({
		enc: btoa(new TextDecoder().decode(enc[0])),
		key: btoa(new TextDecoder().decode(enc[1])),
		iv:  btoa(new TextDecoder().decode(enc[2]))
	}));
}

const svr    = new Oak.Application();
const router = new Oak.Router();
const abort  = new AbortController();

const chat = cryptLoad("./chat.json");
await chat.cryptReady;

router.get("/", ctx => {
	ctx.response.body = `
		<!DOCTYPE html>
		<html>
			<head>
				<title>Hi</title>
			</head>
			<body>
				<h1>Placeholder index</h1>
			</body>
		</html>
	`
});

router.get("/api/chat", ctx => {
	ctx.response.body = chat.serialize();
});

Deno.addSignalListener("SIGINT", () => {
	console.log("Stopping!");

	abort.abort();
});

svr.use(router.routes());
svr.use(router.allowedMethods());

svr.listen({
	secure: true,
	signal: abort.signal,
	port: 8443,
	key: Deno.readTextFileSync("./cert/ckey.pem"),
	cert: Deno.readTextFileSync("./cert/cert.pem")
});
