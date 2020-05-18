import pageData from './pageData';
import { loadMovieData, loadOmdbMovieDescription } from './omdbApi';
import { addMessage } from './apiMessage';

// Get OMDb rating
export function getOmdbDetail(imdbID) {
  const response = loadOmdbMovieDescription(imdbID);
  return response.then((movieData) => {
    if (movieData) {
      if (movieData.Response === 'True') {
        return movieData;
      }
    }
    addMessage(movieData.Error);
    return null;
  }, () => { addMessage(`Get movie data error. Request: ${imdbID}`); });
}

// The function returns movie data with omdb rating
export function getMovieData(description, page) {
  return loadMovieData(description, page).then(
    (res) => {
      if (res) {
        if (res.Response === 'True') {
          pageData.currentPage = page;
          pageData.search = description;
          pageData.movies = res.Search;
          return res.Search;
        }
      }
      addMessage(res.Error);
      return null;
    }, () => { addMessage(`Get movie data error. Request: ${description}`); },
  );
}
