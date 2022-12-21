<script lang="ts">
	import { onMount } from "svelte";
	let htmlCanvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	onMount(() => {
		ctx = htmlCanvas.getContext("2d");

		//allow user to sign their signature on the canvas
		const draw = (e: MouseEvent) => {
			ctx.lineTo(e.offsetX, e.offsetY);
			ctx.stroke();
		};

		htmlCanvas.addEventListener("mousedown", (e) => {
			ctx.beginPath();
			ctx.moveTo(e.offsetX, e.offsetY);
			htmlCanvas.addEventListener("mousemove", draw);
		});

		htmlCanvas.addEventListener("mouseup", () => {
			htmlCanvas.removeEventListener("mousemove", draw);
		});
	});

	const onInputFile = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const file = input.files[0];
		const reader = new FileReader();
		reader.onload = async (event) => {
			const data = event.target.result;
			//console.log(data);
			const res = await fetch("http://localhost:3003/ocr", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ image: data }),
			});
			const json = await res.text();
			console.log(json);
		};
		reader.readAsDataURL(file);
	};

	const onClickReset = () => {
		ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);
	};

	const onClickSave = () => {
		const dataURL = htmlCanvas.toDataURL("image/png");
		const link = document.createElement("a");
		link.download = "signature.png";
		link.href = dataURL;
		link.click();
	};
</script>

<main>
	<div>
		<input type="file" accept="image/*" capture="environment" on:input={onInputFile} />
	</div>
	<div>
		<canvas bind:this={htmlCanvas} />
	</div>
	<div>
		<button on:click={onClickReset}>Reset</button>
		<button on:click={onClickSave}>Save</button>
	</div>
</main>

<style>
	canvas {
		border: 1px solid black;
		background-color: white;
	}
</style>
