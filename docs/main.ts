function getIframeUrl() {
  const hash = window.location.hash;
  return hash.slice(1) || 'home.html';
}

function updateIframe() {
  const url = getIframeUrl();
  if (url) {
    iframe.src = url;
  }
}

const iframe = document.querySelector('iframe') as HTMLIFrameElement;
iframe.src = getIframeUrl();

window.addEventListener('hashchange', updateIframe);
