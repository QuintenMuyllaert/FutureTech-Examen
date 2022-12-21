import express, { json } from "express";
import { Db, MongoClient } from "mongodb";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config();

const app = express();

app.use(json());

const prisma = new PrismaClient();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

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
}

app.post("/package", async (req, res) => {
	console.log(req.body);
	const pkg = req.body as unknown;
	if (pkg) {
		const { name, address, postalCode, city, orderedOn, weight, height, long, lat } = pkg as Package;
		if (!name || !address || !postalCode || !city || !orderedOn || !weight || !height || !long || !lat) {
			res.status(400).send("Invalid package");
			return;
		}

		await prisma.package.create({
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

		const packages = await prisma.package.findMany();

		return res.send(packages);
	} else {
		return res.status(400).send("Invalid package");
	}
});

app.get("/packages");

app.listen(3002, () => {
	console.log("Server is running on port 3002");
});
