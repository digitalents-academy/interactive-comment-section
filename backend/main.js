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

import * as Util from './util.js';
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
	return new Chat.CryptMessageRoot(
		Util.unbase64(d.enc),
		Util.unbase64(d.key),
		Util.unbase64(d.iv)
	);
}

async function cryptSave(path) {
	const enc = await chat.encrypt();
	Deno.writeTextFileSync(path, JSON.stringify({
		enc: Util.base64(enc[0]),
		key: Util.base64(enc[1]),
		iv:  Util.base64(enc[2])
	}));
}

const CHAT_PATH = "./chat.json";

const svr    = new Oak.Application();
const router = new Oak.Router();
const abort  = new AbortController();

const chat = cryptLoad(CHAT_PATH);
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
	`;
});

router.get("/api/chat", ctx => {
	ctx.response.type = "application/json";
	ctx.response.body = chat.serialize();
});

Deno.addSignalListener("SIGINT", async () => {
	console.log("Stopping!");
	await cryptSave(CHAT_PATH);
	abort.abort();
});

svr.addEventListener("error", e => {
	console.log(e.error);
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
