/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const navLinks = Array.from(
      element.querySelectorAll("nav.src-sites-candt-components-HomeNavigation-navList ul li a")
    );
    const videos = Array.from(
      element.querySelectorAll(".src-sites-candt-components-HomeNavigation-backgroundVideoContainer video")
    );
    const cells = [];
    if (videos.length > 0) {
      const videoCell = document.createElement("div");
      videos.forEach((video) => {
        const videoLink = document.createElement("a");
        videoLink.href = video.getAttribute("src");
        videoLink.textContent = video.getAttribute("src");
        const p = document.createElement("p");
        p.appendChild(videoLink);
        videoCell.appendChild(p);
      });
      cells.push([videoCell]);
    }
    const contentCell = document.createElement("div");
    navLinks.forEach((link) => {
      const spans = Array.from(link.querySelectorAll("span.src-sites-candt-components-HomeNavigation-top span"));
      const linkText = spans.map((s) => s.textContent.trim()).join(" ");
      const a = document.createElement("a");
      a.href = link.getAttribute("href");
      a.title = link.getAttribute("title") || "";
      a.textContent = linkText || link.textContent.trim();
      const p = document.createElement("p");
      p.appendChild(a);
      contentCell.appendChild(p);
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-portfolio.js
  function parse2(element, { document }) {
    const cells = [];
    const isHomepagePromotion = element.classList.toString().includes("HomepagePromotion-homepagePromotion");
    const isProjectCard = element.classList.toString().includes("Cards-card--project");
    if (isHomepagePromotion) {
      const cardLinks = element.querySelectorAll(
        'a[class*="homepagePromotion__block"]'
      );
      cardLinks.forEach((card) => {
        const imageCell = [];
        const contentCell = [];
        const img = card.querySelector("img");
        if (img) {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = img.alt || "";
          imageCell.push(newImg);
        }
        const headline = card.querySelector("p");
        if (headline && card.href) {
          const link = document.createElement("a");
          link.href = card.href;
          link.textContent = headline.textContent.trim();
          contentCell.push(link);
        } else if (headline) {
          const p = document.createElement("p");
          p.textContent = headline.textContent.trim();
          contentCell.push(p);
        }
        if (imageCell.length > 0 || contentCell.length > 0) {
          cells.push([imageCell, contentCell]);
        }
      });
    } else if (isProjectCard) {
      const cardCell = [];
      const img = element.querySelector("img");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        cardCell.push(newImg);
      }
      const heading = element.querySelector('h2, h3, h4, [class*="title"], [class*="name"]');
      if (heading) {
        cardCell.push(heading);
      }
      const description = element.querySelector('p, [class*="description"], [class*="subtitle"]');
      if (description) {
        cardCell.push(description);
      }
      const link = element.querySelector("a");
      if (link) {
        const newLink = document.createElement("a");
        newLink.href = link.href;
        newLink.textContent = link.textContent.trim() || "View Project";
        cardCell.push(newLink);
      }
      if (cardCell.length > 0) {
        cells.push(cardCell);
      }
    } else {
      const links = element.querySelectorAll("a");
      links.forEach((link) => {
        const cardCell = [];
        const img = link.querySelector("img");
        if (img) {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = img.alt || "";
          cardCell.push(newImg);
        }
        const text = link.querySelector("p, h2, h3, h4, span");
        if (text) {
          const p = document.createElement("p");
          p.textContent = text.textContent.trim();
          cardCell.push(p);
        }
        if (link.href) {
          const newLink = document.createElement("a");
          newLink.href = link.href;
          newLink.textContent = text ? text.textContent.trim() : link.href;
          cardCell.push(newLink);
        }
        if (cardCell.length > 0) {
          cells.push(cardCell);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-portfolio", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-casestudy.js
  function parse3(element, { document }) {
    const projectImage = element.querySelector(
      'img[class*="singleBlowout__projectImage"], img[class*="SingleBlowout-singleBlowout__project"]'
    );
    const contentContainer = element.querySelector(
      'div[class*="singleBlowout__content"], div[class*="SingleBlowout-singleBlowout__content"]'
    );
    const eyebrow = element.querySelector(
      'span[class*="singleBlowout__eyebrow"], [class*="SingleBlowout-singleBlowout__eyebrow"]'
    );
    const headingLink = element.querySelector(
      'a:has(h2[class*="singleBlowout__title"]), a:has(h2[class*="SingleBlowout-singleBlowout__title"])'
    );
    const heading = element.querySelector(
      'h2[class*="singleBlowout__title"], h2[class*="SingleBlowout-singleBlowout__title"], h1[class*="singleBlowout__title"]'
    );
    const description = element.querySelector(
      'p[class*="singleBlowout__description"], p[class*="SingleBlowout-singleBlowout__description"]'
    );
    const ctaLink = element.querySelector(
      'a:has(span[class*="singleBlowout__cta"]), a:has([class*="SingleBlowout-singleBlowout__cta"])'
    );
    const bulletList = element.querySelector(
      'ul[class*="singleBlowout__bulletList"], ul[class*="SingleBlowout-singleBlowout__bulletList"]'
    );
    const imageCell = [];
    if (projectImage) {
      imageCell.push(projectImage);
    }
    const textCell = [];
    if (eyebrow) {
      const eyebrowP = document.createElement("p");
      eyebrowP.innerHTML = eyebrow.innerHTML;
      textCell.push(eyebrowP);
    }
    if (headingLink) {
      textCell.push(headingLink);
    } else if (heading) {
      textCell.push(heading);
    }
    if (description) {
      textCell.push(description);
    }
    if (ctaLink) {
      const ctaP = document.createElement("p");
      const ctaAnchor = document.createElement("a");
      ctaAnchor.href = ctaLink.href;
      ctaAnchor.textContent = ctaLink.textContent.trim();
      ctaP.appendChild(ctaAnchor);
      textCell.push(ctaP);
    }
    if (bulletList) {
      textCell.push(bulletList);
    }
    const cells = [
      [imageCell, textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-casestudy", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-showcase.js
  function parse4(element, { document }) {
    const isAwardsModule = element.querySelector('[class*="awardsModule__cards"], [class*="awardsModule__title"]');
    const isCarouselHero = element.querySelector('[class*="carousel-hero"], [class*="CarouselHero"]');
    const cells = [];
    if (isAwardsModule) {
      const bgImage = element.querySelector('[class*="awardsModule__background__image"]');
      const headingEl = element.querySelector('h2[class*="awardsModule__title"], h2');
      const cards = element.querySelectorAll('li[class*="awardsModule__card"]');
      if (bgImage) {
        cells.push([bgImage]);
      }
      if (headingEl) {
        cells.push([headingEl]);
      }
      cards.forEach((card) => {
        const link = card.querySelector('a[class*="card__link"], a');
        const brand = card.querySelector('h3[class*="card__brand"], h3');
        const awardName = card.querySelector('h4[class*="card__name"], h4');
        const category = card.querySelector('h5[class*="card__category"], h5');
        const cardContainer = document.createElement("div");
        if (brand) {
          const h3 = document.createElement("h3");
          h3.textContent = brand.textContent.trim();
          cardContainer.appendChild(h3);
        }
        if (awardName) {
          const h4 = document.createElement("h4");
          h4.textContent = awardName.textContent.trim();
          cardContainer.appendChild(h4);
        }
        if (category) {
          const h5 = document.createElement("h5");
          h5.textContent = category.textContent.trim();
          cardContainer.appendChild(h5);
        }
        if (link && link.href) {
          const anchor = document.createElement("a");
          anchor.href = link.href;
          if (link.title) anchor.title = link.title;
          anchor.textContent = link.title || "Read more";
          cardContainer.appendChild(anchor);
        }
        if (cardContainer.children.length > 0) {
          cells.push([cardContainer]);
        }
      });
    } else if (isCarouselHero) {
      const slides = element.querySelectorAll('[class*="slide"], [class*="item"], article, > div > div');
      const heading = element.querySelector("h1, h2, h3");
      if (heading) {
        cells.push([heading]);
      }
      slides.forEach((slide) => {
        const slideHeading = slide.querySelector("h1, h2, h3, h4");
        const slideLink = slide.querySelector("a");
        const slideImage = slide.querySelector("img");
        const slideContainer = document.createElement("div");
        if (slideImage) slideContainer.appendChild(slideImage.cloneNode(true));
        if (slideHeading) slideContainer.appendChild(slideHeading.cloneNode(true));
        if (slideLink) slideContainer.appendChild(slideLink.cloneNode(true));
        if (slideContainer.children.length > 0) {
          cells.push([slideContainer]);
        }
      });
    } else {
      const heading = element.querySelector("h1, h2, h3");
      if (heading) {
        cells.push([heading]);
      }
      const items = element.querySelectorAll('li, article, [class*="card"], [class*="slide"]');
      items.forEach((item) => {
        cells.push([item]);
      });
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "carousel-showcase", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/codeandtheory-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-pc-sdk"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#accessibility-buttons"
      ]);
      const svgImages = element.querySelectorAll('img[src^="data:image/svg+xml"]');
      svgImages.forEach((img) => {
        img.remove();
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "nav.src-sites-candt-components-MainNavigation-header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.src-sites-candt-components-Contact-contact"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".src-sites-candt-components-SentinelIntersect-sentinel"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/codeandtheory-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section, reverseIndex) => {
        const originalIndex = sections.length - 1 - reverseIndex;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
        if (originalIndex > 0) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Main Code and Theory homepage with hero, work showcase, and company introduction",
    urls: [
      "https://www.codeandtheory.com/"
    ],
    blocks: [
      {
        name: "hero-homepage",
        instances: ["section.src-sites-candt-components-HomeNavigation-homeNavigation"]
      },
      {
        name: "cards-portfolio",
        instances: [".src-sites-candt-components-HomepagePromotion-homepagePromotion", ".src-sites-candt-components-Cards-card--project"]
      },
      {
        name: "columns-casestudy",
        instances: ["section.src-sites-candt-components-SingleBlowout-singleBlowout", "section.src-sites-candt-components-SizzleVideo-sizzleVideo"]
      },
      {
        name: "carousel-showcase",
        instances: ["section.src-sites-candt-components-AwardsModule-awardsModule", "section.src-sites-candt-components-CarouselHero-CarouselHeroDesktop-carousel-hero-desktop__container"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Home Navigation Hero",
        selector: "section.src-sites-candt-components-HomeNavigation-homeNavigation",
        style: "dark",
        blocks: ["hero-homepage", "cards-portfolio"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Work Showcase",
        selector: "section.src-sites-candt-components-SizzleVideo-sizzleVideo",
        style: "dark",
        blocks: ["columns-casestudy", "carousel-showcase"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Things We Make",
        selector: "#page-thingsWeMake",
        style: "dark",
        blocks: ["carousel-showcase", "columns-casestudy"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "All Work Grid",
        selector: ".src-sites-candt-components-Cards-card--project",
        style: "dark",
        blocks: ["cards-portfolio"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Page Transition",
        selector: "#transporter-banner--home",
        style: "dark",
        blocks: [],
        defaultContent: [".transporter-banner__title"]
      }
    ]
  };
  var parsers = {
    "hero-homepage": parse,
    "cards-portfolio": parse2,
    "columns-casestudy": parse3,
    "carousel-showcase": parse4
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const pathname = new URL(params.originalURL).pathname;
      const path = WebImporter.FileUtils.sanitizePath(
        pathname === "/" ? "/index" : pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
