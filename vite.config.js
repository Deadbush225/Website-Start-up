import { defineConfig } from "vite";
import { splitVendorChunkPlugin } from "vite";

// import commonjs from "vite-plugin-commonjs";
// import commonjs from "@rollup/plugin-commonjs";
// import NodeResolve from "@rollup/plugin-node-resolve";

import { resolve } from "path";

import fs from "fs";
// import react from '@vitejs/plugin-react'
// import sass from 'sass'

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "docs");

const htmlFiles = fs;
// .readdirSync(resolve(root, "pages"))
// .filter((file) => {
// 	console.log(file);
// 	return file.endsWith(".html");
// })
// .map((file, index) => {
// 	return ["html_page" + index, resolve(root, "pages", file)];
// });

export default defineConfig({
	// plugins: [htmlTemplate()],
	plugins: [
		splitVendorChunkPlugin(),
		// commonjs({
		// 	strictRequires: true,
		// 	include: ["/src/flickity/flickity.pkgd.min.js"],
		// 	transformMixedEsModules: true,
		// }),
		// NodeResolve({
		// 	extensions,
		// 	mainFields: ["module", "main", "jsnext:main", "browser"],
		// 	moduleDirectories: ["node_modules"],
		// 	// modulePaths: [resolve(root, "flickity")],
		// 	rootDir: root,
		// 	browser: true,
		// }),
	],

	base: "./",
	publicDir: false,
	root: root,
	mode: "Development",

	build: {
		target: "es2020",
		// ssr: true,

		outDir,
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(root, "index.ts"),
				// flickity: resolve(root, "flickity", "flickity.pkgd.min.js"),

				index: resolve(root, "index.html"),

				// ...Object.fromEntries(htmlFiles),
			},

			output: {
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split(".").pop();

					console.log(extType);

					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						// extType = "assets";
						return "assets/[name]-[hash][extname]";
					} else if (/css|ts/i.test(extType)) {
						return "styles/[name]-[hash][extname]";
					} else if (/html/i.test(extType)) {
						return "pages/[name]-[hash][extname]";
					}

					return "assets/[name]-[hash][extname]";
					// "css" is only one so no need to catch any possible outcome
				},

				chunkFileNames: "scripts/[name]-[hash].js",

				entryFileNames: "scripts/[name]-[hash].js",

				// dir: "docs/",
				generatedCode: "es5",
			},
		},

		modulePreload: {
			polyfill: false,
		},

		// commonjsOptions: {
		// 	// transformMixedEsModules: true,
		// 	// include: ["/src/flickity/flickity.pkgd.min.js"],
		// 	// exclude: ["/node_modules/jquery/dist/jquery.js"],
		// 	// requireReturnsDefault: "auto",
		// 	// requireReturnsDefault: "namespace",

		// 	// strictRequires: true,
		// 	// include: [/src\/flickity/],
		// 	// transformMixedEsModules: true,
		// 	extensions: extensions,
		// },
		// sourcemap: "hidden",
	},

	server: {
		port: 8888,
		strictPort: true,
		open: true,
	},

	// optimizeDeps: {
	// 	// entries: ["src/*.html", "src/script.ts"],
	// 	// include: ["src/script.ts"],
	// 	// force: true
	// 	// include: ["/src/flickity"],
	// 	// exclude: ["/node_modules"],
	// },

	// resolve: {
	// 	extensions: [".cjs", ".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
	// 	mainFields: ["module", "main", "jsnext:main", "browser"],
	// },
});
