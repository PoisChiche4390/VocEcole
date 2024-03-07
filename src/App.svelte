<script>
	import GermanWords from './components/GermanWords.svelte';
	import GermanCourse from './components/GermanCourse.svelte';
	import EnglishWords from './components/EnglishWords.svelte';
	import EnglishCourse from './components/EnglishCourse.svelte';
	import selectedGermanWords from './stores/selectedGermanWords';
	import Button from './shared/Button.svelte'

	let language = "german";

	$: course = false;
	let languageCourse = "germanCourse"
	let notEnoughSelectedWords = false;

	const startCourse = () => {
		if ($selectedGermanWords == 0) {
			notEnoughSelectedWords = true;
		} else {
			if (language == "german") {
				languageCourse = "germanCourse";
				course = true;
				notEnoughSelectedWords = false;
			} else {
				languageCourse = "englishCourse";
				course = true;
				notEnoughSelectedWords = false;
			};
		}
	};

	$: if ($selectedGermanWords.length > 0) {
		notEnoughSelectedWords = false;
	};
</script>

<main>
	{#if course == false}
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
				<GermanWords	/>
			{:else if language === "english"}
				<EnglishWords />
			{/if}
		</div>
		<Button margin="45px 0" on:click={() => startCourse()}>Commencer</Button>
		{#if notEnoughSelectedWords == true}
			<p class="not-enough-selected-words">selectionez au moins 1 mot</p>
		{/if}
	{:else if languageCourse === "germanCourse"}
		<GermanCourse	/>
	{:else if languageCourse === "englishCourse"}
		<EnglishCourse />
	{/if}
</main>

<style>
	main {
		height: 100%;
		text-align: center;
		padding: 1px 0;
		margin: 0 auto;
		max-width: 960px;
		user-select: none;
		background: white;
	}

	h1 {
		color: #1e272e;
		font-size: 3rem;
		background: #d2dae2;
		margin: 0;
		padding: 15px 0;
	}
	.not-enough-selected-words {
		height: 10px;
    margin: 0 auto;
    margin-top: 15px;
    color: rgb(255, 0, 0);
    font-size: 0.9rem;
		transform: translateY(-500%);
	}
</style>