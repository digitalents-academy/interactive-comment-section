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

import Logger from '../common_lib/logger.js';
import * as DenoUtil from './lib/deno_util.js';
import * as CC from './lib/cryptchat.js';

const config = {
	svr_port: 8443,
	chat_path: DenoUtil.agnosticPath("./comments.json"),
	pfp_path: DenoUtil.agnosticPath("./pfps"),
	ckey_path: DenoUtil.agnosticPath("./cert/ckey.pem"),
	cert_path: DenoUtil.agnosticPath("./cert/cert.pem")
};

const logger = new Logger("Main");
const lroute = logger.sub("Routing");

logger.info("Configuration:\n\t" + Object.entries(config).map(e =>
	e.join(" => ")).join("\n\t"));

async function getUserBody(ctx) {
	const raw = await ctx.request.body({type: "form-data"}).value;
	return raw.read({
		outPath: config.pfp_path
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

const svr    = new Oak.Application();
const router = new Oak.Router();
const abort  = new AbortController();

const chat = new CC.CryptMessageRoot(config.chat_path);
await chat.cryptReady;

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
	const png  = body.files?.find(f => f.name === "png");
	if (!png) {
		serveError(ctx, 400, "missing profile picture");
		return;
	}
	if (png.contentType !== "image/png") {
		serveError(ctx, 400, `invalid profile picture (must be image/png, got ${png.contentType}`);
		Deno.removeSync(png.filename);
		return;
	}
	chat.addUser(name, DenoUtil.Path.basename(png.filename));
	ctx.response.body = { success: true };
});

if (!DenoUtil.lstatSafe(config.pfp_path)?.isDirectory) {
	if (DenoUtil.exists(config.pfp_path)) {
		logger.error("Something other than a directory already exists at", config.pfp_path);
		Deno.exit(1);
	}
	logger.info("Creating profile picture directory");
	Deno.mkdirSync(config.pfp_path);
}

router.post("/api/pfps/:name", ctx => {
	const path = DenoUtil.agnosticPath(config.pfp_path + "/" + ctx.params.name);
	if (!DenoUtil.lstatSafe(path)?.isFile) {
		ctx.response.type = "application/json";
		serveError(404, "no such profile picture");
	}
	ctx.response.type = "image/png";
	ctx.response.body = Deno.readFileSync(path);
});

Deno.addSignalListener("SIGINT", () => {
	logger.warn("Stopping!");
	chat.save();
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

logger.info(`HTTPS starting on ${config.svr_port}`);

svr.listen({
	secure: true,
	signal: abort.signal,
	port: config.svr_port,
	key: Deno.readTextFileSync(config.ckey_path),
	cert: Deno.readTextFileSync(config.cert_path)
});
