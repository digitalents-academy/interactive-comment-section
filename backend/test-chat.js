// I'm too lazy to learn the test system

import * as Chat from './chat.js';

const marisa = new Chat.User("marisa", "./pfps/marisa.png");
const reimu = new Chat.User("reimu", "./pfps/reimu.png");
const nine99 = new Chat.User("cirno", "./pfps/iceicebaby.png");

const chat = new Chat.MessageRoot();

chat.add(marisa, 3, "master-spark rocks, cirno sucks da ze");
chat.add(nine99, -1, "this witch is just jealous of my mad-rad ice magic 9");

chat.children[1].add(reimu, 1, "you got owned before. cope + mald + chew on ice");
chat.children[1].add(marisa, 0, "take the L");

const so = JSON.parse(chat.serialize());

console.log("Constructed normally:");
console.log(chat);
console.log("Serialized:");
console.log(so);
console.log("Reconstructed:");
console.log(new Chat.MessageRoot(so));

console.log("<<< CRYPTO >>>");

const cryptchat = new Chat.CryptMessageRoot(chat,
	new TextEncoder().encode("definitely authenticated"));
await cryptchat.cryptReady;

const enc = await cryptchat.encrypt();

const redec = new Chat.CryptMessageRoot(...enc);
await redec.cryptReady;

console.log("Crypto root:");
console.log(cryptchat);

console.log("Encrypted:");
console.log(enc);

console.log("Re-decrypted:");
console.log(redec);
