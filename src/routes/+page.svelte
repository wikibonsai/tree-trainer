<script lang='ts'>
  import type { PageData } from './$types'
  import { isMarkdown, llm, resultMkdn, resultMkmp, resultTree, systemApiKeys } from '$lib/util/store';
  import { appendStyles } from '$lib/util/prompt';
  import Loader from "$lib/components/element/Loader.svelte";
  import Logo from '$lib/components/element/Logo.svelte';
  // import MarkMap from "$lib/components/component/MarkMap.svelte";
  import Prompt from "$lib/components/component/Prompt.svelte";
  import SentenceTree from "$lib/components/component/SentenceTree.svelte";
  import Theme from '$lib/components/element/Theme.svelte';
  import ToolBar from "$lib/components/component/ToolBar.svelte";
  // import Tree from "$lib/components/component/Tree.svelte";


  export let data: PageData;
  const apiKeys: any = {
    anthropic: (data && data.apiKeyAnthropic) ? data.apiKeyAnthropic : '',
    openai: (data && data.apiKeyOpenAI) ? data.apiKeyOpenAI : '',
    xai: (data && data.apiKeyXAI) ? data.apiKeyXAI : '',
  }

  let loadingTree: boolean = false;
  let loadingPage: boolean = false;

  $: if (data !== undefined) {
    // from server
    if (apiKeys.anthropic.length > 0) { $systemApiKeys.anthropic = apiKeys.anthropic; }
    if (apiKeys.openai.length > 0) { $systemApiKeys.openai = apiKeys.openai; }
    if (apiKeys.xai.length > 0) { $systemApiKeys.xai = apiKeys.xai; }
    loadingPage = false;
  }
  $: model = $llm?.provider
    ? ($llm[$llm.provider]?.model ?? 'missing model')
    : 'Loading...';
  $: provider = $llm?.provider ?? 'Loading...';

  function load(event: CustomEvent<boolean>) {
    loadingTree = event.detail;
  }
</script>

<div class="main">
  <div class="container">
    {#if loadingPage}
      <Loader />
    {:else}
      <div class="flex-center">
        <Logo />
        <h1 class="title-style">
          Tree Trainer
        </h1>
        <Theme pin={true} />
      </div>
      {#if loadingTree}
        <Loader />
      {/if}
      <Prompt bind:text={data.query} on:loading={load} />
      <ToolBar />
      <div id="result" class="result-box-background" class:monospace-text={$isMarkdown}>
        <!-- subtree -->
        <div class="result-box box-border"
             class:extend-bottom-for-label-row={$isMarkdown}
             style="display: {($resultMkdn === '') ? 'none' : 'flex'}">
          {#if $resultMkdn.includes('You need to provide an API key')}
            <div class="error-message">{$resultMkdn}</div>
          {:else}
            {#if $isMarkdown}
              {@html appendStyles($resultMkdn)}
            {:else}
              <SentenceTree markdown={$resultMkdn}
                            height={65}
                            width={75} />
            {/if}
          {/if}
          <div class="pin-logo">
            <Logo which={'wikibonsai'} wTxt={true} size={'small'}/>
          </div>
          <div class="pin-model-version">
            <span>{model}</span>
            <span>{provider}</span>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .monospace-text {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    padding: 0.5rem;
    border-radius: 4px;
    /* overflow-x: auto; */
  }

  .container {
    width: 100%;
    /* max-width: 640px; */
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
  }

  .extend-bottom-for-label-row {
    padding-bottom: 2rem !important;
  }

  .flex-center {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    justify-content: center;
  }

  .labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .main {
    font-family: sans-serif;
    margin-left: 2.5rem;
    margin-right: 2.5rem;
  }

  .pin-logo {
    position: absolute;
    bottom: 10px;
    left: 10px;
  }

  .pin-model-version {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: var(--text-color);
    font-size: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .result-box {
    position: relative;
    display: flex;
    flex-direction: column;
    white-space: pre-wrap;
    background-color: var(--box-background);
    color: var(--text-color);
    border-radius: 0.5rem;
    margin-bottom: 2.5rem;
    padding: 1rem;
  }

  .result-box-background {
    background-color: transparent;
  }

  .title-style {
    font-size: 2.5rem;
    line-height: 2.5rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 1rem;
    margin-right: 1rem;
    display: none;
  }

  .error-message {
    color: var(--text-color);
    text-align: center;
    padding-bottom: 3rem;
    font-size: 1.1rem;
  }

  @media (min-width: 768px) {
    .flex-center {
      justify-content: flex-start;
    }

    .title-style {
      display: block;
    }
  }
</style>
