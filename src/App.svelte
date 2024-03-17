<script>
	import GermanWords from './components/GermanWords.svelte';
	import GermanCourse from './components/GermanCourse.svelte';
	import EnglishWords from './components/EnglishWords.svelte';
	import EnglishCourse from './components/EnglishCourse.svelte';
	import selectedGermanWords from './stores/selectedGermanWords';
	import Menu from './components/Menu.svelte';
	import Button from './shared/Button.svelte'
  import DarkLightMode from './shared/DarkLightMode.svelte';

	let language = "german";

	const delay = ms => new Promise(res => setTimeout(res, ms));

	$: course = false;
	let languageCourse = "germanCourse";
	let notEnoughSelectedWords = false;
	let menu = false;
	let darkMode = false;
	$: background = "#f8f8f8";
	let darkLightModeMenu = false;
	let colorCloseBackgroundColorPage = "#2b2b2b"

	const startCourse = () => {
		if ($selectedGermanWords == 0) {
			notEnoughSelectedWords = true;
		} else {
			if (language == "german") {
				languageCourse = "germanCourse";
				course = true;
			} else {
				languageCourse = "englishCourse";
				course = true;
			};
		}
	};

	const pressEnter = (e) => {
    switch(e.key) {
      case "Enter":
        startCourse()
    }
  }

	$: if ($selectedGermanWords.length > 0) {
		notEnoughSelectedWords = false;
	};
	$: if (darkLightModeMenu == true) {
		background = "#2b2b2b"
	} else {
		background = "#f8f8f8"
	}

	const returnToLobby = () => {
		course = false
	}

	const changeCurrentBackgroundColorMode = async () => {
		if (darkMode == true) {
			darkMode = !darkMode
			colorCloseBackgroundColorPage = "#2b2b2b"
			await delay(1500);
			background = "#f8f8f8"
		} else {
			darkMode = !darkMode
			colorCloseBackgroundColorPage = "#f8f8f8"
			background = "#2b2b2b"
		}
	};
	const openChangeBackgroundColor = () => {
		darkLightModeMenu = true;
		menu = false;
	};
	const closeChangeBackgroundPage = () => {
		darkLightModeMenu = false;
		menu = true;
	};
	const openMenu = () => {
		menu = true;
	};
	const closeMenu = () => {
		menu = false;
	};
</script>

<main style="background: {background};">
	<div class="sub-main">
		{#if course == false && darkLightModeMenu == false && menu == false}
			<div class="top-page">
				<h1>Bienvenue</h1>
			</div>
			<div class="parameters">
				<label>
					<button on:click={() => {openMenu()}}></button>
					<img src="/img/parameter.svg" alt="">
				</label>
			</div>
			<div class="select-language">
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
		{:else if darkLightModeMenu == true && course == false}
			<DarkLightMode on:changeLightDarkMode={() => changeCurrentBackgroundColorMode()}>
				<div class="close-page">
					<label>
						<button on:click={() => {closeChangeBackgroundPage()}}></button>
						<ion-icon name="close-outline" class="close-page-image" style="color: {colorCloseBackgroundColorPage};"></ion-icon>
					</label>
					<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  				<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script><script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  				<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
				</div>
			</DarkLightMode>
		{:else if menu == true && course == false}
			<Menu on:closeMenu={() => closeMenu()} on:openChangeBackgroundColor={() => openChangeBackgroundColor()} />
		{:else if languageCourse === "germanCourse"}
			<GermanCourse on:returnToLobby={() => returnToLobby()}	/>
		{:else if languageCourse === "englishCourse"}
			<EnglishCourse />
		{/if}
	</div>
</main>

<svelte:window on:keypress={(e) => pressEnter(e)}/>

<style>
	main {
		min-width: 100vw;
		background: #f8f8f8;
	}
	.sub-main {
		height: 100%;
		text-align: center;
		padding: 1px 0;
		margin: 0 auto;
		max-width: 960px;
		user-select: none;
	}
	.top-page {
		background: #d2dae2;
		padding: 1vh 0;
		transform: translateY(-1%);
	}
	h1 {
		color: #1e272e;
		font-size: 3rem;
		margin: 0;
		transform: translateY(-3%);
	}
	.parameters label {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		margin-left: auto;
		margin-right: 10px;
		margin-top: 3px;
		cursor: pointer;
		transition: 1s;
	}
	.parameters label:hover {
    background: #e9e9e9;
  }
	.parameters button {
		position: absolute;
		opacity: 0;
		cursor: pointer;
	}
	.close-page label {
		width: 30px;
		height: 30px;
		position: absolute;
		display: flex;
		right: 5px;
		top: 5px;
		border-radius: 50%;
		cursor: pointer;
		transition: 1s;
	}
	.close-page label:hover {
		width: 32px;
		height: 32px;
	}
	.close-page button {
		position: absolute;
		opacity: 0;
	}
	.close-page-image {
		width: 30px;
		height: 30px;
		transition: 1s;
	}
	.close-page-image:hover {
		width: 32px;
		height: 32px;
	}
	.not-enough-selected-words {
		height: 10px;
    margin: 0 auto;
    margin-top: 15px;
    color: rgb(255, 0, 0);
    font-size: 0.9rem;
		transform: translateY(-500%);
	}
	.select-language {
		transform: translateY(-10%);
	}


	@media screen and (max-width: 1200px) and (max-height: 2550px) {
		h1 {
			font-size: 1.2rem;
		}
		.parameters label {
			width: 25px;
			height: 25px;
		}
		.select-language {
			font-size: 0.9rem;
		}
		.not-enough-selected-words {
			transform: translateY(-900%);
		}
	}
</style>