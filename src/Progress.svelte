<svelte:options tag="bar-component" />
<script lang="ts" > 
	// @ts-check
	import { onMount } from 'svelte'; 
	import { tweened } from 'svelte/motion';
	import { quintOut,cubicOut} from 'svelte/easing';  

    const formatToDecimalUnit = (value:number):string => {
		console.log(typeof (value));
    	let  value_str:string = Number(value).toFixed(2)||"";
     
        let formattedString="" ;
        if (Number(value) % 1 != 0) {
        if (value_str.split('.')[1].length == 2 && value_str.slice(0, -1)!='0' )
            formattedString=value_str.replace('.', ',');
        else  
        {
        formattedString=value_str.split('.')[0] + ',' + value_str.split('.')[1] + '0';
        }
        } else  
        formattedString=value_str.replace('.', ',');
        
        return formattedString;
    };
  
	const store = tweened({
		percentage: 0,
	}, {
		duration: 600,
		easing: cubicOut,
		interpolate: (from, to) => t => { 
			 let percentage:number=0;
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
	export let bg_color: string = 'grey';
	export let mask_color:string = 'blue';
	export let label_color: string = '#b0b2b3';  
	export let round:boolean =false;
	 
	export let fill_direction: string = 'b2t';
	export let label_align: string = 'bottom'; //top, bottom
   
	export let value:number=0;
	export let tick_min:number=0;
	export let tick_max:number=100;
	export let tick_layout:string='left';
	export let tick_interval:number=10;

	export let boardwidth:number=3;
	export let board_color:string="black";
	export let gradient_background:boolean=false; 
	export let hide_scale:boolean=false;
	export let scale_interval :number=10;
	export let strokewidth:number = 4;
	
  
 	const labelUnit :string =String.fromCodePoint(8451);
	let onePercValue:number=(tick_max-tick_min)/100;
 	let targetPercentage:number=(value - tick_min ) / (tick_max-tick_min)* 100;
	 	let count:number =(tick_max-tick_min)/tick_interval+1;
	let hideScale = function (index:number):boolean {
			if(index*tick_interval>value)
				return false;
			return true;
	}; 

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

	if(fill_direction == null)
		fill_direction = 'l2r';

	onMount(() => {
		const bbox = pathEl.getBBox();
		canvasWidth = bbox.width;
		canvasHeight = bbox.height;
		canvasPercX = canvasPercX+strokewidth/2;
		canvasPercWidth = canvasWidth-strokewidth;
		store.set({percentage:targetPercentage});
	});
     let displayedNumber:number=0;
	$: {
		if( (fill_direction == 't2b') || (fill_direction == 'b2t')) {
			canvasPercHeight = $store.percentage * (canvasHeight-strokewidth) / 100;
			if(fill_direction == 'b2t') {
				canvasPercY = canvasHeight - canvasPercHeight-strokewidth/2;
			}
		}
		displayedNumber=Number(onePercValue)* Number($store.percentage) + Number(tick_min);
		 
	}
  
    if(round){
		rx=20;
		ry=20;
	}   
	let availableHeight = function (value:number):number {
			 if(value>=0) return value;
			 return 0;
	};
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
		overflow: visible;
		max-width: min-content;
	}
 
  
    .stroke-color{ stroke:#cdc6c6} 

.interval-label{
	position: absolute;
	top: var(--offsetY);
	margin: 0;
	display: flex;
	flex-direction: column-reverse;
	justify-content: space-between;
	height: var(--height);
	font-size: 1.2em;
	color:var(--label_color); 
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

.scale-center{
	display:flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	position:absolute;
	transform: translateY(-50%);
}
.scale-center::before{
	content:"-";
  
}

.scale-center::after{
	content:"-";
}

 .scale-left > span::after{
	 content: '-';
}
.scale-right > span::before{
	 content: '-';
}
  .scale{
	position:relative;
	width: 100%;
  }
  .scale > span{
	width:100%;
	 line-height: 1;
	position:absolute; 
	transform:translateY(-50%);
  }
  .movey{
	transform: translateY(50%);
  }
  .scale-movey{ 
	position:relative;
	width: 100%;
  }
  .scale-movey:last-child{
	visibility: hidden;
  }
  .hide{
	visibility:hidden;
  }
  .scaleleft{
	position: relative;
  }
  .scaleleft > span{
	position: absolute;
	transform: translate(-100%,-50%);
	display: flex;
	justify-content: flex-end;
  }
</style> 
<div class="progress-content">
	 
	{#if label_align == 'top' }
	<div class="progress-label">
		{
					formatToDecimalUnit(displayedNumber)+labelUnit
		}
	</div>
	{/if}
	<div class="guage_plate" style="--boardwidth:{boardwidth}px;--height:{height}px;--board_color:{board_color}">
		<div class="guage_board">
			<svg class="" width="{width}px" height="{height}px"  viewBox="0 0 {canvasWidth}  {canvasHeight} " xmlns="http://www.w3.org/2000/svg"   xmlns:xlink="http://www.w3.org/1999/xlink" >
				<defs>
					<linearGradient id={grId} >
					<stop offset="0%" stop-color={bg_color} stop-opacity={gradient_background?0:1 }/>
					<stop offset="50%" stop-color={bg_color} stop-opacity={gradient_background?0.5:1 } />
					<stop offset="51%" stop-color={bg_color} stop-opacity=1 />
					<stop offset="100%" stop-color={bg_color} stop-opacity=1/>
					</linearGradient>
					 
					<linearGradient  id={maskId}>
					<stop offset="0%" stop-color={mask_color} stop-opacity={gradient_background?0.4:1 }  />
					<stop offset="50%" stop-color={mask_color} stop-opacity={gradient_background?0.8:1 } />
					<stop offset="51%" stop-color={mask_color} stop-opacity=1 />
					<stop offset="100%" stop-color={mask_color}  stop-opacity=1 />
				 
					</linearGradient>
					<clipPath id="round-corner">
						<rect width="{canvasPercWidth }px" height="{availableHeight(canvasPercHeight) }px" x="{canvasPercX }px" 
						y="{availableHeight(canvasPercY)}px"  />
					</clipPath>
				</defs>
				<rect bind:this={pathEl}  width="{width}px" height="{height}px" x="{canvasX}px" y="{canvasY}px" rx={rx} ry={ry} class="  stroke-color"  fill="url(#{grId})" stroke-width={strokewidth}px />
				<rect  width="{canvasPercWidth }px" height="{availableHeight(canvasPercHeight+ry)}px" x="{canvasPercX}px" y="{availableHeight(canvasPercY-ry)}px"  rx={rx/2} ry={ry/2} class=" " fill="url(#{maskId})" clip-path="url(#round-corner)"   />
			</svg>
		</div>
		{#if hide_scale == false }
			<div class="interval-label interval-label-{tick_layout}" style="--label_color:{label_color};--height: {canvasHeight-strokewidth}px;--offsetY:{strokewidth/2}px;" >
							{#if tick_layout == 'left' }
					{#each Array(count) as _, index (index)}
						<div class="scale-{tick_layout} scaleleft"><span>{formatToDecimalUnit(index*tick_interval+Number(tick_min))}</span></div>
					{/each}
				{/if}
				{#if tick_layout == 'right' }
					{#each Array(count) as _, index (index)}
						<div class="scale-{tick_layout} scale"><span>{formatToDecimalUnit(index*tick_interval+Number(tick_min))}</span></div>
					{/each}
				{/if}
				{#if tick_layout == 'center' } 
					{#each Array(count) as _, index (index)}
					
						<div class="scale-movey {hideScale(index)?'hide':''}"><div class="scale-{tick_layout}">{formatToDecimalUnit(index*tick_interval+Number(tick_min))}</div></div>
					{/each}
					
				{/if}
  	 
	
  
			</div>
		{/if}
	</div>	
	 {#if label_align == 'bottom' }
		<div class="progress-label">
				{
					formatToDecimalUnit(displayedNumber)+labelUnit
				}
		</div>
	{/if}
</div>
 