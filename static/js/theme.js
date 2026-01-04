/**
 * Theme Toggle Script
 *
 * Handles dark/light mode switching with:
 * 1. System preference detection
 * 2. localStorage persistence
 * 3. Smooth transitions
 */

(function() {
  // Get the current theme from localStorage or system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved;
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply theme to document
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Initialize theme on page load
  // Note: This also runs in head.html for instant load, but we keep it here for safety
  applyTheme(getPreferredTheme());

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle theme function - called by button onclick
  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    applyTheme(next);
    localStorage.setItem('theme', next);
  };
})();
