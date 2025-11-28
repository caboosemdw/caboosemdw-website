async function loadHTML(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Use absolute paths from project root
  loadHTML('header-placeholder', '/templates/header.html');
  loadHTML('footer-placeholder', '/templates/footer.html');
});