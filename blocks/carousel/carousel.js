/**
 * Carousel block - Testimonial carousel with slide navigation.
 * Expects rows where each row is one slide containing:
 *   - picture (avatar)
 *   - paragraph(s) (quote text)
 *   - strong (author name)
 *   - em (patient duration / meta)
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Build carousel structure
  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-card';

  // Quote icon SVG
  const quoteIcon = document.createElement('div');
  quoteIcon.className = 'carousel-quote-icon';
  quoteIcon.innerHTML = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 38.5C14.5 34.1 16.3 30.3 19.9 27.1C23.5 23.9 27.8 22 32.8 21.4L33.5 24.2C30.1 25.2 27.4 26.8 25.4 29C23.4 31.2 22.4 33.5 22.4 35.9C22.4 36.7 22.6 37.3 23 37.7C23.6 37.3 24.4 37.1 25.4 37.1C27 37.1 28.3 37.6 29.3 38.6C30.3 39.6 30.8 40.9 30.8 42.5C30.8 44.1 30.2 45.5 29 46.5C27.8 47.5 26.3 48 24.5 48C22.3 48 20.5 47.2 19.1 45.6C17.7 44 15.7 41.7 14.5 38.5Z" fill="currentColor"/>
    <path d="M38.5 38.5C38.5 34.1 40.3 30.3 43.9 27.1C47.5 23.9 51.8 22 56.8 21.4L57.5 24.2C54.1 25.2 51.4 26.8 49.4 29C47.4 31.2 46.4 33.5 46.4 35.9C46.4 36.7 46.6 37.3 47 37.7C47.6 37.3 48.4 37.1 49.4 37.1C51 37.1 52.3 37.6 53.3 38.6C54.3 39.6 54.8 40.9 54.8 42.5C54.8 44.1 54.2 45.5 53 46.5C51.8 47.5 50.3 48 48.5 48C46.3 48 44.5 47.2 43.1 45.6C41.7 44 39.7 41.7 38.5 38.5Z" fill="currentColor"/>
  </svg>`;

  // Viewport and track
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  const track = document.createElement('div');
  track.className = 'carousel-track';

  // Process each slide row
  rows.forEach((row, index) => {
    const cell = row.querySelector(':scope > div');
    if (!cell) return;

    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-label', `Testimonial ${index + 1}`);
    if (index !== 0) slide.setAttribute('aria-hidden', 'true');

    const slideInner = document.createElement('div');
    slideInner.className = 'carousel-slide-inner';

    // Extract content
    const picture = cell.querySelector('picture');
    const strong = cell.querySelector('strong');
    const em = cell.querySelector('em');

    // Quote text: paragraphs that are not the avatar, name, or meta
    const quoteBlock = document.createElement('blockquote');
    quoteBlock.className = 'carousel-quote';
    const paragraphs = [...cell.querySelectorAll('p')];
    paragraphs.forEach((p) => {
      // Skip paragraphs that contain the picture, strong, or em
      if (p.querySelector('picture') || p.querySelector('strong') || p.querySelector('em')) return;
      const text = p.textContent.trim();
      if (text.length > 0) {
        const qp = document.createElement('p');
        qp.textContent = text;
        quoteBlock.appendChild(qp);
      }
    });

    // Author section
    const author = document.createElement('div');
    author.className = 'carousel-author';

    if (picture) {
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'carousel-avatar';
      avatarDiv.appendChild(picture.cloneNode(true));
      author.appendChild(avatarDiv);
    }

    const authorCopy = document.createElement('div');
    authorCopy.className = 'carousel-author-copy';

    if (strong) {
      const namePara = document.createElement('p');
      namePara.className = 'carousel-author-name';
      namePara.textContent = strong.textContent;
      authorCopy.appendChild(namePara);
    }

    if (em) {
      const metaPara = document.createElement('p');
      metaPara.className = 'carousel-author-meta';
      metaPara.textContent = em.textContent;
      authorCopy.appendChild(metaPara);
    }

    author.appendChild(authorCopy);

    slideInner.appendChild(quoteBlock);
    slideInner.appendChild(author);
    slide.appendChild(slideInner);
    track.appendChild(slide);
  });

  viewport.appendChild(track);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-arrow carousel-arrow-prev';
  prevBtn.setAttribute('aria-label', 'Previous testimonial');
  prevBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-arrow carousel-arrow-next';
  nextBtn.setAttribute('aria-label', 'Next testimonial');
  nextBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  dots.setAttribute('role', 'tablist');
  dots.setAttribute('aria-label', 'Slides');

  const slideCount = track.children.length;
  for (let i = 0; i < slideCount; i += 1) {
    const dot = document.createElement('button');
    dot.className = `carousel-dot${i === 0 ? ' carousel-dot-active' : ''}`;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dots.appendChild(dot);
  }

  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  controls.appendChild(dots);

  wrapper.appendChild(quoteIcon);
  wrapper.appendChild(viewport);
  wrapper.appendChild(controls);

  // Clear block and add new structure
  block.textContent = '';
  block.appendChild(wrapper);

  // Carousel logic
  let currentSlide = 0;

  function goToSlide(idx) {
    const slides = track.querySelectorAll('.carousel-slide');
    const allDots = dots.querySelectorAll('.carousel-dot');

    let targetIdx = idx;
    if (targetIdx < 0) targetIdx = slides.length - 1;
    if (targetIdx >= slides.length) targetIdx = 0;

    currentSlide = targetIdx;
    track.style.transform = `translateX(-${targetIdx * 100}%)`;

    slides.forEach((s, i) => {
      s.setAttribute('aria-hidden', i !== targetIdx ? 'true' : 'false');
    });

    allDots.forEach((d, i) => {
      d.classList.toggle('carousel-dot-active', i === targetIdx);
      d.setAttribute('aria-selected', i === targetIdx ? 'true' : 'false');
    });
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  dots.addEventListener('click', (e) => {
    const dot = e.target.closest('.carousel-dot');
    if (dot) {
      const index = [...dots.children].indexOf(dot);
      goToSlide(index);
    }
  });

  // Initialize
  goToSlide(0);
}
