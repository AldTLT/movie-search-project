import getCalculatedMargin from './support';

// The function adds message
export function addMessage(message, request) {
  const messageContainer = document.querySelector('.message-container');
  const p = document.createElement('p');
  p.classList.add('message');
  p.textContent = message;

  if (request) {
    p.classList.add('request');
  }

  messageContainer.append(p);
}

// The function sets left position of the message report
export function setMessageContainerPosition() {
  const message = document.querySelector('.message-container');
  message.style.left = getCalculatedMargin(message);
}
