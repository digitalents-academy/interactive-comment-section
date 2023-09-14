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
import * as DenoUtil from './lib/deno_util.js';
import * as Chat from './lib/chat.js';

const SVR_PORT = 8443;
const CHAT_PATH = "./chat.json";
const PFP_PATH = "./pfps";

function cryptLoad() {
	// I want to flatten the person who decided that
	// all the stat()s should throw on file not found
	try {
		var fi = Deno.lstatSync(CHAT_PATH);
	} catch(_) {
		fi = { isFile: false };
	}
	if (!fi.isFile)
		return new Chat.CryptMessageRoot();
	const d = JSON.parse(Deno.readTextFileSync(CHAT_PATH));
	return new Chat.CryptMessageRoot(
		Util.unbase64(d.enc),
		Util.unbase64(d.key),
		Util.unbase64(d.iv)
	);
}

async function cryptSave(c) {
	const enc = await c.encrypt();
	Deno.writeTextFileSync(CHAT_PATH, JSON.stringify({
		enc: Util.base64(enc[0]),
		key: Util.base64(enc[1]),
		iv:  Util.base64(enc[2])
	}));
	return enc;
}

async function getUserBody(ctx) {
	const raw = await ctx.request.body({type: "form-data"}).value;
	return raw.read({
		outPath: PFP_PATH
	});
}

function serveError(ctx, s, msg) {
	lroute.warn("an API request to", ctx.request.url.pathname,
		"failed:", msg);
	ctx.response.status = s;
	ctx.response.body = {
		success: false,
		error: msg
	};
}

const logger = new Logger("Main");
const lcrypt = logger.sub("Crypt");
const lroute = logger.sub("Routing");

const svr    = new Oak.Application();
const router = new Oak.Router();
const abort  = new AbortController();

if (!DenoUtil.lstatSafe(PFP_PATH)?.isDir) {
	logger.info(PFP_PATH, "not found, creating");
	Deno.mkdirSync(PFP_PATH);
}

lcrypt.info("Loading from", CHAT_PATH);
let chat = cryptLoad(CHAT_PATH);
await chat.cryptReady;

chat.onTriggerModify(async c => {
	lcrypt.info("Refreshing! (modify count",
		chat.modifyCount, ">=", chat.cryptSaveThreshold);
	const enc = await cryptSave(c);
	chat = new Chat.CryptMessageRoot(...enc);
});

router.get("/api/chat", ctx => {
	ctx.response.type = "application/json";
	ctx.response.body = chat.serialize();
});

router.post("/api/user/new", async ctx => {
	ctx.response.type = "application/json";
	let body;
	try {
		body = await getUserBody(ctx);
	} catch (_) {
		serveError(ctx, 400, "invalid or missing multipart form body");
		return;
	}
	const name = body.fields.name;
	if (chat.users[name]) {
		serveError(ctx, 403, "this user exists");
		return;
	}
	// TODO: fix this. f.name contains a filename, not the field name
	const png  = body.files.find(f => f.name === "png");
	if (!png) {
		serveError(ctx, 400, "missing profile picture");
		return;
	}
	if (png.contentType !== "image/png") {
		serveError(ctx, 400, `invalid profile picture (must be image/png, got ${png.contentType}`);
		Deno.removeSync(png.filename);
		return;
	}
	chat.addUser(name, png.name);
	ctx.response.body = { success: true };
});

router.post("/api/pfps/:name", ctx => {
	const path = PFP_PATH + "/" + ctx.params.name;
	if (!DenoUtil.lstatSafe(path)?.isFile) {
		ctx.response.type = "application/json";
		serveError(404, "no such profile picture");
	}
	ctx.response.type = "image/png";
	ctx.response.body = Deno.readFileSync(path);
});

Deno.addSignalListener("SIGINT", async () => {
	logger.warn("Stopping!");
	lcrypt.info("Saving chat");
	await cryptSave(chat);
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
