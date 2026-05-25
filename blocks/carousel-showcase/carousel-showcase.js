/**
 * Carousel Showcase block - Awards/Recognition module
 * Displays a heading with horizontally arranged award cards
 * over a background image.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Row 1: background image
  const bgRow = rows[0];
  if (bgRow) {
    const picture = bgRow.querySelector('picture');
    if (picture) {
      const bgContainer = document.createElement('div');
      bgContainer.classList.add('carousel-showcase-background');
      bgContainer.append(picture);
      block.prepend(bgContainer);
    }
    bgRow.remove();
  }

  // Row 2: heading
  const headingRow = rows[1];
  if (headingRow) {
    const heading = headingRow.querySelector('h2');
    if (heading) {
      heading.classList.add('carousel-showcase-title');
      block.append(heading);
    }
    headingRow.remove();
  }

  // Remaining rows: award cards
  const cardRows = rows.slice(2);
  if (cardRows.length > 0) {
    const cardsList = document.createElement('ul');
    cardsList.classList.add('carousel-showcase-cards');

    cardRows.forEach((row) => {
      const li = document.createElement('li');
      li.classList.add('carousel-showcase-card');

      // Get all content from the row's cell
      const cell = row.querySelector(':scope > div');
      if (cell) {
        li.append(...cell.childNodes);
      }

      cardsList.append(li);
      row.remove();
    });

    block.append(cardsList);
  }
}
