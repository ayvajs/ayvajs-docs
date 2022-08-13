const element = document.createElement('div');
element.id = 'canvas';
element.style['height'] = '100vh';
document.body.appendChild(element);

const ayva = new Ayva().defaultConfiguration();
ayva.addOutputDevice(new OSREmulator(element));

ayva.updateLimits('stroke', 0.25, 0.75);
ayva.updateLimits('roll', 0.25, 0.75);
ayva.updateLimits('pitch', 0.25, 0.75);

Object.assign(window, { ayva });