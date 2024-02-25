<script>
	import GermanWords from './components/GermanWords.svelte';
	import EnglishWords from './components/EnglishWords.svelte'

	let language = "german";
</script>

<main>
	<h1>Bienvenue</h1>
	<div class="selectLanguage">
		<h3>Langue</h3>
		<select bind:value={language}>
			<option value="german">Allemand</option>
			<option value="english">Anglais</option>
		</select>
	</div>
	<div class="wordsChoice">
		{#if language === "german"}
			<GermanWords />
		{:else if language === "english"}
			<EnglishWords />
		{/if}
	</div>
	
</main>

<style>
	main {
		text-align: center;
		max-width: 240px;
		padding: 1px 0;
		margin: 0 auto;
		max-width: 960px;
	}

	h1 {
		color: #1e272e;
		font-size: 3rem;
		background: #d2dae2;
		margin: 0;
		padding: 15px 0;
	}
</style>