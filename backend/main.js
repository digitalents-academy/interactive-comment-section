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

import Logger from './lib/logger.js';
import * as Util from './lib/util.js';
import * as Chat from './lib/chat.js';

function cryptLoad(path) {
	// I want to flatten the person who decided that
	// all the stat()s should throw on file not found
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

const SVR_PORT = 8443;
const CHAT_PATH = "./chat.json";

const logger = new Logger("Main");
const lcrypt = logger.sub("Crypt");
const lroute = logger.sub("Routing");

const svr    = new Oak.Application();
const router = new Oak.Router();
const abort  = new AbortController();

lcrypt.info("Loading from", CHAT_PATH);
const chat = cryptLoad(CHAT_PATH);
await chat.cryptReady;

router.get("/api/chat", ctx => {
	ctx.response.type = "application/json";
	ctx.response.body = chat.serialize();
});

Deno.addSignalListener("SIGINT", async () => {
	logger.warn("Stopping!");
	lcrypt.info("Saving to", CHAT_PATH);
	await cryptSave(CHAT_PATH);
	abort.abort();
});

svr.addEventListener("error", e => {
	console.log(e.error);
});

svr.use(router.routes());
svr.use(router.allowedMethods());
svr.use((ctx, next) => {
	lroute.warn("Not found:", ctx.request.url.pathname);
	next();
});

logger.info(`HTTPS starting on ${SVR_PORT}`);

svr.listen({
	secure: true,
	signal: abort.signal,
	port: SVR_PORT,
	key: Deno.readTextFileSync("./cert/ckey.pem"),
	cert: Deno.readTextFileSync("./cert/cert.pem")
});
