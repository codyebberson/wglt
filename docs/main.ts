const iframe = document.querySelector('iframe') as HTMLIFrameElement;

function updateIframe() {
  iframe.src = window.location.hash.slice(1) || 'home.html';
}

updateIframe();

window.addEventListener('hashchange', updateIframe);
