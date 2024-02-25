<script>
  import { each, text } from 'svelte/internal';
  import Checkbox from '../shared/checkbox.svelte'
  import germanWords from '../stores/germanWords';
  import selectedGermanWordsStore from '../stores/selectedGermanWords';

  let selectedGermanWords = [...$selectedGermanWordsStore];

  let actualPage = 0;
  const leftArrowClick = () => {
    if (actualPage < 1) {
      actualPage = 10
      // console.log("ouais de 0 a 10")
    } else {
      actualPage = actualPage - 10
      // console.log("ouais le 10 - 10")
    }
  };
  const rightArrowClick = () => {
    if (actualPage > 9) {
      actualPage = 0
      // console.log("oe de 10 a 0")
    } else {
      actualPage = actualPage + 10
      // console.log("oe le 0 + 10")
    }
  };

  $: wordsPerPages = actualPage + 10;
  $: actualWordsPage = $germanWords.slice(actualPage, wordsPerPages);
  // $: console.log(actualWordsPage, wordsPerPages, actualPage)
  $: console.log(selectedGermanWords)
</script>

<div class="germanWordsList">
  <div class="wordsContainer">
    {#each actualWordsPage as germanWord (germanWord.id)}
      <label class="checkbox-container"><input type="checkbox" bind:group={selectedGermanWords} value={germanWord} /> {germanWord.german} = {germanWord.french}</label>
    {/each}
  </div>
  <!-- bind:group={$selectedGermanWords} -->
  <div class="arrows">
    <img src="/img/leftArrow.svg" on:click|preventDefault={() => leftArrowClick()}>
    <img src="/img/rightArrow.svg" on:click|preventDefault={() => rightArrowClick()}>
  </div>
</div>

<style>
  .wordsContainer {
    border: 1px solid black;
    border-radius: 30px;
    max-width: 600px;
    margin: 0 auto;
    padding: 10px 0;
    background: rgb(246, 246, 246);
  }
  .wordsContainer {
    display: grid;
    margin-bottom: 25px;
    margin-top: 20px;
  }
  .checkbox-container {
    max-width: 50vw;
    margin: 10px auto;
  }
  .arrows {
    display: inline;
  }
  img {
    height: 35px;
    cursor: pointer;
    margin: 0 7px;
  }
</style>