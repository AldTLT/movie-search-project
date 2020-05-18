/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-destructuring */
import SpecialButton from './class/specialButton';
import SymbolButton from './class/symbolButton';
import { search } from './search';
import pageData from './pageData';
import getCalculatedMargin from './support';

// Input bar
const monitor = document.querySelector('.search__input');

// Buttons line 1
const LINE_1_BUTTONS = {
  Backquote: ['`', 'Ё'],
  Digit1: ['1', '1'],
  Digit2: ['2', '2'],
  Digit3: ['3', '3'],
  Digit4: ['4', '4'],
  Digit5: ['5', '5'],
  Digit6: ['6', '6'],
  Digit7: ['7', '7'],
  Digit8: ['8', '8'],
  Digit9: ['9', '9'],
  Digit0: ['0', '0'],
  Minus: ['-', '-'],
  Equal: ['+', '+'],
};

// Buttons line 2
const LINE_2_BUTTONS = {
  KeyQ: ['Q', 'Й'],
  KeyW: ['W', 'Ц'],
  KeyE: ['E', 'У'],
  KeyR: ['R', 'К'],
  KeyT: ['T', 'Е'],
  KeyY: ['Y', 'Н'],
  KeyU: ['U', 'Г'],
  KeyI: ['I', 'Ш'],
  KeyO: ['O', 'Щ'],
  KeyP: ['P', 'З'],
  BracketLeft: ['[', 'Х'],
  BracketRight: [']', 'Ъ'],
  Backslash: ['\\', '\\'],
};

// Buttons line 3
const LINE_3_BUTTONS = {
  KeyA: ['A', 'Ф'],
  KeyS: ['S', 'Ы'],
  KeyD: ['D', 'В'],
  KeyF: ['F', 'А'],
  KeyG: ['G', 'П'],
  KeyH: ['H', 'Р'],
  KeyJ: ['J', 'О'],
  KeyK: ['K', 'Л'],
  KeyL: ['L', 'Д'],
  Semicolon: [';', 'Ж'],
};

// Buttons line 4
const LINE_4_BUTTONS = {
  Quote: ['\'', 'Э'],
  KeyZ: ['Z', 'Я'],
  KeyX: ['X', 'Ч'],
  KeyC: ['C', 'С'],
  KeyV: ['V', 'М'],
  KeyB: ['B', 'И'],
  KeyN: ['N', 'Т'],
  KeyM: ['M', 'Ь'],
  Comma: [',', 'Б'],
  Period: ['.', 'Ю'],
  Slash: ['/', '.'],
};

// Set cursor position from pageData
function setCursorPosition() {
  monitor.selectionStart = pageData.cursorPosition;
  monitor.selectionEnd = pageData.cursorPosition;
}

// Save position of the sursor in input
function saveCursorPosition() {
  pageData.cursorPosition = monitor.selectionStart;
}

// Function changes the language
function changeLanguage() {
  const keyButtons = document.querySelectorAll('.symbol-keyboard-button');
  keyButtons.forEach((keyButton) => {
    const newButton = keyButton;
    const text = newButton.innerText;
    newButton.innerText = newButton.value;
    newButton.value = text;
  });

  const language = document.querySelector('#Lang');
  language.textContent = language.textContent === 'EN' ? 'RU' : 'EN';
}

// The function implements special key buttons click
function makeSpecialButtonFunction(keyButton) {
  const keyId = keyButton.id;

  switch (keyId) {
    case 'Backspace': {
      const text = monitor.value.split('');
      const removeNumber = pageData.cursorPosition > 0 ? 1 : 0;
      text.splice(pageData.cursorPosition - 1, removeNumber);
      pageData.cursorPosition = (pageData.cursorPosition - 1) < 0 ? 0 : pageData.cursorPosition - 1;
      monitor.value = text.join('');

      setCursorPosition();
      break;
    }
    case 'Delete': {
      const text = monitor.value.split('');
      text.splice(pageData.cursorPosition, 1);
      monitor.value = text.join('');

      setCursorPosition();
      break;
    }
    case 'Enter': {
      const input = document.querySelector('.search__input');
      if (input.value) {
        search();
        // eslint-disable-next-line no-use-before-define
        toggleKeyboardEvents();
      }
      break;
    }
    case 'ArrowLeft': {
      const cursor = monitor.selectionStart;
      monitor.selectionStart = cursor === 0 ? 0 : cursor - 1;
      monitor.selectionEnd = monitor.selectionStart;

      saveCursorPosition();
      break;
    }
    case 'ArrowRight': {
      monitor.selectionStart += 1;
      monitor.selectionEnd = monitor.selectionStart;

      saveCursorPosition();
      break;
    }
    case 'Lang': {
      changeLanguage();
      break;
    }
    default: {
      break;
    }
  }
}

// The function adds symbol to textarea
function inputData(symbol) {
  const cursor = monitor.selectionStart;
  const textBefore = monitor.value.substring(0, cursor);
  const textAfter = monitor.value.substring(cursor);
  monitor.value = textBefore + symbol + textAfter;
  pageData.cursorPosition += 1;
  setCursorPosition();
}

// Compute scaleX to transform key button
function buttonScaleTransform(keyButton) {
  const newKeyButton = keyButton;
  let { width } = window.getComputedStyle(newKeyButton);
  width = width.substring(0, width.length - 2);
  const scaleX = 1 - (4 / width).toFixed(3);
  newKeyButton.style.transform = `scale(${scaleX}, 0.9)`;
}

// The function applies the style to the pressed key-button
function keyButtonPressed(keyButton) {
  if (keyButton.classList.contains('symbol-keyboard-button')) {
    const symbol = keyButton.id === 'Space' ? ' ' : keyButton.innerText;
    inputData(symbol);
  }

  if (keyButton.classList.contains('special-keyboard-button')) {
    makeSpecialButtonFunction(keyButton);
  }

  keyButton.classList.add('keyboard-button-active');
  buttonScaleTransform(keyButton);
}

// The function applies the style to the released key-button
function keyButtonReleased(keyButton) {
  keyButton.classList.remove('keyboard-button-active');
  const newKeyButton = keyButton;
  newKeyButton.style.transform = 'none';
  monitor.focus();
}

// Event mouse button down
function onMouseDown(event) {
  keyButtonPressed(event.target);
}

// Event key button down
function onKeyDown(event) {
  event.preventDefault();
  const keyButton = document.querySelector(`#${event.code}`);
  if (keyButton) {
    keyButtonPressed(keyButton);
  }
}

// Event mouse button up
function onMouseUp(event) {
  keyButtonReleased(event.target);
}

// Event key button down
function onKeyUp(event) {
  event.preventDefault();
  const keyButton = document.querySelector(`#${event.code}`);

  if (keyButton) {
    keyButtonReleased(keyButton);
  }
}

// Event mouse leave a target
function onMouseOut(event) {
  keyButtonReleased(event.target);
}

// Function returns the key-button.
function getKey(id, keyText) {
  let text = null;
  let value = null;
  if (localStorage.getItem('language') === 'en') {
    text = keyText[0];
    value = keyText[1];
  } else {
    text = keyText[1];
    value = keyText[0];
  }

  const keyButton = document.createElement('button', 'symbol-key-button');
  keyButton.id = id;
  keyButton.innerText = text.toLowerCase();
  keyButton.value = value.toLowerCase();
  return keyButton;
}

// Function creates key-buttons from object and appends to page.
function createKeys(keys, domElement) {
  for (const key in keys) {
    const keyButton = getKey(key, keys[key]);
    domElement.append(keyButton);
  }
}

// Function creates a functional key-button and appends to page.
function createSpecialKey(key, text, domElement, length) {
  const keyButton = document.createElement('button', 'special-key-button');
  domElement.append(keyButton);
  keyButton.id = key;
  keyButton.innerText = text;
  keyButton.style.gridColumn = length !== undefined ? `span ${length}` : 'span 2';
}

// Add keys to keyboard
function addKeys(keyboard) {
  // Line buttons 1
  createKeys(LINE_1_BUTTONS, keyboard);
  // Line buttons 2
  createKeys(LINE_2_BUTTONS, keyboard);
  // Line buttons 3
  createKeys(LINE_3_BUTTONS, keyboard);
  createSpecialKey('Backspace', 'Back.', keyboard, 4);
  // Line buttons 4
  createKeys(LINE_4_BUTTONS, keyboard);
  createSpecialKey('Delete', 'Del', keyboard, 3);
  // Line buttons 5
  createSpecialKey('Lang', 'RU', keyboard, 4);
  keyboard.append(getKey('Space', [' ', ' '], 11));
  createSpecialKey('ArrowLeft', '◄', keyboard);
  createSpecialKey('ArrowRight', '►', keyboard);
  createSpecialKey('Enter', 'Enter', keyboard, 5);
}

// Add or remove events
export function toggleKeyboardEvents() {
  const keyboard = document.querySelector('.wrapper-keyboard');

  if (keyboard.classList.contains('keyboard-move-in')) {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  } else {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  }
}

// Create keyboard
export function createKeyboard() {
  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper-keyboard';

  // Create keyboard
  const keyboard = document.createElement('div');
  keyboard.className = 'keyboard';
  wrapper.append(keyboard);

  // Append wrapper
  document.querySelector('.search').append(wrapper);
  document.querySelector('.search__input').focus();

  customElements.define('symbol-key-button', SymbolButton, { extends: 'button' });
  customElements.define('special-key-button', SpecialButton, { extends: 'button' });

  addKeys(keyboard);

  wrapper.style.left = getCalculatedMargin(wrapper);

  document.querySelectorAll('.keyboard-button')
    .forEach((keyButton) => {
      keyButton.addEventListener('mousedown', onMouseDown);
      keyButton.addEventListener('mouseup', onMouseUp);
      keyButton.addEventListener('mouseout', onMouseOut);
    });
}
