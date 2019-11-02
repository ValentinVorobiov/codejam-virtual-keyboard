import { virtualKeyboard } from './assets/js/keyboard.class.js' ;

let mainContainer = document.querySelector( 'body' );

let kbWrapper = document.createElement( 'div' );
kbWrapper.classList.add( 'virtkeyb-page__wrapper' );
    kbWrapper.classList.add( 'keyboard-wrapper' );
    let mainKeyboard = new virtualKeyboard( kbWrapper );
    document.mainKeyboard = mainKeyboard;

  mainContainer.insertAdjacentElement( 'afterBegin' , kbWrapper );




