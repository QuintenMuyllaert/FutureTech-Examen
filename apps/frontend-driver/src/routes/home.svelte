<script lang="ts">
	import { Link } from "svelte-routing";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

	const packages = writable<any>(null);

	const getPackages = async () => {
		const res = await fetch("http://backend-driver.tobybostoen.be/packages");
		return await res.json();
	};

	onMount(async () => {
		await getPackages().then((data) => {
			console.log(data);
			packages.set(data);
		});
	});
</script>

<div class="shadow rounded-md p-8 bg-white min-w-[90vw] min-h-[80vh] max-w-6xl">
	<h1 class="font-bold text-2xl">Home</h1>
	<div class="grid max-h-[65vh] overflow-y-auto">
		<div class="grid grid-cols-8 sticky top-0 z-10 py-2 bg-white">
			<h2 class="font-bold">id</h2>
			<h2 class="font-bold">name</h2>
			<h2 class="font-bold">address</h2>
			<h2 class="font-bold">postalCode</h2>
			<h2 class="font-bold">city</h2>
			<h2 class="font-bold">orderedOn</h2>
			<h2 class="font-bold">weight</h2>
			<h2 class="font-bold">height</h2>
		</div>

		{#if $packages != null || $packages != undefined}
			{#each $packages as p}
				<Link to="/tracking/{p.id}" class="grid grid-cols-8">
					<div class="overflow-y-auto py-2 border-t-2">{p.id}</div>
					<div class="overflow-y-auto py-2 border-t-2">{p.name}</div>
					<div class="overflow-y-auto py-2 border-t-2">{p.address}</div>
					<div class="overflow-y-auto py-2 border-t-2">{p.postalCode}</div>
					<div class="overflow-x-auto py-2 border-t-2">{p.city}</div>
					<div class="overflow-x-auto py-2 border-t-2">{p.orderedOn}</div>
					<div class="overflow-x-auto py-2 border-t-2">{p.weight}</div>
					<div class="overflow-x-auto py-2 border-t-2">{p.height}</div>
				</Link>
			{/each}
		{/if}
	</div>
</div>
