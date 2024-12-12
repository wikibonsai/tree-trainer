import type { Writable } from 'svelte/store';
import type { OptLLM } from './types';
import { writable } from 'svelte/store';
import {
  DEFAULT_MODEL_ANTHROPIC,
  DEFAULT_MODEL_OPENAI,
  DEFAULT_MODEL_XAI,
} from './const';


// api

export const llm: Writable<OptLLM> = writable({
  provider: 'anthropic',
  anthropic: {
    model: DEFAULT_MODEL_ANTHROPIC,
    apiKey: '',
  },
  openai: {
    model: DEFAULT_MODEL_OPENAI,
    apiKey: '',
  },
  xai: {
    model: DEFAULT_MODEL_XAI,
    apiKey: '',
  },
});
// note: this is mostly for debugging for now
export const systemApiKeys: Writable<Record<string, string>> = writable({
  anthropic: '',
  openai: '',
  xai: '',
});

// colors

export const isDark: Writable<boolean> = writable(false);
export const theme: Writable<string> = writable('light');

// options

export function initOpts(): void {
  // llm opts
  llm.update(currentLlm => ({
    ...currentLlm,
    provider: localStorage.getItem('provider') || 'openai',
    model: localStorage.getItem('model') || 'chatgpt',
    anthropic: {
      ...currentLlm.anthropic,
      apiKey: localStorage.getItem('api-key-anthropic') || '',
    },
    openai: {
      ...currentLlm.openai,
      apiKey: localStorage.getItem('api-key-openai') || ''
    },
    xai: {
      ...currentLlm.xai,
      apiKey: localStorage.getItem('api-key-xai') || '',
    },
  }));
}
export const isMarkdown: Writable<boolean> = writable(true);

// user input

export const userEssay: Writable<string> = writable('');

// result

export const resultMkdn: Writable<string> = writable('');
export const resultMkmp: Writable<SVGSVGElement | null> = writable(null);
export const resultTree: Writable<SVGSVGElement | null> = writable(null);
