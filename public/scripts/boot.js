(function () {
  try {
    if (/Win/i.test(navigator.platform) || /Windows NT/i.test(navigator.userAgent)) {
      document.documentElement.setAttribute("data-force-motion", "true");
    }

    function isInjectedAttr(name) {
      return (
        name === "bis_skin_checked" ||
        name === "bis_register" ||
        name === "data-cursor-ref" ||
        name.indexOf("__processed_") === 0
      );
    }

    function stripNode(node) {
      if (!node || node.nodeType !== 1 || !node.attributes) return;
      var names = [];
      for (var i = 0; i < node.attributes.length; i++) names.push(node.attributes[i].name);
      for (var j = 0; j < names.length; j++) {
        if (isInjectedAttr(names[j])) node.removeAttribute(names[j]);
      }
    }

    function stripTree(root) {
      if (!root) return;
      stripNode(root);
      var all = root.getElementsByTagName("*");
      for (var i = 0; i < all.length; i++) stripNode(all[i]);
    }

    function run() {
      stripTree(document.documentElement);
    }

    run();
    if (typeof queueMicrotask === "function") queueMicrotask(run);
    else setTimeout(run, 0);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run, { once: true });
    }
  } catch (e) {}
})();
