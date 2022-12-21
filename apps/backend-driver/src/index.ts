import express, { json } from "express";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
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
	height: number;
	long: number;
	lat: number;
	status: string;
}

interface SocketMsg {
	id: string
	status: string
}

io.on("connection", async(socket) => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
	socket.on("statusChange", async(msg: SocketMsg) => {
		console.log("message: ", msg);
		if(msg.status == "sorting" || msg.status == "delivered"){
			await prisma.package.update({
				where: {
					id: msg.id
				},
				data: {
					// @ts-ignore
					status: msg.status
				}
			})
		}
	});
});

app.post("/package", async (req, res) => {
	console.log(req.body);
	const pkg = req.body as unknown;
	if (pkg) {
		const { name, address, postalCode, city, orderedOn, weight, height, long, lat } = pkg as Package;
		if (!name || !address || !postalCode || !city || !orderedOn || !weight || !height || !long || !lat) {
			res.status(400).send("Invalid package");
			return;
		}

		const packageMade = await prisma.package.create({
			data: {
				name,
				address,
				postalCode,
				city,
				orderedOn,
				weight,
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

app.get("/packages", async (req, res) => {
	const packages = await prisma.package.findMany();
	return res.send(packages);
});

app.listen(3002, () => {
	console.log("Server is running on port 3002");
});
