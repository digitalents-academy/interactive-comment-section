import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import * as fs from "node:fs";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		https: {
			key: fs.readFileSync("../backend/cert/ckey.pem"),
			cert: fs.readFileSync("../backend/cert/cert.pem")
		}
	}
})