<script lang="ts">
	import { base } from '$app/paths';
</script>

<main>
	<slot />
</main>

<style>
	main {
		max-width: 40rem;
		margin: auto;
		width: 100%;
		height: 100%;
	}

	main > *:not(:last-child) {
		margin-bottom: 1rem;
	}

	:global(img) {
		max-width: 100%;
	}
</style>
