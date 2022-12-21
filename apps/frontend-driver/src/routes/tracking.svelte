<script lang="ts">
	import io from "socket.io-client";
	import { navigate } from "svelte-routing";
	import { onMount } from "svelte";

	export let id;
	let currentPackage = null;
	console.log(id);

	const socket = io("ws://backend-driver.tobybostoen.be");
	let currentStep = "Validatie";
	let deliveryDate = new Date();
	let estimetedDeliveryTime = "12:00 - 14:00";

	const getPackage = async () => {
		const res = await fetch(`http://backend-driver.tobybostoen.be/package/${id}`);
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
				<div class="mx-auto">
					<p>Pakje is in validatie</p>
					<button
						class="px-4 py-2 bg-red-600 text-white rounded-md"
						on:click={() => {
							change("Sortering");
						}}>Validatie is klaar</button>
				</div>
			{/if}
			{#if currentStep === "Sortering"}
				<p>Pakje is in sortering</p>
				<button
					class="px-4 py-2 bg-red-600 text-white rounded-md"
					on:click={() => {
						change("Verzonden");
					}}>Sortering is klaar</button>
			{/if}
			{#if currentStep === "Verzonden"}
				<p>Pakje is vertrokken voor levering</p>
				<button
					class="px-4 py-2 bg-red-600 text-white rounded-md"
					on:click={() => {
						navigate(
							//with encodeURIComponent you can use special characters in the url
							//`http://frontend-ocr-test.tobybostoen.be/?name=${currentPackage.name}&address=${currentPackage.address}&postalCode=${currentPackage.postalCode}&city=${currentPackage.city}&orderedOn=${currentPackage.orderedOn}&weight=${currentPackage.weight}&height=${currentPackage.height}&long=${currentPackage.long}&lat=${currentPackage.lat}&status=${currentPackage.status}&id=${currentPackage.id}&deliverDate=${currentPackage.deliverDate}`,
							`http://frontend-ocr-test.tobybostoen.be/?name=${encodeURIComponent(currentPackage.name)}&address=${encodeURIComponent(
								currentPackage.address,
							)}&postalCode=${encodeURIComponent(currentPackage.postalCode)}&city=${encodeURIComponent(currentPackage.city)}&orderedOn=${encodeURIComponent(
								currentPackage.orderedOn,
							)}&weight=${encodeURIComponent(currentPackage.weight)}&height=${encodeURIComponent(currentPackage.height)}&long=${encodeURIComponent(
								currentPackage.long,
							)}&lat=${encodeURIComponent(currentPackage.lat)}&status=${encodeURIComponent(currentPackage.status)}&id=${encodeURIComponent(
								currentPackage.id,
							)}&deliverDate=${encodeURIComponent(currentPackage.deliverDate)}`,
						);
					}}>Geleverd</button>
			{/if}
		</div>
	</div>
</div>
