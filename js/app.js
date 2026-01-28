 (() => {
   const rightScroll = document.getElementById("rightScroll");

   function isWKWebViewBridgeAvailable() {
     return !!(window.webkit &&
               window.webkit.messageHandlers &&
               window.webkit.messageHandlers.bridge &&
               typeof window.webkit.messageHandlers.bridge.postMessage === "function");
   }

   function postToNative(action, payload = {}) {
     if (!isWKWebViewBridgeAvailable()) return false;
     window.webkit.messageHandlers.bridge.postMessage({ action, payload });
     return true;
   }

   function openExternal(url) {
     // If embedded, ask native to open.
     if (postToNative("openExternal", { url })) return;
     window.location.href = url;
   }

   function scrollRightPanelTo(selector) {
     if (!rightScroll) return;
     const target = document.querySelector(selector);
     if (!target) return;

     const top = target.getBoundingClientRect().top - rightScroll.getBoundingClientRect().top;
     rightScroll.scrollTo({ top: rightScroll.scrollTop + top - 10, behavior: "smooth" });
   }

   // Intercept “scroll to section” links so they scroll the right panel.
   document.addEventListener("click", (e) => {
     const a = e.target.closest("a");
     if (!a) return;

     const scrollTo = a.getAttribute("data-scrollto");
     if (scrollTo) {
       e.preventDefault();
       scrollRightPanelTo(scrollTo);
       return;
     }

     const action = a.getAttribute("data-action");
     if (!action) return;

     e.preventDefault();

     switch (action) {
       case "download":
         // Replace with your real download or checkout URL.
         openExternal("https://example.com/download");
         break;

       case "buy-pro":
         openExternal("https://buy.stripe.com/14A6oH3o26hg5fjgwneUU00");
         break;

       case "buy-commercial":
         openExternal("https://buy.stripe.com/28E28re2G6hgbDHbc3eUU01");
         break;

       case "support":
         openExternal("info@paraxis.tech");
         break;

       default:
         // Unknown action: no-op
         break;
     }
   });

   // If user lands with #license in URL, scroll right panel to it.
   window.addEventListener("load", () => {
     if (window.location.hash) {
       const sel = window.location.hash;
       // Only handle if it exists
       if (document.querySelector(sel)) {
         // Prevent browser from trying to scroll body
         setTimeout(() => scrollRightPanelTo(sel), 30);
       }
     }
   });
 })();


