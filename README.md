# guage_svelte

### Using in a Svelte app

```javascript
import ProgressBar from 'svelte-simple-progressbar';
```

```javascript
<ProgressBar
      value={50}
    tickLayout="right"  
    tickInterval={10} 
    scaleInterval={10}
    tickMax={100}
    tickMin={0}
    width={80} 
    height={250} 
    bgColor="#333333"
    maskColor="green"
    boardColor="#4d4d4d"
    labelColor="black"
    labelAlign="bottom" 
    strokewidth={6}
    round
    gradientBackground
    hideScale
  />
```
