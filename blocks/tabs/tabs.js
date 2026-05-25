/**
 * Tabs block - Jump Navigation variant
 * Transforms rows of links into a sticky jump navigation bar.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // Create nav element
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Page sections');

  // Add "Jump to:" label
  const label = document.createElement('span');
  label.className = 'tabs-label';
  label.textContent = 'Jump to:';
  nav.appendChild(label);

  // Extract links from rows
  const rows = [...block.children];
  rows.forEach((row) => {
    const link = row.querySelector('a');
    if (link) {
      link.className = 'tabs-link';
      nav.appendChild(link);
    }
  });

  // Clear block and append nav
  block.textContent = '';
  block.appendChild(nav);
}
