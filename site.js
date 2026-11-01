// Content stays visible when motion is reduced or observer setup fails.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  try {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), {threshold: 0.1});
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    document.documentElement.classList.add('js-reveal');
  } catch { document.documentElement.classList.remove('js-reveal'); }
}

const progress = document.querySelector('.progress');
let progressFrame = false;
function updateProgress() {
  const range = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0})`;
  progressFrame = false;
}
addEventListener('scroll', () => {
  if (!progressFrame) { progressFrame = true; requestAnimationFrame(updateProgress); }
}, {passive: true});
addEventListener('resize', updateProgress);
updateProgress();

// Avoid downloading decorative footage on phones and metered connections.
const heroVideo = document.querySelector('.hero-video');
const desktopVideo = matchMedia('(min-width: 761px)');
const connection = navigator.connection;
let heroInView = true;
function syncVideo() {
  const allowed = desktopVideo.matches && !reducedMotion.matches && !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType);
  if (!allowed || document.hidden || !heroInView) {
    heroVideo.pause();
    heroVideo.classList.remove('playing');
    if (!allowed && heroVideo.querySelector('source').hasAttribute('src')) {
      heroVideo.querySelector('source').removeAttribute('src');
      heroVideo.load();
    }
    return;
  }
  const source = heroVideo.querySelector('source');
  if (!source.hasAttribute('src')) { source.src = source.dataset.src; heroVideo.load(); }
  heroVideo.play().catch(() => heroVideo.classList.remove('playing'));
}
heroVideo.addEventListener('playing', () => heroVideo.classList.add('playing'));
heroVideo.addEventListener('error', () => heroVideo.classList.remove('playing'));
reducedMotion.addEventListener('change', syncVideo);
desktopVideo.addEventListener('change', syncVideo);
connection?.addEventListener('change', syncVideo);
document.addEventListener('visibilitychange', syncVideo);
if ('IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver(([entry]) => { heroInView = entry.isIntersecting; syncVideo(); });
  heroObserver.observe(document.querySelector('.hero'));
}
syncVideo();

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('primary-navigation');
function closeMenu() { menuToggle.setAttribute('aria-expanded', 'false'); }
menuToggle.addEventListener('click', () => menuToggle.setAttribute('aria-expanded', String(menuToggle.getAttribute('aria-expanded') !== 'true')));
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('nav')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); menuToggle.focus(); }
});
desktopVideo.addEventListener('change', closeMenu);

function enquiryUrl(name, interest) {
  return 'https://wa.me/919649476845?text=' + encodeURIComponent('Hi Panther’s Sports Academy, my name is ' + name.trim() + '. I would like to learn ' + interest + '. Please share the session timings, fees, and how I can visit the academy.');
}
document.getElementById('enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('enquiry-name');
  name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
  if (!event.currentTarget.reportValidity()) return;
  // Same-tab navigation works even when the browser blocks pop-up windows.
  location.assign(enquiryUrl(name.value, document.getElementById('enquiry-interest').value));
});
document.getElementById('enquiry-name').addEventListener('input', event => event.target.setCustomValidity(''));
