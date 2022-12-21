import express, { json } from "express";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import fs from "fs/promises";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

config();

app.use(json());

const prisma = new PrismaClient();

interface Package {
	name: string;
	address: string;
	postalCode: string;
	city: string;
	orderedOn: Date;
	weight: number;
	width: number;
	depth: number;
	height: number;
	long: number;
	lat: number;
	status: string;
}

interface SocketMsg {
	id: string;
	status: string;
}

io.on("connection", async (socket: any) => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
	socket.on("statusChange", async (msg: SocketMsg) => {
		console.log("message: ", msg);
		if (msg.status == "Sortering" || msg.status == "Verzonden") {
			await prisma.package.update({
				where: {
					id: msg.id,
				},
				data: {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					status: msg.status,
				},
			});
			socket.emit("statusUpdate", {
				status: msg.status,
				id: msg.id,
			});
		}
	});
});

app.post("/package", async (req, res) => {
	console.log(req.body);
	const pkg = req.body as unknown;
	if (pkg) {
		const { name, address, postalCode, city, weight, width, depth, height, long, lat } = pkg as Package;
		const orderedOn = new Date();
		//check if all fields are filled ( not null or undefined)
		if (!name || !address || !postalCode || !city || !weight || !width || !depth || !height || !long || !lat) {
			console.log("Invalid package");
			console.log("Caused by", name, address, postalCode, city, weight, width, depth, height, long, lat);
			res.status(400).send("Invalid package");
			return;
		}
		const deliverDate = new Date(new Date(orderedOn).setDate(new Date(orderedOn).getDate() + 2));

		const packageMade = await prisma.package.create({
			data: {
				name,
				address,
				postalCode,
				city,
				orderedOn,
				deliverDate,
				weight,
				width,
				depth,
				height,
				long,
				lat,
			},
		});

		return res.send(`Package has been added with id ${packageMade.id}`);
	} else {
		return res.status(400).send("Invalid package");
	}
});
//50 mb limit
app.use(
	bodyParser.json({
		limit: "50mb",
	}),
);
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.post("/idcard", async (req, res) => {
	const { image, id, packageId } = req.body;
	if (!image || !id || !packageId) {
		console.log("Invalid idcard", id, packageId);
		return res.status(400).send("Invalid idcard");
	}

	const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, "");
	await prisma.package.update({
		where: {
			id: id,
		},
		data: {
			// @ts-ignore
			status: "Geleverd",
		},
	});
	await fs.writeFile(`./idcard/${id}-${packageId}-signed.jpg`, base64Data, "base64");
	return res.send("ok");
});

app.get("/packages", async (req, res) => {
	const packages = await prisma.package.findMany();
	return res.send(packages);
});

app.get("/package/:id", async (req, res) => {
	const pkg = await prisma.package.findUnique({
		where: {
			id: req.params.id,
		},
	});
	return res.send(pkg);
});

server.listen(3002, () => {
	console.log("Server is running on port 3002");
});
