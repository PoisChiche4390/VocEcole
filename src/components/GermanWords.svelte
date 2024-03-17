<script>
  import { onDestroy } from 'svelte';
  import germanWords from '../stores/germanWords';
  import selectedGermanWordsStore from '../stores/selectedGermanWords';

  let actualPage = 0;
  let pageSize = 10;
  let width = screen.width;
  let height = screen.height;
  $: if (width < 1200 && height < 2550) {
    pageSize = 6
  } else {
    pageSize = 10
  }

  const delay = ms => new Promise(res => setTimeout(res, ms));

  const leftArrowClick = () => {
    if (actualPage === 0) {
      actualPage = Math.ceil($germanWords.length / pageSize) - 1;
    } else {
      actualPage = actualPage - 1;
    }
  };

  const rightArrowClick = () => {
    if (actualPage === Math.ceil($germanWords.length / pageSize) - 1) {
      actualPage = 0;
    } else {
      actualPage++;
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

  const toggleCheckAll = async (e) => {
    const isChecked = e.target.checked;
    actualWordsPage.forEach(germanWord => {
      germanWord.checked = isChecked;
      changeWord({ target: { checked: isChecked } }, germanWord);
    });
    rightArrowClick()
    await delay(0.000000000000000000000000000000000000000000000000000000001);
    leftArrowClick()
  };

  $: startIndex = actualPage * pageSize;
  $: endIndex = startIndex + pageSize;
  $: actualWordsPage = $germanWords.slice(startIndex, endIndex);

  // $: console.log($selectedGermanWordsStore)

  onDestroy(() => {
  });
</script>

<div class="german-words-list">
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
    height: 37.5vh;
    border: 0 solid;
    border-radius: 8px;
    max-width: 800px;
    margin: 0 auto;
    padding: 10px 0;
    background: #f4f4f4;
  }
  .wordsContainer {
    display: grid;
    margin-bottom: 1.3vh;
    margin-top: 1.1vh;
    overflow-y: scroll;
    scrollbar-width: thin;
  }
  .checkbox-container {
    max-width: 600px;
    margin: 10px auto;
  }
  label {
    cursor: pointer;
  }
  .info {
    background: #a9d9ea;
    padding: 4px 0;
    font-weight: bold;
  }
  .arrows {
    height: 35px;
    margin-top: 5vh;
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
    border-radius: 6px;
    background: #eeeeee;
  }
  @media screen and (max-width: 1200px) and (max-height: 2550px) {
    .german-words-list {
      font-size: 0.8rem;
      transform: translateY(-5%);
    }
    .arrows {
      margin-top: 15px;
      height: 25px;
    }
    img {
      height: 25px;
    }
    .checkbox-container {
      margin: 3vh 0;
    }
  }
</style>