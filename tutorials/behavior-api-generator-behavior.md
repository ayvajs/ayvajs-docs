> In JavaScript, generators are functions that can be exited and later re-entered. Their context (variable bindings) are saved across re-entrances. This makes them ideal for behaviors because they ensure that the behavior is interruptable, that logic executes at the right time, and that the main thread is never blocked. <br/><br/> You should have at least a basic understanding of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*" target="_blank">generator functions</a> before proceeding.

Ayva's ```do()``` method accepts behaviors in the form of a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*" target="_blank">generator function</a>. When using a generator function, the ```yield``` keyword can be used to pause execution until any moves that have been queued are finished. A value may optionally be passed to ```yield``` to perform an action as well. That value may take the following forms:  
<br/>  

#### yield &lt;number&gt;

A number is interpreted as the number of seconds to wait _after all moves have finished_:

```javascript
ayva.do(function*() {
  ayva.$.stroke(0, 1).execute(); // Stroke down.
  ayva.$.stroke(1, 1).execute(); // Stroke up.
  yield 0.5;         // Wait half a second.
});
```

<a href="./tutorial-examples/behavior-api-custom-example-4.html" target="_blank">Try it out!</a>  
<br/>  
   
#### yield &lt;single-axis-move&gt;

A single-axis move can be yielded directly (see the <a href="./tutorial-motion-api-overview.html" target="_blank">Motion API</a>):

```javascript
ayva.do(function*() {
  yield { to: 0, speed: 1 };  // Stroke down.
  yield { to: 1, speed: 0.5 }; // Stroke up.
});
```
<a href="./tutorial-examples/behavior-api-custom-example-5.html" target="_blank">Try it out!</a>  
<br/>  
    
#### yield &lt;multi-axis-move&gt;

A multi-axis move can be yielded by passing an array of moves (see the <a href="./tutorial-motion-api-multiaxis.html" target="_blank">Motion API: Multiaxis Movements</a>):
```javascript
ayva.do(function*() {
  yield [
    { to: 0, speed: 1 },
    { axis: 'twist', to: 0 }
  ];

  yield [
    { to: 1, speed: 0.5 },
    { axis: 'twist', to: 1 }
  ];
});
```
<a href="./tutorial-examples/behavior-api-custom-example-6.html" target="_blank">Try it out!</a>  
<br/>  
   
#### yield &lt;move-builder&gt;

A move builder can be yielded directly (see <a href="./tutorial-motion-api-syntactic-sugar.html" target="_blank">Syntactic Sugar ($)</a>):

```javascript
ayva.do(function*() {
  const { stroke } = ayva.$;                // Get a move builder.
  
  yield stroke(0, 1).twist(0).pitch(0.75);  // Stroke down.
  yield stroke(1, 1).twist(1).pitch(0.25);  // Stroke up.
});
```
<a href="./tutorial-examples/behavior-api-custom-example-7.html" target="_blank">Try it out!</a>  
<br/>  
   
#### yield &lt;Promise&gt;

A <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">Promise</a> can be yielded. Execution will continue after all previous moves have finished and the specified Promise has resolved.

```javascript
ayva.do(function*() {
  ayva.$.stroke(0, 1).execute();
  ayva.$.stroke(1, 1).execute();
  yield new Promise ((resolve) => { /* Some asynchronous operation */ });
});
```  
<br/>  

#### yield &lt;null&gt; or &lt;undefined&gt;

Yielding ```null``` or ```undefined``` will simply pause execution until any moves that have been queued are finished.

```javascript
ayva.do(function*() {
  ayva.$.stroke(0, 1).execute();
  ayva.$.stroke(1, 1).execute();
  yield;

  console.log('This will print after the above strokes are complete.');
});
``` 

### Object Oriented Programming

You can package your generator behavior into a class to make it more reusable and/or configurable by extending the ```GeneratorBehavior``` base class. ```GeneratorBehavior``` is available as part of the standard distribution, but to use it within an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" target="_blank">ES6 module</a>, you must import it. For example, _in a browser_:

```javascript
import { Ayva, GeneratorBehavior } from 'https://unpkg.com/ayvajs';
```
or _from within a Node.js app_:
```javascript
import { Ayva, GeneratorBehavior } from 'ayvajs';
```
<br/>  

#### *generate()

When you extend a ```GeneratorBehavior```, you must implement the ```*generate()``` method. The ```*generate()``` method takes an optional Ayva instance as the argument and is expected to perform and/or yield the actions that constitute a single iteration of the behavior.

```javascript
class MyStroke extends GeneratorBehavior {
  constructor (speed) {
    super(); // Must call super constructor.
    this.speed = speed;
  }

  * generate (ayva) {
    const { stroke } = ayva.$; // Get a move builder.

    yield stroke(0, this.speed); // Stroke down.
    yield stroke(1, this.speed); // Stroke up.
    yield 0.5;                   // Wait 0.5 seconds.
  }
}

ayva.do(new MyStroke(2)); // 2 strokes per second.
```

<a href="./tutorial-examples/behavior-api-custom-example-8.html" target="_blank">Try it out!</a>  
<br/>  

### Behavior Composition

A ```GeneratorBehavior``` can incorporate another ```GeneratorBehavior``` by using a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*" target="_blank">yield*</a> expression.

The following example demonstrates using ```ClassicStroke``` inside a ```GeneratorBehavior``` (```ClassicStroke``` is a subclass of ```GeneratorBehavior```):

```javascript
class MyCompositeBehavior extends GeneratorBehavior {
  constructor (speed) {
    super();
    this.speed = speed;
  }

  * generate (ayva) {
    const fullSpeedStroke = new ClassicStroke(0, 1, this.speed);
    const halfSpeedStroke = new ClassicStroke(0, 1, this.speed / 2);

    yield* fullSpeedStroke(ayva, 4); // 4 full speed strokes.
    yield* halfSpeedStroke(ayva, 4); // 4 half speed strokes.
  }
}

ayva.do(new MyCompositeBehavior(2));
```

<a href="./tutorial-examples/behavior-api-custom-example-9.html" target="_blank">Try it out!</a>  
 
Notice that when we used ```ClassicStroke``` in a ```yield*``` expression, we called it like a function:

```javascript
yield* fullSpeedStroke(ayva, 4);
```

This is because a ```GeneratorBehavior``` is designed to be a _callable_ object. i.e. It can behave like a function. When invoked, it will automatically call its ```*generate()``` function to return the generator for the behavior. The first parameter is the Ayva instance to pass to ```*generate()```, and the second (optional) parameter is the number of iterations to perform (_default = 1_). 

```yield*``` will give control to the sub behavior until the specified number of iterations have completed.
<br/> 
<br/>  
  
#### bind()

It is sometimes tedious to always have to pass the Ayva instance to a generator behavior when it is invoked. To prevent having to do this, a ```GeneratorBehavior``` can be bound to an Ayva instance using the ```bind()``` method (not to be confused with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind" target="_blank">Function.prototype.bind()</a>, although the effect is similar).

Here is the previous example rewritten using ```bind()```:

```javascript
class MyCompositeBehavior extends GeneratorBehavior {
  constructor (speed) {
    super();
    this.speed = speed;
  }

  * generate (ayva) {
     // Create and bind the strokes to the Ayva instance.
    const fullSpeedStroke = new ClassicStroke(0, 1, this.speed).bind(ayva);
    const halfSpeedStroke = new ClassicStroke(0, 1, this.speed / 2).bind(ayva);

    // The ayva parameter can now be omitted.
    yield* fullSpeedStroke(4); // 4 full speed strokes.
    yield* halfSpeedStroke(4); // 4 half speed strokes.
  }
}

ayva.do(new MyCompositeBehavior(2));
```

If only one iteration needs to be performed, and a generator behavior has been bound to an Ayva instance (or doesn't need one), it can itself be yielded without having to invoke it. For example:

```javascript
class MyBehavior extends GeneratorBehavior {
  /* ... */
}

const behavior = new MyBehavior();

ayva.do(function*() {
  /* ... */

  yield* behavior;
});
```
<br/> 

#### next()

One limitation of a ```yield*``` expression is that it passes control to the supplied generator until that generator is finished. There is therefore no way for the parent behavior to take back control. ```GeneratorBehaviors``` have a ```next()``` method that allows for finer control if needed. It returns only the next action of a behavior so control can be taken back at any time. The following example demonstrates this by creating a stroke that sometimes pauses for half a second in between movements:

```javascript
class MyStroke extends GeneratorBehavior {
  * generate (ayva) { 
    // Create a stroke where up strokes are performed at half speed.
    const stroke = new ClassicStroke(0, 1, [1, 0.5]).bind(ayva);

    while (true) {
      yield* stroke;
    }
  }
}

class MyCompositeBehavior extends GeneratorBehavior {
  * generate (ayva) {
    const myStroke = new MyStroke().bind(ayva);

    while (true) {
      // Yield only the next action of MyStroke (a single stroke).
      yield myStroke.next();

      if (Math.random() < 0.5) {
        // 50% chance of pausing for half a second in between strokes.
        yield 0.5;
      }
    }
  }
}

ayva.do(new MyCompositeBehavior()); 
```

<a href="./tutorial-examples/behavior-api-custom-example-13.html" target="_blank">Try it out!</a>  

### Tempest Stroke

```TempestStrokes``` contain some convenience methods to allow incorporating them into ```GeneratorBehaviors``` more seamlessly.
<br/>  

#### start()

The ```start()``` method returns a generator that moves the device into the starting position of a ```TempestStroke```:

```javascript
ayva.do(function*() {
  const stroke = new TempestStroke('down-forward', 30).bind(ayva);

  yield* stroke.start();

  while (true) {
    yield* stroke;
  }
});
```

<a href="./tutorial-examples/behavior-api-custom-example-10.html" target="_blank">Try it out!</a>  

By default the speed of the movement is _1 unit per second_. An object may be passed to the  ```start()``` method to override any properties of the movement. The properties available for override are those supplied to movement descriptors according to the <a href="tutorial-motion-api-overview.html">Motion API</a>. Here is an example that makes the start move last for 2 seconds with a parabolic ramp:

```javascript
ayva.do(function*() {
  const stroke = new TempestStroke('down-forward', 30).bind(ayva);

  yield* stroke.start({ 
    duration: 2, 
    value: Ayva.RAMP_PARABOLIC 
  });

  while (true) {
    yield* stroke;
  }
});
```

<a href="./tutorial-examples/behavior-api-custom-example-11.html" target="_blank">Try it out!</a>  

_Note: The ```start()``` method's first parameter would normally be the Ayva instance, but in these examples the usage of ```bind()``` allows us to omit it._
<br/>  


#### transition()

The ```transition()``` method returns a new ```TempestStroke``` that includes a transition at the beginning:

```javascript
ayva.do(function*() {
  const stroke = new TempestStroke('down-forward', 45).bind(ayva);

  // Perform two down-forward strokes.
  // Note: Each iteration of a TempestStroke is 180 degrees.
  yield* stroke.start();
  yield* stroke(4);

  // Transition into an orbit-grind at 60 bpm over three seconds.
  const nextStroke = stroke.transition('orbit-grind', 60, 3);

  while (true) {
    yield* nextStroke;
  }
});
```

<a href="./tutorial-examples/behavior-api-custom-example-12.html" target="_blank">Try it out!</a>

_Note: In this example the first parameter of ```transition()``` was a named stroke, but it could also be a stroke config—just like the first parameter of TempestStroke's constructor._

### Whew!

That's all for the Behavior API! Feel free to explore the <a href="./index.html" target="_blank">API Documentation</a> to discover anything not covered here. 😊
