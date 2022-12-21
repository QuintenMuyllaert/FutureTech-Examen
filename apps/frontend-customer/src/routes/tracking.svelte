<script lang="ts">
	import { Map, Marker } from "@beyonk/svelte-mapbox";
	let mapComponent: Map;

	const Kortrijk = {
		lat: 50.82803,
		lng: 3.26487,
	};

	let currentStep = 1;
	let stepName = "Ontvangen";
	let deliveryDate = new Date();
	let estimetedDeliveryTime = "12:00 - 14:00";

	const changeStep = (step: number) => {
		currentStep = step;

		switch (step) {
			case 1:
				stepName = "Ontvangen";
				break;
			case 2:
				stepName = "Verwerken";
				break;
			case 3:
				stepName = "Verzonden";
				break;
			case 4:
				stepName = "Geleverd";
				break;
		}
	};

	const onMapReady = (m) => {
		console.log(m);
		// console.log(Kortrijk.lat, Kortrijk.lng);
		mapComponent.flyTo({ center: [Kortrijk.lng, Kortrijk.lat] });
	};
</script>

<div>
	<div class="shadow rounded-md p-8 grid grid-rows-[auto_auto_1fr] gap-4 bg-white min-h-[50vh]">
		<h1 class="text-4xl text-red font-bold">K-post</h1>
		<nav>
			<ul class="flex gap-4">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="bg-red-500 rounded-full w-24 h-4" on:click={() => changeStep(1)} />
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="{currentStep >= 2 ? 'bg-red-500' : 'bg-neutral-200'} rounded-full w-24 h-4" on:click={() => changeStep(2)} />
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="{currentStep >= 3 ? 'bg-red-500' : 'bg-neutral-200'} rounded-full w-24 h-4" on:click={() => changeStep(3)} />
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="{currentStep >= 4 ? 'bg-red-500' : 'bg-neutral-200'} rounded-full w-24 h-4" on:click={() => changeStep(4)} />
			</ul>
		</nav>
		<div class="w-full">
			<h2 class="text-xl font-bold">{stepName}</h2>
			<div class="flex gap-8">
				<div>
					<h3 class="font-bold">Verwachte leveringsdatum</h3>
					<p>{deliveryDate.getDay()}/{deliveryDate.getMonth()}/{deliveryDate.getFullYear()}</p>
				</div>
				<div>
					<h3 class="font-bold">Geschatte leveringstijd</h3>
					<p>{estimetedDeliveryTime}</p>
				</div>
			</div>
			<div class="w-[28rem] max-w-lg mt-4 h-48 overflow-y-auto">
				{#if currentStep === 1}
					<p>Je pakje is bij ons aangemeld en zal zo snel mogelijk verwerkt worden wanneer we deze ontvangen!</p>
				{/if}
				{#if currentStep === 2}
					<p>We hebben je pakje in ons magazijn ontvangen! We zullen je pakje zo snel mogelijk verwerken en leveren!</p>
				{/if}
				{#if currentStep === 3}
					<Map
						accessToken="pk.eyJ1IjoiYWVyZXR5IiwiYSI6ImNsOHZweTF2eDBnaHUzd29ndHExZHJzOXcifQ.IuExbN0AdEz1VCEDUVDn1w"
						bind:this={mapComponent}
						on:ready={onMapReady}>
						<Marker lat={Kortrijk.lat} lng={Kortrijk.lng} color="rgb(239,68,68)" label="Kortrijk" popupClassName="class-name" />
						<Marker lat={Kortrijk.lat} lng={3} color="rgb(18, 40, 224)" label="Deliverer" popupClassName="class-name" />
					</Map>
				{/if}
				{#if currentStep === 4}
					<p>Je pakje is geleverd!</p>
				{/if}
			</div>
		</div>
	</div>
</div>
