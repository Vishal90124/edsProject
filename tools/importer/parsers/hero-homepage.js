/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-homepage
 * Base block: hero
 * Source: https://www.codeandtheory.com/
 * Selector: section.src-sites-candt-components-HomeNavigation-homeNavigation
 *
 * Extracts full-viewport navigation hero with large text links
 * to main site sections and looping video backgrounds.
 */
export default function parse(element, { document }) {
  // Extract navigation links from the nav list
  const navLinks = Array.from(
    element.querySelectorAll('nav.src-sites-candt-components-HomeNavigation-navList ul li a')
  );

  // Extract background videos
  const videos = Array.from(
    element.querySelectorAll('.src-sites-candt-components-HomeNavigation-backgroundVideoContainer video')
  );

  // Build cells array - each row is a single-cell array [[cell1], [cell2], ...]
  const cells = [];

  // Row 1: All background videos (links to video sources)
  if (videos.length > 0) {
    const videoCell = document.createElement('div');
    videos.forEach((video) => {
      const videoLink = document.createElement('a');
      videoLink.href = video.getAttribute('src');
      videoLink.textContent = video.getAttribute('src');
      const p = document.createElement('p');
      p.appendChild(videoLink);
      videoCell.appendChild(p);
    });
    cells.push([videoCell]);
  }

  // Row 2: Navigation links as content (all links in one cell)
  const contentCell = document.createElement('div');
  navLinks.forEach((link) => {
    // Reconstruct link text from spans (source uses individual word spans)
    const spans = Array.from(link.querySelectorAll('span.src-sites-candt-components-HomeNavigation-top span'));
    const linkText = spans.map((s) => s.textContent.trim()).join(' ');

    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.title = link.getAttribute('title') || '';
    a.textContent = linkText || link.textContent.trim();

    const p = document.createElement('p');
    p.appendChild(a);
    contentCell.appendChild(p);
  });
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
