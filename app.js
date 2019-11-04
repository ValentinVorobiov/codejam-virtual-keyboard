import './assets/css/reset.css';
import './assets/css/normalize.css';

import './style.scss';

/* eslint-disable import/extensions */
import VirtualKeyboard from './assets/js/keyboard.class';

const mainContainer = document.querySelector('body');

const kbWrapper = document.createElement('div');
kbWrapper.classList.add('virtkeyb-page__wrapper');
kbWrapper.classList.add('keyboard-wrapper');

const mainKeyboard = new VirtualKeyboard(kbWrapper);
window.mainKeyboard = mainKeyboard;
mainContainer.insertAdjacentElement('afterBegin', kbWrapper);
