<script>
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import germanWords from '../stores/germanWords';
  import selectedGermanWordsStore from '../stores/selectedGermanWords';

  let actualPage = 0;
  const pageSize = 10;

  const leftArrowClick = () => {
    if (actualPage === 0) {
      actualPage = 1;
    } else {
      actualPage = Math.max(actualPage - 1, 0);
    }
  };

  const rightArrowClick = () => {
    if (actualPage === 1) {
      actualPage = 0;
    } else {
      const lastPage = Math.ceil($germanWords.length / pageSize) - 1;
      actualPage = Math.min(actualPage + 1, lastPage);
    }
  };

  const changeWord = (event, germanWord) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      selectedGermanWordsStore.update(selectedWords => {
        // Include the word in the array if it's not already present
        if (!selectedWords.some(word => word.id === germanWord.id)) {
          return [...selectedWords, germanWord];
        }
        return selectedWords;
      });
    } else {
      selectedGermanWordsStore.update(selectedWords => {
        // Remove the word from the array
        return selectedWords.filter(word => word.id !== germanWord.id);
      });
    }
  };

  const toggleCheckAll = (e) => {
    const isChecked = e.target.checked;
    actualWordsPage.forEach(germanWord => {
      germanWord.checked = isChecked;
      changeWord({ target: { checked: isChecked } }, germanWord);
    });
  };

  $: startIndex = actualPage * pageSize;
  $: endIndex = startIndex + pageSize;
  $: actualWordsPage = $germanWords.slice(startIndex, endIndex);

  // $: console.log($selectedGermanWordsStore)

  onDestroy(() => {
  });
</script>

<div class="germanWordsList">
  <div class="wordsContainer">
    <form>
      <label class="select-all">
        <input type="checkbox" 
              on:change={toggleCheckAll} 
              checked={actualWordsPage.every(word => word.checked)}>
        Select all on page {actualPage + 1}
      </label>
      {#each actualWordsPage as germanWord (germanWord.id)}
        {#if germanWord.forLesson == true}
        <label class="checkbox-container">
          <input type="checkbox" 
                bind:checked={germanWord.checked} 
                on:change={(event) => changeWord(event, germanWord)}/>
          {germanWord.german} = {germanWord.french}
        </label>
        {:else}
          <p class="info">{germanWord.content}</p>
        {/if}
      {/each}
    </form>
  </div>
  <div class="arrows">
    <img src="/img/leftArrow.svg" on:click|preventDefault={() => leftArrowClick()}>
    <span class="actual-page">page {actualPage + 1}</span>
    <img src="/img/rightArrow.svg" on:click|preventDefault={() => rightArrowClick()}>
  </div>
</div>


<style>
  .wordsContainer {
    height: 400px;
    border: 0 solid;
    border-radius: 8px;
    max-width: 800px;
    margin: 0 auto;
    padding: 10px 0;
    background: #f4f4f4;
  }
  .wordsContainer {
    display: grid;
    margin-bottom: 25px;
    margin-top: 20px;
    overflow-y: scroll;
    scrollbar-width: thin;
  }
  .checkbox-container {
    max-width: 600px;
    margin: 10px auto;
  }
  .info {
    background: #a9d9ea;
    padding: 4px 0;
    font-weight: bold;
  }
  .arrows {
    height: 35px;
    margin-top: 40px;
  }
  img {
    height: 35px;
    cursor: pointer;
    margin: 0 10px;
  }
  .actual-page {
    transform: translateY(-50%);
    display: inline-block;
    padding: 1.5px 7px;
    margin: auto 0;
    border: 0 solid;
    border-radius: 5px;
    background: #eeeeee;
  }
</style>