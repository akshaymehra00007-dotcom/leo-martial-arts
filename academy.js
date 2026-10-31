const filters = [...document.querySelectorAll('[data-filter]')];
const galleryPhotos = [...document.querySelectorAll('.gallery-photo')];
const morePhotos = document.querySelector('.gallery-more');
const galleryStatus = document.querySelector('.gallery-status');
const photoDialog = document.querySelector('.lightbox');
let activeCategory = 'all';
let shownCount = 12;
let selectedPhotos = galleryPhotos;
let activePhoto = 0;
let openingButton;

function updateGallery() {
  selectedPhotos = galleryPhotos.filter(photo => activeCategory === 'all' || photo.dataset.category === activeCategory);
  galleryPhotos.forEach(photo => { photo.hidden = !selectedPhotos.includes(photo) || selectedPhotos.indexOf(photo) >= shownCount; });
  morePhotos.hidden = shownCount >= selectedPhotos.length;
  const visibleCount = Math.min(shownCount, selectedPhotos.length);
  galleryStatus.textContent = `Showing ${visibleCount} of ${selectedPhotos.length} photographs`;
}
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  activeCategory = button.dataset.filter;
  shownCount = 12;
  updateGallery();
}));
morePhotos.addEventListener('click', () => { shownCount += 12; updateGallery(); });

function showPhoto(index) {
  activePhoto = (index + selectedPhotos.length) % selectedPhotos.length;
  const button = selectedPhotos[activePhoto];
  const source = button.querySelector('img');
  const image = photoDialog.querySelector('img');
  photoDialog.querySelector('.photo-crop').setAttribute('style', button.dataset.cropStyle);
  const ratio = button.querySelector('.photo-crop').style.getPropertyValue('--ratio');
  photoDialog.style.setProperty('--ratio', ratio);
  image.src = button.dataset.photo;
  image.alt = source.alt;
  photoDialog.querySelector('.lightbox-caption').textContent = source.alt;
  photoDialog.querySelector('.photo-position').textContent = `${activePhoto + 1} / ${selectedPhotos.length}`;
}
galleryPhotos.forEach(button => button.addEventListener('click', () => {
  openingButton = button;
  showPhoto(selectedPhotos.indexOf(button));
  photoDialog.showModal();
}));
photoDialog.querySelector('.lightbox-close').addEventListener('click', () => photoDialog.close());
photoDialog.querySelector('.photo-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
photoDialog.querySelector('.photo-next').addEventListener('click', () => showPhoto(activePhoto + 1));
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(activePhoto + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
photoDialog.addEventListener('click', event => { if (event.target === photoDialog) photoDialog.close(); });
photoDialog.addEventListener('close', () => openingButton?.focus({preventScroll:true}));
updateGallery();
