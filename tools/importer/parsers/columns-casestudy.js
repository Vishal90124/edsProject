/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-casestudy
 * Base block: columns
 * Source: https://www.codeandtheory.com/
 * Selector: section.src-sites-candt-components-SingleBlowout-singleBlowout
 * Generated: 2026-05-24
 *
 * Two-column case study blowout: large project image (left column),
 * structured text content with eyebrow, heading, description, CTA, and bullet list (right column).
 */
export default function parse(element, { document }) {
  // === Column 1: Project Image ===
  const projectImage = element.querySelector(
    'img[class*="singleBlowout__projectImage"], img[class*="SingleBlowout-singleBlowout__project"]'
  );

  // === Column 2: Text Content ===
  const contentContainer = element.querySelector(
    'div[class*="singleBlowout__content"], div[class*="SingleBlowout-singleBlowout__content"]'
  );

  // Extract eyebrow text
  const eyebrow = element.querySelector(
    'span[class*="singleBlowout__eyebrow"], [class*="SingleBlowout-singleBlowout__eyebrow"]'
  );

  // Extract linked heading (h2 wrapped in an anchor)
  const headingLink = element.querySelector(
    'a:has(h2[class*="singleBlowout__title"]), a:has(h2[class*="SingleBlowout-singleBlowout__title"])'
  );
  const heading = element.querySelector(
    'h2[class*="singleBlowout__title"], h2[class*="SingleBlowout-singleBlowout__title"], h1[class*="singleBlowout__title"]'
  );

  // Extract description paragraph
  const description = element.querySelector(
    'p[class*="singleBlowout__description"], p[class*="SingleBlowout-singleBlowout__description"]'
  );

  // Extract CTA link
  const ctaLink = element.querySelector(
    'a:has(span[class*="singleBlowout__cta"]), a:has([class*="SingleBlowout-singleBlowout__cta"])'
  );

  // Extract bullet list
  const bulletList = element.querySelector(
    'ul[class*="singleBlowout__bulletList"], ul[class*="SingleBlowout-singleBlowout__bulletList"]'
  );

  // === Build Column 1 (Image) ===
  const imageCell = [];
  if (projectImage) {
    imageCell.push(projectImage);
  }

  // === Build Column 2 (Text Content) ===
  const textCell = [];

  if (eyebrow) {
    // Convert eyebrow span to a paragraph for proper rendering
    const eyebrowP = document.createElement('p');
    eyebrowP.innerHTML = eyebrow.innerHTML;
    textCell.push(eyebrowP);
  }

  if (headingLink) {
    // Preserve the linked heading structure
    textCell.push(headingLink);
  } else if (heading) {
    // Fallback: heading without link wrapper
    textCell.push(heading);
  }

  if (description) {
    textCell.push(description);
  }

  if (ctaLink) {
    // Create a standalone paragraph with the CTA link
    const ctaP = document.createElement('p');
    const ctaAnchor = document.createElement('a');
    ctaAnchor.href = ctaLink.href;
    ctaAnchor.textContent = ctaLink.textContent.trim();
    ctaP.appendChild(ctaAnchor);
    textCell.push(ctaP);
  }

  if (bulletList) {
    textCell.push(bulletList);
  }

  // === Assemble cells: one row with two columns ===
  const cells = [
    [imageCell, textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-casestudy', cells });
  element.replaceWith(block);
}
