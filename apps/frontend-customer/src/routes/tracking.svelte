<script lang="ts">
	import { Map, Marker } from "@beyonk/svelte-mapbox";
	import io from "socket.io-client";
	import { onMount } from "svelte";

	export let id;

	const socket = io("ws://backend-driver.tobybostoen.be");

	const getPackage = async () => {
		const res = await fetch(`http://backend-driver.tobybostoen.be/package/${id}`);
		return await res.json();
	};

	let packageCurrent;

	let mapComponent: Map;

	const Kortrijk = {
		lat: 50.82803,
		lng: 3.26487,
	};

	let currentStep;
	let stepName = "Ontvangen";
	let deliveryDate = new Date();
	let estimetedDeliveryTime = "12:00 - 14:00";

	const onMapReady = (m) => {
		console.log(m);
		// console.log(Kortrijk.lat, Kortrijk.lng);
		mapComponent.flyTo({ center: [Kortrijk.lng, Kortrijk.lat] });
	};
	socket.on("statusUpdate", (msg) => {
		currentStep = msg.status;
		packageCurrent.status = msg.status;
		console.log(packageCurrent);
	});

	$: packageCurrent ? console.log(packageCurrent) : console.log("no package");

	onMount(async () => {
		const res = await getPackage();
		packageCurrent = res;
		currentStep = res.status;
		console.log(packageCurrent);
	});
</script>

<div>
	<div class="shadow rounded-md p-8 grid grid-rows-[auto_auto_1fr] gap-4 bg-white min-h-[50vh] w-[90vw] md:w-[40vw]">
		<h1 class="text-4xl text-red font-bold">K-post</h1>
		<nav>
			<ul class="grid grid-cols-4 gap-4 w-full">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="bg-red-500 rounded-full h-4" />
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li
					class="{currentStep == 'Sortering' || currentStep == 'Geleverd' || currentStep == 'Verzonden' ? 'bg-red-500' : 'bg-neutral-200'} rounded-full h-4" />
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="{currentStep == 'Verzonden' || currentStep == 'Geleverd' ? 'bg-red-500' : 'bg-neutral-200'} rounded-full h-4" />
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="{currentStep == 'Geleverd' ? 'bg-red-500' : 'bg-neutral-200'} rounded-full h-4" />
			</ul>
		</nav>
		<div class="w-full">
			<h2 class="text-xl font-bold">{stepName}</h2>
			<div class="flex flex-col md:flex-row gap-8">
				<div>
					<h3 class="font-bold">Verwachte leveringsdatum</h3>
					{#if packageCurrent}
						<p>{packageCurrent.deliverDate}</p>
					{/if}
				</div>
				<div>
					<h3 class="font-bold">Geschatte leveringstijd</h3>
					<p>{estimetedDeliveryTime}</p>
				</div>
			</div>
			<div class="max-w-lg mt-4 h-48 overflow-y-auto">
				{#if currentStep === "Validatie"}
					<p>Je pakje is bij ons aangemeld en zal zo snel mogelijk verwerkt worden wanneer we deze ontvangen!</p>
				{/if}
				{#if currentStep === "Sortering"}
					<p>We hebben je pakje in ons magazijn ontvangen! We zullen je pakje zo snel mogelijk verwerken en leveren!</p>
				{/if}
				{#if currentStep === "Verzonden"}
					{#if packageCurrent != undefined && packageCurrent != null && packageCurrent.long != undefined && packageCurrent.long != null}
						<Map
							accessToken="pk.eyJ1IjoiYWVyZXR5IiwiYSI6ImNsOHZweTF2eDBnaHUzd29ndHExZHJzOXcifQ.IuExbN0AdEz1VCEDUVDn1w"
							bind:this={mapComponent}
							on:ready={onMapReady}>
							<Marker lat={Kortrijk.lat} lng={Kortrijk.lng} color="rgb(239,68,68)" label="Kortrijk" popupClassName="class-name" />
							<Marker lat={packageCurrent.lat} lng={packageCurrent.long} color="rgb(18, 40, 224)" label="Deliverer" popupClassName="class-name" />
							{console.log(packageCurrent.lat, packageCurrent.long, packageCurrent)}
						</Map>
					{/if}
				{/if}
				{#if currentStep === "Geleverd"}
					<p>Je pakje is geleverd!</p>
				{/if}
			</div>
		</div>
	</div>
</div>
