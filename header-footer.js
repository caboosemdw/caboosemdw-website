async function loadHTML(elementId, filePath) {
  const response = await fetch(filePath);
  const html = await response.text();
  document.getElementById(elementId).innerHTML = html;
}

window.addEventListener('DOMContentLoaded', () => {
  loadHTML('header-placeholder', 'header.html');
  loadHTML('footer-placeholder', 'footer.html');
});