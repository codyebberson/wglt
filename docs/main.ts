const iframe = document.querySelector('iframe') as HTMLIFrameElement;

function updateIframe() {
  const hash = window.location.hash;
  const url = hash.slice(1);
  if (url) {
    iframe.src = url;
  }
}

window.addEventListener('load', updateIframe);
window.addEventListener('hashchange', updateIframe);
