/* eslint-disable import/extensions */
import keyboardLayout from './keyboard.layout.js';

import { keymapEN, keymapRU } from './keyboard.mapping.js';

function hasClass(el, className) {
  let result = false;
  if (el.getAttribute('class').indexOf(className) > -1) {
    result = true;
  }
  return result;
}

function deactivateKey(keyElement, delay = 250) {
  let changed = false;
  if (hasClass(keyElement, 'active')) {
    changed = true;
    setTimeout(() => { keyElement.classList.remove('active'); }, delay);
  }
  return changed;
}

function activateKey(keyElement) {
  let changed = false;
  if (!hasClass(keyElement, 'active')) {
    keyElement.classList.add('active');
    changed = true;
  }
  return changed;
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
      // eslint-disable-next-line quote-props
      'EN': { layout: keyboardLayout, mapping: keymapEN },
      // eslint-disable-next-line quote-props
      'RU': { layout: keyboardLayout, mapping: keymapRU },
    };
    this.eventHistory = [];
    this.fnHistory = [];
    this.strings = [];
    this.parentElement = parentElement;
    this.shiftState = false;
    this.capsState = false;
    this.altState = false;
    this.controlState = false;
    this.cursorPosition = 0;
    this.readFromStorage();

    this.renderInput();
    this.renderKeyboard();

    this.textarea.focus();
  }

  saveToStorage() {
    const saveData = JSON.stringify({
      actualLanguage: this.actualLanguage,
      strings: this.strings.slice(),
      inputValue: this.textarea.value.slice(),
      cursorPosition: this.textarea.selectionStart,
      states: {
        capsState: this.capsState,
      },
    });
    localStorage['rs-virtkey'] = saveData;
  }

  readFromStorage() {
    let imported = false;
    if (localStorage['rs-virtkey']) {
      imported = true;
      const importedState = JSON.parse(localStorage['rs-virtkey']);
      this.actualLanguage = importedState.actualLanguage;
      this.strings = importedState.strings.slice();
      this.capsState = importedState.states.capsState;
      this.cursorPosition = importedState.cursorPosition;
    }
    return imported;
  }

  clearRendered() {
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
    this.textarea.value = this.strings.join('\n');
    this.textarea.setAttribute('rows', '25');
    this.textarea.setAttribute('cols', '80');
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
    const rows = [];
    keyboard.layout.forEach((row) => {
      const kbRow = document.createElement('div');
      kbRow.classList.add('virtual-keyboard__layout-row');
      kbRow.classList.add('keyboard-row');
      const keys = [];

      row.forEach((keyName) => {
        const aKey = keyboard.mapping[keyName];
        const kbKey = document.createElement('div');
        kbKey.classList.add('keyboard-key');
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
        if (aKey.eventCode === 'CapsLock') {
          if (this.capsState) { kbKey.classList.add('active'); }
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
  }

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
    this.shiftState = false;
    this.altState = false;
    this.controlState = false;
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
      currValue = currValue.slice(0, selStart - 1) + currValue.slice(selStart, initLength);
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

  textareaMoveNext() {
    if (
      this.textarea.value
      && this.textarea.selectionStart < this.textarea.value.length - 1
    ) {
      this.textarea.selectionStart += 1;
      this.textarea.selectionEnd = this.textarea.selectionStart;
    }
  }

  textareaMovePrev() {
    if (this.textarea.selectionStart > 0 && this.textarea.value) {
      this.textarea.selectionStart -= 1;
      this.textarea.selectionEnd = this.textarea.selectionStart;
    }
  }

  textareaMoveUp() {
    this.currentPosition = this.textarea.selectionStart;
    this.strings = this.textarea.value.split('\n');
    let beforeString = this.textarea.value.slice(0, this.currentPosition);
    let beforeArray = [];
    beforeArray = beforeString.split('\n');

    if (beforeArray.length > 1) {
      const lastStringIndex = beforeArray[beforeArray.length - 1].length;
      const prevStringLength = beforeArray[beforeArray.length - 2].length;
      let newIndex = 0;
      if (lastStringIndex >= prevStringLength) {
        newIndex = prevStringLength;
      } else {
        newIndex = lastStringIndex;
      }
      beforeArray.pop();
      let newLastString = beforeArray[beforeArray.length - 1];
      newLastString = newLastString.slice(0, newIndex);
      beforeArray[beforeArray.length - 1] = newLastString;
      beforeString = beforeArray.join('\n');
      this.currentPosition = beforeString.length;
      this.textarea.selectionStart = this.currentPosition;
      this.textarea.selectionEnd = this.currentPosition;
    } else {
      this.textarea.selectionStart = 0;
      this.textarea.selectionEnd = 0;
    }
  }

  textareaMoveDown() {
    this.currentPosition = this.textarea.selectionStart;
    this.strings = this.textarea.value.split('\n');
    let beforeString = this.textarea.value.slice(0, this.currentPosition);
    let beforeArray = [];
    beforeArray = beforeString.split('\n');

    if (beforeArray.length < this.strings.length) {
      const initStrCount = beforeArray.length;
      const lastStringIndex = beforeArray[beforeArray.length - 1].length;
      const nextStringLength = this.strings[beforeArray.length].length;
      let newIndex = 0;
      if (lastStringIndex >= nextStringLength) {
        newIndex = nextStringLength;
      } else {
        newIndex = lastStringIndex;
      }
      beforeArray.pop();
      beforeArray.push(this.strings[initStrCount - 1]);
      beforeArray.push(this.strings[initStrCount]);
      let newLastString = beforeArray[beforeArray.length - 1];
      newLastString = newLastString.slice(0, newIndex);
      beforeArray[beforeArray.length - 1] = newLastString;
      beforeString = beforeArray.join('\n');
      this.currentPosition = beforeString.length;
      this.textarea.selectionStart = this.currentPosition;
      this.textarea.selectionEnd = this.currentPosition;
    } else {
      this.textarea.selectionStart = 0;
      this.textarea.selectionEnd = 0;
    }
  }


  inputListener(event) {
    const isKeyDownEvent = (event.type === 'keydown');
    const isKeyUpEvent = (event.type === 'keyup');
    const isPhysicalKeyboardEvent = isKeyDownEvent || isKeyUpEvent;
    const virtualKey = this.findKeyCodeElement.call(this, event.code);

    this.eventHistory.push({
      type: 'physicalKey',
      fullEvent: event,
      virtKey: virtualKey,
      initStates: {
        shiftState: this.shiftState,
        capsState: this.capsState,
        altState: this.altState,
        controlState: this.controlState,
      },
      textareaState: {
        selStart: this.textarea.selectionStart,
        selEnd: this.textarea.selectionEnd,
        text: this.textarea.value,
      },
      strings: this.strings,
    });

    if (isPhysicalKeyboardEvent && virtualKey) {
      const keyObjectName = virtualKey.getAttribute('data-keyname');
      const keyObject = this.keyboards[this.actualLanguage].mapping[keyObjectName];

      if (isKeyDownEvent) {
        if (keyObject.isFn) {
          const eventCommand = keyObject.eventType;
          switch (eventCommand) {
            case 'toggleShift':
              if (!this.shiftState) {
                this.toggleShift(true);
              }
              activateKey(virtualKey);
              if (
                (this.shiftState && this.altState)
                || (this.shiftState && this.controlState)) {
                this.toggleLanguage();
              }
              break;
            case 'toggleAlt':
              if (!this.altState) {
                this.toggleAlt(true);
              }
              activateKey(virtualKey);
              if (
                (this.shiftState && this.altState)
                || (this.shiftState && this.controlState)
              ) {
                this.toggleLanguage();
              }
              break;
            case 'toggleControl':
              if (!this.controlState) {
                this.toggleControl(true);
              }
              activateKey(virtualKey);
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
                deactivateKey(virtualKey);
              } else {
                activateKey(virtualKey);
              }
              break;
            case 'insertTab':
              this.textareaInsert.call(this, '    ');
              activateKey(virtualKey);
              this.textarea.focus();
              deactivateKey(virtualKey);
              break;
            case 'moveUp':
              activateKey(virtualKey);
              break;
            case 'movePrev':
              activateKey(virtualKey);
              break;
            case 'moveDown':
              activateKey(virtualKey);
              break;
            case 'moveNext':
              activateKey(virtualKey);
              break;
            case 'removeNext':
              activateKey(virtualKey);
              break;
            case 'removePrev':
              activateKey(virtualKey);
              break;
            default: break;
          } // switch
          this.fnHistory.push({
            type: 'physicalKey',
            eventType: event.type,
            virtKey: virtualKey,
            keyObj: keyObject,
          });
        } else {
          activateKey(virtualKey);
        }
        this.textarea.focus();
      }

      if (isKeyUpEvent) {
        if (keyObject.isFn) {
          const eventCommand = keyObject.eventType;
          switch (eventCommand) {
            case 'toggleShift':
              if (this.shiftState) { this.toggleShift(false); }
              deactivateKey(virtualKey);
              break;
            case 'toggleControl':
              if (this.controlState) { this.toggleControl(false); }
              deactivateKey(virtualKey);
              break;
            case 'toggleAlt':
              if (this.altState) { this.toggleAlt(false); }
              deactivateKey(virtualKey);
              break;
            case 'removePrev':
              deactivateKey(virtualKey);
              break;
            case 'Tab':
              this.textareaInsert('    ');
              deactivateKey(virtualKey);
              break;
            case 'newLine':
              deactivateKey(virtualKey);
              break;
            case 'moveUp':
              deactivateKey(virtualKey);
              break;
            case 'movePrev':
              deactivateKey(virtualKey);
              break;
            case 'moveDown':
              deactivateKey(virtualKey);
              break;
            case 'moveNext':
              deactivateKey(virtualKey);
              break;
            case 'removeNext':
              deactivateKey(virtualKey);
              break;
            default: break;
          } // switch
          this.fnHistory.push({
            type: 'physicalKey',
            eventType: event.type,
            virtKey: virtualKey,
            keyObj: keyObject,
          });
        } else {
          if (this.capsState) {
            const currentPosition = this.textarea.selectionStart - 1;
            let modString = this.textarea.value;
            const initLenght = modString.length;
            const currentChar = modString[currentPosition];
            const newChar = currentChar.toLocaleUpperCase();
            modString = modString.slice(0, currentPosition)
            + newChar
            + modString.slice(currentPosition + 1, initLenght - 1);
            this.textarea.value = modString;
          }
          deactivateKey(virtualKey);
        }
      }

      this.strings = this.textarea.value.split('\n');
      this.saveToStorage();
    } // physical keyboard event
  }

  layoutListener(event) {
    event.preventDefault();
    let eventTarget = event.target;
    let keyObject = null;
    let virtualKey = null;
    if (hasClass(eventTarget, 'caption-span')) {
      eventTarget = eventTarget.closest('.keyboard-key');
    }
    if (hasClass(eventTarget, 'keyboard-key')) {
      virtualKey = eventTarget;
      const keyName = eventTarget.getAttribute('data-keyname');
      keyObject = this.keyboards[this.actualLanguage].mapping[keyName];
      this.eventHistory.push({
        type: 'virtualKeyBefore',
        fullEvent: event,
        virtKey: virtualKey,
        initStates: {
          shiftState: this.shiftState,
          capsState: this.capsState,
          altState: this.altState,
          controlState: this.controlState,
        },
        textareaState: {
          selStart: this.textarea.selectionStart,
          selEnd: this.textarea.selectionEnd,
          text: this.textarea.value,
        },
        strings: this.strings,
      });
      if (keyObject.isFn) {
        const eventCommand = keyObject.eventType;
        switch (eventCommand) {
          case 'insertTab':
            virtualKey.classList.add('active');
            this.textareaInsert('    ');
            deactivateKey(virtualKey, 450);
            break;
          case 'removePrev':
            virtualKey.classList.add('active');
            this.textareaRemovePrev();
            deactivateKey(virtualKey, 450);
            break;
          case 'removeNext':
            virtualKey.classList.add('active');
            this.textareaRemoveNext();
            deactivateKey(virtualKey, 450);
            break;
          case 'newLine':
            virtualKey.classList.add('active');
            this.textareaInsert('\n');
            deactivateKey(virtualKey, 450);
            break;
          case 'toggleCaps':
            this.toggleCaps(null);
            if (!this.capsState) {
              deactivateKey(virtualKey, 450);
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
              const pairKey = this.findKeyCodeElement(pairKeyObj.eventCode);
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
            this.toggleControl(null);
            if (this.controlState) {
              virtualKey.classList.add('active');
            } else {
              const aLanguage = this.actualLanguage;
              const pairKeyObj = this.keyboards[aLanguage].mapping[keyObject.pairKey];
              const pairKey = this.findKeyCodeElement(pairKeyObj.eventCode);
              setTimeout(() => {
                if (hasClass(virtualKey, 'active')) { virtualKey.classList.remove('active'); }
                if (hasClass(pairKey, 'active')) { pairKey.classList.remove('active'); }
              }, 250);
            }
            if (this.shiftState && this.controlState) {
              this.toggleLanguage();
            }
            break;
          case 'toggleAlt':
            this.toggleAlt(null);
            if (this.altState) {
              virtualKey.classList.add('active');
            } else {
              const aLanguage = this.actualLanguage;
              const pairKeyObj = this.keyboards[aLanguage].mapping[keyObject.pairKey];
              const pairKey = this.findKeyCodeElement(pairKeyObj.eventCode);
              setTimeout(() => {
                if (hasClass(virtualKey, 'active')) { virtualKey.classList.remove('active'); }
                if (hasClass(pairKey, 'active')) { pairKey.classList.remove('active'); }
              }, 250);
            }
            if ((this.shiftState && this.altState)) {
              this.toggleLanguage();
            }
            break;
          case 'movePrev':
            activateKey(virtualKey);
            this.textareaMoveNext();
            deactivateKey(virtualKey, 450);
            break;
          case 'moveNext':
            activateKey(virtualKey);
            this.textareaMoveNext();
            deactivateKey(virtualKey, 450);
            break;
          case 'moveUp':
            activateKey(virtualKey);
            this.textareaMoveUp();
            deactivateKey(virtualKey, 450);
            break;
          case 'moveDown':
            activateKey(virtualKey);
            this.textareaMoveDown();
            deactivateKey(virtualKey, 450);
            break;
          case 'toggleWin':
            activateKey(virtualKey);
            deactivateKey(virtualKey, 450);
            break;
          default: break;
        } // switch
      } else {
        let insertValue = keyObject.char;
        if (this.shiftState) { insertValue = keyObject.charShift; }
        if (this.capsState) { insertValue = keyObject.charCaps; }
        if (this.shiftState && this.capsState) { insertValue = keyObject.char; }
        this.textareaInsert(insertValue);
        virtualKey.classList.add('active');
        setTimeout(() => { virtualKey.classList.remove('active'); }, 450);
      }
      this.strings = this.textarea.value.split('\n');
      this.eventHistory.push({
        type: 'virtualKeyAfter',
        fullEvent: event,
        virtKey: virtualKey,
        initStates: {
          shiftState: this.shiftState,
          capsState: this.capsState,
          altState: this.altState,
          controlState: this.controlState,
        },
        textareaState: {
          selStart: this.textarea.selectionStart,
          selEnd: this.textarea.selectionEnd,
          text: this.textarea.value,
        },
        strings: this.strings,
      });
    } // if really on-screen key pressed
    this.saveToStorage();
  } // layoutListener
}

export default VirtualKeyboard;
