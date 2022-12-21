<script lang="ts">
	import io from "socket.io-client";
	import { onMount } from "svelte";

	export let id;
	let currentPackage = null;
	console.log(id);

	const socket = io("ws://backend-driver.localhost");
	let currentStep = "Validatie";
	let deliveryDate = new Date();
	let estimetedDeliveryTime = "12:00 - 14:00";

	const getPackage = async () => {
		const res = await fetch(`http://backend-driver.localhost/package/${id}`);
		return await res.json();
	};

	const change = (step: string) => {
		socket.on("statusUpdate", (msg) => {
			currentStep = msg.status;
		});
		socket.emit("statusChange", {
			id: id,
			status: step,
		});
	};
	console.log(currentStep);
	onMount(async () => {
		if (id != null || id != undefined) {
			const res = await getPackage();
			console.log(res);
			currentStep = res.status;
			currentPackage = res;
			console.log(currentPackage);
		}
	});
</script>

<div class="shadow rounded-md p-8 grid grid-rows-[auto_auto_1fr] gap-4 bg-white min-h-[50vh]">
	<h1 class="text-4xl text-red font-bold">K-post</h1>
	<nav>
		<ul class="flex gap-4">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li class="bg-red-500 rounded-full w-24 h-4" />
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li class="{currentStep == 'Sortering' || currentStep == 'Verzonden' ? 'bg-red-500' : 'bg-neutral-200'} rounded-full w-24 h-4" />
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li class="{currentStep == 'Verzonden' ? 'bg-red-500' : 'bg-neutral-200'} rounded-full w-24 h-4" />
		</ul>
	</nav>
	<div class="w-full">
		<h2 class="text-xl font-bold">{currentStep}</h2>
		<div class="flex gap-8">
			<div>
				<h3 class="font-bold">Verwachte leveringsdatum</h3>
				{#if currentPackage != null}
					<p>{currentPackage.deliverDate}</p>
				{/if}
			</div>
			<div>
				<h3 class="font-bold">Geschatte leveringstijd</h3>
				<p>{estimetedDeliveryTime}</p>
			</div>
		</div>
		<div class="w-[28rem] max-w-lg mt-4 h-48 overflow-y-auto">
			{#if currentStep === "Validatie"}
				<p>Pakje is in validatie</p>
				<button
					on:click={() => {
						change("Sortering");
					}}>Validatie is klaar</button>
			{/if}
			{#if currentStep === "Sortering"}
				<p>Pakje is in sortering</p>
				<button
					on:click={() => {
						change("Verzonden");
					}}>Sortering is klaar</button>
			{/if}
			{#if currentStep === "Verzonden"}
				<p>Pakje is vertrokken voor levering</p>
			{/if}
		</div>
	</div>
</div>
