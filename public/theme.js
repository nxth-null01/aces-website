try {
  if (localStorage.getItem('aces-theme') === 'light') {
    document.documentElement.dataset.theme = 'light';
    const favicon = document.getElementById('aces-favicon');
    favicon.href = new URL('aces-light.ico', favicon.href).href;
  }
} catch {
  // Storage can be unavailable in private or restricted browsing contexts.
}
