<script lang="ts">
	let currentStep = 1;
	let stepName = "Ontvangen";

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
</script>

<main class="min-h-screen flex justify-center items-center bg-neutral-100">
	<div class="shadow rounded p-8 flex flex-col gap-4 bg-white">
		<h1 class="text-4xl text-red font-bold">K-post</h1>
		<nav>
			<ul class="flex gap-4">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="bg-red-500 rounded-full w-24 h-4" on:click={() => changeStep(1)} />
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="{currentStep >= 2 ? 'bg-red-500' : 'bg-neutral-200'} rounded-full w-24 h-4 " on:click={() => changeStep(2)} />
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="{currentStep >= 3 ? 'bg-red-500' : 'bg-neutral-200'} rounded-full w-24 h-4 text-white" on:click={() => changeStep(3)} />
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="{currentStep >= 4 ? 'bg-red-500' : 'bg-neutral-200'} rounded-full w-24 h-4 text-white" on:click={() => changeStep(4)} />
			</ul>
		</nav>
		<div class="min-w-xs">
			<h1 class="text-xl font-bold mb-4">{stepName}</h1>
			{#if currentStep === 1}
				<p>step1</p>
			{/if}
			{#if currentStep === 2}
				<p>step2</p>
			{/if}
			{#if currentStep === 3}
				<p>step3</p>
			{/if}
			{#if currentStep === 4}
				<p>step4</p>
			{/if}
		</div>
	</div>
</main>
