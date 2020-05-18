// Loading bar
const loading = document.querySelector('#loadingProgress');

// The function hides loading bar
export function hideLoading() {
  loading.classList.add('hidden');
}

// The function shows loading bar
export function showLoading() {
  loading.classList.remove('hidden');
}
