<script lang="ts">
	import { onMount } from "svelte";
	import Package from "./package.svelte";
	let htmlCanvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	let htmlNameInput: HTMLInputElement;

	onMount(() => {
		ctx = htmlCanvas.getContext("2d");
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 1;

		//allow user to sign their signature on the canvas
		const draw = (e: MouseEvent | TouchEvent) => {
			let x = 0;
			let y = 0;
			if (e instanceof TouchEvent) {
				console.log("touch");
				x = e.touches[0].clientX - htmlCanvas.offsetLeft;
				y = e.touches[0].clientY - htmlCanvas.offsetTop;
			}
			if (e instanceof MouseEvent) {
				console.log("mouse");
				x = e.offsetX;
				y = e.offsetY;
			}
			ctx.lineTo(x, y);
			// black
			ctx.strokeStyle = "#000000";
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

		//mobile
		htmlCanvas.addEventListener("touchstart", (e) => {
			ctx.beginPath();
			ctx.moveTo(e.touches[0].clientX - htmlCanvas.offsetLeft, e.touches[0].clientY - htmlCanvas.offsetTop);
			htmlCanvas.addEventListener("touchmove", draw);
		});

		htmlCanvas.addEventListener("touchend", () => {
			htmlCanvas.removeEventListener("touchmove", draw);
		});
	});

	const onInputFile = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (!input.files) return;
		const file = input.files[0];
		const reader = new FileReader();
		reader.onload = async (event) => {
			const data = event.target.result;
			//console.log(data);
			const res = await fetch(`http://${document.location.hostname}/api/ocr`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ image: data }),
			});
			const name = await res.text();
			console.log(name);
			htmlNameInput.value = name;

			//clear file input
			input.value = "";
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
	<nav>
		<img src="/kpostlogo.png" alt="logo" />
	</nav>
	<div class="container">
		<Package />

		<div class="gap">
			<div>
				<label for="naam">Fullname</label>
				<div class="fileinput">
					<input type="text" name="naam" id="naam" bind:this={htmlNameInput} />
					<label for="passport">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="12" cy="12" r="10" /><line x1="14.31" y1="8" x2="20.05" y2="17.94" /><line x1="9.69" y1="8" x2="21.17" y2="8" /><line
								x1="7.38"
								y1="12"
								x2="13.12"
								y2="2.06" /><line x1="9.69" y1="16" x2="3.95" y2="6.06" /><line x1="14.31" y1="16" x2="2.83" y2="16" /><line
								x1="16.62"
								y1="12"
								x2="10.88"
								y2="21.94" /></svg>
					</label>
					<input type="file" name="passport" id="passport" accept="image/*" capture="environment" on:input={onInputFile} />
				</div>
			</div>
			<div>
				<div>
					<label for="canvas">Handtekening</label>
				</div>
				<canvas id="canvas" bind:this={htmlCanvas} />
			</div>
			<div>
				<button on:click={onClickReset}>Reset</button>
				<button on:click={onClickSave}>Save</button>
			</div>
		</div>
	</div>
</main>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	input[type="file"] {
		display: none;
	}
	main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr;
	}
	nav {
		background-color: rgba(0, 0, 0, 0.2);
		height: 3rem;
		box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
	}
	nav img {
		height: 3rem;
	}
	canvas {
		border: 1px solid black;
		background-color: white;
	}

	.container {
		display: grid;
		width: 100%;
		height: 100%;
		place-items: center;
	}

	.fileinput {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		place-items: center;
	}

	.fileinput input[type="text"] {
		border: none;
		padding: 0.5rem;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 0.25rem 0 0 0.25rem;
	}

	.fileinput label {
		width: 100%;
		height: 100%;
		cursor: pointer;
		display: grid;
		place-items: center;
		padding: 0.25rem;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 0 0.25rem 0.25rem 0;
	}

	.gap {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
