import KeyButton from './button';

// The class represents alpha-numeric key-button.
export default class SymbolButton extends KeyButton {
  constructor() {
    super();
    this.classList.add('symbol-keyboard-button');
  }
}
