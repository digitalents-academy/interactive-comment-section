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

import Keyring from './lib/keyring.js';
import Logger from '../common_lib/logger.js';
import * as DenoUtil from './lib/deno_util.js';
import * as CC from './lib/cryptchat.js';

const config = {
	svr_port: 8443,
	chat_path: DenoUtil.agnosticPath("./comments.json"),
	pfp_path: DenoUtil.agnosticPath("./pfps"),
	cookie_keyring: DenoUtil.agnosticPath("./keyring.json"),
	keyring_size: 8,
	ckey_path: DenoUtil.agnosticPath("./cert/ckey.pem"),
	cert_path: DenoUtil.agnosticPath("./cert/cert.pem")
};

const logger = new Logger("Main");
const lroute = logger.sub("Routing");

logger.info("Configuration:\n\t" + Object.entries(config).map(e =>
	e.join(" => ")).join("\n\t"));

function serveError(ctx, s, msg) {
	lroute.warn("an API request to", ctx.request.url.pathname,
		"failed:", msg);
	ctx.response.status = s;
	ctx.response.body = {
		success: false,
		error: msg
	};
}

async function checkBody(ctx, btype) {
	try {
		return await ctx.request.body({type: btype}).value;
	} catch(_) {
		serveError(ctx, 400, "invalid or missing body");
		return null;
	}
}

const abort = new AbortController();

const chat = new CC.CryptMessageRoot(config.chat_path);
await chat.cryptReady;

const sessions = {};

const keyring = new Keyring(config.cookie_keyring, config.keyring_size);
const svr = new Oak.Application({ keys: keyring.keys });
const router = new Oak.Router();

async function stop() {
	logger.warn("Stopping!");
	abort.abort();
	keyring.save();
	await chat.save();
}

// user API
router.get("/api/user/exists", async ctx => {
	ctx.response.type = "application/json";
	const body = await checkBody(ctx, "json");
	if (body === null)
		return;
	if (this.chat.users[body.user]) {
		ctx.response.body = { success: true, exists: true };
		return;
	}
	ctx.response.body = { success: true, exists: false };
});

// auth
router.post("/api/user/new", async ctx => {
	ctx.response.type = "application/json";
	const body = await checkBody(ctx, "form-data");
	if (body === null)
		return;
	let formData;
	try {
		formData = body.read({ outPath: config.pfp_path });
	} catch (_) {
		serveError(ctx, 400, "invalid or missing multipart form data");
		return;
	}
	const name = formData.fields.name;
	if (chat.users[name]) {
		serveError(ctx, 403, "this user exists");
		return;
	}
	const png = formData.files?.find(f => f.name === "png");
	if (!png) {
		serveError(ctx, 400, "missing profile picture");
		return;
	}
	if (png.contentType !== "image/png") {
		serveError(ctx, 400, "invalid media type for profile picture, must be image/png");
		Deno.removeSync(png.filename);
		return;
	}
	if (!formData.fields.pwhash) {
		serveError(ctx, 400, "missing password hash");
		return;
	}
	let user;
	try {
		user = chat.addUser(name,
			DenoUtil.Path.basename(png.filename),
			formData.fields.pwhash);
	} catch(e) {
		serveError(ctx, 400, e.message);
		return;
	}
	await ctx.cookies.set("BearerToken", user.token);
	sessions[user.token] = user;
	ctx.response.body = { success: true, user: user.serializeUser() };
});

router.post("/api/user/login", async ctx => {
	ctx.response.type = "application/json";
	const body = await checkBody(ctx, "json");
	if (body === null)
		return;
	const user = chat.users[body.name];
	if (!user) {
		serveError(ctx, 404, "no such user");
		return;
	}
	if (body.pwhash !== user.pwhash) {
		serveError(ctx, 403, "invalid password");
		return;
	}
	await ctx.cookies.set("BearerToken", user.token);
	sessions[user.token] = user;
	ctx.response.body = { success: true, user: user.serializeUser() };
});

router.get("/api/user/logout", async ctx => {
	ctx.response.type = "application/json";
	const token = await ctx.cookies.get("BearerToken");
	if (!token) {
		serveError(ctx, 400, "expired session");
		return;
	}
	const user = sessions[token];
	await ctx.cookies.delete("BearerToken");
	if (!user) {
		serveError(ctx, 403, "invalid session");
		return;
	}
	delete sessions[user.token];
	user.regenerateToken();
	ctx.response.body = { success: true };
});

// comments API
router.get("/api/comment/list", ctx => {
	ctx.response.type = "application/json";
	ctx.response.body = chat.serializeUser();
});

// profile pictures
router.post("/api/pfps/:name", ctx => {
	const path = DenoUtil.agnosticPath(config.pfp_path + "/" + ctx.params.name);
	if (!DenoUtil.lstatSafe(path)?.isFile) {
		ctx.response.type = "application/json";
		serveError(ctx, 404, "no such profile picture");
	}
	ctx.response.type = "image/png";
	ctx.response.body = Deno.readFileSync(path);
});

if (!DenoUtil.lstatSafe(config.pfp_path)?.isDirectory) {
	if (DenoUtil.exists(config.pfp_path)) {
		logger.error("Something other than a directory already exists at", config.pfp_path);
		Deno.exit(1);
	}
	logger.info("Creating profile picture directory");
	Deno.mkdirSync(config.pfp_path);
}

svr.use((ctx, next) => {
	ctx.response.headers.set("Access-Control-Allow-Origin", "*");
	next();
});
svr.use(router.routes());
svr.use(router.allowedMethods());
svr.use((ctx, next) => {
	lroute.warn("Not found:", ctx.request.url.toString());
	ctx.response.status = 404;
	next();
});

svr.listen({
	secure: true,
	signal: abort.signal,
	port: config.svr_port,
	key: Deno.readTextFileSync(config.ckey_path),
	cert: Deno.readTextFileSync(config.cert_path)
});

logger.info(`Listening on ${config.svr_port}.`);
logger.info("Press CTRL+D to stop. DO NOT PRESS CTRL+C unless you want to exit uncleanly!");

// oak somehow buggers SIGINT listeners. when you register
// a SIGINT listener, start the Oak server and then hit
// CTRL+C, you're thrown back into your command
// interpreter while the actual process stays alive.
// I figure there's some sort of weird interaction between
// Deno.listenTls and signal handlers that creates this
// issue, because it doesn't happen in other programs.

function wait() {
	const eof = new Uint8Array(1);
	Deno.stdin.read(eof).then(async _ => {
		if (eof[0] !== 0)
			wait();
		await stop();
		Deno.exit(0);
	});
}

wait();
