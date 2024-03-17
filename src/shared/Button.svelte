<script>
  export let margin = 0;
  export let color = 'duolingo-button-blue'
</script>

<button class:blue={color === 'duolingo-button-blue'} class:green={color === 'duolingo-button-green'} class:red={color === 'duolingo-button-red'} style="margin-top: {margin};" on:click>
  <slot></slot>
</button>

<style>
  .blue {
    appearance: button;
    background-color: #1899D6;
    border: solid transparent;
    border-radius: 16px;
    border-width: 0 0 4px;
    box-sizing: border-box;
    color: #FFFFFF;
    cursor: pointer;
    display: inline-block;
    font-family: din-round,sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: .8px;
    line-height: 20px;
    outline: none;
    overflow: visible;
    padding: 13px 16px;
    text-align: center;
    text-transform: uppercase;
    touch-action: manipulation;
    transform: translateZ(0);
    transition: filter .2s;
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    width: 400px;
  } 

  .blue:after {
    background-clip: padding-box;
    background-color: #1CB0F6;
    border: solid transparent;
    border-radius: 16px;
    border-width: 0 0 4px;
    bottom: -4px;
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }

  .blue:main,
  .blue:focus {
    user-select: auto;
  }

  .blue:hover:not(:disabled) {
    filter: brightness(1.1);
    -webkit-filter: brightness(1.1);
  }

  .blue:disabled {
    cursor: auto;
  }

  .blue:active {
    border-width: 4px 0 0;
    background: none;
  }



  .green {
    appearance: button;
    background-color: #58cc02;
    border: solid transparent;
    border-radius: 16px;
    border-width: 0 0 4px;
    box-sizing: border-box;
    color: #FFFFFF;
    cursor: pointer;
    display: inline-block;
    font-family: din-round,sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: .8px;
    line-height: 20px;
    outline: none;
    overflow: visible;
    padding: 13px 16px;
    text-align: center;
    text-transform: uppercase;
    touch-action: manipulation;
    transform: translateZ(0);
    transition: filter .2s;
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    width: 400px;
  } 

  .green:after {
    background-clip: padding-box;
    background-color: #89e219;
    border: solid transparent;
    border-radius: 16px;
    border-width: 0 0 4px;
    bottom: -4px;
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }

  .green:main,
  .green:focus {
    user-select: auto;
  }

  .green:hover:not(:disabled) {
    filter: brightness(1.1);
    -webkit-filter: brightness(1.1);
  }

  .green:disabled {
    cursor: auto;
  }

  .green:active {
    border-width: 4px 0 0;
    background: none;
  }



  .red {
    appearance: button;
    background-color: #ea2b2b;
    border: solid transparent;
    border-radius: 16px;
    border-width: 0 0 4px;
    box-sizing: border-box;
    color: #FFFFFF;
    cursor: pointer;
    display: inline-block;
    font-family: din-round,sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: .8px;
    line-height: 20px;
    outline: none;
    overflow: visible;
    padding: 13px 16px;
    text-align: center;
    text-transform: uppercase;
    touch-action: manipulation;
    transform: translateZ(0);
    transition: filter .2s;
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    width: 400px;
  } 

  .red:after {
    background-clip: padding-box;
    background-color: #ff4b4b;
    border: solid transparent;
    border-radius: 16px;
    border-width: 0 0 4px;
    bottom: -4px;
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }

  .red:main,
  .red:focus {
    user-select: auto;
  }

  .red:hover:not(:disabled) {
    filter: brightness(1.1);
    -webkit-filter: brightness(1.1);
  }

  .red:disabled {
    cursor: auto;
  }

  .red:active {
    border-width: 4px 0 0;
    background: none;
  }



  @media screen and (max-width: 1200px) and (max-height: 2550px) {
    .blue {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      width: 200px;
      height: 20px;
    }
    .green {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      width: 200px;
      height: 30px;
      transform: translateY(-125%);
    }
    .red {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      width: 200px;
      height: 30px;
      transform: translateY(-125%);
    }
  }
</style>