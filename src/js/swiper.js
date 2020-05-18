/* eslint-disable no-use-before-define */
import poster from '../assets/image/poster.jpg';
import { getMovieData, getOmdbDetail } from './dataApi';
import { setDetail } from './detail';
import pageData from './pageData';
import { addMessage } from './apiMessage';

const SLIDE = `
<div class="swiper-slide">
<div class="slide-container">
    <a href="#" class="movie-name" target="_blank"></a>
    <div class="poster-container">
      <img class="movie-poster">
    </div>
    <p class="movie-year"></p>
    <div class="movie-imdb">
      <div class="imdb-star"></div>
      <p class="imdb">7.3</p>
    </div>
  </div>
</div>`;

// Swiper
// eslint-disable-next-line no-undef
export const swiper = new Swiper('.swiper-container', {
  centerInsufficientSlides: true,
  breakpoints: {
    // when window width is >= 375px
    375: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    // when window width is >= 768px
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    // when window width is >= 1200px
    1200: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    // when window width is >= 1400px
    1400: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  // Events
  on: {
    slideChange: swiperSlideChangeHandler,
  },
});

// The function removes all slides
export function removeSlides() {
  swiper.removeAllSlides();
}

// The function makes only 10 slides, if there are more on the DOM, remove remaining
export function makeTenSlides() {
  // swiper.slideTo(1);
  for (let i = 0; i < 10; i += 1) {
    swiper.appendSlide(SLIDE);
  }

  swiper.update();
}

// The function show slides if they has loaded
function showSlides(slidesNumber) {
  return new Promise(() => {
    let count = 0;
    const sliders = document.querySelectorAll('.movie-poster');
    sliders.forEach((data) => {
      const slider = data;
      // eslint-disable-next-line no-multi-assign
      slider.onload = slider.onerror = () => {
        count += 1;
        if (count >= slidesNumber) {
          const swiperWrapper = document.querySelector('.swiper-wrapper');
          swiperWrapper.style.transition = '1s';
          swiperWrapper.classList.remove('disappear');
        }
      };
    });
  });
}

// End of swiper desapper
export function transitionEndHandler() {
  document.querySelector('.swiper-wrapper').removeEventListener('transitionend', transitionEndHandler);
  swiper.slideTo(1);
  removeSlides();
  makeTenSlides();
  putData(pageData.movies);

  // Create next 10 slides
  const slidesNumber = swiper.slides.length;
  createNextSliders(slidesNumber);
}

// The function sets rating on the slide
function setRating(slide, imdbID) {
  const newSlide = slide;
  getOmdbDetail(imdbID).then((movieDescription) => {
    if (movieDescription.imdbRating) {
      newSlide.querySelector('.imdb').textContent = movieDescription.imdbRating;
    } else {
      newSlide.querySelector('.imdb').textContent = 'N/A';
    }
  });
}

// Click on a poster
function posterClickHandler() {
  document.querySelectorAll('.movie-poster').forEach((posterImage) => posterImage.classList.remove('disappear'));
  setDetail(this);
}

// Set movie data (poster, name, year etc) to slide
function setMovieDataToSlide(slide, movieData) {
  if (!slide) {
    return;
  }

  const newSlide = slide;

  setRating(newSlide, movieData.imdbID);

  const p = newSlide.querySelector('.movie-poster');
  p.src = movieData.Poster === 'N/A' ? poster : movieData.Poster;
  p.id = movieData.imdbID;
  p.addEventListener('click', posterClickHandler);

  const movieName = newSlide.querySelector('.movie-name');
  movieName.textContent = movieData.Title;
  const imdbId = movieData.imdbID;
  movieName.href = `https://www.imdb.com/title/${imdbId}`;
  newSlide.querySelector('.movie-year').textContent = `(${movieData.Year})`;

  // Set default poster if image not loaded
  p.onerror = () => { p.src = poster; };
}

// Create next sliders
function createNextSliders(lastSliderNumber) {
  let slide = swiper.slides[lastSliderNumber - 1];
  getMovieData(pageData.search, pageData.currentPage + 1).then((response) => {
    if (response) {
      response.forEach((movieData) => {
        swiper.appendSlide(SLIDE);
        if (slide) {
          slide = slide.nextElementSibling;
          setMovieDataToSlide(slide, movieData);
        }
      });
    }
  }, addMessage('Unable to load data'));
}

// Slider change handler
function swiperSlideChangeHandler() {
  const slidesNumber = swiper.slides.length;
  const { slidesPerView } = swiper.params;
  const activeSlideNumber = swiper.activeIndex;
  // Create next sliders if current slider === slider numbers - 4
  if (activeSlideNumber === slidesNumber - (slidesPerView + 5)) {
    createNextSliders(slidesNumber);
  }
}

// Put movies to slides. Hidest remaining slides.
export function putData(moviesData) {
  let count = 0;
  let swiperSlide = document.querySelector('.swiper-slide');
  moviesData.forEach((movie) => {
    if (swiperSlide) {
      setMovieDataToSlide(swiperSlide, movie);
      swiperSlide = swiperSlide.nextElementSibling;
      count += 1;
    }
  });

  while (swiperSlide) {
    swiperSlide.classList.add('hidden');
    swiperSlide = swiperSlide.nextElementSibling;
  }

  swiper.update();

  // Show slides if they loaded
  showSlides(count);
}

// Load the first 10 slides
export function initSlides() {
  const movieDescription = 'movie';
  pageData.search = 'movie';
  const page = 1;
  let slidesNumber = 0;

  makeTenSlides();
  getMovieData(movieDescription, page)
    .then((movies) => {
      if (movies) {
        putData(movies);
        slidesNumber = swiper.slides.length;
      }

      // Create next 10 slides
      createNextSliders(slidesNumber);
    });
}
