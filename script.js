import VirtualKeyboard from './assets/js/keyboard.class.js';

console.log('Script.js attached successfully');
const mainContainer = document.querySelector('body');

const kbWrapper = document.createElement('div');
kbWrapper.classList.add('virtkeyb-page__wrapper');
kbWrapper.classList.add('keyboard-wrapper');

const mainKeyboard = new VirtualKeyboard(kbWrapper);
mainContainer.insertAdjacentElement('afterBegin', kbWrapper);
