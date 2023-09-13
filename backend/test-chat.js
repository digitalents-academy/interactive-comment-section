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


const chat = new Chat.MessageRoot();

chat.addUser("marisa", "./pfps/marisa.png");
chat.addUser("reimu", "./pfps/reimu.png");
chat.addUser("cirno", "./pfps/iceicebaby.png");
chat.addUser("barrierpolice", "./pfps/yukari.png");
chat.addUser("suika", "./pfps/shithead.png");

chat.add("marisa", 3, "master-spark rocks, cirno sucks da ze");
chat.add("cirno", -1, "this witch is just jealous of my mad-rad ice magic 9");

chat.children[1].add("reimu", 1, "you got owned before. cope + mald + chew on ice");
chat.children[1].children[0].add("barrierpolice", 1, "everyone calm down lmao", 0);
chat.children[1].add("marisa", 0, "take the L");

const so = chat.serialize();
const flatThread = chat.children[1].serializeFlat();

console.log("Constructed normally:");
console.log(chat);
console.log("Serialized:");
console.log(so);
console.log("Flat thread:");
console.log(flatThread);
console.log("Reconstructed:");
console.log(new Chat.MessageRoot(so));
// this wording makes me feel dumb
console.log("Votes of the list of top-level messages sorted by votes:");
console.log(chat.byVotes().map(m => m.votes));

console.log("<<< CRYPTO >>>");

const cryptchat = new Chat.CryptMessageRoot(so);
await cryptchat.cryptReady;

cryptchat.add("suika", 0, "I'm late to the party, what's up");

const enc = await cryptchat.encrypt();

const redec = new Chat.CryptMessageRoot(...enc);
await redec.cryptReady;

console.log("Crypto root:");
console.log(cryptchat);

console.log("Encrypted:");
console.log(enc);

console.log("Re-decrypted:");
console.log(redec);
