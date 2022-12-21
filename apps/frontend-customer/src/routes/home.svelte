<script lang="ts">
	import { navigate } from "svelte-routing";
</script>

<div class="shadow rounded-md p-8 bg-white w-[80vw] md:w-[30vw]">
	<div class="flex flex-col gap-4 items-center">
		<h1 class="font-bold text-2xl">Welkom</h1>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<button class="bg-red-600 text-white rounded p-4" on:click={() => navigate("add")}>Toevoegen pakje</button>
			<button class="bg-red-600 text-white rounded p-4" on:click={() => navigate("overview")}>Overzicht</button>
		</div>
	</div>
</div>
