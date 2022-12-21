<script lang="ts">
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
</script>

<main>
	<input type="file" accept="image/*" capture="environment" on:input={onInputFile} />
</main>

<style>
</style>
