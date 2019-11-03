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
    this.strings = [];
    this.parentElement = parentElement;
    this.shiftState = false;
    this.capsState = false;
    this.altState = false;
    this.controlState = false;
    this.cursorPosition = 0;

    this.renderInput();
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

  clearRenderedLayout( ){
    let oldLayoutWrapper = this.parentElement.querySelector( '.virtual-keyboard__layout-wrapper' );
    if( oldLayoutWrapper ){ oldLayoutWrapper.remove() ; }
    this.keyboardKeys = null;
   }

  clearRenderedInput(){
    let oldInputWrapper = this.parentElement.querySelector( '.virtual-keyboard__input-wrapper' );
    if( oldInputWrapper ){ oldInputWrapper.remove(); }
    this.keyboardInput = null;
  }

  renderInput(  ){

    this.clearRenderedInput();
    this.keyboardInput = document.createElement( 'div' );
    this.keyboardInput.classList.add( 'virtual-keyboard__input-wrapper' );

    this.textarea = document.createElement( 'textarea' );
    this.textarea.classList.add( 'virtual-keyboard__input' );
    this.textarea.setAttribute( "rows", "25" );
    this.textarea.setAttribute( "cols" , "80" );
    this.textarea.value = this.strings.join( '' );
    this.keyboardInput.insertAdjacentElement( 'beforeEnd' , this.textarea );

    let _instance = this;
    this.keyboardInput.addEventListener( 'keydown', this.inputListener.bind( event, _instance ) );
    this.keyboardInput.addEventListener( 'keyup', this.inputListener.bind( event, _instance ) );
    this.keyboardInput.addEventListener( 'keypress', null );

    this.parentElement.insertAdjacentElement( 'beforeEnd', this.keyboardInput );

  };

  renderKeyboard(  ){
    this.clearRenderedLayout();
    this.keyboardKeys = document.createElement( 'div' );
    this.keyboardKeys.classList.add( 'virtual-keyboard__layout-wrapper' );
    if( this.shiftState ){ this.keyboardKeys.classList.add( 'shift-on' ); }
    if( this.capsState ){ this.keyboardKeys.classList.add( 'caps-on' ); }
    if( this.controlState ){ this.keyboardKeys.classList.add( 'control-on' ); }
    if( this.altState ){ this.keyboardKeys.classList.add( 'alt-on' ); }

    let _keyboard =  this.keyboards[ this.actualLanguage ];
    let _rows = []; let itemIndex = 0;

    _keyboard.layout.forEach( ( row, i ) => {

      let kbRow = document.createElement( 'div' );
          kbRow.classList.add( 'virtual-keyboard__layout-row' );
          kbRow.classList.add( 'keyboard-row' );
          kbRow.classList.add( 'keyboard-row-'+i );
          let _keys = [];

      row.forEach( (keyName , j) => {

        itemIndex +=1;
        let _key = _keyboard.mapping[ keyName ];
        let kbKey = document.createElement( 'div' );
            kbKey.classList.add( 'keyboard-key' );
            kbKey.classList.add( 'keyboard-key-'+itemIndex );
            kbKey.classList.add( keyName );
            kbKey.setAttribute( 'data-event-code' , _key.eventCode );
            kbKey.setAttribute( 'data-keyname' , keyName );
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

    let _instance = this;

    this.keyboardKeys.addEventListener( 'click', this.layoutListener.bind( event, _instance ) );
    this.parentElement.insertAdjacentElement( 'beforeEnd', this.keyboardKeys );


  };

  renderAll(   ){
    this.renderInput();
    this.renderKeyboard();
  } // renderAll()

  findKeyCodeElement( aKeyCode ){
    let resultKey = null;

    let keysArray = this.keyboardKeys.querySelectorAll( '.keyboard-key' );
    keysArray.forEach( (keyElement) => {
        if( keyElement.getAttribute( 'data-event-code' ).indexOf( aKeyCode ) > -1 ){
            resultKey = keyElement;
        }
    } );

    // resultKey = this.keyboardKeys.querySelector( '[data-event-code]="'+aKeyCode+'"' );

    return resultKey;
  }

  toggleLanguage( newLanguage ){
    if( newLanguage == null ){
      if( this.actualLanguage == 'RU' ){
        this.actualLanguage = 'EN'
      } else {
        this.actualLanguage = 'RU'
      }
    } else {
      this.actualLanguage = newLanguage;
    }
    console.log( 'SWITCHED TO LANGUAGE: ', this.actualLanguage );
    this.renderKeyboard();
  }

  toggleShift( newState ){

    if( newState == null ){
      this.shiftState = !this.shiftState;
    } else {
      this.shiftState = newState;
    }

    if( this.shiftState ){
      this.keyboardKeys.classList.add( 'shift-on' );
    } else {
      this.keyboardKeys.classList.remove( 'shift-on' );
    }
  }

  toggleCaps( newState ){
    if( newState == null ){
      this.capsState = !this.capsState
    } else {
      this.capsState = newState;
    }

    this.renderKeyboard();

  }

  toggleAlt( newState ){
    if( newState == null ){
      this.altState = !this.altState;
    } else {
      this.altState = newState;
    }
  }

  toggleControl( newState ){
    if( newState == null ){
      this.controlState = !this.controlState;
    } else {
      this.controlState = newState;
    }
  }



  inputListener( _instance, evt ){
    evt.preventDefault;
    console.log( 'VirtualKeyboard #inputListener :\n ' );
    console.log( '#inputListener @event: ', evt );
    console.log( '#inputListener @_instance: ', _instance );

    let isKeyDownEvent = ( evt.type == 'keydown' );
    let isKeyUpEvent = ( evt.type == 'keyup' );
    let isPhysicalKeyboardEvent = isKeyDownEvent || isKeyUpEvent ;
    let virtualKey = _instance.findKeyCodeElement.call( _instance, evt.code );
    console.log( '#inputListener, @virtualKey: ', virtualKey );
    _instance.eventHistory.push( { type: 'physical', fullEvent: evt, virtualKey : virtualKey } );

    if( isPhysicalKeyboardEvent && virtualKey ){
      console.log( 'Physical keyboard event detected \n' );
      let keyCode = evt.code;
      let keyKey = evt.key;
      let keyObjectName = virtualKey.getAttribute( 'data-keyname' );
      let keyObject = _instance.keyboards[ _instance.actualLanguage ].mapping[ keyObjectName ];

      if( isKeyDownEvent ){

        console.log( '#inputListener, Physical KeyDown Event...' );
        virtualKey.classList.add( 'active' );
        if( keyObject.isFn ){
          let eventCommand = keyObject.eventType;
          switch ( eventCommand ){
            case 'toggleShift' :
              _instance.toggleShift.call( _instance, true );
              if( _instance.shiftState && _instance.altState ||
                _instance.shiftState && _instance.controlState ) {
                _instance.toggleLanguage.call( _instance );
              }
              break;
            case 'toggleAlt' :
              _instance.toggleAlt.call( _instance, true );
              if( _instance.shiftState && _instance.altState ||
                _instance.shiftState && _instance.controlState ) {
                _instance.toggleLanguage.call( _instance );
              }
              break;
            case 'toggleControl' :
              _instance.toggleControl.call( _instance, true );
              if( _instance.shiftState && _instance.altState ||
                _instance.shiftState && _instance.controlState ) {
                _instance.toggleLanguage.call( _instance );
              }
              break;
            case 'toggleCaps' :
              _instance.toggleCaps.call( _instance, null );
              console.log( '#inputListener, instance capsState after change : ', _instance.capsState );
              if( ! _instance.capsState ) {
                  setTimeout( () => { virtualKey.classList.remove( 'active' ) } , 250 );
                }
            break;
            default: break;
          } // switch
        }
        _instance.textarea.focus();

      }

      if( isKeyUpEvent ){
        console.log( '#inputListener, Physical KeyUp Event...' );
        let textarea = _instance.keyboardInput.querySelector( '.virtual-keyboard__input' );
        console.log( 'textarea element value: \n ', textarea.value );
        console.log( 'textarea cursor position: \n', textarea.selectionStart );

        if( keyObject.isFn ){
            let eventCommand = keyObject.eventType;
            switch ( eventCommand ) {
                case 'toggleShift' :
                    _instance.toggleShift.call( _instance, false );
                    setTimeout( () => { virtualKey.classList.remove( 'active' ) } , 250 );
                break ;
                case 'toggleControl' :
                    _instance.toggleControl.call( _instance, false ) ;
                    setTimeout( () => { virtualKey.classList.remove( 'active' ) } , 250 );
                break ;
                case 'toggleAlt' :
                  _instance.toggleShift.call( _instance, false ) ;
                  setTimeout( () => { virtualKey.classList.remove( 'active' ) } , 250 );
                break;
                case 'removePrev' :
                  setTimeout( () => { virtualKey.classList.remove( 'active' ) } , 250 );
                break;
                case 'Tab':
                  setTimeout( () => { virtualKey.classList.remove( 'active' ) } , 250 );
                break;
                case 'newLine' :
                  setTimeout( () => { virtualKey.classList.remove( 'active' ) } , 250 );
                break;

            } // switch
        } else {
            setTimeout( () => { virtualKey.classList.remove( 'active' ) } , 250 );
        }

      }
    } // physical keyboard event

  }

  layoutListener( _instance, evt ){

  }


}

export { VirtualKeyboard as virtualKeyboard } ;
