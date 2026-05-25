export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const videoRow = rows[0];
  const navRow = rows[1];

  // Extract video URLs from the first row
  const videoLinks = videoRow.querySelectorAll('a');
  const videoUrls = [...videoLinks].map((a) => a.href).filter((url) => url.endsWith('.mp4'));

  // Build video background container
  const videoContainer = document.createElement('div');
  videoContainer.className = 'hero-homepage-video-bg';

  if (videoUrls.length > 0) {
    const video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');

    const source = document.createElement('source');
    [source.src] = videoUrls;
    source.type = 'video/mp4';
    video.append(source);
    videoContainer.append(video);

    // Store additional video URLs for potential cycling
    if (videoUrls.length > 1) {
      video.dataset.videos = JSON.stringify(videoUrls);
      video.dataset.currentIndex = '0';

      video.addEventListener('ended', () => {
        const urls = JSON.parse(video.dataset.videos);
        let idx = parseInt(video.dataset.currentIndex, 10);
        idx = (idx + 1) % urls.length;
        video.dataset.currentIndex = String(idx);
        video.querySelector('source').src = urls[idx];
        video.load();
        video.play();
      });
      // Disable loop so ended event fires
      video.loop = false;
    }
  }

  // Build nav links container
  const navContainer = document.createElement('nav');
  navContainer.className = 'hero-homepage-nav';
  const navCell = navRow.querySelector(':scope > div');
  if (navCell) {
    const links = navCell.querySelectorAll('a');
    links.forEach((a) => {
      const linkWrapper = document.createElement('div');
      linkWrapper.className = 'hero-homepage-nav-item';
      const newLink = a.cloneNode(false);
      newLink.textContent = a.textContent;
      linkWrapper.append(newLink);
      navContainer.append(linkWrapper);
    });
  }

  // Replace block content
  block.textContent = '';
  block.append(videoContainer);
  block.append(navContainer);
}
