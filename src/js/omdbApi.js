import { addMessage } from './apiMessage';

// The function loades movies by movie name
export function loadMovieData(description, page) {
  const url = `https://www.omdbapi.com/?type=movie&s=${description}&page=${page}&apikey=678db4bd`;
  const options = {
    method: 'GET',
  };
  return fetch(url, options)
    .then((response) => response.json(), () => { addMessage(`Unable to load: ${url}`); });
}

// The function loades movie description by imdbId
export function loadOmdbMovieDescription(imdbID) {
  const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=678db4bd`;
  const options = {
    method: 'GET',
  };
  return fetch(url, options)
    .then((response) => response.json(), () => { addMessage(`Unable to load: ${url}`); });
}
