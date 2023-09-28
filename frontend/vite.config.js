import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { PORT, KEY, CERT } from '../a.json'

import * as fs from "node:fs";
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: PORT,
		https: {
			key: fs.readFileSync(path.resolve('..', KEY)),
			cert: fs.readFileSync(path.resolve('..', CERT))
		}
	}
})