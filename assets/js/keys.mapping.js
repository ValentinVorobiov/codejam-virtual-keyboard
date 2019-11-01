
const keyMappingEN = [

  { name: keyTilda, isFn: false, isLock: false, eventKey: 'Dead', eventCode: 'Backquote', char: '\`', charShift : '\~' },
  { name: key_1, isFn: false, isLock: false, eventCode: 'Digit1', char: '1', charShift : '!' },
  { name: key_2, isFn: false, isLock: false, eventCode: 'Digit2', char: '2', charShift : '@' },
  { name: key_3, isFn: false, isLock: false, eventCode: 'Digit3', char: '3', charShift : '#' },
  { name: key_4, isFn: false, isLock: false, eventCode: 'Digit4', char: '4', charShift : '$' },
  { name: key_5, isFn: false, isLock: false, eventCode: 'Digit5', char: '5', charShift : '%' },
  { name: key_6, isFn: false, isLock: false, eventCode: 'Digit6', char: '6', charShift : '^' },
  { name: key_7, isFn: false, isLock: false, eventCode: 'Digit7', char: '7', charShift : '&' },
  { name: key_8, isFn: false, isLock: false, eventCode: 'Digit8', char: '8', charShift : '*' },
  { name: key_9, isFn: false, isLock: false, eventCode: 'Digit9', char: '9', charShift : '(' },
  { name: key_0, isFn: false, isLock: false, eventCode: 'Digit0', char: '0', charShift : ')' },
  { name: key_minus, isFn: false, isLock: false, eventCode: 'Minus', char: '-', charShift : '_ ' },
  { name: key_equal, isFn: false, isLock: false, eventCode: 'Equal', char: '=', charShift : '+' },
  { name: key_backspace, isFn: true, isLock: false, eventCode: 'Backspace', eventType : 'removePrev' },

  { name: key_tab, isFn: false, isLock: false, eventCode: 'Tab', char: '    ', charShift : '    ' },
  { name: key_q, isFn: false, isLock: false, eventCode: 'KeyQ', char: 'q', charShift : 'Q' },
  { name: key_w, isFn: false, isLock: false, eventCode: 'KeyW', char: 'w', charShift : 'W' },
  { name: key_e, isFn: false, isLock: false, eventCode: 'KeyE', char: 'e', charShift : 'E' },
  { name: key_r, isFn: false, isLock: false, eventCode: 'KeyR', char: 'r', charShift : 'R' },
  { name: key_t, isFn: false, isLock: false, eventCode: 'KeyT', char: 't', charShift : 'T' },
  { name: key_y, isFn: false, isLock: false, eventCode: 'KeyY', char: 'y', charShift : 'Y' },
  { name: key_u, isFn: false, isLock: false, eventCode: 'KeyU', char: 'u', charShift : 'U' },
  { name: key_i, isFn: false, isLock: false, eventCode: 'KeyI', char: 'i', charShift : 'I' },
  { name: key_o, isFn: false, isLock: false, eventCode: 'KeyO', char: 'o', charShift : 'O' },
  { name: key_p, isFn: false, isLock: false, eventCode: 'KeyP', char: 'p', charShift : 'P' },
  { name: key_bracket_left, isFn: false, isLock: false, eventCode: 'BracketLeft', char: '[', charShift : '{' },
  { name: key_bracket_right, isFn: false, isLock: false, eventCode: 'BracketLeft', char: ']', charShift : '}' },
  { name: key_enter, isFn: false, isLock: false, eventCode: 'Enter', eventType: 'newLine' },

  { name: key_capslock, isFn: true, isLock: true, eventCode: 'CapsLock', eventType: 'toggleCaps' },

];

const keyMappingRu = [];

module.exports.keyMappingEN = keyMappingEN;
module.exports.keyMappingRU = keyMappingRU;
