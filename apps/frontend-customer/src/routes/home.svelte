<script lang="ts">
	import { navigate } from "svelte-routing";
</script>

<div class="shadow rounded-md p-8 bg-white">
	<div class="flex flex-col gap-4 items-center">
		<h1 class="font-bold text-2xl">Welkom</h1>
		<div class="flex gap-4">
			<button class="bg-red-600 text-white rounded p-4 w-64" on:click={() => navigate("add")}>Toevoegen pakje</button>
			<button class="bg-red-600 text-white rounded p-4 w-64" on:click={() => navigate("overview")}>Overzicht</button>
		</div>
	</div>
</div>
