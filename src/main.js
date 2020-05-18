/* eslint-disable import/no-unresolved */
// Styles
import '@sass/style.scss';
// Font NotoSansKR
import '@sass/NotoSansKR.css';

import { initSlides } from './js/swiper';
import { clearSearch, search, setSearchInfoPosition } from './js/search';
import { createKeyboard, toggleKeyboardEvents } from './js/keyboard';
import getCalculatedMargin from './js/support';
import pageData from './js/pageData';
import { setMessageContainerPosition } from './js/apiMessage';

initSlides();
createKeyboard();
setMessageContainerPosition();
setSearchInfoPosition();

function clearSearchClickHandler() {
  clearSearch();
}

function searchHandler() {
  const input = document.querySelector('.search__input');
  if (input.value) {
    search();
  }

  document.querySelector('.search__input').focus();
}

function submitSearch(event) {
  event.preventDefault();
  searchHandler();
}

// The function hides and shows keyboard
function showKeyboard() {
  const keyboard = document.querySelector('.wrapper-keyboard');
  pageData.cursorPosition = document.querySelector('.search__input').selectionStart;
  keyboard.classList.toggle('keyboard-move-in');
  toggleKeyboardEvents();
}

document.querySelector('.search__input').focus();
document.querySelector('#search_form').addEventListener('submit', submitSearch);
document.querySelector('.search-clear').addEventListener('click', clearSearchClickHandler);
document.querySelector('.search__button').addEventListener('click', searchHandler);
document.querySelector('.search-keyboard').addEventListener('click', showKeyboard);
document.querySelector('.report').addEventListener('click', () => document.querySelector('.message-container').classList.toggle('report-active'));
window.onresize = () => {
  const keyboard = document.querySelector('.wrapper-keyboard');
  keyboard.style.left = getCalculatedMargin(keyboard);
  setMessageContainerPosition();
  setSearchInfoPosition();
};
document.addEventListener('click', () => document.querySelector('.search-info').classList.remove('search-info-active'));
