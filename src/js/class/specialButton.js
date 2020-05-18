import KeyButton from './button';

// The class represents special key-button.
export default class SpecialButton extends KeyButton {
  constructor() {
    super();
    this.classList.add('special-keyboard-button');
  }
}
