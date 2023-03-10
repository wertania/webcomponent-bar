<svelte:options tag="bar-component" />

<script lang="ts">
  // @ts-check
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { quintOut, cubicOut } from "svelte/easing";

  const isTrue = (value: string): string => {
    return /^true$/i.test(value);
  }

  const formatToDecimalUnit = (value: number, separator: string): string => {
    let value_str: string = Number(value).toFixed(decimals) || "";
    console.log(Number(value) % 1);
    let formattedString = "";
    if (Number(value) % 1 != 0) {
      if (
        value_str.split(".")[1].length == 2 &&
        value_str.slice(0, -1) != "0"
      ) {
        formattedString = value_str.replace(".", separator);
      } else {
        formattedString =
          value_str.split(".")[0] + separator + value_str.split(".")[1];
      }
    } else {
      formattedString = value_str.replace(".", separator);
    }

    return formattedString;
  };

  const store = tweened(
    {
      percentage: 0,
    },
    {
      duration: 600,
      easing: cubicOut,
      interpolate: (from, to) => (t) => {
        let percentage: number = 0;
        percentage += Number(
          (from.percentage + (to.percentage - from.percentage) * t).toFixed(2)
        );

        if (percentage > 100) percentage = 100;
        return {
          percentage: percentage,
        };
      },
    }
  );

  export let width: number = 500;
  export let height: number = 500;
  export let bg_color: string = "grey";
  export let mask_color: string = "blue";
  export let label_color: string = "#b0b2b3";
  export let round = false;

  export let mode: string = "b2t";
  export let label_align: string = "bottom"; //top, bottom

  export let value: number = 0;
  export let tick_min: number = 0;
  export let tick_max: number = 100;
  export let tick_layout: string = "left";
  export let tick_interval: number = 10;

  export let boardwidth: number = 3;
  export let board_color: string = "black";
  export let gradient_background = false;
  export let hide_scale: boolean = false;

  export let strokewidth: number = 4;
  export let label_decimal_separator = ".";
  export let value_decimal_separator = ".";
  export let stroke_color = "#cd4d4d";
  export let mask_opacity = 50;
  export let decimals = 2;
  export let font_bold = false;
  export let font_weight: string = "lighter";
  let column_reverse: string = "column-reverse";

  if (isTrue(font_bold)) font_weight = "bold";
  const labelUnit: string = String.fromCodePoint(8451);
  let onePercValue: number = (tick_max - tick_min) / 100;
  let targetPercentage: number =
    ((value - tick_min) / (tick_max - tick_min)) * 100;
  let count: number = (tick_max - tick_min) / tick_interval + 1;
  let hideScale = function (index: number): boolean {
    if (index * tick_interval > value) return false;
    return true;
  };

  let canvasWidth = 0;
  let canvasHeight = 0;
  let canvasPercHeight_clip = 0;
  let canvasPercY_clip = 0;
  let canvasPercWidth_clip = 0;
  let canvasPercX_clip = 0;
  let canvasPercWidth = 0;
  let canvasPercHeight = 0;
  let canvasPercX = strokewidth / 2;
  let canvasPercY = strokewidth / 2;
  let canvasX = strokewidth / 2;
  let canvasY = strokewidth / 2;
  let rx = 0,
    ry = 0;
  const ts = new Date().getTime();
  let pathEl: SVGPathElement;
  let scaleLabel;
  let labelHeight: number = 0;
  let labelWidth: number = 0;

  const maskId = "tx_mask_" + ts + Math.floor(Math.random() * 999);
  const grId = "pb_gradient_" + ts + Math.floor(Math.random() * 999);
  let gradientTransform = 0;
  if (width == null) width = 100;
  if (height == null) height = 300;

  if (mode == "b2t" || mode == "r2l") {
    column_reverse = "column-reverse";
  }
  if (mode == "t2b" || mode == "l2r") {
    column_reverse = "column";
  }
  onMount(() => {
    const bbox = pathEl.getBBox();
    canvasWidth = bbox.width;
    canvasHeight = bbox.height;
    if (mode == "t2b" || mode == "b2t") {
      canvasPercX = canvasPercX + strokewidth / 2;
      canvasPercWidth = canvasWidth - strokewidth;

      labelHeight = canvasHeight - strokewidth;
    } else {
      canvasPercY = canvasPercY + strokewidth / 2;
      canvasPercX = canvasPercX + strokewidth / 2;
      canvasPercHeight = canvasHeight - strokewidth;
      labelHeight = canvasWidth;
      labelWidth = canvasHeight;
      gradientTransform = 90;
    }
    store.set({ percentage: targetPercentage });
  });
  let displayedNumber: number = 0;
  $: {
    if (mode == "t2b" || mode == "b2t") {
      canvasPercHeight =
        ($store.percentage * (canvasHeight - strokewidth)) / 100;
      canvasPercHeight_clip = canvasPercHeight;
      canvasPercWidth_clip = canvasPercWidth;
      if (mode == "b2t") {
        canvasPercY = canvasHeight - canvasPercHeight;
        canvasPercX_clip = canvasPercX;
        canvasPercY_clip = canvasPercY;
        canvasPercHeight = canvasPercHeight + ry;
        canvasPercY = canvasPercY - ry;
      } else {
        canvasPercY_clip = strokewidth;
        canvasPercX_clip = canvasPercX;
        canvasPercY = canvasPercY_clip;
        canvasPercHeight = canvasPercHeight + ry;
      }
    } else {
      canvasPercWidth = ($store.percentage * (canvasWidth - strokewidth)) / 100;
      canvasPercY_clip = canvasPercY;
      canvasPercHeight_clip = canvasPercHeight;

      if (mode == "r2l") {
        canvasPercX = canvasWidth - canvasPercWidth - strokewidth / 2;
        canvasPercX_clip = canvasPercX + strokewidth / 2;
        canvasPercX = canvasPercX - rx;
        canvasPercWidth_clip = canvasPercWidth + strokewidth / 2;
        canvasPercWidth += rx;
        canvasPercWidth += strokewidth / 2;
      } else {
        canvasPercX_clip = canvasPercX;
        canvasPercWidth_clip = canvasPercWidth;
        canvasPercWidth += rx;
      }
    }
    displayedNumber =
      Number(onePercValue) * Number($store.percentage) + Number(tick_min);
  }

  if (round) {
    rx = 30;
    ry = 30;
  }
  let availableHeight = function (value: number): number {
    if (value >= 0) return value;
    return 0;
  };
</script>

<div class="progress-content" style="font-weight:{font_weight}">
  {#if label_align == "top" || tick_layout == "bottom"}
    <div class="progress-label">
      {formatToDecimalUnit(displayedNumber, label_decimal_separator) + labelUnit}
    </div>
  {/if}
  <div
    class="guage_plate"
    style="--boardwidth:{boardwidth}px;--height:{height}px;--board_color:{board_color}"
  >
    <div class="guage_board">
      <svg
        width={Number(width) + Number(strokewidth)}
        height={Number(height) + Number(strokewidth)}
        viewBox="0 0 {canvasWidth + Number(strokewidth)}  {Number(
          canvasHeight
        ) + Number(strokewidth)}"
        preserveAspectRatio="xMinYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <linearGradient
            id={grId}
            gradientTransform="rotate({gradientTransform})"
          >
            <stop
              offset="0%"
              stop-color={bg_color}
              stop-opacity={isTrue(gradient_background) ? 0 : 1}
            />
            <stop
              offset="50%"
              stop-color={bg_color}
              stop-opacity={isTrue(gradient_background) ? 0.5 : 1}
            />
            <stop offset="51%" stop-color={bg_color} stop-opacity="1" />
            <stop offset="100%" stop-color={bg_color} stop-opacity="1" />
          </linearGradient>

          <linearGradient
            id={maskId}
            gradientTransform="rotate({gradientTransform})"
          >
            <stop
              offset="0%"
              stop-color={mask_color}
              stop-opacity={isTrue(gradient_background) ? mask_opacity / 200 : 1}
            />
            <stop
              offset="50%"
              stop-color={mask_color}
              stop-opacity={isTrue(gradient_background) ? mask_opacity / 100 : 1}
            />
            <stop offset="51%" stop-color={mask_color} stop-opacity="1" />
            <stop offset="100%" stop-color={mask_color} stop-opacity="1" />
          </linearGradient>
          <clipPath id="round-corner">
            <rect
              width="{canvasPercWidth_clip}px"
              height="{availableHeight(canvasPercHeight_clip)}px"
              x="{canvasPercX_clip}px"
              y="{availableHeight(canvasPercY_clip)}px"
              rx={value == 100 ? rx - strokewidth / 2 : 0}
              ry={value == 100 ? ry - strokewidth / 2 : 0}
            />
          </clipPath>
        </defs>
        <rect
          bind:this={pathEl}
          width="{width}px"
          height="{height}px"
          x="{canvasX}px"
          y="{canvasY}px"
          rx={isTrue(round) ? rx : 0}
          ry={isTrue(round) ? ry : 0}
          stroke={stroke_color}
          fill="url(#{grId})"
          stroke-width={strokewidth}
        />
        <rect
          width="{canvasPercWidth}px"
          height="{availableHeight(canvasPercHeight)}px"
          x="{canvasPercX}px"
          y="{availableHeight(canvasPercY)}px"
          rx={isTrue(round) ? availableHeight(rx - strokewidth / 2) : 0}
          ry={isTrue(round) ? availableHeight(ry - strokewidth / 2) : 0}
          fill="url(#{maskId})"
          clip-path="url(#round-corner)"
        />
      </svg>
    </div>
    {#if hide_scale == false}
      <div
        class=" interval-label interval-label-{tick_layout}"
        style="--label_color:{label_color}; --height: {labelHeight}px; --offsetY:{strokewidth /
          2}px; --column_reverse:{column_reverse}; --width:{labelWidth}px"
      >
        {#if tick_layout == "left"}
          {#each Array(count) as _, index (index)}
            <div class="scale-{tick_layout} scaleleft">
              <span
                >{formatToDecimalUnit(
                  index * tick_interval + Number(tick_min), value_decimal_separator
                )}</span
              >
            </div>
          {/each}
        {/if}
        {#if tick_layout == "right"}
          {#each Array(count) as _, index (index)}
            <div class="scale-{tick_layout} scale">
              <span
                >{formatToDecimalUnit(
                  index * tick_interval + Number(tick_min), value_decimal_separator
                )}</span
              >
            </div>
          {/each}
        {/if}
        {#if tick_layout == "center"}
          {#each Array(count) as _, index (index)}
            <div class="scale-movey {hideScale(index) ? 'hide' : ''}">
              <div class="scale-{tick_layout}">
                {formatToDecimalUnit(index * tick_interval + Number(tick_min), value_decimal_separator)}
              </div>
            </div>
          {/each}
        {/if}
        {#if tick_layout == "top"}
          {#each Array(count) as _, index (index)}
            <div class="scale-horizontal">
              <div class="scale-{tick_layout}">
                {formatToDecimalUnit(index * tick_interval + Number(tick_min), value_decimal_separator)}
              </div>
            </div>
          {/each}
        {/if}
        {#if tick_layout == "bottom"}
          {#each Array(count) as _, index (index)}
            <div class="scale-horizontal-bottom">
              <div class="scale-{tick_layout}">
                {formatToDecimalUnit(index * tick_interval + Number(tick_min), value_decimal_separator)}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
  {#if label_align == "bottom" && tick_layout != "bottom"}
    <div class="progress-label">
      {formatToDecimalUnit(displayedNumber, label_decimal_separator) + labelUnit}
    </div>
  {/if}
</div>

<style>
  .progress-label {
    font-size: 1.8em;
  }
  .progressbar-thin {
    overflow: visible;
  }
  .progress-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 70px;
    overflow: visible;
    max-width: min-content;
    font-weight: var(--font_bold);
    font-family: "sans-serif";
  }

  .interval-label {
    position: absolute;
    top: var(--offsetY);
    margin: 0;
    display: flex;
    flex-direction: var(--column_reverse);
    justify-content: space-between;
    height: var(--height);
    font-size: 1.2em;
    color: var(--label_color);
    transform-origin: top left;
  }
  .interval-label.interval-label-right {
    right: 0;
    transform: translate(100%);
    align-items: flex-start;
  }
  .interval-label.interval-label-left {
    left: 0;
    transform: translate(-100%);
    align-items: flex-end;
  }
  .interval-label.interval-label-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
    left: 0;
    width: 100%;
  }
  .interval-label.interval-label-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    left: 0;
    transform: rotate(-90deg);
  }
  .interval-label.interval-label-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transform: rotate(90deg);
    flex-direction: column-reverse;
    right: 0;
    top: var(--width);
  }
  .guage_plate {
    position: relative;
    margin: 20 10px;
    height: var(--height);
  }

  .scale-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: absolute;
    transform: translateY(-50%);
  }
  .scale-center::before {
    content: "-";
  }

  .scale-center::after {
    content: "-";
  }

  .scale-left > span::after {
    content: "-";
  }
  .scale-right > span::before {
    content: "-";
  }
  .scale-top::before {
    content: "-";
  }
  .scale-bottom::before {
    content: "-";
  }
  .scale {
    position: relative;
    width: 100%;
  }
  .scale > span {
    width: 100%;
    line-height: 1;
    position: absolute;
    transform: translateY(-50%);
  }
  .movey {
    transform: translateY(50%);
  }
  .scale-movey {
    position: relative;
    width: 100%;
  }
  .scale-movey:last-child {
    visibility: hidden;
  }
  .hide {
    visibility: hidden;
  }
  .scaleleft {
    position: relative;
  }
  .scaleleft > span {
    position: absolute;
    transform: translate(-100%, -50%);
    display: flex;
    justify-content: flex-end;
  }

  .scale-top {
    position: absolute;
    transform: translateY(-50%);
  }
  .scale-bottom {
    position: absolute;
    transform: translateY(-50%);
  }
</style>
