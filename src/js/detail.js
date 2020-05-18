/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { getOmdbDetail } from './dataApi';

// The function returns true if description used, otherwiese - false
function isDetailUsed(nameText) {
  const regex = /(Rated|Released|Runtime|Genre|Director|Actors|Plot|Country|Production)$/i;
  return regex.test(nameText);
}

let back = false;

// Remove container with movie information
function removeInformation() {
  const detail = document.querySelector('.detail');
  if (detail) {
    detail.remove();
  }
}

// End of slide animation handler
function animationEndHandler() {
  if (back) {
    this.classList.remove('rotateBack');
    this.classList.add('hidden');
    this.removeEventListener('animationend', animationEndHandler);
  }
}

// Click on movie detail
export function detailClick() {
  back = true;
  const detail = document.querySelector('.detail');
  detail.classList.remove('rotateFront');
  detail.classList.add('rotateBack');
  const moviePoster = detail.parentElement.querySelector('.movie-poster');
  moviePoster.classList.remove('rotateBack');
  moviePoster.classList.add('rotateFront');
}


// The functon gets container of movie detail information
function getContainer() {
  const container = document.createElement('div');
  container.classList.add('detail');

  const detailTitle = document.createElement('p');
  detailTitle.classList.add('detail-title');
  detailTitle.textContent = 'Movie description';

  container.append(detailTitle);
  container.addEventListener('click', detailClick);
  container.addEventListener('animationend', animationEndHandler);
  container.addEventListener('mouseleave', detailClick);

  return container;
}

// The function create one row of the movie description
function createDetail(nameText, valueText, detail) {
  if (!isDetailUsed(nameText)) {
    return;
  }

  const detailText = document.createElement('p');
  detailText.classList.add('detail-text');

  const name = document.createElement('span');
  name.classList.add('detail-name');
  name.textContent = nameText;

  const value = document.createElement('span');
  value.classList.add('detail-value');
  value.textContent = valueText;

  detailText.append(name, value);
  detail.append(detailText);
}

// The function set movie description page
export function setDetail(poster) {
  back = false;
  removeInformation();
  const detail = getContainer();
  getOmdbDetail(poster.id).then((movieDetail) => {
    for (const key in movieDetail) {
      createDetail(key, movieDetail[key], detail);
      poster.parentElement.append(detail);
      detail.classList.add('rotateFront');
      poster.classList.add('rotateBack');
    }
  });
}
