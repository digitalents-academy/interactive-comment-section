/*
 * comments page common libs - chat tree implementation
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

import * as Util from './util.js';

const DELETED_USER = "deleted user";

// exporting because it might come in useful for individual
// messages
export function hydrateMessage(r, up, m, i) {
	// r.users[m.user] should be undefined for deleted users
	// which is fine (check Message constructor)
	const a = new Message(r, up, i,
		r.users[m.user], m.votes, m.content, m.timestamp);
	for (let i = 0; i < m.children.length; i++)
		a.children.push(hydrateMessage(r, a, m.children[i], i));
	return a;
}

// message root object, representing the root of a chat tree
// clients should use this class
export class MessageRoot {
	constructor(d = {}) {
		if (!d.chat || !d.users) {
			this.users = {};
			this.children = [];
			return this;
		}
		this.hydrate(d);
	}

	hydrate(obj) {
		if (!obj.messageRoot)
			throw new TypeError("not a serialized MessageRoot");
		this.users = Object.fromEntries(Object.entries(obj.users).map(e =>
			[e[0], new User(e[0], e[1].png)]));
		this.children = obj.chat.map((m, i) => hydrateMessage(this, this, m, i))
	}

	// dummy for CryptoMessageRoot.triggerModify()
	triggerModify() {
		return new Promise(r => r(null));
	}

	addUser(n, p) {
		this.users[n] = new User(n, p);
		return this.triggerModify();
	}

	removeUser(n) {
		delete this.users[n];
		return this.triggerModify();
	}

	add(u, t, ts = null) {
		this.children.push(new Message(this, this, this.children.length,
			this.users[u], { [u]: 1 }, t, (ts === null) ? Util.unixTime() : ts));
		return this.triggerModify();
	}

	getMessageByPath(p) {
		let m = this;
		for (let i = 0; i < p.length; i++) {
			m = m.children[p[i]];
			if (!m)
				return null;
		}
		return m;
	}

	remove(i) {
		if (i >= this.children.length)
			throw new RangeError("message index out of bounds");
		this.children.splice(i, 1);
		return this.triggerModify();
	}

	serialize() {
		return {
			messageRoot: true,
			users: Object.fromEntries(Object.entries(this.users).filter(u =>
				u[0] !== DELETED_USER).map(e => [e[0], e[1].serialize()])),
			chat: this.children.map(c => c.serialize())
		};
	}

	serializeString() {
		return JSON.stringify(this.serialize());
	}

	byScore() {
		return this.children.sort((a, b) =>
			(a.score < b.score) - (b.score < a.score));
	}
}

export class Message {
	#computeScore() {
		this.score = Object.values(this.votes).reduce((a, b) => a + b);
	}

	constructor(r, p, i, u, v, t, ts) {
		this.children = [];
		this.root  = r;
		this.up    = p;
		this.index = i;
		this.user  = Util.either(u, new User(DELETED_USER, "default.png"));
		this.votes = v;
		this.text  = t;
		this.time  = ts;

		// sets this.score
		this.#computeScore();
	}

	upvote(u) {
		this.votes[u] = 1;
		this.#computeScore();
	}

	downvote(u) {
		this.votes[u] = -1;
		this.#computeScore();
	}

	unvote(u) {
		delete this.votes[u];
		this.#computeScore();
	}

	add(u, t, ts = null) {
		this.children.push(new Message(this.root, this, this.children.length,
			this.root.users[u], { [u]: 1 }, t, (ts === null) ? Util.unixTime() : ts));
		return this.root.triggerModify();
	}

	remove(i) {
		if (i >= this.children.length)
			throw new RangeError("message index out of bounds");
		this.children.splice(i, 1);
		return this.root.triggerModify();
	}

	edit(t) {
		this.text = t;
		return this.root.triggerModify();
	}

	serialize() {
		return {
			index: this.index,
			user: this.user.name,
			votes: this.votes, // object
			score: this.score,
			content: this.text,
			timestamp: this.time,
			children: this.children.map(c => c.serialize())
		};
	}

	path() {
		const p = [this.index];
		for (let m = this.up; m.root !== undefined; m = m.up)
			p.unshift(m.index);
		return p;
	}

	serializeFlat(ping = false) {
		const msg = [{
			index: this.index,
			user: this.user.name,
			votes: this.votes,
			score: this.score,
			content: (ping ? `@${this.up.user.name} ` : "") + this.text,
			timestamp: this.time,
		}];
		this.children.map(e => e.serializeFlat(true)).forEach(s =>
			msg.push(...s));
		return msg;
	}
}

export class User {
	constructor(n, p) {
		this.name = n;
		this.png = p;
	}

	serialize() {
		return {
			name: this.name,
			png: this.png
		};
	}
}
