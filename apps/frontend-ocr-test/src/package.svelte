<script lang="ts">
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

	import { onMount } from "svelte";
	let pkg: Package = {
		name: "John Doe",
		address: "123 Main St",
		postalCode: "12345",
		city: "New York",
		orderedOn: new Date(),
		weight: 10,
		height: 10,
		long: 10,
		lat: 10,
		status: "Delivered",
	};

	let name, address, postalCode, city, orderedOn, weight, height, long, lat, status;
	$: if (pkg) {
		name = pkg.name;
		address = pkg.address;
		postalCode = pkg.postalCode;
		city = pkg.city;
		orderedOn = pkg.orderedOn;
		weight = pkg.weight;
		height = pkg.height;
		long = pkg.long;
		lat = pkg.lat;
		status = pkg.status;
	}

	onMount(async () => {
		console.log(pkg);
		//get package data from query string
		const urlParams = new URLSearchParams(window.location.search);
		pkg.name = urlParams.get("name");
		pkg.address = urlParams.get("address");
		pkg.postalCode = urlParams.get("postalCode");
		pkg.city = urlParams.get("city");
		pkg.orderedOn = new Date(urlParams.get("orderedOn"));
		pkg.weight = parseInt(urlParams.get("weight"));
		pkg.height = parseInt(urlParams.get("height"));
		pkg.long = parseInt(urlParams.get("long"));
		pkg.lat = parseInt(urlParams.get("lat"));
		pkg.status = urlParams.get("status");

		//example
		//http://frontend-ocr-test.localhost/?name=John%20Doe&address=123%20Main%20St&postalCode=12345&city=New%20York&orderedOn=2021-01-01&weight=10&height=10&long=10&lat=10&status=Delivered
		//let uri = `http://frontend-ocr-test.localhost/?name=${pkg.name}&address=${pkg.address}&postalCode=${pkg.postalCode}&city=${pkg.city}&orderedOn=${pkg.orderedOn}&weight=${pkg.weight}&height=${pkg.height}&long=${pkg.long}&lat=${pkg.lat}&status=${pkg.status}`;
	});
</script>

<main>
	<ul>
		<li>NAME : {name}</li>
		<li>ADDRESS : {address}</li>
		<li>POSTAL CODE : {postalCode}</li>
		<li>CITY : {city}</li>
		<li>ORDERED ON : {orderedOn.toLocaleDateString()}</li>
		<li>WEIGHT : {weight}g</li>
		<li>HEIGHT : {height}cm</li>
	</ul>
</main>

<style scoped>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.2);
		padding: 1rem;
		border-radius: 0.25rem;
		box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
	}
	ul {
		padding: 0;
		text-align: left;
		list-style: none;
	}
</style>
