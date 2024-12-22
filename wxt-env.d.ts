/// <reference types="svelte" />
import type Polyfill from 'webextension-polyfill';

declare global {
  export type * as Browser from 'webextension-polyfill';
  const browser: Polyfill;
}
