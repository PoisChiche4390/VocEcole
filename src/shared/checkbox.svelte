<script>
  export let group = undefined;
	export let value = undefined;
</script>

<label>
  <input type="checkbox" bind:group value={value} class="checkbox-word">
	<slot />
</label>