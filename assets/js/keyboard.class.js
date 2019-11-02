import { keyboardLayout } from './keyboard.layout.js' ;
import { keymapEN } from './keyboard.mapping.js' ;
import { keymapRU } from './keyboard.mapping.js' ;


class VirtualKeyboard {
  constructor( parentElement, initLanguage ){
    // by default. setting language to EN
    this.actualLanguage = ( initLanguage ? initLanguage : 'EN' ) ;
    this.keyboards = {
      'EN' : { layout : keyboardLayout, mapping: keymapEN } ,
      'RU' :  { layout: keyboardLayout, mapping: keymapRU } ,
    };
    this.eventHistory = [];
    this.renderedString = '';
    this.parentElement = parentElement;
    this.shiftState = false;
    this.capsState = false;
    this.altState = false;
    this.controlState = false;

    this.renderKeyboard();
  } // constructor

  clearRendered(  ){
    /*Pre-requisites: removing existing elements  */
    let oldInputWrapper = this.parentElement.querySelector( '.virtual-keyboard__input-wrapper' );
    let oldLayoutWrapper = this.parentElement.querySelector( '.virtual-keyboard__layout-wrapper' );
    if( oldInputWrapper ){ oldInputWrapper.remove(); }
    if( oldLayoutWrapper ){ oldLayoutWrapper.remove(); }
    this.keyboardInput = null;
    this.keyboardKeys = null;
  }

  renderKeyboard(   ){

    this.clearRendered();

    this.keyboardInput = document.createElement( 'div' );
    this.keyboardInput.classList.add( 'virtual-keyboard__input-wrapper' );
    let textarea = document.createElement( 'textarea' );
    textarea.classList.add( 'virtual-keyboard__input' );
    textarea.setAttribute( "rows", "25" );
    textarea.setAttribute( "cols" , "80" );
    this.keyboardInput.insertAdjacentElement( 'beforeEnd' , textarea );


    this.keyboardKeys = document.createElement( 'div' );
    this.keyboardKeys.classList.add( 'virtual-keyboard__layout-wrapper' );
    // console.log( '#renderKeyboard, selected keymap : ', this.keyboards[ this.actualLanguage ] );
    let _keyboard =  this.keyboards[ this.actualLanguage ];
    let _rows = []; let itemIndex = 0;

    _keyboard.layout.forEach( ( row, i ) => {

      // console.log( '#renderKeyboard, processing keyboard row : \n', row );
      let kbRow = document.createElement( 'div' );
          kbRow.classList.add( 'virtual-keyboard__layout-row' );
          kbRow.classList.add( 'keyboard-row' );
          kbRow.classList.add( 'keyboard-row-'+i );
          let _keys = [];

      row.forEach( (keyName , j) => {

        itemIndex +=1;
        let _key = _keyboard.mapping[ keyName ];
        // console.log( '#renderKeyboard, current key : \n', _key );
        let kbKey = document.createElement( 'div' );
            kbKey.classList.add( 'keyboard-key' );
            kbKey.classList.add( 'keyboard-key-'+itemIndex );
            kbKey.classList.add( keyName );
            kbKey.setAttribute( 'data-event-code' , _key.eventCode );
        let _captionRegular = document.createElement( 'span' );
        _captionRegular.classList.add( 'caption-normal' );
        let _captionShift = document.createElement( 'span' );
        _captionShift.classList.add( 'caption-shift' );
        let _captionCaps = document.createElement( 'span' );
        _captionCaps.classList.add( 'caption-caps' );

        if( _key.isFn ){
          kbKey.classList.add( 'functional' );
          _key.isLock ? kbKey.classList.add( 'fn-locker' ) : null ;
          kbKey.setAttribute( 'data-command' , _key.eventType );
            _captionRegular.innerHTML = _key.char;
            _captionShift.innerHTML = _key.char;
            _captionCaps.innerHTML = _key.char;
        } else {
          _captionRegular.innerHTML = _key.char ;
          _captionShift.innerHTML = _key.charShift;
          _captionCaps.innerHTML = _key.charCaps;
        }
        if( _key.eventCode == 'Space' ){
          _captionRegular.innerHTML = 'Space' ;
          _captionShift.innerHTML = 'Space' ;
          _captionCaps.innerHTML = 'Space' ;
        }

        kbKey.insertAdjacentElement( 'beforeEnd' , _captionRegular );
        kbKey.insertAdjacentElement( 'beforeEnd' , _captionShift );
        kbKey.insertAdjacentElement( 'beforeEnd' , _captionCaps );

        _keys.push( kbKey ) ;

        kbRow.insertAdjacentElement( 'beforeEnd' , kbKey );
      } );

      _rows.push( kbRow );
     } );

     _rows.forEach( ( keyboardRow ) => {
      this.keyboardKeys.insertAdjacentElement( 'beforeEnd' , keyboardRow );
     } );

    this.parentElement.insertAdjacentElement( 'afterBegin', this.keyboardInput );
    this.parentElement.insertAdjacentElement( 'beforeEnd', this.keyboardKeys );
    this.parentElement.addEventListener( 'keydown', this.commonListener );
    this.parentElement.addEventListener( 'keyup', this.commonListener );
    this.parentElement.addEventListener( 'keypress', null );
    this.parentElement.addEventListener( 'click', this.commonListener );


    // console.log( '#renderKeyboard finalizing, @renderKeys: \n' , this.keyboardKeys );

  } // renderKeyboard()

  findKeyCodeElement( aKeyCode ){

  }

  switchLanguage( newLanguage ){
    if( newLanguage == null ){

    } else {

    }

    this.renderKeyboard();

  }

  commonListener( evt ){
    evt.preventDefault;
    console.log( 'VirtualKeyboard #commonListener :\n ' );
    // console.log( '#commonListener @evt : \n', evt );
    console.log( '#commonListener event type : \n', evt.type );
    console.log( '#commonListener event target : \n', evt.target );

    let isKeyDownEvent = ( evt.type == 'keydown' );
    let isKeyUpEvent = ( evt.type == 'keyup' );
    let isPhysicalKeyboardEvent = isKeyDownEvent || isKeyUpEvent ;

    if( isPhysicalKeyboardEvent ){
      console.log( 'Physical keyboard event detected \n' );
      console.log( 'event.key: ', evt.key );
      console.log( 'event.code: ', evt.code );
      let keyCode = evt.code;
      let keyKey = evt.key;

      if( isKeyDownEvent ){

      }
      if( isKeyUpEvent ){

      }
    }

  }

  toggleShift( newState ){
    if( newState == null ){
      this.shiftState = !this.shiftState;
    } else {
      this.shiftState = newState;
    }

    this.renderKeyboard();
  }

  toggleCaps( newState ){
    if( newState == null ){
    this.capsState = !this.capsState
    } else {
      this.capsState = newState;
    }
    this.renderKeyboard();
  }



}

export { VirtualKeyboard as virtualKeyboard } ;
