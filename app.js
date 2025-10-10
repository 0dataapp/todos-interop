// remoteStorage module
const remoteStorage = new RemoteStorage({
  modules: [todos],
});

remoteStorage.access.claim('todos', 'rw');

const mod = {

  // https://www.w3schools.com/howto/howto_js_draggable.asp
  makeDraggable (elmnt, params = {}) {
    const box = { x1: 0, y1: 0, x2: 0, y2: 0 };

    elmnt.onmousedown = (event) => {
      event = event || window.event;

      if (params.ignoredElement) {
        const rect = params.ignoredElement.getBoundingClientRect();
        const isInside = (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        );

        if (isInside) {
            console.log("Mouse is inside the hit area.");
            return;
        } else {
            console.log("Mouse is outside the hit area.");
        }
      }

      event.preventDefault();
      
      box.x2 = event.clientX;
      box.y2 = event.clientY;
      Object.assign(document, {
        onmouseup: () => document.onmouseup = document.onmousemove = null,
        onmousemove: (event) => {
          event = event || window.event;
          event.preventDefault();
          
          box.x1 = box.x2 - event.clientX;
          box.y1 = box.y2 - event.clientY;
          box.x2 = event.clientX;
          box.y2 = event.clientY;

          elmnt.style.top = (elmnt.offsetTop - box.y1) + 'px';
          elmnt.style.left = (elmnt.offsetLeft - box.x1) + 'px';
        },
      })
    };
  },

};

// setup after page loads
document.addEventListener('DOMContentLoaded', () => {

  (new Widget(remoteStorage)).attach(document.querySelector('widget-container'));

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

  mod.makeDraggable(document.querySelector('intro'), {
    ignoredElement: document.querySelector('#remotestorage-widget'),
  });
  
});
