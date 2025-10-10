// remoteStorage module
const remoteStorage = new RemoteStorage({
  modules: [todos],
});

remoteStorage.access.claim('todos', 'rw');

// setup after page loads
document.addEventListener('DOMContentLoaded', () => {

  (new Widget(remoteStorage)).attach('widget-wrapper');

  remoteStorage.on('ready', () => {
    if (!remoteStorage.remote.token) {
      return;
    }

    Array.from(document.querySelectorAll('project iframe')).forEach(e => {
      const parent = e.parentElement;
      e.remove()

      const source = e.src;
      e.src = `${ source }#remotestorage=${ remoteStorage.remote.userAddress }&access_token=${ remoteStorage.remote.token }`.replace(/#+/g, '#');
      parent.appendChild(e);
      
      setTimeout(() => e.src = source, 3000);
    });
  });
  
});
