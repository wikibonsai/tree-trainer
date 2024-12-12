<script lang='ts'>
  import type { EventDispatcher } from 'svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import { llm, resultMkdn, userEssay } from '$lib/util/store';


  export let text: string = '';
  // miyagi quotes from: https://screenrant.com/karate-kid-mr-miyagi-wise-inspiring-quotes/
  const placeholders: string[] = [
    // single
    'Wax on, wax off',
    'One day, you do own way.',
    'Just remember, [credential] never replace eye, ear, and brain.',
    'Lie only become truth if person wants to believe it.',
    'Just remember, truth strength come from inside.',
    'If come from inside you, alwyas right one.',
    'You trust the quality of what you know, not the quantity.',
    'If [writing] used to defend honor, defend life, [writing] mean something. If [writing] used to defend plastic metal trophy, [writing] no mean nothing.',
    'First learn stand, then learn fly. Nature rule, not mine.',
    'Man who catch fly with chopstick, accomplish anything.',
    'Sometimes what heart know, head forget.',
    'You look revenge that way, you start by digging two grave.',
    'When you feel life out of focus, always return to basic of life.',
    'For man who no forgiveness in heart, life worse punishment than death.',
    // double
    'Inside you have strong root. No need nothing except what inside you to grow.',
    'Don\'t know. Never been attacked by tree.',
    'Never put passion before principle. Even if you win, you lose.',
    'It\'s okay to lose to opponent. Must not lose to fear!',
    'Not matter who\'s stronger. Matter who\'s smarter.',
    'Balance good, [writing] good, everything good. Bad balance, better pack up and go home.',
    'Walk on road: Walk left side, safe. Walk right side, safe. Walk middle, sooner or later...Get squish just like grape!',
    // multi
    'Lesson not just [writing] only. Lesson for whole life! Whole life have balance, everything be better.',
  ];
  let placeholder: string;

  const dispatch: EventDispatcher<any> = createEventDispatcher();

  onMount(async () => {
    placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    if (text.length > 0) {
      $userEssay = text;
      goai();
    }
  });

  async function goai() {
    dispatch('loading', true,);
    $resultMkdn = '';
    try {
      const response = await fetch('/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: $userEssay,
          opts: {
            llm: $llm,
          },
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const { result } = await response.json();
      $resultMkdn = result;
    } catch (e) {
      console.error('Problem getting result from LLM:', e);
      alert('An error occurred while processing your request. Please try again.');
    } finally {
      dispatch('loading', false);
    }
  }

  async function submit(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      goai();
    }
  }
</script>

<svelte:window on:keydown={submit} />

<div class="prompt-container">
  <input id="input"
            placeholder={placeholder}
            class="input box-border"
            autocomplete="off"
            bind:value={$userEssay} />
  <button id="growButton"
          class="btn"
          on:click={goai}>
    Grow
  </button>
</div>

<style>
  .prompt-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;
  }

  .input {
    color: var(--text-color);
    background-color: var(--box-background);
    box-sizing: border-box;
    border-radius: 0.5rem;
    padding: 0.5rem;
    margin: 0.5rem;
  }

  /* todo */
  /* from: https://css-tricks.com/snippets/css/change-autocomplete-styles-webkit-browsers/ */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    color: var(--text-color);
    background-color: var(--box-background);
    box-sizing: border-box;
    width: 100%;
    border-radius: 0.5rem;
    padding: 0.5rem;
    margin: 0.5rem;
  }

  .input:focus {
    outline: 2px solid var(--hover-color);
  }
</style>