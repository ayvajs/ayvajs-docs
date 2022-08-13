> In JavaScript, generators are functions that can be exited and later re-entered. Their context (variable bindings) are saved across re-entrances. This makes them ideal for behaviors because they ensure that the behavior is interruptable, that logic executes at the right time, and that the main thread is never blocked. <br/><br/> You should have at least a basic understanding of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*" target="_blank">generator functions</a> before proceeding.

Ayva's ```do()``` method accepts behaviors in the form of a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*" target="_blank">generator function</a>. When using a generator function, the ```yield``` keyword can be used to pause execution until any moves that have been queued are finished. A value may optionally be passed to ```yield``` to perform an action as well. That value may take the following forms:  
<br/>  

#### yield &lt;number&gt;

A number is interpreted as the number of seconds to wait _after all moves have finished_:

```javascript
ayva.do(function*() {
  ayva.stroke(0, 1); // Stroke down.
  ayva.stroke(1, 1); // Stroke up.
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
  ayva.stroke(0, 1);
  ayva.stroke(1, 1);
  yield new Promise ((resolve) => { /* Some asynchronous operation */ });
});
```  
<br/>  

#### yield &lt;null&gt; or &lt;undefined&gt;

Yielding ```null``` or ```undefined``` will simply pause execution until any moves that have been queued are finished.

```javascript
ayva.do(function*() {
  ayva.stroke(0, 1);
  ayva.stroke(1, 1);
  yield;

  console.log('This will print after the above strokes are complete.');
});
``` 

### Object Oriented Programming

You can package your generator behavior into a class to make it more reusable and/or configurable by extending the ```GeneratorBehavior``` base class.
To use a ```GeneratorBehavior```, you must import it. For example, _in a browser_:

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

### Whew!

That's all for the Behavior API! Feel free to explore the <a href="./index.html" target="_blank">API Documentation</a> to discover anything not covered here. 😊