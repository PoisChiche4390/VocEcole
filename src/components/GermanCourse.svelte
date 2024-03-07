<script>
  import {tweened} from 'svelte/motion'
  import {fade, slide, scale} from 'svelte/transition';
  import {onMount} from 'svelte'
  import { onDestroy } from 'svelte';
  import Button from '../shared/Button.svelte'
  import selectedGermanWords from '../stores/selectedGermanWords';

  let score = 0;
  let scorePercentage = 0;
  let color = 'duolingo-button-green'
  let lessonEnd = false;
  let readOnly = false;
  let wrongAnswer = false;
  $: notEnoughCharacters = false;

  $: currentWord = "";
  $: translatedCurrentWord = "";
  $: translatedCurrentWordWithoutMisspeling = translatedCurrentWord.toLowerCase().split(" ").join("");
  $: if (translatedCurrentWordWithoutMisspeling.length >= 1) {
    notEnoughCharacters = false;
  };

  let continueBtn = false;

  $: wordHelp = false;

  let background = "#fff";

  const totalWords = $selectedGermanWords.length;
  $: scorePercentage = score / totalWords * 100;
  const tweenedScore = tweened(0);
  $: tweenedScore.set(scorePercentage);

  $: console.log(scorePercentage, score, $selectedGermanWords, lessonEnd)

  onMount (() => {
    updateCurrentWord()
    return () => {};
  });

  const updateCurrentWord = () => {
    currentWord = $selectedGermanWords[Math.floor(Math.random() * $selectedGermanWords.length)]
  };

  const submitWord = () => {
    if (translatedCurrentWordWithoutMisspeling.length < 1) {
      notEnoughCharacters = true;
    } else if (continueBtn == true) {
      continueBtn = false;
      color = 'duolingo-button-green'
      notEnoughCharacters = false;
      background = "#fff";
      translatedCurrentWord = "";
      readOnly = false;
      wrongAnswer = false;
      updateCurrentWord()
    } else if (translatedCurrentWordWithoutMisspeling == currentWord.germanWithoutMisspeling) {
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
        console.log("letsgo")
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

  const wordHelpClick = () => {
    wordHelp = !wordHelp;
  };

  const finishLesson = () => {
    location.reload()
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
      {#if wordHelp == true}
        <p class="help" in:fade out:scale|local>{currentWord.german}</p>
      {/if}
      <p class="words" on:click={() => wordHelpClick()}>{currentWord.french}</p>
    </div>
  </div>
  <div class="translate-to-french">
    {#if readOnly == true}
    <textarea readonly spellcheck="false" cols="5" rows="15" maxlength="175" bind:value={translatedCurrentWord}></textarea>
    {:else}
    <textarea spellcheck="false" cols="5" rows="15" maxlength="175" bind:value={translatedCurrentWord}></textarea>
    {/if}

    {#if translatedCurrentWord.length > 174}
      <p class="max-characters">Calme, stresse pas</p>
      <div class="colored-bottom" style="background: {background}; margin-top: 75px"><Button color={color} margin="80px 0" on:click={() => submitWord()}>Confirmer</Button></div>
    {:else if lessonEnd == true}
    <div class="colored-bottom" style="background: {background}; margin-top: 100px"><Button color={color} margin="80px 0" on:click={finishLesson}>Confirmer</Button></div>
    {:else if notEnoughCharacters == true}
      <p class="not-enough-characters">Il doit y avoir plus d'un charactère (hors espace)</p>
      <div class="colored-bottom" style="background: {background}; margin-top: 75px"><Button color={color} margin="80px 0" on:click={() => submitWord()}>Confirmer</Button></div>
    {:else if wrongAnswer == true}
    <div class="colored-bottom" style="background: {background}; margin-top: 100px">
      <Button color={color} margin="80px 0" on:click={() => submitWord()}>Confirmer</Button>
      <p class="wrong-answer">La bonne réponse était: {currentWord.german}</p>
    </div>
    {:else}
      <div class="colored-bottom" style="background: {background}; margin-top: 100px"><Button color={color} margin="80px 0" on:click={() => submitWord()}>Confirmer</Button></div>
    {/if}
  </div>
</div>

<style>
  .course-pourcentage {
    width: 500px;
    height: 30px;
    margin: 0 auto;
    background: #f2f2f2;
    border:0 solid;
    border-radius: 20px;
    margin-top: 20px;
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
    margin-top: 30px;
    justify-content: left;
  }
  .help {
    display: inline;
    height: 70px;
    vertical-align: middle;
    border: 2px solid #d2d2d2;
    border-radius: 20px;
  }
  .words {
    width: 420px;
    height: 50px;
    overflow-wrap: break-word;
    transform: translateY(200%);
    position: fixed;
  }
  .words-container .words {
    text-decoration: underline dotted;
  }
  .words-container {
    display: grid;
    width: 420px;
    height: 100px;
    margin: 0 auto;
    margin-bottom: 150px;
    font-size: 1.2rem;
  }
  textarea {
    display: grid;
    margin: 0 auto;
    resize: none;
    height: 220px;
    width: 500px;
    justify-content: center;
    padding: 7.5px 40px;
    border: 3px solid #d2d2d2;
    box-shadow: 0 5px 0 0 #d2d2d2;
    border-radius: 5vh;
    outline: none;
    font-size: 1.25rem;
    background: white;
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
</style>