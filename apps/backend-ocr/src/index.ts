import tesseract from "node-tesseract-ocr";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs/promises";

const config = {
	lang: "eng",
	oem: 1,
	psm: 3,
};

const findNames = async (image: string) => {
	const result = await tesseract.recognize(image, config);
	const lines = result.split("\n");
	//find the line with the word "name" (case insensitive)
	const nameLine = lines.find((line) => line.toLowerCase().includes("name"));
	//find the line with the word "names" (case insensitive)
	const namesLine = lines.find((line) => line.toLowerCase().includes("names"));

	if (!nameLine || !namesLine) {
		throw new Error("Name or names not found");
	}

	const name = nameLine?.split(/name/i)[1].trim();
	const names = namesLine?.split(/names/i)[1].trim();
	const fullName = names + " " + name;

	return fullName;
};

const app = express();

app.use(cors());
//50 mb limit
app.use(
	bodyParser.json({
		limit: "50mb",
	}),
);
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.post("/ocr", async (req, res) => {
	const { image } = req.body;
	//convert base64 to image file
	const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, "");
	const uid = Math.random().toString(36).substring(7);
	await fs.writeFile(`./temp/${uid}.jpg`, base64Data, "base64");
	try {
		const result = await findNames(`./temp/${uid}.jpg`);
		res.send(result);
	} catch (error: any) {
		res.status(400).send(error?.message);
	}
	//delete the image file
	await fs.unlink(`./temp/${uid}.jpg`);
});

app.listen(3003, () => {
	console.log("Server running on port 3003");
});
