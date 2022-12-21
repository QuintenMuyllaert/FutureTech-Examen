<script lang="ts">
	const pkg = {
		name: "",
		address: "",
		postalCode: "",
		city: "",
		height: 0,
		weight: 0,
		depth: 0,
		width: 0,
		long: 50,
		lat: 3,
		orderedOn: new Date(),
		status: "validatie",
	};

	const handleSubmit = () => {
		console.log(pkg);
	};
</script>

<div class="shadow rounded-md p-8 bg-white">
	<form class="grid gap-4" on:submit|preventDefault={handleSubmit}>
		<h1 class="text-2xl font-bold">Pak aangeven</h1>

		<div class="flex flex-col">
			<label for="naam" class="font-bold">Naam</label>
			<input type="text" id="naam" class="border py-1 px-2 rounded" bind:value={pkg.name} />
		</div>

		<div class="flex flex-col">
			<label for="street" class="font-bold">Straat + nr</label>
			<input type="text" id="street" class="border py-1 px-2 rounded" bind:value={pkg.address} />
		</div>

		<div class="flex gap-4">
			<div class="flex flex-col">
				<label for="postal" class="font-bold">Postcode</label>
				<input type="text" id="postal" class="border py-1 px-2 rounded" bind:value={pkg.postalCode} />
			</div>
			<div class="flex flex-col">
				<label for="city" class="font-bold">Stad</label>
				<input type="text" id="city" class="border py-1 px-2 rounded" bind:value={pkg.city} />
			</div>
		</div>

		<div class="flex gap-4">
			<div class="flex flex-col">
				<label for="height" class="font-bold">Hoogte</label>
				<input type="number" id="height" class="border py-1 px-2 rounded" bind:value={pkg.height} />
			</div>
			<div class="flex flex-col">
				<label for="weight" class="font-bold">Gewicht</label>
				<input type="number" id="weight" class="border py-1 px-2 rounded" bind:value={pkg.weight} />
			</div>
		</div>

		<button class="bg-red-600 text-white rounded p-2 mt-6">Toevoegen</button>
	</form>
</div>
