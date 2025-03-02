<script lang='ts'>
  import { onMount } from 'svelte';
  import { llm, systemApiKeys } from '$lib/util/store';
  import {
    DEFAULT_MODEL_ANTHROPIC,
    DEFAULT_MODEL_OPENAI,
    DEFAULT_MODEL_XAI,
  } from '$lib/util/const';

  export let isOpen: boolean = false;

  let activeTab = 'llm';
  const imgSrc: string = '/img/icons/icons8-help-50.png';

  onMount(() => {
    // llm options
    $llm.provider = localStorage.getItem('provider')
              ? localStorage.getItem('provider')
              : 'anthropic';
    $llm.anthropic.model = localStorage.getItem('model-anthropic')
              ? localStorage.getItem('model-anthropic')
              : DEFAULT_MODEL_ANTHROPIC;
    $llm.openai.model = localStorage.getItem('model-openai')
              ? localStorage.getItem('model-openai')
              : DEFAULT_MODEL_OPENAI;
    $llm.xai.model = localStorage.getItem('model-xai')
              ? localStorage.getItem('model-xai')
              : DEFAULT_MODEL_XAI;
    if ($systemApiKeys.anthropic === '') {
      $llm.anthropic.apiKey = localStorage.getItem('api-key-anthropic')
                            ? localStorage.getItem('api-key-anthropic')
                            : '';
    }
    if ($systemApiKeys.openai === '') {
      $llm.openai.apiKey = localStorage.getItem('api-key-openai')
                      ? localStorage.getItem('api-key-openai')
                      : '';
    }
    if ($systemApiKeys.xai === '') {
      $llm.xai.apiKey = localStorage.getItem('api-key-xai')
                      ? localStorage.getItem('api-key-xai')
                      : '';
    }
  });

  // modal

  function closeModal(): void {
    isOpen = false;
  }

  function toggleModal(): void {
    isOpen = !isOpen;
  }

  function saveOpts(): void {
    // llm
    localStorage.setItem('provider', $llm.provider);
    const provider: string = $llm.provider;
    localStorage.setItem('model', $llm[provider].model);
    // todo: if loaded from server, skip
    localStorage.setItem('api-key-anthropic', $llm[provider].apiKey);
    localStorage.setItem('api-key-openai', $llm[provider].apiKey);
    localStorage.setItem('api-key-xai', $llm[provider].apiKey);
    toggleModal();
  };

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && isOpen) {
      toggleModal();
    }
  }

  // tabs

  function setActiveTab(tab: string) {
    activeTab = tab;
  }

  // api

  function notify() {
    alert('If you have an API developer key, you can put it in this input and it will be used when posting to one of the listed LLM providers.\n\nnhttps://docs.x.ai/docs/quickstart\n\nSee the following links to get a key:\n\nhttps://console.anthropic.com/settings/keys\n\nhttps://platform.openai.com/api-keys\n\nPutting API keys into boxes is generally a bad idea! If you have any concerns, create an API key and then revoke it after using this site.');
  }
</script>


<svelte:window on:keydown={handleKeydown} />

<div class="modal" class:modal-open={isOpen}>
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <button class="modal-close" on:click={closeModal}>
      <svg class="btn-close" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
        <path d="M16.292 2.292l-1.584-1.584-6.708 6.708-6.708-6.708-1.584 1.584 6.708 6.708-6.708 6.708 1.584 1.584 6.708-6.708 6.708 6.708 1.584-1.584-6.708-6.708z"></path>
      </svg>
    </button>
    <p class="modal-title">Options</p>
    <div class="modal-body">
      <div class="tabs">
        <button
          class="tab-button"
          class:active={activeTab === 'llm'}
          on:click={() => setActiveTab('llm')}>
          LLM Models
        </button>
      </div>
      {#if activeTab === 'llm'}
        <form class="dropdown-container">
          <div class="dropdown-label">
            <span>Provider</span>
            <select id="indentSelect" bind:value={$llm.provider}>
              <option value="anthropic">Anthropic</option>
              <option value="openai">OpenAI</option>
              <option value="xai">xAI</option>
              <!-- <option value="google">Gemini</option> -->
            </select>
          </div>
          <div class="dropdown-label">
            <div class="dropdown-label">
              <span>Model</span>
              {#if $llm.provider === 'anthropic'}
                <select id="indentSelect" bind:value={$llm.anthropic.model}>
                  <!-- <option value="claude">Claude</option> -->
                  <option value="claude-3-7-sonnet-20250219">claude-3-7-sonnet-20250219</option>
                  <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet-20241022</option>
                  <option value="claude-3-5-sonnet-20240620">claude-3-5-sonnet-20240620</option>
                  <option value="claude-3-5-haiku-20241022">claude-3-5-haiku-20241022</option>
                  <option value="claude-3-opus-20240229">claude-3-opus-20240229</option>
                  <option value="claude-3-sonnet-20240229">claude-3-sonnet-20240229</option>
                  <option value="claude-3-haiku-20240307">claude-3-haiku-20240307</option>
                </select>
              {:else if $llm.provider === 'openai'}
                <select id="indentSelect" bind:value={$llm.openai.model}>
                  <option value="o3-mini">o3-mini</option>
                  <option value="o1">o1</option>
                  <option value="o1-mini">o1-mini</option>
                  <option value="o1-preview">o1-preview</option> 
                  <option value="gpt-4o-mini-2024-07-18">gpt-4o-mini-2024-07-18</option>
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-4-turbo">gpt-4-turbo</option>
                  <option value="gpt-4">gpt-4</option>
                </select>
              {:else if $llm.provider === 'xai'}
                <select id="indentSelect" bind:value={$llm.xai.model}>
                  <option value="grok-3">grok-3</option>
                  <option value="grok-2-1212">grok-2-1212</option>
                  <option value="grok-beta">grok-beta</option>
                </select>
              <!-- {:else if $llm.model === 'google'}
                <select id="indentSelect" bind:value={$llm.google.model}>
                  <option value="model">Gemini</option>
                </select> -->
              {/if}
            </div>
          <div class="dropdown-label-info">
            <span><strong>API Keys</strong></span>
            <button class="flex-shrink-0 w-6 h-6 rounded p-0 cursor-pointer flex items-center justify-center pointer-events-auto"
                    on:click={notify}>
              <img id="helpApiKeyIcon" src={imgSrc} class="fill-current text-gray-600 p-1">
            </button>
          </div>
          <div class="dropdown-label">
            <span>Anthropic</span>
            <input id="anthropic_key_risky_but_cool"
                  type="password"
                  class="w-full px-3 py-1.5 bg-gray-200 text-sm border-none rounded focus:outline-none focus:bg-white focus:text-gray-800"
                  placeholder="Your Anthropic API Key (risky but cool)"
                  bind:value={$llm.anthropic.apiKey}
                  on:focus={e => {
                    e.target.type = 'text';
                  }}
                  on:blur={e => {
                    e.currentTarget.type = 'password';
                  }}
                  on:input={e => {
                    localStorage.setItem('api-key-anthropic', e.target.value);
                  }}/>
          </div>
          <div class="dropdown-label">
            <span>OpenAI</span>
            <input id="openai_key_risky_but_cool"
                  type="password"
                  class="w-full px-3 py-1.5 bg-gray-200 text-sm border-none rounded focus:outline-none focus:bg-white focus:text-gray-800"
                  placeholder="Your OpenAI API Key (risky but cool)"
                  bind:value={$llm.openai.apiKey}
                  on:focus={e => {
                    e.target.type = 'text';
                  }}
                  on:blur={e => {
                    e.currentTarget.type = 'password';
                  }}
                  on:input={e => {
                    localStorage.setItem('api-key-openai', e.target.value);
                  }}/>
          </div>
          <div class="dropdown-label">
            <span>xAI</span>
            <input id="xai_key_risky_but_cool"
                  type="password"
                  class="w-full px-3 py-1.5 bg-gray-200 text-sm border-none rounded focus:outline-none focus:bg-white focus:text-gray-800"
                  placeholder="Your xAI API Key (risky but cool)"
                  bind:value={$llm.xai.apiKey}
                  on:focus={e => {
                    e.target.type = 'text';
                  }}
                  on:blur={e => {
                    e.currentTarget.type = 'password';
                  }}
                  on:input={e => {
                    localStorage.setItem('api-key-xai', e.target.value);
                  }}/>
          </div>
        </form>
      {/if}
    </div>
    <div class="modal-footer">
      <button class="modal-button" on:click={saveOpts}>
        Save
      </button>
    </div>
  </div>
</div>

<style>
  input {
    flex-grow: 1;
    padding: 0.5rem;
    background-color: var(--box-background);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
  }

  select {
    flex-grow: 1;
    padding: 0.5rem;
    background-color: var(--box-background);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
  }

  /* modal */

  .modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
    padding: 1.5rem;
    border-radius: 0.5rem;
    position: relative;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 500;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .modal-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .modal-open {
    opacity: 1;
    pointer-events: auto;
  }

  .modal-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #1f2937;
    opacity: 0.5;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    text-align: center;
  }

  .modal-button {
    background-color: var(--hover-color);
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .modal-button:hover {
    background-color: var(--hover-color);
  }

  /* dropdown */

  .dropdown-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .dropdown-label {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .dropdown-label span {
    margin-right: 1rem;
    min-width: 80px;
  }

  .dropdown-label-info {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  /* tabs */

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1rem;
  }

  .tab-button {
    background: none;
    color: var(--text-color);
    border-color: var(--accent-color-dark);
    border: 1px solid var(--accent-color-dark);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    margin: 0 0.25rem;
    border-radius: 0.25rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  .tab-button:hover {
    opacity: 1;
    border: 1px solid var(--hover-color);
    border-radius: 0.5rem;
  }

  .tab-button.active {
    opacity: 1;
    border: 1px solid var(--accent-color-light);
    border-radius: 0.5rem;
    /* border-bottom: 2px solid var(--accent-color); */
  }

  .tab-button.active:hover {
    border: 1px solid var(--hover-color);
    border-radius: 0.5rem;
  }
</style>
