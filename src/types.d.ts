import type { SvelteComponentTyped } from 'svelte';
declare module 'svelte-simple-progressbar' {
  export default class ProgressBar extends SvelteComponentTyped<{
    width: number;
    height: number;
    round?: boolean;
    bgColor?: string;
    maskColor?: string;
    labelColor?: string;
    gradientBackground?: boolean;
    labelUnit?: string;
    tickLayout?: string;
    value?: number;
    tickMin?: number;
    tickMax?: number;
    tickInterval?: number;
    scaleInterval?: number;
    strokewidth?: number;  
  }> {}
}
export const num: number = 42;
