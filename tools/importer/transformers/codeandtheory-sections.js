/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Code and Theory section breaks and section metadata.
 * Inserts <hr> section breaks and Section Metadata blocks based on template sections.
 * All selectors verified against migration-work/cleaned.html captured DOM:
 * - section-1: section.src-sites-candt-components-HomeNavigation-homeNavigation (line 84)
 * - section-2: section.src-sites-candt-components-SizzleVideo-sizzleVideo (line 176)
 * - section-3: #page-thingsWeMake (line 397)
 * - section-4: .src-sites-candt-components-Cards-card--project (line 192)
 * - section-5: #transporter-banner--home (line 375)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;

    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid position shifts
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section, reverseIndex) => {
      const originalIndex = sections.length - 1 - reverseIndex;
      const sectionEl = element.querySelector(section.selector);

      if (!sectionEl) return;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert section metadata after the section element
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(sectionMetadata);
        }
      }

      // Insert <hr> before the section element (except for the first section)
      if (originalIndex > 0) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    });
  }
}
