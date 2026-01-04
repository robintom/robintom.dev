/**
 * Tag Filter Script
 *
 * Enables tag-based filtering for Posts and TIL list pages.
 */

(function() {
  function initTagFilter(container) {
    const filterList = container.querySelector('.tag-filter-list');
    if (!filterList) {
      return;
    }

    const content = (container.nextElementSibling && container.nextElementSibling.classList.contains('filtered-content'))
      ? container.nextElementSibling
      : document.querySelector('.filtered-content');

    if (!content) {
      return;
    }

    const buttons = Array.from(filterList.querySelectorAll('.tag-filter-btn'));
    const items = Array.from(content.querySelectorAll('.item[data-tags]'));
    const yearSections = Array.from(content.querySelectorAll('.posts-year'));
    const noResults = content.querySelector('.no-results');

    function setActiveButton(activeButton) {
      buttons.forEach((button) => {
        button.classList.toggle('active', button === activeButton);
      });
    }

    function updateYearSections() {
      if (!yearSections.length) {
        return;
      }

      yearSections.forEach((section) => {
        const sectionItems = Array.from(section.querySelectorAll('.item[data-tags]'));
        const hasVisibleItem = sectionItems.some((item) => !item.hidden);
        section.hidden = !hasVisibleItem;
      });
    }

    function applyFilter(tag) {
      const normalizedTag = tag === 'all' ? null : tag;
      let visibleCount = 0;

      items.forEach((item) => {
        const tagList = (item.getAttribute('data-tags') || '')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean);
        const isMatch = !normalizedTag || tagList.includes(normalizedTag);
        item.hidden = !isMatch;
        if (isMatch) {
          visibleCount += 1;
        }
      });

      updateYearSections();

      if (noResults) {
        noResults.hidden = visibleCount > 0;
      }
    }

    filterList.addEventListener('click', (event) => {
      const button = event.target.closest('.tag-filter-btn');
      if (!button) {
        return;
      }

      setActiveButton(button);
      applyFilter(button.getAttribute('data-tag'));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const filters = document.querySelectorAll('.tag-filter');
    filters.forEach((container) => initTagFilter(container));
  });
})();
