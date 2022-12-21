<script lang="ts">
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/home.svelte";
	import Tracking from "./routes/tracking.svelte";
	import Overview from "./routes/overview.svelte";
	import Add from "./routes/add.svelte";
	import NotFound from "./routes/404.svelte";

	export let url = "";
</script>

<Router {url}>
	<main class="grid grid-rows-[auto_1fr] min-h-screen">
		<nav class="bg-red-600 p-4 text-white flex gap-8">
			<img src="/kpostlogo.png" alt="logo" />
			<Link to="/">Home</Link>
			<Link to="overview">Overzicht</Link>
		</nav>
		<div class="h-full flex justify-center items-center bg-neutral-100">
			<Route path="tracking/:id" component={Tracking} />
			<Route path="overview" component={Overview} />
			<Route path="add" component={Add} />
			<Route path="/"><Home /></Route>
			<Route path="*" component={NotFound} />
		</div>
	</main>
</Router>

<style>
	img {
		height: 3rem;
		background-color: white;
		border-radius: 0.5rem;
	}
	nav {
		align-items: center;
	}
</style>
