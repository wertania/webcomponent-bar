 <svelte:options accessors={true}/>
<script lang="ts" > 
	// @ts-check
	import { onMount } from 'svelte'; 
	import { tweened } from 'svelte/motion';
	import { quintOut,cubicOut} from 'svelte/easing';
    import ProgressBarIntervalLabel from './ProgressBarIntervalLabel.svelte';
	 import {formatToDecimalUnit}  from './util';

	const store = tweened({
		percentage: 0,
	}, {
		duration: 600,
		easing: cubicOut,
		interpolate: (from, to) => t => { 
			 let percentage=0;
				percentage += Number((from.percentage + (to.percentage-from.percentage)*t).toFixed(2));
			 
				if(percentage>100)
				percentage=100;
			return {
				percentage: percentage 
			};
		}
	}); 
	 
	export let width: number = 500;
	export let height: number = 500; 
	export let bgColor: string = 'grey';
	export let maskColor:string = 'blue';
	export let labelColor: string = '#4d4d4d';  
	export let round:boolean =false;
	 
	export let fillDirection: string = 'b2t';
	export let labelAlign: string = 'none'; //top, bottom
   
	export let value:number=0;
	export let tickMin:number=0;
	export let tickMax:number=100;
	export let tickLayout:string='left';
	export let tickInterval:number=10;

	export let boardwidth:number=3;
	export let boardColor:string="black";
	export let gradientBackground:boolean=false; 
	export let hideScale:boolean=false;
	export let scaleinterval :number=10;
	export let strokewidth:number = 4;
	
  
 	const labelUnit  =String.fromCodePoint(8451);
	let onePercValue=(tickMax-tickMin)/100;
 	let targetPercentage=(value - tickMin ) / (tickMax-tickMin)* 100;
	 
    

	let canvasWidth = 0;
	let canvasHeight = 0;

	let canvasPercWidth = 0;
	let canvasPercHeight = 0;
	let canvasPercX = 0;
	let canvasPercY = 0;
	let canvasX=0;
	let canvasY=0;  
	let rx=0,ry=0; 
	const ts = new Date().getTime();
	  let pathEl:SVGPathElement;
	const maskId = 'tx_mask_' + ts + Math.floor(Math.random() * 999);
	const grId = 'pb_gradient_' + ts + Math.floor(Math.random() * 999);
 
	if(width == null)
		width = 100;
	if(height == null)
		height = 300;

	if(fillDirection == null)
		fillDirection = 'l2r';

	onMount(() => {
		const bbox = pathEl.getBBox();
		canvasWidth = bbox.width;
		canvasHeight = bbox.height;
		canvasPercX = canvasPercX+strokewidth/2;
		canvasPercWidth = canvasWidth-strokewidth;
		store.set({percentage:targetPercentage});
	});
     
	$: {
		if( (fillDirection == 't2b') || (fillDirection == 'b2t')) {
			canvasPercHeight = $store.percentage * (canvasHeight-strokewidth) / 100;
			if(fillDirection == 'b2t') {
				canvasPercY = canvasHeight - canvasPercHeight-strokewidth/2;
			}
		}
	}
  
    if(round){
		rx=20;
		ry=20;
	}  

</script>
<style>
	 

 
	.progress-label{
		font-size: 1.8em;
		font-weight: 100;
	}
	.progressbar-thin {
		overflow: visible;
	}
	.progress-content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 70px;
		overflow: hidden;
		max-width: min-content;
		border: 4px solid black;
	}
 
  
    .stroke-color{ stroke:#4d4d4d} 

.interval-label{
	position: absolute;
	top: var(--offsetY);
	margin: 0;
	display: flex;
	flex-direction: column-reverse;
	justify-content: space-between;
	height: var(--height);
	font-size: 1.2em;
	color:var(--labelColor); 
}
.interval-label.interval-label-right{
	right:0;
	transform:translate(100%); 
	align-items:flex-start;
}
.interval-label.interval-label-left{
	left:0;
	transform:translate(-100%); 
	align-items:flex-end;
}
.interval-label.interval-label-center{
	display:flex;
	justify-content: space-between;
	align-items: center;
	left:0;
	width: 100%;
 
}
.guage_plate{
	position: relative; 
	margin: 20 10px;
	height: var(--height); 
}
</style> 
<div class="progress-content">
	 
	{#if labelAlign == 'top' }
	<div class="progress-label">
		{
					formatToDecimalUnit(onePercValue* $store.percentage + tickMin)+labelUnit
		}
	</div>
	{/if}
	<div class="guage_plate" style="--boardwidth:{boardwidth}px;--height:{height};--boardColor:{boardColor}">
		<div class="guage_board">
			<svg class="" width="{width}" height={height}  viewBox="0 0 {canvasWidth} {canvasHeight}" xmlns="http://www.w3.org/2000/svg"   xmlns:xlink="http://www.w3.org/1999/xlink" >
				<defs>
					<linearGradient id={grId} >
					<stop offset="0%" stop-color={bgColor} stop-opacity={gradientBackground?0:1 }/>
					<stop offset="50%" stop-color={bgColor} stop-opacity={gradientBackground?0.5:1 } />
					<stop offset="51%" stop-color={bgColor} stop-opacity=1 />
					<stop offset="100%" stop-color={bgColor} stop-opacity=1/>
					</linearGradient>
					 
					<linearGradient  id={maskId}>
					<stop offset="0%" stop-color={maskColor} stop-opacity={gradientBackground?0.4:1 }  />
					<stop offset="50%" stop-color={maskColor} stop-opacity={gradientBackground?0.8:1 } />
					<stop offset="51%" stop-color={maskColor} stop-opacity=1 />
					<stop offset="100%" stop-color={maskColor}  stop-opacity=1 />
				 
					</linearGradient>
					<clipPath id="round-corner">
						<rect width="{canvasPercWidth }" height="{canvasPercHeight }" x="{canvasPercX }" 
						y="{canvasPercY}"  />
					</clipPath>
				</defs>
				<rect bind:this={pathEl}  width="{width}" height="{height}" x="{canvasX}" y="{canvasY}" rx={rx} ry={ry} class="  stroke-color"  fill="url(#{grId})" stroke-width={strokewidth} />
				<rect  width="{canvasPercWidth }" height="{canvasPercHeight+ry}" x="{canvasPercX}" y="{canvasPercY-ry}"  rx={rx/2} ry={ry/2} class=" " fill="url(#{maskId})" clip-path="url(#round-corner)"   />
			</svg>
		</div>
		{#if hideScale == false }
			<div class="interval-label interval-label-{tickLayout}" style="--labelColor:{labelColor};--height:{canvasHeight-strokewidth};--offsetY:{strokewidth/2};" >
				<ProgressBarIntervalLabel tickLayout={tickLayout} tickMin={tickMin} tickMax={tickMax} 
				tickInterval={tickInterval}   scaleinterval={scaleinterval} value={value}/>
			</div>
		{/if}
	</div>	
	{#if labelAlign == 'bottom' }
		<div class="progress-label">
				{
					formatToDecimalUnit(onePercValue* $store.percentage + tickMin)+labelUnit
				}
		</div>
	{/if}
</div>
 