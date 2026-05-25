/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import cardsPortfolioParser from './parsers/cards-portfolio.js';
import columnsCasestudyParser from './parsers/columns-casestudy.js';
import carouselShowcaseParser from './parsers/carousel-showcase.js';

// TRANSFORMER IMPORTS
import codeandtheoryCleanupTransformer from './transformers/codeandtheory-cleanup.js';
import codeandtheorySectionsTransformer from './transformers/codeandtheory-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Main Code and Theory homepage with hero, work showcase, and company introduction',
  urls: [
    'https://www.codeandtheory.com/'
  ],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['section.src-sites-candt-components-HomeNavigation-homeNavigation']
    },
    {
      name: 'cards-portfolio',
      instances: ['.src-sites-candt-components-HomepagePromotion-homepagePromotion', '.src-sites-candt-components-Cards-card--project']
    },
    {
      name: 'columns-casestudy',
      instances: ['section.src-sites-candt-components-SingleBlowout-singleBlowout', 'section.src-sites-candt-components-SizzleVideo-sizzleVideo']
    },
    {
      name: 'carousel-showcase',
      instances: ['section.src-sites-candt-components-AwardsModule-awardsModule', 'section.src-sites-candt-components-CarouselHero-CarouselHeroDesktop-carousel-hero-desktop__container']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Home Navigation Hero',
      selector: 'section.src-sites-candt-components-HomeNavigation-homeNavigation',
      style: 'dark',
      blocks: ['hero-homepage', 'cards-portfolio'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Featured Work Showcase',
      selector: 'section.src-sites-candt-components-SizzleVideo-sizzleVideo',
      style: 'dark',
      blocks: ['columns-casestudy', 'carousel-showcase'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Things We Make',
      selector: '#page-thingsWeMake',
      style: 'dark',
      blocks: ['carousel-showcase', 'columns-casestudy'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'All Work Grid',
      selector: '.src-sites-candt-components-Cards-card--project',
      style: 'dark',
      blocks: ['cards-portfolio'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Page Transition',
      selector: '#transporter-banner--home',
      style: 'dark',
      blocks: [],
      defaultContent: ['.transporter-banner__title']
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-homepage': heroHomepageParser,
  'cards-portfolio': cardsPortfolioParser,
  'columns-casestudy': columnsCasestudyParser,
  'carousel-showcase': carouselShowcaseParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  codeandtheoryCleanupTransformer,
  codeandtheorySectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const pathname = new URL(params.originalURL).pathname;
    const path = WebImporter.FileUtils.sanitizePath(
      pathname === '/' ? '/index' : pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
