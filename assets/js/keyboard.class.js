import { keyboardLayout } from './keyboard.layout.js';

import { keymapEN, keymapRU } from './keyboard.mapping.js';

function hasClass(el, className) {
  let result = false;
  if (el.getAttribute('class').indexOf(className) > -1) {
    result = true;
  }
  return result;
}

class VirtualKeyboard {
  constructor(parentElement, initLanguage) {
    // by default. setting language to EN
    if (initLanguage) {
      this.actualLanguage = initLanguage;
    } else {
      this.actualLanguage = 'EN';
    }
    this.keyboards = {
      'EN': { layout: keyboardLayout, mapping: keymapEN },
      'RU': { layout: keyboardLayout, mapping: keymapRU },
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

  clearRendered() {
    /*  Pre-requisites: removing existing elements  */
    const oldInputWrapper = this.parentElement.querySelector('.virtual-keyboard__input-wrapper');
    const oldLayoutWrapper = this.parentElement.querySelector('.virtual-keyboard__layout-wrapper');
    if (oldInputWrapper) { oldInputWrapper.remove(); }
    if (oldLayoutWrapper) { oldLayoutWrapper.remove(); }
    this.keyboardInput = null;
    this.keyboardKeys = null;
  }

  clearRenderedLayout() {
    const oldLayoutWrapper = this.parentElement.querySelector('.virtual-keyboard__layout-wrapper');
    if (oldLayoutWrapper) { oldLayoutWrapper.remove(); }
    this.keyboardKeys = null;
  }

  clearRenderedInput() {
    const oldInputWrapper = this.parentElement.querySelector('.virtual-keyboard__input-wrapper');
    if (oldInputWrapper) { oldInputWrapper.remove(); }
    this.keyboardInput = null;
  }

  renderInput() {
    this.clearRenderedInput();
    this.keyboardInput = document.createElement('div');
    this.keyboardInput.classList.add('virtual-keyboard__input-wrapper');

    this.textarea = document.createElement('textarea');
    this.textarea.classList.add('virtual-keyboard__input');
    this.textarea.setAttribute('rows', '25');
    this.textarea.setAttribute('cols', '80');
    this.textarea.value = this.strings.join('');
    this.keyboardInput.insertAdjacentElement('beforeEnd', this.textarea);

    const instance = this;

    this.keyboardInput.addEventListener('keydown', (event) => { this.inputListener.call(instance, event); });
    this.keyboardInput.addEventListener('keyup', (event) => { this.inputListener.call(instance, event); });
    this.keyboardInput.addEventListener('keypress', null);

    this.parentElement.insertAdjacentElement('beforeEnd', this.keyboardInput);
  }

  renderKeyboard() {
    this.clearRenderedLayout();
    this.keyboardKeys = document.createElement('div');
    this.keyboardKeys.classList.add('virtual-keyboard__layout-wrapper');
    if (this.shiftState) { this.keyboardKeys.classList.add('shift-on'); }
    if (this.capsState) { this.keyboardKeys.classList.add('caps-on'); }
    if (this.controlState) { this.keyboardKeys.classList.add('control-on'); }
    if (this.altState) { this.keyboardKeys.classList.add('alt-on'); }

    const keyboard = this.keyboards[this.actualLanguage];
    const rows = []; let itemIndex = 0;
    keyboard.layout.forEach((row) => {
      const kbRow = document.createElement('div');
      kbRow.classList.add('virtual-keyboard__layout-row');
      kbRow.classList.add('keyboard-row');
      // kbRow.classList.add('keyboard-row-' + i);
      const keys = [];

      row.forEach((keyName) => {
        itemIndex += 1;
        const aKey = keyboard.mapping[keyName];
        const kbKey = document.createElement('div');
        kbKey.classList.add('keyboard-key');
        // kbKey.classList.add('keyboard-key-' + itemIndex);
        kbKey.classList.add(keyName);
        kbKey.setAttribute('data-event-code', aKey.eventCode);
        kbKey.setAttribute('data-keyname', keyName);
        const captionRegular = document.createElement('span');
        captionRegular.classList.add('caption-span');
        captionRegular.classList.add('caption-normal');
        const captionShift = document.createElement('span');
        captionShift.classList.add('caption-span');
        captionShift.classList.add('caption-shift');
        const captionCaps = document.createElement('span');
        captionCaps.classList.add('caption-span');
        captionCaps.classList.add('caption-caps');

        if (aKey.isFn) {
          kbKey.classList.add('functional');
          if (aKey.isLock) { kbKey.classList.add('fn-locker'); }
          kbKey.setAttribute('data-command', aKey.eventType);
          captionRegular.innerHTML = aKey.char;
          captionShift.innerHTML = aKey.char;
          captionCaps.innerHTML = aKey.char;
        } else {
          captionRegular.innerHTML = aKey.char;
          captionShift.innerHTML = aKey.charShift;
          captionCaps.innerHTML = aKey.charCaps;
        }
        if (aKey.eventCode === 'Space') {
          captionRegular.innerHTML = 'Space';
          captionShift.innerHTML = 'Space';
          captionCaps.innerHTML = 'Space';
        }

        kbKey.insertAdjacentElement('beforeEnd', captionRegular);
        kbKey.insertAdjacentElement('beforeEnd', captionShift);
        kbKey.insertAdjacentElement('beforeEnd', captionCaps);

        keys.push(kbKey);

        kbRow.insertAdjacentElement('beforeEnd', kbKey);
      });

      rows.push(kbRow);
    });

    rows.forEach((keyboardRow) => {
      this.keyboardKeys.insertAdjacentElement('beforeEnd', keyboardRow);
    });

    const instance = this;

    this.keyboardKeys.addEventListener('click', (event) => { this.layoutListener.call(instance, event); });
    this.parentElement.insertAdjacentElement('beforeEnd', this.keyboardKeys);
  }

  renderAll() {
    this.renderInput();
    this.renderKeyboard();
  } // renderAll()

  findKeyCodeElement(aKeyCode) {
    let resultKey = null;
    const keysArray = this.keyboardKeys.querySelectorAll('.keyboard-key');
    keysArray.forEach((keyElement) => {
      if (keyElement.getAttribute('data-event-code').indexOf(aKeyCode) > -1) {
        resultKey = keyElement;
      }
    });
    return resultKey;
  }

  findKeyNameElement(aKeyName) {
    let resultKey = null;
    const keysArray = this.keyboardKeys.querySelectorAll('.keyboard-key');
    keysArray.forEach((keyElement) => {
      if (keyElement.getAttribute('data-keyname').indexOf(aKeyName) > -1) {
        resultKey = keyElement;
      }
    });
    return resultKey;
  }

  toggleLanguage(newLanguage) {
    if (newLanguage == null) {
      if (this.actualLanguage === 'RU') {
        this.actualLanguage = 'EN';
      } else {
        this.actualLanguage = 'RU';
      }
    } else {
      this.actualLanguage = newLanguage;
    }
    console.log('SWITCHED TO LANGUAGE: ', this.actualLanguage);
    this.renderKeyboard();
  }

  toggleShift(newState) {
    if (newState == null) {
      this.shiftState = !this.shiftState;
    } else {
      this.shiftState = newState;
    }

    if (this.shiftState) {
      this.keyboardKeys.classList.add('shift-on');
    } else {
      this.keyboardKeys.classList.remove('shift-on');
    }
  }

  toggleCaps(newState) {
    if (newState == null) {
      this.capsState = !this.capsState;
    } else {
      this.capsState = newState;
    }
    if (this.capsState) {
      this.keyboardKeys.classList.add('caps-on');
    } else {
      this.keyboardKeys.classList.remove('caps-on');
    }
    this.renderKeyboard();
  }

  toggleAlt(newState) {
    if (newState == null) {
      this.altState = !this.altState;
    } else {
      this.altState = newState;
    }

    if (this.altState) {
      this.keyboardKeys.classList.add('alt-on');
    } else {
      this.keyboardKeys.classList.remove('alt-on');
    }
  }

  toggleControl(newState) {
    if (newState == null) {
      this.controlState = !this.controlState;
    } else {
      this.controlState = newState;
    }

    if (this.controlState) {
      this.keyboardKeys.classList.add('control-on');
    } else {
      this.keyboardKeys.classList.remove('control-on');
    }
  }

  textareaInsert(stringToInsert) {
    let currValue = this.textarea.value;
    const selStart = this.textarea.selectionStart;
    const selEnd = this.textarea.selectionEnd;
    currValue = currValue.slice(0, selStart) + stringToInsert + currValue.slice(selEnd);
    this.textarea.value = currValue;
    const newSelIndex = selStart + stringToInsert.length;
    this.textarea.selectionStart = newSelIndex;
    this.textarea.selectionEnd = newSelIndex;
    this.cursorPosition = this.textarea.selectionStart;
    this.strings = currValue;
  }

  textareaRemovePrev() {
    let currValue = this.textarea.value;
    const initLength = currValue.length;
    const selStart = this.textarea.selectionStart;
    if (currValue && initLength && selStart > 0) {
      currValue = currValue.slice(0, selStart - 1) + currValue.slice(selStart, initLength - 1);
      this.textarea.value = currValue;
      this.textarea.selectionStart = selStart - 1;
      this.textarea.selectionEnd = selStart - 1;
      this.cursorPosition = this.textarea.selectionStart;
    }
  }

  textareaRemoveNext() {
    let currValue = this.textarea.value;
    const initLength = currValue.length;
    const selStart = this.textarea.selectionStart;
    if (currValue && initLength && selStart > 0 && selStart < initLength - 1) {
      currValue = currValue.slice(0, selStart) + currValue.slice(selStart + 1, initLength - 1);
      this.textarea.value = currValue;
      this.textarea.selectionStart = selStart;
      this.textarea.selectionEnd = selStart;
      this.cursorPosition = this.textarea.selectionStart;
    }
  }


  inputListener(event) {
    // evt.preventDefault();
    // console.log( 'VirtualKeyboard #inputListener :\n ' );
    // console.log('#inputListener @event: ', event);
    // console.log( '#inputListener @_instance: ', _instance );
    // console.log('#inputListener, @this:', this);

    const isKeyDownEvent = (event.type === 'keydown');
    const isKeyUpEvent = (event.type === 'keyup');
    const isPhysicalKeyboardEvent = isKeyDownEvent || isKeyUpEvent;
    const virtualKey = this.findKeyCodeElement.call(this, event.code);
    // console.log( '#inputListener, @virtualKey: ', virtualKey );
    this.eventHistory.push({ type: 'physical', fullEvent: event, virtKey: virtualKey });

    if (isPhysicalKeyboardEvent && virtualKey) {
      // console.log( 'Physical keyboard event detected \n' );
      // const keyCode = evt.code;
      // const keyKey = evt.key;
      const keyObjectName = virtualKey.getAttribute('data-keyname');
      const keyObject = this.keyboards[this.actualLanguage].mapping[keyObjectName];

      if (isKeyDownEvent) {
        // console.log( '#inputListener, Physical KeyDown Event...' );
        virtualKey.classList.add('active');
        if (keyObject.isFn) {
          const eventCommand = keyObject.eventType;
          switch (eventCommand) {
            case 'toggleShift':
              this.toggleShift(true);
              if (
                (this.shiftState && this.altState)
                || (this.shiftState && this.controlState)) {
                this.toggleLanguage();
              }
              break;
            case 'toggleAlt':
              this.toggleAlt(true);
              if (
                (this.shiftState && this.altState)
                || (this.shiftState && this.controlState)
              ) {
                this.toggleLanguage();
              }
              break;
            case 'toggleControl':
              this.toggleControl(true);
              if (
                (this.shiftState && this.altState)
                || (this.shiftState && this.controlState)
              ) {
                this.toggleLanguage();
              }
              break;
            case 'toggleCaps':
              this.toggleCaps(null);
              if (!this.capsState) {
                setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              } else {
                virtualKey.classList.add('active');
              }

              break;
            case 'insertTab':
              this.textareaInsert.call(this, '    ');
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              this.textarea.focus();
              break;
            default: break;
          } // switch
        }
        this.textarea.focus();
      }

      if (isKeyUpEvent) {
        // console.log( '#inputListener, Physical KeyUp Event...' );
        const textarea = this.keyboardInput.querySelector('.virtual-keyboard__input');
        // console.log( 'textarea element value: \n ', textarea.value );
        // console.log( 'textarea cursor position: \n', textarea.selectionStart );

        if (keyObject.isFn) {
          const eventCommand = keyObject.eventType;
          switch (eventCommand) {
            case 'toggleShift':
              this.toggleShift(false);
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            case 'toggleControl':
              this.toggleControl(false);
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            case 'toggleAlt':
              this.toggleAlt(false);
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            case 'removePrev':
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            case 'Tab':
              this.insertValue('    ');
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            case 'newLine':
              this.insertValue('\n');
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            case 'moveUp':
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            case 'movePrev':
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            case 'moveDown':
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            case 'moveNext':
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            case 'removeNext':
              setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
              break;
            default: break;
          } // switch
        } else {
          setTimeout(() => { virtualKey.classList.remove('active'); }, 250);
        }
      }
    } // physical keyboard event
  }

  layoutListener(event) {
    event.preventDefault();
    let eventTarget = event.target;
    // console.log( '#layoutListener, event target: ', evt.target );
    let keyObject = null;
    let virtualKey = null;
    if (hasClass(eventTarget, 'caption-span')) {
      eventTarget = eventTarget.closest('.keyboard-key');
    }
    // console.log( '#layoutListener, corrected event target: ', eventTarget );
    if (hasClass(eventTarget, 'keyboard-key')) {
      virtualKey = eventTarget;
      const keyName = eventTarget.getAttribute('data-keyname');
      keyObject = this.keyboards[this.actualLanguage].mapping[keyName];
      if (keyObject.isFn) {
        const eventCommand = keyObject.eventType;
        switch (eventCommand) {
          case 'insertTab':
            virtualKey.classList.add('active');
            this.textareaInsert('    ');
            setTimeout(() => { virtualKey.classList.remove('active'); }, 450);
            break;
          case 'removePrev':
            virtualKey.classList.add('active');
            this.textareaRemovePrev();
            setTimeout(() => { virtualKey.classList.remove('active'); }, 450);
            break;
          case 'removeNext':
            virtualKey.classList.add('active');
            this.textareaRemoveNext();
            setTimeout(() => { virtualKey.classList.remove('active'); }, 450);
            break;
          case 'newLine':
            virtualKey.classList.add('active');
            this.textareaInsert('\n');
            setTimeout(() => { virtualKey.classList.remove('active'); }, 450);
            break;
          case 'toggleCaps':
            this.toggleCaps(null);
            if (!this.capsState) {
              setTimeout(() => { virtualKey.classList.remove('active'); }, 450);
            } else {
              virtualKey.classList.add('active');
            }
            break;
          case 'toggleShift':
            this.toggleShift(null);
            if (this.shiftState) {
              virtualKey.classList.add('active');
            } else {
              const aLanguage = this.actualLanguage;
              const pairKeyObj = this.keyboards[aLanguage].mapping[keyObject.pairKey];
              let pairKey = this.findKeyCodeElement(pairKeyObj.eventCode);
              setTimeout(() => {
                if (hasClass(virtualKey, 'active')) { virtualKey.classList.remove('active'); }
                if (hasClass(pairKey, 'active')) { pairKey.classList.remove('active'); }
              }, 250);
            }
            if (
              (this.shiftState && this.altState)
              || (this.shiftState && this.controlState)
            ) {
              this.toggleLanguage();
            }
            break;
          case 'toggleControl':
            break;
          case 'toggleAlt':
            break;
          case 'movePrev':
            break;
          case 'moveNext':
            break;
          case 'moveUp':
            break;
          case 'moveDown':
            break;
          default: break;
        } // switch
      } else {
        let insertValue = keyObject.char;
        if (this.shiftState) { insertValue = keyObject.charShift; }
        if (this.capsState) { insertValue = keyObject.charCaps; }
        if (this.shiftState && this.capsState) { insertValue = keyObject.char; }
        // console.log( '#layoutListener, insertValue : ', insertValue );
        this.textareaInsert(insertValue);
        virtualKey.classList.add('active');
        setTimeout(() => { virtualKey.classList.remove('active'); }, 450);
      }
    } // if really on-screen key pressed
  } // layoutListener
}

export default VirtualKeyboard;
