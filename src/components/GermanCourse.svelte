<script>
  import {tweened} from 'svelte/motion'
  import {fade, slide, scale} from 'svelte/transition';
  import {onMount} from 'svelte'
  import { onDestroy } from 'svelte';
  import Button from '../shared/Button.svelte'
  import selectedGermanWords from '../stores/selectedGermanWords';
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  const delay = ms => new Promise(res => setTimeout(res, ms));

  let score = 0;
  let scorePercentage = 0;
  let color = 'duolingo-button-green'
  let lessonEnd = false;
  let readOnly = false;
  let wrongAnswer = false;
  let continueBtn = false;
  let styleForHelp = "display: inline; height: 70px; vertical-align: middle; margin: 21.7px 0;";
  let showWords = "";
  const totalWords = $selectedGermanWords.length;
  $: notEnoughCharacters = false;
  $: wordHelp = false;

  let margin1 = 80;
  let margin2 = 75;
  let margin3 = 100;
  let width = screen.width;
  let height = screen.height;
  $: if (width < 1200 && height < 2550) {
    margin1 = 50
    margin2 = 50
    margin3 = 50
  } else {
    margin1 = 80
  }

  $: currentWord = "";
  $: translatedCurrentWord = "";
  $: translatedCurrentWordWithoutMisspeling = translatedCurrentWord.toLowerCase().split(" ").join("");
  $: if (translatedCurrentWordWithoutMisspeling.length >= 1) {
    notEnoughCharacters = false;
  };

  let background = "#f8f8f8";

  $: scorePercentage = score / totalWords * 100;
  const tweenedScore = tweened(0);
  $: tweenedScore.set(scorePercentage);

  $: console.log(scorePercentage, score, $selectedGermanWords, lessonEnd)

  onMount (() => {
    updateCurrentWord()
    return () => {};
  });

  const pressEnterInTextarea = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
    }
  }

  const pressEnter = (e) => {
    switch(e.key) {
      case "Enter":
        submitWord();
    }
  }

  const updateCurrentWord = () => {
    currentWord = $selectedGermanWords[Math.floor(Math.random() * $selectedGermanWords.length)]
  };

  const submitWord = () => {
    if (translatedCurrentWordWithoutMisspeling.length < 1) {
      notEnoughCharacters = true;
    } else if (continueBtn == true) {
      if (lessonEnd == false) {
        continueBtn = false;
        color = 'duolingo-button-green'
        notEnoughCharacters = false;
        background = "#f8f8f8";
        translatedCurrentWord = "";
        readOnly = false;
        wrongAnswer = false;
        updateCurrentWord()
      } else if (lessonEnd == true) {
        location.reload()
      }
    } else if (translatedCurrentWordWithoutMisspeling == currentWord.german.toLowerCase().split(" ").join("")) {
      selectedGermanWords.update(selectedWords => {
        // Remove the word from the array
        return selectedWords.filter(word => word.id !== currentWord.id);
      });
      score++;
      background = "#d7ffb8";
      color = 'duolingo-button-green'
      notEnoughCharacters = false;
      continueBtn = true
      readOnly = true;
      if ($selectedGermanWords.length == 0) {
        lessonEnd = true
      }
    } else {
      background = "#ffb2b2";
      notEnoughCharacters = false;
      color = 'duolingo-button-red'
      continueBtn = true
      readOnly = true;
      wrongAnswer = true;
    }
  };

  const wordHelpClick = async () => {
    if (wordHelp == false) {
      wordHelp = !wordHelp;
      showWords = currentWord.german;
      styleForHelp = "display: inline; height: 70px; vertical-align: middle; border: 2px solid #d2d2d2; border-radius: 20px; background: #fff; margin: 20px 0;"
    } else {
      wordHelp = !wordHelp;
      showWords = "";
      styleForHelp = "display: inline; height: 70px; vertical-align: middle; margin: 21.7px 0;"

    }
  };
  
  onDestroy(() => {
  });
</script>

<div class="course">
  <div class="course-pourcentage">
    <div class="pourcentage" style="width: {$tweenedScore}%;">
      <div class="pourcentage-contrast"></div>
    </div>
  </div>
  <div class="orinal-words">
    <h2>Traduis :</h2>
    <div class="words-container">
      <p class="help" in:fade out:scale|local style="{styleForHelp}">{showWords}</p>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <p class="words" on:click={() => wordHelpClick()}>{currentWord.french}</p>
    </div>
  </div>
  <div class="translate-to-french">
    {#if readOnly == true}
    <textarea readonly spellcheck="false" cols="5" rows="15" maxlength="175" bind:value={translatedCurrentWord} on:keypress={e => pressEnterInTextarea(e)}></textarea>
    {:else}
    <textarea spellcheck="false" cols="5" rows="15" maxlength="175" bind:value={translatedCurrentWord} on:keypress={e => pressEnterInTextarea(e)}></textarea>
    {/if}

    {#if translatedCurrentWord.length > 174}
      <p class="max-characters">Calme, stresse pas</p>
      <div class="colored-bottom" style="background: {background}; margin-top: {margin2}px"><Button color={color} margin="{margin1}px 0" on:click={() => submitWord()}>Confirmer</Button></div>
    {:else if notEnoughCharacters == true}
      <p class="not-enough-characters">Il doit y avoir plus d'un charactère</p>
      <div class="colored-bottom" style="background: {background}; margin-top: {margin1 - 25}px"><Button color={color} margin="{margin1}px 0" on:click={() => submitWord()}>Confirmer</Button></div>
    {:else if wrongAnswer == true}
    <div class="colored-bottom" style="background: {background}; margin-top: {margin3}px">
      <Button color={color} margin="{margin1}px 0" on:click={() => submitWord()}>Confirmer</Button>
      <p class="wrong-answer">La bonne réponse était: {currentWord.german}</p>
    </div>
    {:else}
      <div class="colored-bottom" style="background: {background}; margin-top: {margin3}px"><Button color={color} margin="{margin1}px 0" on:click={() => submitWord()}>Confirmer</Button></div>
    {/if}
  </div>
</div>

<svelte:window on:keypress={(e) => pressEnter(e)}/>

<style>
  .course-pourcentage {
    width: 500px;
    height: 30px;
    margin: 0 auto;
    background: #bbbbbb;
    border:0 solid;
    border-radius: 20px;
    margin-top: 2vh;
  }
  .pourcentage-contrast {
    height: 10px;
    width: calc(100% - 30px);
    border-radius: 5px;
    margin: 0 auto;
    background: #a5ed6e;
    transform: translateY(50%);
  }
  .pourcentage {
    width: 500px;
    height: 30px;
    background: #58cc02;
    border: 0 solid;
    border-radius: 20px;
  }
  h2 {
    display: grid;
    width: 500px;
    margin: 0 auto;
    margin-top: 3vh;
    justify-content: left;
  }
  .words {
    width: 420px;
    height: 50px;
    overflow-wrap: break-word;
    margin: 20px 0;
  }
  .words-container .words {
    text-decoration: underline dotted;
  }
  .words-container {
    display: grid;
    width: 420px;
    height: 9vh;
    margin: 0 auto;
    margin-bottom: 150px;
    font-size: 1.2rem;
  }
  textarea {
    display: grid;
    margin: 0 auto;
    resize: none;
    height: 20vh;
    width: 500px;
    justify-content: center;
    padding: 7.5px 40px;
    border: 3px solid #d2d2d2;
    box-shadow: 0 5px 0 0 #d2d2d2;
    border-radius: 5vh;
    outline: none;
    font-size: 1.25rem;
    background: #fff;
    overflow: hidden;
  }
  .not-enough-characters {
    height: 10px;
    margin: 0 auto;
    margin-top: 15px;
    color: rgb(255, 0, 0);
    font-size: 0.9rem;
  }
  .max-characters {
    height: 10px;
    margin: 0 auto;
    margin-top: 15px;
    color: rgb(255, 0, 0);
    font-size: 0.9rem;
  }
  .colored-bottom {
    height: 500px;
    width: 100%;
  }
  .wrong-answer {
    color: #430202;
    font-size: 1.2rem;
    transform: translateY(-150%);
  }


  @media screen and (max-width: 1200px) and (max-height: 2550px) {
    * {
      font-size: 1rem;
    }
    .course {
      width: 100vw;
    }
    .course-pourcentage {
      width: 90vw;
    }
    h2 {
      margin-left: 4vw;
      font-size: 1.2rem;
    }
    .words-container {
      margin-bottom: 15vh;
    }
    .words {
      width: 90vw;
      margin-left: 5vw;
      margin-right: 5vw;
      transform: translateY(115%);
    }
    .help {
      height: 10vh;
    }
    textarea {
      width: 92vw;
      height: 20vh;
      font-size: 0.9rem;
      padding: 3px 15px;
    }
    .colored-bottom {
      margin-top: 5px;
    }
    .help {
      width: 90vw;
      margin-left: 5vw;
      margin-right: 5vw;
      height: 10vh;
    }
    .wrong-answer {
      font-size: 0.9rem;
      transform: translateY(-450%);
    }
  }
</style>