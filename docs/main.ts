const iframe = document.querySelector('iframe') as HTMLIFrameElement;

function updateIframe(): void {
  iframe.src = window.location.hash.slice(1) || 'home.html';
}

updateIframe();

window.addEventListener('hashchange', updateIframe);
