<a href="https://ayvajs.github.io/ayva-stroker-lite/" target="_blank">Ayva Stroker Lite</a> is a small web based random stroker app that can connect to and control an OSR2 or SR6 device.

<style>
  ol.strokes ::marker {
    font-weight: bold;
  }
</style>
Features:

- Create, import, and export your own custom multiaxis strokes with variations.
- Create, import, and export your own custom AyvaScripts.
- Run any <a href="https://ayvajs.github.io/ayvajs-docs/tutorial-behavior-api-tempest-stroke.html" target="_blank">TempestStroke</a> in Ayva's library.
- Change the speed (bpm) of the currently running stroke.
- Enter Free Play mode where strokes are randomly selected according to user preferences.
- Set the duration range for random strokes.
- Smooth transitions between strokes.
- Set the duration range for transitions.
- Set the bpm range.
- Set the bpm to change continuously or only on transitions to the next stroke.
- Enable default twist movements.
- Choose what strokes to include in Free Play mode.
- Set device output limits.
- Connect to an output via the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API" target="_blank">Web Serial API</a> or a WebSocket.
- Emulator to see 3D simulation of movements on screen (with or without hardware device connected).

<div style="display: none">A video guide is available <a href="https://www.youtube.com/watch?v=0WTC9joyvN8" target="_blank">here</a>.</div>

Supported browsers: Chrome, Edge, Safari

_Note: The app will run in Firefox, but Firefox does not support the Web Serial API yet so connecting to an actual device via serial in Firefox is currently not possible._

## Guide

<img src="./images/stroker-lite-guide-1.png">

### Contents
<ol>
  <li><a href="#emulator">Emulator</a></li>
  <li><a href="#output">Output Range and Device Connection</a></li>
  <li><a href="#controls">Controls</a></li>
  <li><a href="#parameters">Parameters</a></li>
  <li><a href="#strokes">Behaviors</a></li>
  <li><a href="#mode">Mode</a></li>
  <li><a href="#bpm">Current BPM</a></li>
  <li><a href="#designer">Stroke Designer</a></li>
  <li><a href="#import-export">Import / Export</a></li>
  <li><a href="#ayvascripts">AyvaScripts</a></li>
  <li><a href="#stroke-format">Behavior File Format</a></li>
</ol>

<h3 id="emulator">1. Emulator</h3>

The emulator provides a 3D simulation of the movements of the device. The current version is of an OSR2+. It does not have a ```surge``` or ```sway``` axis (as available on the SR6), however, movements on those axes are still supported by the application and will be sent to an actual device when connected. Behaviors can be played on the emulator alone (a physical device does not have to be connected).

Controls:
- _Click+Drag_ to rotate the camera.
- _Mousewheel_ to zoom in and out.
- _Shift+Click+Drag_ to pan.

<h3 id="output">2. Output Range and Device Connection</h3>

<img width="350px" src="./images/stroker-lite-guide-output-range.png"><br/> 

This section allows you to set the output type and the output range for all linear and rotational axes. The details on how Ayva scales output can be found in the <a href="https://ayvajs.github.io/ayvajs-docs/tutorial-configuration.html" target="_blank">Configuration</a> documentation under the Axis Limits section.

The button in the top middle gives the output connection status. Clicking it will connect to the current output. The default output type is Serial.
This can be changed by clicking the _gear_ icon in the top right:

<img width="250px" src="./images/stroker-lite-guide-output-type-serial.png">
<div style="margin-bottom: 10px; margin-top: 5px; margin-left: 20px">When in Serial mode, clicking the connect button will open the built-in Web Serial API window of the browser and allow you to select a serial port to connect to.</div>
<img width="250px" src="./images/stroker-lite-guide-output-type-websocket.png">
<div style="margin-bottom: 10px; margin-top: 5px; margin-left: 20px">When in WebSocket mode, clicking the connect button will open a websocket to the  <i>/ws</i> path on the provided host and port. To connect to device firmware that supports WiFi, you should set the host to the IP address of your device, and the port to 80.</div>
<img width="250px" src="./images/stroker-lite-guide-output-type-console.png">
<div style="margin-bottom: 10px; margin-top: 5px; margin-left: 20px">When in Console mode, clicking the connect button will cause all TCode to simply be output to the console. This output type is generally only used for debugging.</div>

Clicking the connect button again after an output is connected will disconnect.

_Note: For safety reasons, connections can only be made when in __Stopped__ mode. You will not be able to connect to an output if a stroke is currently playing._

<h3 id="controls">3. Controls</h3>

<img width="500px" src="./images/stroker-lite-guide-controls.png">  

- __Eye Icon__: Hide/show the UI.
- __Home Device__: Stops the current behavior and moves the device to the home position.
- __Free Play__: Commands Ayva to start playing behaviors randomly according to the current parameters.
- __Stop (Esc)__: Immediately stops the current behavior and ceases to send any output to the device. Pressing the _Escape_ key will also trigger this action.

<h3 id="parameters">4. Parameters</h3>

<img width="500px" src="./images/stroker-lite-guide-parameters.png"><br/>  

This section allows you to set the parameters that are used during free play mode (and some for manually triggered strokes). Most parameters in this section take effect on the _next_ stroke played.

- __Change BPM__: Select when to change the BPM. The options are:
  - _On Transition_ - changes the BPM when a new stroke is selected.
  - _Continuously_ - continuously changes the BPM.
- __BPM Range__: The speed range of strokes in beats per minute. When a stroke is randomly selected, it will pick a random speed within this range.
- __Acceleration (bpm/s)__: How fast to change the BPM in units of BPM per second. This is only enabled when in _Continuous_ BPM change mode.
- __Pattern Duration__: The duration range of strokes in seconds. When a stroke is randomly selected, it will last for a random amount of seconds within this range.
- __Transition Duration__: The duration range for smooth transitions in seconds. When a new stroke is starting, the transition into the new stroke will take a random amount of seconds within this range.
- __Default Twist__: This option allows you to add custom motion to the twist axis for any stroke that doesn't have it (i.e. the twist motion specified here only takes effect if the current stroke playing does not have its own twist).
- __Twist Range__: When twist is enabled, this allows you to specify the range of the twist motion.
- __Twist Phase__: When twist is enabled, this allows you to specify the _phase_ of the twist motion.
- __Twist Eccentricity__: When twist is enabled, this allows you to specify the _eccentricity_ of the twist motion.

Default twist motion is a sinusoidal shaped movement. See the <a href="https://ayvajs.github.io/ayvajs-docs/tutorial-behavior-api-tempest-stroke.html" target="_blank">TempestStroke</a> documentation for additional details on parameters such as phase and eccentricity.

<h3 id="strokes">5. Behaviors</h3>

<img width="500px" src="./images/stroker-lite-guide-strokes.png"><br/>  

This section allows you to manage strokes and AyvaScripts.
<ol class="strokes" style="list-style-type: upper-alpha">
  <li>Select what strokes or scripts to include in free play mode. The top most checkbox can be used to select or deselect all behaviors.</li>
  <li>Manually trigger a behavior. Manually triggering a behavior transitions out of free play mode. In manual mode, the current behavior will play continuously until another behavior is selected, free play mode is triggered, or the behavior completes (in the case of an AyvaScript).</li>
  <li>Hover over the <i>eye</i> icon to quickly view a preview of the corresponding stroke. <i>Previews are disabled for AyvaScripts.</i></li>
  <li>Access create, import, and export behaviors functionality. These features are covered in the <a href="#designer">Stroke Designer</a> and <a href="#ayvascripts">AyvaScripts</a> sections. This menu can only be accessed in Stopped mode. When a stroke or script is playing this area will instead show the name of the current behavior, as well as when a transition is occurring.</li>
</ol>

<h3 id="mode">6. Mode</h3>

<img width="200px" src="./images/stroker-lite-guide-mode.png"><br/>  

This label displays the current mode. It will be either __Stopped__, __Free Play__, or __Manual__.

<h3 id="bpm">7. Current BPM</h3>

<img width="600px" src="./images/stroker-lite-guide-current-bpm.png"><br/>  

This slider shows the current speed. In both __Free Play__ and __Manual__ mode the speed of the current stroke can be changed in real time. However, while you can set the speed in __Free Play__ mode, Ayva can (and likely __will__) choose a new speed when it decides to play a new stroke. But Ayva will never changes strokes while you are dragging the slider. This means that if you are in Free Play mode and you would like to stay on the current pattern without leaving Free Play, you could keep the bpm slider engaged until you are ready to switch.

Manually updating the bpm is not allowed during a transition or when an AyvaScript is playing (the widget will be disabled), as Ayva has full control of the speed during that time.

<h3 id="designer">8. Stroke Designer</h3>

<img width="600px" src="./images/stroker-lite-guide-designer-1.png"><br/>

The stroke designer can be accessed by clicking the _gear_ icon in the top right of the _Strokes_ section, then clicking _Create TempestStroke_.
 
<br/>  

<img width="900px" src="./images/stroker-lite-guide-designer-2.png"><br/>  

<ol class="strokes" style="list-style: upper-alpha">
  <li>Clicking the axes button allows you to select which axes to include in your stroke. All axes of an SR6 device are available.</li>
  <li>Motion can be specified for each axis with an interactive graph widget. The parameters available are:<ul>
      <li><b>Range:</b> The left slider sets the range. This is a dual slider specifying the <i>from</i> and <i>to</i> values for the motion. The knobs can be slid past each other to change the shape of the motion, as well as be set to the same value if you want the axis to hold a value for the duration of the motion.</li>
      <li><b>Phase:</b> The bottom left slider sets the phase of the motion.</li>
      <li><b>Eccentricity:</b> The bottom right slider sets the eccentricity of the motion.</li>
      <li><b>Noise:</b> The two knobs on the bottom right set the noise (amount of variation) for either end of the range of motion.
      <li><b>Function:</b> The bottom right icon (fx) allows you to change the mathematical function. The options are <i>Sinusoidal</i>, <i>Parabolic</i>, or <i>Linear</i></li>
    </ul>
    Use the middle mouse over a graph to quickly expand or contract the range.
    <br/>Double click a slider knob to reset to default value(s). 
    <br/>The progress dot on the graph will move along with the current motion in real time.
    <br/><br/><img width="450px" src="./images/demo-tempest-motion.gif">
    <br/><br/>Note that when there are more axes than available space you can scroll to view the additional axes.<br/><br/>

  </li>
  <li>The current motion will automatically preview on the emulator. The BPM can be adjusted to preview at higher or lower speeds.</li>
  <li>If a device is connected, you can optionally send the preview of the stroke to the actual device. This option is disabled by default, and will be unavailable if there is no device connected.</li>
  <li>Clicking the preset button will open a dropdown allowing you to select a stroke from the library (custom or default) as a starting point. You may also cycle through the presets by clicking the arrows.</li>
  <li>You can give your stroke a name and add it to the library. Names are restricted to lowercase alphanumeric characters and dashes, and must be unique. When a stroke is added to the library, it will be made available on the main screen for use in Free Play or Manual modes. It will also be available as a preset if you return to the stroke designer later.</li>
</ol>

Strokes can be editted by clicking the _gear_ icon next to them on the main screen.
  
Note that all strokes are saved in the local storage of the browser, so they will remain between sessions. However, if you clear your browser storage then you will lose your strokes. To make a backup of your stroke(s) (or to share your strokes with others) you can use the import/export functionality as detailed in the next section.

<h3 id="import-export">9. Import / Export</h3>

<img width="600px" src="./images/stroker-lite-guide-designer-3.png"><br/>

Import or Export of behaviors can be accessed by clicking the _gear_ icon in the top right of the _Strokes_ section. These will open the browser file dialogs and allow you to import or export a behavior file. When exporting this way, all custom behaviors will be exported. The option to export an individual behavior can be found by clicking the _gear_ icon next to the desired behavior:

<img width="600px" src="./images/stroker-lite-guide-designer-4.png"><br/>

_Note that this is also how you access the Edit and Delete functionality._

To import or export __all__ app data, click the gear box in the lower left corner of the app:

<img width="600px" src="./images/stroker-lite-guide-settings.png"><br/>

_Note: This is also how you access the Release Notes._

<h3 id="ayvascripts">10. AyvaScripts</h3>

> <span style="color: #AA0000"><b>Warning:</b> AyvaScripts are an Advanced feature. To write AyvaScripts you should have familiarity with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" style="color: #AA0000;font-weight: bold;text-decoration: underline;">JavaScript</a>, Ayva's  <a style="color: #AA0000;font-weight: bold;text-decoration: underline;" href="./tutorial-motion-api.html" target="_blank">Motion API</a> , and Ayva's <a style="color: #AA0000;font-weight: bold;text-decoration: underline;" href="./tutorial-behavior-api.html" target="_blank">Behavior API</a></span>.

AyvaScripts allow you to extend Ayva's functionality with custom scripts that can leverage the full power of Ayva.js's Motion and Behavior APIs. An AyvaScript is essentially just the body of the ```*generate()``` function of a <a href="./tutorial-behavior-api-generator-behavior.html" target="_blank">GeneratorBehavior</a>. The AyvaScript editor can be accessed by clicking the _gear_ icon in the top right of the _Strokes_ section, then clicking _Create AyvaScript_:

<img width="600px" src="./images/stroker-lite-guide-create-ayvascript.png"><br/>

<img width="1100px" src="./images/stroker-lite-guide-ayvascript.png"><br/>

The body of an AyvaScript can be entered in the code editor on the left side, and previewed using the Play button on the top left. Anything that can be done in a <a href="./tutorial-behavior-api-generator-behavior.html" target="_blank">GeneratorBehavior</a> can be done in an AyvaScript.

Here is an example AyvaScript that does a basic up / down stroke on the main axis using a move builder:

```javascript
const { stroke } = ayva.$;

yield stroke(0, 1);
yield stroke(1, 1);
```

Note that AyvaScripts have full control of Ayva. To take the user's parameters into account when constructing your behavior, a special ```GLOBALS``` object 
is available that contains a <i>parameters</i> object. It contains the following properties:

```twist```: <b>boolean.</b> true if default twist is enabled. false if not.<br/>
```bpm```: <b>array</b>. The bpm range.<br/>
```acceleration```: <b>array.</b> The bpm acceleration range.<br/>
```patternDuration```: <b>array.</b> The pattern duration range.<br/>
```transitionDuration```: <b>array.</b> The transition duration range.<br/>
```twistRange```: <b>array.</b> The default twist range.<br/>
```twistPhase```: <b>number.</b> The default twist phase.<br/>
```twistEcc```: <b>number.</b> The default twist eccentricity.<br/>
```bpmMode```: <b>string.</b> The change bpm mode. Either <i>transition</i> or <i>continuous</i>

The following example is the same simple AyvaScript from above but it utilizes the user supplied bpm range to choose a random duration for each stroke:

```javascript
const { stroke } = ayva.$;
const [ minBpm, maxBpm ] = GLOBALS.parameters.bpm;
const randomBpm = Ayva.map(Math.random(), 0, 1, minBpm, maxBpm);
const duration = 60 / randomBpm;

yield stroke(0, duration);
yield stroke(1, duration);
```

<b>TBD: There are many things that can be done with AyvaScripts. Stay tuned for a more detailed tutorial!</b>

<h3 id="stroke-format">11. Behavior File Format</h3>

Behavior files are <a href="https://www.json.org/json-en.html" target="_blank">JSON</a> files. The top level object is an array containing all the behaviors. Each behavior has the following properties:

<ul>
  <li><code>name</code>: alphanumeric, dash separated name of the behavior.</li>
  <li><code>type</code>: currently the only supported types are <b>tempest-stroke</b> and <b>ayvascript</b>.</li>
  <li><code>data</code>: when the type is <b>tempest-stroke</b> this will be an object containing the stroke parameters, keyed by axis name or alias. When the type is <b>ayvascript</b>, this will be an object with a single property, <code>script</code>, that contains the entire script as a string.</li>
</ul>

#### Example

```javascript
[
  {
    "name": "my-orbit-grind",
    "type": "tempest-stroke",
    "data": {
      "L0": {
        "from": 0,
        "to": 0.6,
        "phase": 0,
        "ecc": 0.3
      },
      "R1": {
        "from": 0.1,
        "to": 0.9,
        "phase": 1,
        "ecc": -0.3
      },
      "R2": {
        "from": 0.9,
        "to": 0.1,
        "phase": 0,
        "ecc": -0.3
      }
    }
  },
  {
    "name": "my-custom-ayvascript",
    "type": "ayvascript",
    "data": {
      "script": "yield { to: 0, speed: 2 };\nyield { to: 1, speed: 1 };"
    }
  }
]
```
