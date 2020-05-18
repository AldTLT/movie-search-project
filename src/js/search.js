import { getMovieData } from './dataApi';
import { transitionEndHandler } from './swiper';
import { showLoading, hideLoading } from './loading';
import translate from './translate';
import getCalculatedMargin from './support';
import { addMessage } from './apiMessage';

const SEARCH_INPUT = document.querySelector('.search__input');
const SEARCH_INFO = document.querySelector('.search-info');

export function clearSearch() {
  SEARCH_INPUT.value = '';
}

// The function sets the left position of the info text
export function setSearchInfoPosition() {
  const info = document.querySelector('.search-info');
  info.style.left = getCalculatedMargin(info);
}

// The functions shows messages if there is no result to find
function showResultMessage(findData, success) {
  const searchText = SEARCH_INFO.querySelector('.message__text');
  const searhTarget = SEARCH_INFO.querySelector('.message__target');
  searhTarget.textContent = findData;
  if (success) {
    searchText.textContent = 'Showing results for ';
  } else {
    searchText.textContent = 'No results were found for ';
  }

  SEARCH_INFO.classList.add('search-info-active');
}

// The function checks string for cyrillic characters
function checkStringToFind(stringToFind) {
  const regex = /[а-яА-ЯёЁ]/i;
  return regex.test(stringToFind);
}

// The function load movie data and hides swiper-wrapper
function showMovies(movie) {
  let success = false;
  getMovieData(movie, 1)
    .then((data) => {
      if (data) {
        success = true;
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.addEventListener('transitionend', transitionEndHandler);
        swiperWrapper.style.transition = '1s';
        swiperWrapper.classList.add('disappear');
      }

      showResultMessage(movie, success);
      hideLoading();
    }, addMessage('Unable to load data'));
}

// The function searches movies
export function search() {
  document.querySelector('.wrapper-keyboard').classList.remove('keyboard-move-in');
  SEARCH_INFO.classList.remove('search-info-active');
  const movieName = SEARCH_INPUT.value.trim();

  addMessage(`Search for ${movieName}`, true);

  showLoading();
  const isCyrillic = checkStringToFind(movieName);

  if (isCyrillic) {
    translate(movieName).then((data) => {
      addMessage(`Translate request for ${movieName}`, true);
      showMovies(data.text[0]);
    });
  } else if (movieName) {
    showMovies(movieName);
  }
}
