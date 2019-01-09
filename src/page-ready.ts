// pageReady -- informs you when the page is ready.
//
// Interface:
//   pageReady: Thenable<void>
//
// Usage:
//   import { pageReady } from 'page-ready';
//   pageReady.then(function () {
//       console.log("the page is ready!");
//   });
//

export let pageReady: Promise<void> = new Promise(function (resolve) {
    let isReady = false;
    let doc = document;
    let win = window;
    let loaded = function () {
        if (isReady) {
            return;
        }
        isReady = true;

        doc.removeEventListener("DOMContentLoaded", loaded, false);
        win.removeEventListener("load", loaded, false);

        resolve(void 0);
    };

    if (doc.readyState === "complete") {
        isReady = true;
        resolve(void 0);
    } else {
        doc.addEventListener("DOMContentLoaded", loaded, false);
        win.addEventListener("load", loaded, false);
    }
});

export default pageReady;
