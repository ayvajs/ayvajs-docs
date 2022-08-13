import OSREmulator from 'https://unpkg.com/osr-emu';
import * as AyvaModules from 'https://unpkg.com/ayvajs@0.13.3';

const element = document.createElement('div');
element.id = 'canvas';
element.style['height'] = '100vh';
document.body.appendChild(element);

const ayva = new AyvaModules.Ayva().defaultConfiguration();
ayva.addOutputDevice(new OSREmulator(element));

ayva.updateLimits('stroke', 0.25, 0.75);
ayva.updateLimits('roll', 0.25, 0.75);
ayva.updateLimits('pitch', 0.25, 0.75);

Object.assign(window, AyvaModules, { ayva });