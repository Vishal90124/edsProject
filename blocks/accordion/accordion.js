/**
 * Accordion block - FAQ-style expandable/collapsible items
 * Content structure:
 *   Row 1: Header cell (h2 + description paragraph)
 *   Row 2+: Question cell | Answer cell
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // First row is the header (h2 + description)
  const headerRow = rows[0];
  headerRow.classList.add('accordion-header');

  // Build items container from remaining rows
  const itemsContainer = document.createElement('div');
  itemsContainer.classList.add('accordion-items');

  rows.slice(1).forEach((row, index) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const question = cells[0].textContent.trim();
    const answerContent = cells[1].innerHTML;

    // Create accordion item
    const item = document.createElement('div');
    item.classList.add('accordion-item');

    // Create trigger button
    const trigger = document.createElement('button');
    trigger.setAttribute('type', 'button');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', `accordion-panel-${index}`);
    trigger.setAttribute('id', `accordion-trigger-${index}`);

    const questionSpan = document.createElement('span');
    questionSpan.classList.add('accordion-question');
    questionSpan.textContent = question;

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('accordion-icon');
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
      <line class="accordion-icon-h" x1="5" y1="12" x2="19" y2="12"></line>
      <line class="accordion-icon-v" x1="12" y1="5" x2="12" y2="19"></line>
    </svg>`;

    trigger.appendChild(questionSpan);
    trigger.appendChild(iconSpan);

    // Create panel
    const panel = document.createElement('div');
    panel.classList.add('accordion-panel');
    panel.setAttribute('id', `accordion-panel-${index}`);
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', `accordion-trigger-${index}`);
    panel.hidden = true;

    const panelInner = document.createElement('div');
    panelInner.classList.add('accordion-panel-inner');
    panelInner.innerHTML = answerContent;
    panel.appendChild(panelInner);

    item.appendChild(trigger);
    item.appendChild(panel);
    itemsContainer.appendChild(item);

    // Remove original row
    row.remove();
  });

  block.appendChild(itemsContainer);

  // Event delegation for accordion toggle
  itemsContainer.addEventListener('click', (e) => {
    const trigger = e.target.closest('button');
    if (!trigger) return;

    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));

    // Close all other items (single-open behavior matching source)
    itemsContainer.querySelectorAll('button[aria-expanded="true"]').forEach((btn) => {
      if (btn !== trigger) {
        btn.setAttribute('aria-expanded', 'false');
        const otherPanel = document.getElementById(btn.getAttribute('aria-controls'));
        if (otherPanel) otherPanel.hidden = true;
      }
    });

    // Toggle clicked item
    trigger.setAttribute('aria-expanded', String(!expanded));
    if (panel) panel.hidden = expanded;
  });
}
