<h3 class="pad">Overview</h3>

Ayva's ```do()``` method accepts behaviors in the form of a function, or an object with a ```perform()``` method. Upon calling ```do()```, the Ayva instance will start a loop that continuously invokes the provided function (or ```perform()``` method). After each invocation it will wait for any moves started by the behavior to complete before starting the next iteration. The loop will continue forever until either ```do()``` is called with another behavior, ```stop()``` is called, or the behavior completes itself. 

### Function

```javascript
const myStroke = function (ayvaInstance) {
    ayvaInstance.stroke(0, 1); // Stroke down.
    ayvaInstance.stroke(1, 1); // Stroke up.
};

ayva.do(myStroke); // Perform the behavior until commanded to stop.
```

_Note: This example uses the convenience methods for single axis stroking as documented in the <a href="./tutorial-motion-api-syntactic-sugar.html#convenience" target="_blank">Syntactic Sugar ($)</a> tutorial._

<a href="./tutorial-examples/behavior-api-custom-example-1.html" target="_blank">Try it out!</a>

A behavior is independent of any specific instance of Ayva. When a particular Ayva instance performs the behavior, it passes itself as the sole parameter to the function. In the previous example we named this parameter ```ayvaInstance``` just to make it clear that it is not necessarily the same instance of Ayva used later in the example. If your program is only ever using one (global) instance of Ayva, you don't need to specify it as a parameter to your function. The following would also work:

```javascript
ayva.do(() => {
  ayva.stroke(0, 1); // Stroke down.
  ayva.stroke(1, 1); // Stroke up.
}); 
```

### Object Oriented Programming

You can package your behavior into a class that implements the ```perform()``` method to make it more reusable and/or configurable. Here is a reimplementation of the previous example using OOP to allow setting the speed of the stroke:

```javascript
class MyStroke {
  constructor (speed) {
    this.speed = speed;
  }

  perform (ayva) {
    ayva.stroke(0, this.speed);
    ayva.stroke(1, this.speed);
  }
}

ayva.do(new MyStroke(2)); // Perform a 2 strokes per second stroke.
```

<a href="./tutorial-examples/behavior-api-custom-example-2.html" target="_blank">Try it out!</a>

### Completion

By default, Ayva will perform a behavior forever until commanded to stop. A behavior can however signal its own completion if desired. It can
do this by setting its ```complete``` property to true. Here is a behavior that only strokes for five seconds and then stops (using <a href="https://developer.mozilla.org/en-US/docs/Web/API/Performance/now" target="_blank">performance.now()</a> to keep track of time):

```javascript
class FiveSecondStroke {
  constructor (speed) {
    this.speed = speed;
  }

  perform (ayva) {
    if (!this.startTime) {
      this.startTime = performance.now();
    }

    if (performance.now() - this.startTime < 5000) {
      ayva.stroke(0, this.speed);
      ayva.stroke(1, this.speed);  
    } else {
      // Five seconds has elapsed, so signal completion.
      this.complete = true;
    }
  }
}

ayva.do(new FiveSecondStroke(2)); // Perform a 2 strokes per second stroke for five seconds.
```

_Note: Ayva includes a convenience class for dealing with durations called ```VariableDuration```. See the <a href="./VariableDuration.html" target="_blank">API Documentation</a> to think of other ways you might implement this example._

<a href="./tutorial-examples/behavior-api-custom-example-3.html" target="_blank">Try it out!</a>

For simple behaviors that consist of only moves, passing a function or creating an object or class that implements the ```perform()``` method might be enough. However, for more complex behaviors that require logic based on the current state, have pauses, or depend on the actions of sub behaviors, the asynchronous nature of the _Motion API_ requires special handling. This is discussed in the next section.

<div style="text-align: center; font-size: 18px">Next: <a href="./tutorial-behavior-api-generator-behavior.html">Generator Behaviors</a></div>
