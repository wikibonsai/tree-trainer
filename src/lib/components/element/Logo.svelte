<script lang='ts'>
  import { URL_REPO_TREE_TRAINER, URL_WIKIBONSAI } from '$lib/util/const';
  import { theme } from '$lib/util/store';

  export let which: string = 'tree-trainer';
  // note: 'wTxt' is short for 'with text'
  export let wTxt: boolean = false;
  export let size: string = 'medium';

  $: logo = (which === 'tree-trainer' ) ? '/img/logo/mr-miyagi.svg' : `/img/logo/wikibonsai-${$theme}.svg`;
  $: logoTxt = (which === 'tree-trainer') ? 'Tree Trainer' : 'WikiBonsai';
  $: logoUrl = (which === 'tree-trainer') ? URL_REPO_TREE_TRAINER : URL_WIKIBONSAI;

  $: dimensions = {
    small: { width: '50px', height: '40px' },
    medium: { width: '75px', height: '60px' },
    large: { width: '100px', height: '80px' }
  }[size] || { width: '75px', height: '60px' }; // Default to medium if size is not recognized
  $: txtSize = (size === 'small') ? '0.75rem' : (size === 'medium') ? '1rem' : '1.5rem';
</script>

<div class="logo-container">
  <a href={logoUrl}>
    <img id="logo"
        src={logo}
        style={`width: ${dimensions.width}; height: ${dimensions.height};`}
        alt="Logo" />
  </a>
  {#if wTxt}
    <div class="logo" style={`font-size: ${txtSize}`}>{logoTxt}</div>
  {/if}
</div>

<style>
  .logo {

  }

  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
  }
</style>
