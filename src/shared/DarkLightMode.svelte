<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  const changeMode = () => {
    dispatch('changeLightDarkMode')
  };

</script>

<div class="dark-light-mode">
  <slot></slot>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <label class="change-light-dark-mode">
    <input type="checkbox" class="toggle-change-light-dark-mode" on:click|self={() => changeMode()}>
    <ion-icon name="sunny" class="sun"></ion-icon>
    <ion-icon name="moon" class="moon"></ion-icon>
    <span class="toggle"></span>
    <span class="animateBg"></span>
  </label>
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script><script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</div>

<style>
  .dark-light-mode {
		display: flex;
		justify-content: center;
		align-items: center;
    min-height: 102vh;
		background: #2b2b2b;
    transform: translateY(-0.1%);
	}
	.dark-light-mode label {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
    cursor: pointer;
	}
	.dark-light-mode input {
		position: absolute;
		opacity: 0;
	}
  .moon {
    position: absolute;
    font-size: 3em;
    color: #666;
    filter: drop-shadow(0 0 2px rgba(0,0,0 .5));
    transform: scale(0);
    transition: 1s ease;
  }
  input:checked~.moon {
    transition-delay: .8s;
    transform: scale(1) rotate(360deg);
  }
  .sun {
    font-size: 3em;
    color: #666;
    filter: drop-shadow(0 0 2px rgba(0,0,0 .5));
    transition: 1s ease;
    transition-delay: .8s;
  }
  input:checked~.sun {
    transition-delay: 0s;
    transform: rotate(360deg) scale(0);
  }
  .toggle {
    position: absolute;
    width: 80px;
    height: 80px;
    background: #f8f8f8;
    border-radius: 50%;
    box-shadow: 
      inset 0 8px 60px rgba(0,0,0, .1),
      inset 0 8px 8px rgba(0,0,0, .1),
      inset 0 -4px 4px rgba(0,0,0, .1);
      z-index: -1;
    transition: 1s;
  }
  input:checked~.toggle {
    background: #2b2b2b;
  }
  .animateBg {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: #f8f8f8;
    z-index: -2;
    clip-path: circle(150% at 50% 50%);
    transition: 1.5s ease-out;
    transform: translateY(-1%);
    pointer-events: none;
  }
  input:checked~.animateBg {
    clip-path: circle(0% at 50% 50%);
  }
</style>