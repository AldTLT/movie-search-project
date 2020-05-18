// The function calculates margin left to set element on the center
export default function getCalculatedMargin(domElement) {
  const pageWidth = document.documentElement.clientWidth;
  const elementWidth = window.getComputedStyle(domElement).width.replace(/px$/, '');
  let left = (pageWidth - elementWidth) / 2;
  left = left < 0 ? 0 : left;
  return `${left}px`;
}
