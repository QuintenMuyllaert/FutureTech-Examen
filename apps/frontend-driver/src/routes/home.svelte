<script lang="ts">
	import { navigate } from "svelte-routing"
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

	const packages = writable<any>(null);

	const getPackages = async () => {
		const res = await fetch("http://backend-driver.localhost/packages");
		return await res.json();
	};

	onMount(async () => {
		await getPackages().then((data) => {
			console.log(data);
			packages.set(data)
		});
	});
</script>

<div class="shadow rounded-md p-8 bg-white">
	<h1>Home</h1>
	<p>Welkom op de homepagina</p>
	{#if $packages != null}
		{#each $packages as pkg}
			<button on:click={() => {
				navigate(`/tracking/${pkg.id}`)
			}} class="px-4 py-2 bg-red-600 text-white">
				{pkg.id}
			</button>
		{/each}
	{/if}
</div>
