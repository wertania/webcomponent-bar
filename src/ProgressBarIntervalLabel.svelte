<script lang="ts">
	import   {formatToDecimalUnit}   from './util';
	// @ts-check  
	export let tickInterval: number=10;
	export let tickMin: number=0;
	export let tickMax: number=100; 
	export let tickLayout: string='center';  
	export const scaleinterval:number=10;
	export let value:number=10;
	let count:number =(tickMax-tickMin)/tickInterval+1;
	let hideScale = function (index:number):boolean {
			if(index*tickInterval>value)
				return false;
			return true;
	};
      
</script>

<style> 
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
	{#if tickLayout == 'left' }
	 	{#each Array(count) as _, index (index)}
			<div class="scale-{tickLayout} scaleleft"><span>{formatToDecimalUnit(index*tickInterval+tickMin)}</span></div>
		{/each}
	{/if}
	{#if tickLayout == 'right' }
	 	{#each Array(count) as _, index (index)}
			<div class="scale-{tickLayout} scale"><span>{formatToDecimalUnit(index*tickInterval+tickMin)}</span></div>
		{/each}
	{/if}
	{#if tickLayout == 'center' } 
	 	{#each Array(count) as _, index (index)}
		
			<div class="scale-movey {hideScale(index)?'hide':''}"><div class="scale-{tickLayout}">{formatToDecimalUnit(index*tickInterval+tickMin)}</div></div>
		{/each}
		 
	{/if}
  	 
	
  