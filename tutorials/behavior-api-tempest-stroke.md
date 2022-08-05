## What is a Tempest Stroke?

Named for its creator, <a href="https://www.patreon.com/tempestvr" target="_blank">Tempest MAx</a>, a ```TempestStroke``` is a behavior that allows specifying oscillatory motion on an arbitrary number of axes with a formula loosely based on orbital motion calculations. The default base formula is:

<img style="width:250px" src="./images/tempest-motion.png">

Where ```θ``` is the angle in radians, ```p``` is the _phase_, and ```c``` is the _eccentricity_. Here is a simple graph that shows how these parameters effect the shape of the motion (_try tweaking phase and eccentricity_):

<canvas style="margin-top:20px" width=450 height=100 id="tempest-motion-graph"></canvas>
<div style="display: grid; grid-template-columns: 1fr 1fr; max-width: 50%">
  <b style="justify-self: end">phase (<span id="phase-value">0.00</span>):</b> 
  <input 
    id="phase" 
    type="range" 
    min="-1000" 
    max = "1000" 
    value=0 
    oninput="updateTempestGraph(event)">
  <b style="justify-self: end">eccentricity (<span id="ecc-value">0.00</span>):</b> 
  <input 
    id="ecc" 
    type="range" 
    min="-1000" 
    max = "1000" 
    value=0 
    oninput="updateTempestGraph(event)">
</div>

<script>
  function plot (selector, fn, range) {
    const canvas = document.querySelector(selector);
    const context = canvas.getContext('2d');
    const { width, height } = canvas;

    const widthScale = (width / (range[1] - range[0]));
    const heightScale = ((height - 12) / (range[3] - range[2]));
    let first = true;

    context.lineCap = 'round';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();

    for (let x = 0; x < width; x++) {
      const xFnVal = (x / widthScale) - range[0];
      let yGVal = (fn(xFnVal) - range[2]) * heightScale;
      
      yGVal = height - 6 - yGVal;
      
      if (first) {
        context.moveTo(x, yGVal);
        first = false;
      }
      else {
        context.lineTo(x, yGVal);
      }
    }

    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.stroke(); 
  }

  function updateTempestGraph (event) {
    let phase = document.querySelector('#phase').value / 250;
    let ecc = document.querySelector('#ecc').value / 1000;

    document.querySelector('#phase-value').textContent = phase.toFixed(2);
    document.querySelector('#ecc-value').textContent = ecc.toFixed(2);

    const fn = (x) => -Math.cos(x + (Math.PI * phase)/2 + ecc * Math.sin(x + (Math.PI * phase)/2));

    plot('#tempest-motion-graph', fn, [0, Math.PI * 2, -1, 1]);
  }

  plot('#tempest-motion-graph', (x) => -Math.cos(x), [0, Math.PI * 2, -1, 1]);
</script>

### Setup

To use ```TempestStroke```, you must import it. This can be done at the same time that you import the Ayva class. For example, _in a browser_:

```javascript
import { Ayva, TempestStroke } from 'https://unpkg.com/ayvajs';
```
or _from within a Node.js app_:
```javascript
import { Ayva, TempestStroke } from 'ayvajs';
```

Once ```TempestStroke``` is imported, you can create new strokes using ```TempestStroke```'s constructor, which takes a configuration object and bpm (beats per minute).

```java
const myStroke = new TempestStroke({
  stroke: {
    from: 0,    // Start of the range of motion [0 - 1]
    to: 1,      // End of the range of motion [0 - 1]
    phase: 0.3,
    ecc: 0.7
  }
}, 30);

ayva.do(myStroke);
```

This would cause Ayva to perform a 30 bpm stroke with motion that looks like this:

<img style="max-width: 50%" src="./images/tempest-motion-example.png">

<a href="./tutorial-examples/tempest-stroke-example-1.html" target="_blank">Try it out!</a>

You can add motion to as many axes as you like with various parameters. The following example demonstrates an orbit grind on the axes available in an OSR2+:

```java
ayva.do(new TempestStroke({
  stroke: { from: 0.0, to: 0.3, ecc: 0.3 },
  roll:   { from: 0.1, to: 0.9, phase: 1.0, ecc: -0.3 },
  pitch:  { from: 0.9, to: 0.1, ecc: -0.3 }
}));
```

_Note: only the ```from``` and ```to``` properties are required for an axis. ```phase``` and ```eccentricity``` both default to __0__. The default for bpm is __60__._

<a href="./tutorial-examples/tempest-stroke-example-2.html" target="_blank">Try it out!</a>

### Built-in Patterns

There are some built-in patterns that can be referenced by name:

```javascript
// Execute an orbit-grind at 24 bpm
ayva.do(new TempestStroke('orbit-grind', 24));
```

<a href="./tutorial-examples/tempest-stroke-example-3.html" target="_blank">Try it out!</a>

Here is the full list of available patterns:

```back-thrust-down```
```back-thrust-down-swirl```
```diagonal-down-back```
```diagonal-down-forward```
```down-backward```
```down-forward```
```forward-back-grind```
```forward-back-tease```
```lean-forward-thrust-down```
```lean-forward-thrust-down-swirl```
```left-right-tease```
```orbit-grind```
```orbit-tease```
```swirl-tease```
```thrust-forward```
```thrust-forward-swirl```
```vortex-tease```

_Explore!_

### Customizing Built-in Patterns

You can get the parameters for a built-in pattern as a starting point by using ```TempestStroke.library```:

```javascript
// Get a copy of the built-in orbit grind parameters.
const myOrbitGrind = TempestStroke.library['orbit-grind'];

// Tweak the range of the stroke axis of the orbit grind to be wider.
// Library pattern axis names use the machine names (i.e. "L0" instead of "stroke")
myOrbitGrind.L0.to = 1;

ayva.do(new TempestStroke(myOrbitGrind, 30));
```

<a href="./tutorial-examples/tempest-stroke-example-4.html" target="_blank">Try it out!</a>

### Value Provider

Internally, ```TempestStroke``` uses a <a href="./tutorial-motion-api-value-providers.html" target="_blank">value provider</a> to describe Tempest Motion. This value provider is available to be used independently of a ```TempestStroke``` in your own moves. See the <a href="./Ayva.html#.tempestMotion" target="_blank">API Documentation</a> for ```Ayva.tempestMotion()```.

<h3 id="other-motion-shapes">Other Motion Shapes</h3>

It is possible to use functions other than cosine by specifying the ```construct``` parameter. This property should be a function that creates the value provider to use for the motion. There are currently two additional built-in types available:

#### Parabolic

Parabolic motion can be used to create a "bounce" effect (_try tweaking phase and eccentricity_):

<canvas style="margin-top:20px" width=450 height=100 id="parabolic-motion-graph"></canvas>
<div style="display: grid; grid-template-columns: 1fr 1fr; max-width: 50%">
  <b style="justify-self: end">phase (<span id="parabolic-phase-value">0.00</span>):</b> 
  <input 
    id="parabolic-phase" 
    type="range" 
    min="-1000" 
    max = "1000" 
    value=0 
    oninput="updateParabolicGraph(event)">
  <b style="justify-self: end">eccentricity (<span id="parabolic-ecc-value">0.00</span>):</b> 
  <input 
    id="parabolic-ecc" 
    type="range" 
    min="-1000" 
    max = "1000" 
    value=0 
    oninput="updateParabolicGraph(event)">
</div>

<script>
  const mod = (a, b) => ((a % b) + b) % b;

  function updateParabolicGraph (event) {
    const { PI, sin } = Math;
    let phase = document.querySelector('#parabolic-phase').value / 250;
    let ecc = document.querySelector('#parabolic-ecc').value / 1000;

    document.querySelector('#parabolic-phase-value').textContent = phase.toFixed(2);
    document.querySelector('#parabolic-ecc-value').textContent = ecc.toFixed(2);

    const fn = (x) => {
      const angle = x + (PI * phase / 2);
      const a = (mod(angle, (2 * PI)) / PI) - 1 + (ecc / PI) * sin(angle);

      return 1 - (a * a);
    }

    plot('#parabolic-motion-graph', fn, [0, Math.PI * 2, 0, 1]);
  }

  plot('#parabolic-motion-graph', (x) => 1-((mod(x, (2 * Math.PI)) / Math.PI) - 1)**2, [0, Math.PI * 2, 0, 1]);
</script>
<br/>  

You can tell an axis to use motion shaped like this by passing ```Ayva.parabolicMotion``` into the ```construct``` parameter:

```javascript
ayva.do(new TempestStroke({
  stroke: { from: 0.0, to: 1, construct: Ayva.parabolicMotion },
  pitch:  { from: 0.1, to: 0.9, phase: -1 }
}));
```

<a href="./tutorial-examples/tempest-stroke-example-5.html" target="_blank">Try it out!</a>
<br/>  
  

#### Linear

Linear motion can be used to create more "robotic" movements (_try tweaking phase and eccentricity_):

<canvas style="margin-top:20px" width=450 height=100 id="linear-motion-graph"></canvas>
<div style="display: grid; grid-template-columns: 1fr 1fr; max-width: 50%">
  <b style="justify-self: end">phase (<span id="linear-phase-value">0.00</span>):</b> 
  <input 
    id="linear-phase" 
    type="range" 
    min="-1000" 
    max = "1000" 
    value=0 
    oninput="updateLinearGraph(event)">
  <b style="justify-self: end">eccentricity (<span id="linear-ecc-value">0.00</span>):</b> 
  <input 
    id="linear-ecc" 
    type="range" 
    min="-1000" 
    max = "1000" 
    value=0 
    oninput="updateLinearGraph(event)">
</div>

<script>
  function updateLinearGraph (event) {
    const { PI, sin, abs } = Math;
    let phase = document.querySelector('#linear-phase').value / 250;
    let ecc = document.querySelector('#linear-ecc').value / 1000;

    document.querySelector('#linear-phase-value').textContent = phase.toFixed(2);
    document.querySelector('#linear-ecc-value').textContent = ecc.toFixed(2);

    const fn = (x) => {
      const angle = x + (PI * phase / 2);
      const a = (mod(angle, (2 * PI)) / PI) - 1 + (ecc / PI) * sin(angle);

      return 1 - abs(a);
    }

    plot('#linear-motion-graph', fn, [0, Math.PI * 2, 0, 1]);
  }

  plot('#linear-motion-graph', (x) => 1-Math.abs((mod(x, (2 * Math.PI)) / Math.PI) - 1), [0, Math.PI * 2, 0, 1]);
</script>
<br/>  

You can tell an axis to use motion shaped like this by passing ```Ayva.linearMotion``` into the ```construct``` parameter:

```javascript
ayva.do(new TempestStroke({
  stroke: { from: 0.0, to: 1, construct: Ayva.linearMotion },
  pitch:  { from: 0.1, to: 0.9, phase: -1 }
}));
```

<a href="./tutorial-examples/tempest-stroke-example-6.html" target="_blank">Try it out!</a>
<br/>  

<div style="text-align: center; font-size: 18px">Next: <a href="./tutorial-behavior-api-custom.html">Custom Behaviors</a></div>
