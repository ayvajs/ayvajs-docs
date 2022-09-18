> Note: This is the guide for *Ayva.js*—the software library. It assumes basic familiarity with <a href="https://www.patreon.com/tempestvr" target="_blank">Open Source Multi Axis Stroker Robots</a>, TCode, and <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">JavaScript</a>. If you are looking for the guide for the web application *Ayva Stroker Lite*, click <a href="./tutorial-ayva-stroker-lite.html">here.</a>

## What is Ayva.js?
Ayva.js is a lightweight, behavior-based JavaScript library for controlling <a href="https://www.patreon.com/tempestvr" target="_blank">Open Source Multi Axis Stroker Robots</a> such as the <a href="https://www.thingiverse.com/thing:4843410" target="_blank">OSR2+</a>, SR6, or any device that can be controlled with TCode. It allows specifying simple or complex multi-axis movements using an expressive Motion API. More complex behaviors can be constructed using a Behavior API.
## Quick Start


### Web
To get started with Ayva.js for the web, simply copy the following code into an HTML file and open it in your browser:

```html
<script src="https://unpkg.com/osr-emu/dist/osr-emu.dist.min.js"></script>
<script src="https://unpkg.com/ayvajs/dist/ayva.dist.min.js"></script>

<div id="emulator" style="height: 100vh"></div>

<script>
  const emulator = new OSREmulator('#emulator');
  const ayva = new Ayva().defaultConfiguration();
  ayva.addOutput(emulator);

  ayva.move({ to: 0, duration: 2 });
</script>
```

The above example imports the minified distributions of Ayva.js and the <a href="https://github.com/ayvajs/osr-emu" target="_blank">OSR Emulator</a> from <a href="https://unpkg.com/" target="_blank">unpkg</a>. It loads the emulator into an html element, creates a new instance of Ayva, adds the emulator as an output, and then commands the emulator to move to the bottom position over two seconds.

To connect to an actual device using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API" target="_blank">Web Serial API</a>, you may use a _WebSerialDevice_. The following example creates a button that requests a connection to a device when clicked (_we need to do this because the Web Serial API only allows a request to connect if it was triggered by a user gesture_):

```html
<script src="https://unpkg.com/ayvajs/dist/ayva.dist.min.js"></script>

<button id="connect" onclick="connect()">Connect</button>

<script>
  const ayva = new Ayva().defaultConfiguration();
  const device = new WebSerialDevice();

  function connect () {
    device.requestConnection().then(() => {
      ayva.addOutput(device);

      ayva.move({ to: 0, duration: 2 });
    }).catch((error) => {
      console.error('Error connecting to device:', error);
    });
  }
</script>
```

### ES6 Module

Ayva.js (as well as the OSR Emulator) may also be imported as an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" target="_blank">ES6 module</a>. Here are the previous examples rewritten using modules:

__Emulator:__
```html
<div id="emulator" style="height: 100vh"></div>

<script type="module">
  import { Ayva } from 'https://unpkg.com/ayvajs';
  import { OSREmulator } from 'https://unpkg.com/osr-emu';

  const emulator = new OSREmulator('#emulator');
  const ayva = new Ayva().defaultConfiguration();
  ayva.addOutput(emulator);

  ayva.move({ to: 0, duration: 2 });
</script>
```

__Actual Device:__
```html
<button id="connect" onclick="connect()">Connect</button>

<script type="module">
  import { Ayva, WebSerialDevice } from 'https://unpkg.com/ayvajs';
  const ayva = new Ayva().defaultConfiguration();
  const device = new WebSerialDevice();

  window.connect = function () {
    device.requestConnection().then(() => {
      ayva.addOutput(device);

      ayva.move({ to: 0, duration: 2 });
    }).catch((error) => {
      console.error('Error connecting to device:', error);
    });
  }
</script>
```

### npm

Ayva.js can be installed and used in a <a href="https://nodejs.org/en/" target="_blank">Node.js</a> app via <a href="https://docs.npmjs.com/about-npm" target="_blank">npm</a>:

```
npm install ayvajs
```

To import Ayva into your Node.js app:
```js
import { Ayva } from 'ayvajs';

const ayva = new Ayva().defaultConfiguration();

// ...
```

Ayva.js does not provide any device implementations that work in a Node.js app. Instead, Ayva.js can work with an external library. The recommended serial library for Node.js is <a href="https://serialport.io/" target="_blank">serialport</a>:

```
npm install serialport
```
Then:  

```js
import { Ayva } from 'ayvajs';
import { SerialPort } from 'serialport';

// Create a new device on the specified port. 
// Note: /dev/cu.usbserial-0001 is just an example. Your port will likely be different.
const device = new SerialPort({ path: '/dev/cu.usbserial-0001', baudRate: 115200 });

const ayva = new Ayva().defaultConfiguration();
ayva.addOutput(device);

ayva.move({ to: 0, speed: 1 });
```
_Note: This example is the syntax from __version 10__ of SerialPort_.

When running in Node.js, your app will need to be configured with type _module_ (in the <a href="https://nodejs.org/api/packages.html#type" target="_blank">package.json</a>), __or__ you will need to suffix your file with the ```.mjs``` extension and include that extension explicitly when running it. i.e.

```javascript
node my-app.mjs
```

### Versions

While Ayva.js is relatively stable, it is still considered to be under active development. It has not yet reached version __1.0.0__. Therefore breaking changes might be introduced as the API matures. You can protect yourself from breaking changes by locking to a specific version.

Examples in this tutorial have all used the latest version. When importing using <a href="https://unpkg.com/" target="_blank">unpkg</a>, to restrict to a specific version simply add @&lt;version&gt; into the url. Ex:

```html
<script src="https://unpkg.com/ayvajs@0.14.0/dist/ayva.dist.min.js"></script>
```

_ES6 module:_

```html
<script type="module">
  import { Ayva } from "https://unpkg.com/ayvajs@0.14.0";
</script>
```

_Node.js app:_
```
npm install ayvajs@0.14.0
```

All releases may be viewed <a href="https://github.com/ayvajs/ayvajs/releases" target="_blank">here.</a>

<div style="text-align: center; font-size: 18px">Next: <a href="./tutorial-configuration.html">Configuration</a></div>
