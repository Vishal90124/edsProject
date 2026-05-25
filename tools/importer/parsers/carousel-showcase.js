/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-showcase
 * Base block: carousel
 * Source: https://www.codeandtheory.com/
 * Selector: section.src-sites-candt-components-AwardsModule-awardsModule,
 *           section.src-sites-candt-components-CarouselHero-CarouselHeroDesktop-carousel-hero-desktop__container
 * Description: Awards/Recognition module with heading and horizontally scrollable
 * award cards. Each card has brand name (h3), award name (h4), and category (h5),
 * wrapped in a link. Dark textured background image with horizontal card scroll.
 * Also handles CarouselHero variant with slides containing headings and links.
 */
export default function parse(element, { document }) {
  // Detect which variant we are dealing with
  const isAwardsModule = element.querySelector('[class*="awardsModule__cards"], [class*="awardsModule__title"]');
  const isCarouselHero = element.querySelector('[class*="carousel-hero"], [class*="CarouselHero"]');

  const cells = [];

  if (isAwardsModule) {
    // === Awards Module variant ===

    // Extract background image from the background container
    const bgImage = element.querySelector('[class*="awardsModule__background__image"]');

    // Extract section heading (h2 with nested <p>)
    const headingEl = element.querySelector('h2[class*="awardsModule__title"], h2');

    // Extract all award cards
    const cards = element.querySelectorAll('li[class*="awardsModule__card"]');

    // Row 1: Background image (optional)
    if (bgImage) {
      cells.push([bgImage]);
    }

    // Row 2: Section heading
    if (headingEl) {
      cells.push([headingEl]);
    }

    // Rows 3+: One row per award card - all card content in a single cell
    cards.forEach((card) => {
      const link = card.querySelector('a[class*="card__link"], a');
      const brand = card.querySelector('h3[class*="card__brand"], h3');
      const awardName = card.querySelector('h4[class*="card__name"], h4');
      const category = card.querySelector('h5[class*="card__category"], h5');

      // Create a container div to hold all card content in one cell
      const cardContainer = document.createElement('div');

      // Add brand heading
      if (brand) {
        const h3 = document.createElement('h3');
        h3.textContent = brand.textContent.trim();
        cardContainer.appendChild(h3);
      }

      // Add award name heading
      if (awardName) {
        const h4 = document.createElement('h4');
        h4.textContent = awardName.textContent.trim();
        cardContainer.appendChild(h4);
      }

      // Add category heading
      if (category) {
        const h5 = document.createElement('h5');
        h5.textContent = category.textContent.trim();
        cardContainer.appendChild(h5);
      }

      // Add link wrapping all content
      if (link && link.href) {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        if (link.title) anchor.title = link.title;
        anchor.textContent = link.title || 'Read more';
        cardContainer.appendChild(anchor);
      }

      if (cardContainer.children.length > 0) {
        cells.push([cardContainer]);
      }
    });
  } else if (isCarouselHero) {
    // === Carousel Hero variant ===
    // Extract slides/items from the carousel hero
    const slides = element.querySelectorAll('[class*="slide"], [class*="item"], article, > div > div');
    const heading = element.querySelector('h1, h2, h3');

    if (heading) {
      cells.push([heading]);
    }

    slides.forEach((slide) => {
      const slideHeading = slide.querySelector('h1, h2, h3, h4');
      const slideLink = slide.querySelector('a');
      const slideImage = slide.querySelector('img');

      const slideContainer = document.createElement('div');
      if (slideImage) slideContainer.appendChild(slideImage.cloneNode(true));
      if (slideHeading) slideContainer.appendChild(slideHeading.cloneNode(true));
      if (slideLink) slideContainer.appendChild(slideLink.cloneNode(true));

      if (slideContainer.children.length > 0) {
        cells.push([slideContainer]);
      }
    });
  } else {
    // Fallback: try to extract any meaningful content
    const heading = element.querySelector('h1, h2, h3');
    if (heading) {
      cells.push([heading]);
    }
    const items = element.querySelectorAll('li, article, [class*="card"], [class*="slide"]');
    items.forEach((item) => {
      cells.push([item]);
    });
  }

  // Only create block if we have content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-showcase', cells });
    element.replaceWith(block);
  }
}
