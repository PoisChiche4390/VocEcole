<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  const openChangeBackgroundColor = () => {
    dispatch('openChangeBackgroundColor')
  }
  const closeMenu = () => {
    dispatch('closeMenu')
  }
</script>

<div class="menu">
  <div class="close-menu">
    <div class="close-page">
      <label>
        <button on:click={() => {closeMenu()}}></button>
        <ion-icon name="close-outline" class="close-menu-image"></ion-icon>
      </label>
    </div>
  </div>
  <div class="open-change-color-background">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <label on:click={() => {openChangeBackgroundColor()}}>
      <button></button>
      <ion-icon name="contrast-outline" class="change-background-image"></ion-icon>
    </label>
    <p>changer mode sombre/clair</p>
  </div>
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script><script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</div>

<style>
  .menu {
    height: 100vh;
  }
  .close-menu label {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		margin-left: auto;
    margin-top: 5px;
		margin-right: 5px;
		cursor: pointer;
    transition: 1s;
	}
  .close-menu label:hover {
    background: #e9e9e9;
  }
	.close-menu button {
		position: absolute;
		opacity: 0;
		cursor: pointer;
	}
  .close-menu-image {
    width: 30px;
		height: 30px;
  }
  .open-change-color-background {
		display: flex;
		justify-content: center;
		align-items: center;
    margin-top: 5vh;
	}
	.open-change-color-background label {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
    cursor: pointer;
    transition: 1s;
	}
  .open-change-color-background label:hover {
		width: 35px;
		height: 35px;
	}

	.open-change-color-background button {
		position: absolute;
		opacity: 0;
		margin: auto 0;
	}
	.change-background-image {
		width: 30px;
		height: 30px;
    transition: 1s;
	}
  .change-background-image {
    width: 35px;
		height: 35px;
  }
  p {
    font-size: 1rem;
    margin-left: 10px;
  }
</style>