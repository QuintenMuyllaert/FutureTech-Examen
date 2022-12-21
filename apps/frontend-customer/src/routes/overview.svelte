<script lang="ts">
	import { Link } from "svelte-routing";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

	const packages = writable<any>(null);

	const getPackages = async () => {
		const res = await fetch("http://backend-driver.tobybostoen.be/packages");
		return await res.json();
	};

	const mobile = () => {
		if (window.innerWidth < 768) {
			return true;
		} else {
			return false;
		}
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
	<div class="mobile grid max-h-[65vh] overflow-y-auto">
		<div class="grid cols sticky top-0 z-10 py-2 bg-white">
			{#if !mobile()}
				<h2 class="font-bold">id</h2>
			{/if}
			<h2 class="font-bold">naam</h2>
			<h2 class="font-bold">adres</h2>
			<h2 class="font-bold">postcode</h2>
			<h2 class="font-bold">stad</h2>
			{#if !mobile()}
				<h2 class="font-bold">besteldatum</h2>
				<h2 class="font-bold">gewicht</h2>
				<h2 class="font-bold">hoogte</h2>
			{/if}
		</div>

		{#if $packages != null || $packages != undefined}
			{#each $packages as p}
				<Link to="/tracking/{p.id}" class="grid ">
					<div class="grid cols sticky top-0 z-10 py-2 bg-white">
						{#if !mobile()}
							<div class="overflow-y-auto py-2 border-t-2">{p.id}</div>
						{/if}
						<div class="overflow-y-auto py-2 border-t-2">{p.name}</div>
						<div class="overflow-y-auto py-2 border-t-2">{p.address}</div>
						<div class="overflow-y-auto py-2 border-t-2">{p.postalCode}</div>
						<div class="overflow-x-auto py-2 border-t-2">{p.city}</div>
						{#if !mobile()}
							<div class="overflow-x-auto py-2 border-t-2">{p.orderedOn}</div>
							<div class="overflow-x-auto py-2 border-t-2">{p.weight}</div>
							<div class="overflow-x-auto py-2 border-t-2">{p.height}</div>
						{/if}
					</div>
				</Link>
			{/each}
		{/if}
	</div>
</div>

<style>
	.cols {
		display: grid;
		grid-template-columns: repeat(8, auto);
	}
</style>
