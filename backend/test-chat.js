/*
 * comments backend - chat tree test
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
