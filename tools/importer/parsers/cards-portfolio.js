/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-portfolio
 * Base block: cards
 * Source: https://www.codeandtheory.com/
 * Selectors: .src-sites-candt-components-HomepagePromotion-homepagePromotion,
 *            .src-sites-candt-components-Cards-card--project
 * Generated: 2026-05-24
 *
 * Handles two card layout variants:
 * 1. Homepage Promotion (news ticker): publication logo + headline + external link
 * 2. Project cards grid: project image + brand/title + link
 */
export default function parse(element, { document }) {
  const cells = [];

  // Determine which variant we're dealing with based on class
  const isHomepagePromotion = element.classList.toString().includes('HomepagePromotion-homepagePromotion');
  const isProjectCard = element.classList.toString().includes('Cards-card--project');

  if (isHomepagePromotion) {
    // Homepage Promotion: contains multiple card links in a wrapper
    const cardLinks = element.querySelectorAll(
      'a[class*="homepagePromotion__block"]'
    );

    cardLinks.forEach((card) => {
      const imageCell = [];
      const contentCell = [];

      // Extract publication logo image
      const img = card.querySelector('img');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        imageCell.push(newImg);
      }

      // Extract headline as a linked paragraph (card itself is the link)
      const headline = card.querySelector('p');
      if (headline && card.href) {
        const link = document.createElement('a');
        link.href = card.href;
        link.textContent = headline.textContent.trim();
        contentCell.push(link);
      } else if (headline) {
        const p = document.createElement('p');
        p.textContent = headline.textContent.trim();
        contentCell.push(p);
      }

      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
  } else if (isProjectCard) {
    // Project card: single card element with image + title/brand + link
    const cardCell = [];

    // Extract project image
    const img = element.querySelector('img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      cardCell.push(newImg);
    }

    // Extract title/brand heading or text
    const heading = element.querySelector('h2, h3, h4, [class*="title"], [class*="name"]');
    if (heading) {
      cardCell.push(heading);
    }

    // Extract description or subtitle
    const description = element.querySelector('p, [class*="description"], [class*="subtitle"]');
    if (description) {
      cardCell.push(description);
    }

    // Extract link
    const link = element.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = link.textContent.trim() || 'View Project';
      cardCell.push(newLink);
    }

    if (cardCell.length > 0) {
      cells.push(cardCell);
    }
  } else {
    // Fallback: treat as generic card container with multiple links
    const links = element.querySelectorAll('a');
    links.forEach((link) => {
      const cardCell = [];

      const img = link.querySelector('img');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        cardCell.push(newImg);
      }

      const text = link.querySelector('p, h2, h3, h4, span');
      if (text) {
        const p = document.createElement('p');
        p.textContent = text.textContent.trim();
        cardCell.push(p);
      }

      if (link.href) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.textContent = text ? text.textContent.trim() : link.href;
        cardCell.push(newLink);
      }

      if (cardCell.length > 0) {
        cells.push(cardCell);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-portfolio', cells });
  element.replaceWith(block);
}
