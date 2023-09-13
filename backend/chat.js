// chat tree implementation
// TODO: license info (GPL-3?)

// or diedrate
function rehydrate(up, m, i) {
	const a = new Message(up, i,
		new User(m.user.name, m.user.png),
		m.votes, m.content);
	for (let i = 0; i < m.children.length; i++)
		a.children.push(rehydrate(a, m.children[i], i));
	return a;
}

// message root object, representing the root of a chat tree
// clients should use this class
export class MessageRoot {
	constructor(d = []) {
		if (!Array.isArray(d))
			console.log("messages object must be an array");
		this.root = true;
		this.children = d.map((m, i) => rehydrate(this, m, i));
	}

	// if this function returns non-null, the owner of this
	// MessageRoot should destroy it and create a new one,
	// calling cryptInit() with the returned values
	// (you can even use apply())
	triggerModify() {
		return new Promise(r => r(null));
	}

	add(u, v, t) {
		this.children.push(new Message(this, this.children.length, u, v, t));
		return this.triggerModify();
	}

	remove(i) {
		if (i >= this.children.length)
			throw new RangeError("message index out of bounds");
		this.children.splice(i, 1);
		return this.triggerModify();
	}

	serialize() {
		return JSON.stringify(this.children.map(c => c.serialize()));
	}
}

async function genKeyWithIV() {
	return [
		await crypto.subtle.generateKey({
			name: "AES-GCM",
			length: 256
		}, true, ["encrypt", "decrypt"]),
		
		crypto.getRandomValues(new Uint8Array(12))
	];
}

// crypto wrapper around MessageRoot for encryption
// server should use this class
export class CryptMessageRoot extends MessageRoot {
	constructor(d, k, iv) {
		super();
		this.cryptKey = null;
		this.cryptIV  = null; // init vector
		// create/update/delete threshold for save().
		// this can be increased for chat trees that see
		// more activity to prevent server load caused by
		// crypt ops
		this.cryptSaveThreshold = 50;

		this.cryptReady = this.#cryptInit(d, k, iv);
	}
	
	// if this returns non-null, you should destroy this
	// object and make a new one, using the elements of
	// the returned array as arguments to the new one
	triggerModify() {
		this.modifyCount++;
		if (this.modifyCount >= this.cryptSaveThreshold)
			return this.encrypt();
		super.triggerModify();
	}

	async #cryptInit(d, k, iv) {
		// new chat
		if (!d || d instanceof MessageRoot) {
			[this.cryptKey, this.cryptIV] = await genKeyWithIV();
			if (d instanceof MessageRoot)
				this.children = d.children;
			return true;
		}
		// existing chat
		if (!k || !iv)
			throw new TypeError("ciphertext given without key or IV");
		const ck = (k instanceof CryptoKey) ? k :
			await crypto.subtle.importKey("raw", k, "AES-GCM", true, ["encrypt", "decrypt"]);
		this.children = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({
			name: "AES-GCM",
			iv: iv
		}, ck, d))).map((c, i) => rehydrate(this, c, i));
		// regenerate key
		[this.cryptKey, this.cryptIV] = await genKeyWithIV();
		return true;
	}

	// anything calling save should destroy this object
	// after it returns
	async encrypt() {
		// how am I supposed to indent this???
		return [await crypto.subtle.encrypt({
			name: "AES-GCM",
			iv: this.cryptIV
		}, this.cryptKey,
			new TextEncoder().encode(this.serialize())),
			this.cryptKey, this.cryptIV];
	}
}

class Message {
	constructor(p, i, u, v, t) {
		this.children = [];
		this.up    = p;
		this.index = i;
		this.user  = u;
		this.votes = v;
		this.text  = t;
	}

	upvote() {
		this.votes++;
	}

	downvote() {
		this.votes--;
	}

	triggerModify() {
		return this.up.triggerModify();
	}

	add(u, v, t) {
		this.children.push(new Message(this, this.children.length, u, v, t));
		return this.triggerModify();
	}

	remove(i) {
		if (i >= this.children.length)
			throw new RangeError("message index out of bounds");
		this.children.splice(i, 1);
		return this.triggerModify();
	}

	edit(t) {
		this.text = t;
		return this.triggerModify();
	}

	serialize() {
		return {
			index: this.index,
			user: this.user.serialize(),
			votes: this.votes,
			content: this.text,
			children: this.children.map(c => c.serialize())
		};
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
