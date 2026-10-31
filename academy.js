// Filtering leaves the existing gallery dialog and keyboard interaction intact.
const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  const category = button.dataset.filter;
  document.querySelectorAll('.gallery-photo').forEach(photo => {
    photo.hidden = category !== 'all' && photo.dataset.category !== category;
  });
  const founderLink = document.querySelector('.founder-gallery-link');
  founderLink.hidden = category !== 'all' && category !== 'founder';
}));
