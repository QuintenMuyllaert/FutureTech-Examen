import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import http from "http";
import https from "https";
import fs from "fs/promises";

const app = express();

app.use(cors());

const origins = {
	"backend-ocr": "http://localhost:3003",
	"frontend-customer": "http://localhost:3001",
	"frontend-driver": "http://localhost:3000",
	"frontend-ocr-test": "http://localhost:3004",
	"backend-driver": "http://localhost:3002",
};

app.use(
	createProxyMiddleware({
		target: "http://localhost",
		changeOrigin: true,
		router: (req) => {
			// request should be ORIGIN.localhost
			const host = req.headers.host?.split(".")[0];
			if (!host) {
				return "http://localhost:404";
			}

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			if (!origins[host]) {
				return "http://localhost:404";
			}
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			return origins[host];
		},
		ws: true,
	}),
);

const doesSSLExist = async () => {
	try {
		await fs.readFile("./ssl/server.key");
		return true;
	} catch (error) {
		return false;
	}
};

const startServer = async () => {
	if (await doesSSLExist()) {
		console.log("SSL exists, starting https server");
		const server = https.createServer(
			{
				key: await fs.readFile("./ssl/server.key"),
				cert: await fs.readFile("./ssl/server.cert"),
			},
			app,
		);
		server.listen(443);

		//http redirect to https
		const httpServer = http.createServer((req, res) => {
			res.writeHead(301, { Location: "https://" + req.headers["host"] + req.url });
			res.end();
		});
		httpServer.listen(80);
	} else {
		console.log("SSL does not exist, starting http server");
		const server = http.createServer(app);
		server.listen(80);
	}
};

startServer();
