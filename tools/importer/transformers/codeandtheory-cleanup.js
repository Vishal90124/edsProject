/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Code and Theory site-wide cleanup.
 * Removes non-authorable content (navigation, footer, cookie consent, accessibility buttons,
 * sentinel elements, SVG inline data images, iframes, noscript tags).
 * All selectors verified against migration-work/cleaned.html captured DOM.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent overlay (OneTrust) - found at #onetrust-consent-sdk in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-pc-sdk',
    ]);

    // Remove accessibility buttons - found at #accessibility-buttons in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#accessibility-buttons',
    ]);

    // Remove inline SVG data:image/svg+xml base64 images that block parsing
    const svgImages = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    svgImages.forEach((img) => {
      img.remove();
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove main navigation - found at nav.src-sites-candt-components-MainNavigation-header in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'nav.src-sites-candt-components-MainNavigation-header',
    ]);

    // Remove footer elements - found at footer.src-sites-candt-components-Contact-contact in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer.src-sites-candt-components-Contact-contact',
    ]);

    // Remove sentinel/intersection observer elements - found at .src-sites-candt-components-SentinelIntersect-sentinel in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.src-sites-candt-components-SentinelIntersect-sentinel',
    ]);

    // Remove iframes, noscript, and link elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
    ]);
  }
}
