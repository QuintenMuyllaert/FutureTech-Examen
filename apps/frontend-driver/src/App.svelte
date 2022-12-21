<script lang="ts">
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/home.svelte";
	import Tracking from "./routes/tracking.svelte";

	export let url = "";
</script>

<Router {url}>
	<main class="grid grid-rows-[auto_1fr] min-h-screen">
		<nav class="bg-red-600 p-4 text-white flex gap-8">
			<Link to="/">Home</Link>
			<Link to="tracking">Tracking</Link>
		</nav>
		<div class="h-full flex justify-center items-center bg-neutral-100">
			<!-- <Route path="blog/:id" component={BlogPost} /> -->
			<Route path="tracking" component={Tracking} />
			<Route path="/"><Home /></Route>
		</div>
	</main>
</Router>
