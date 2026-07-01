(function () {
  var script =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

  var botId = script.getAttribute("data-bot-id");
  if (!botId) return;

  var origin = new URL(script.src).origin;
  var chatUrl = origin + "/chat/" + botId;

  /* ── Floating button ── */
  var btn = document.createElement("button");
  btn.setAttribute("aria-label", "Open chat");
  btn.style.cssText = [
    "position:fixed",
    "bottom:24px",
    "right:24px",
    "width:60px",
    "height:60px",
    "border-radius:50%",
    "background:linear-gradient(135deg,#7c3aed,#ea580c)",
    "color:white",
    "font-size:26px",
    "border:none",
    "cursor:pointer",
    "box-shadow:0 4px 20px rgba(124,58,237,0.4)",
    "z-index:2147483647",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "transition:transform 0.2s",
  ].join(";");
  btn.textContent = "💬";
  btn.onmouseenter = function () { btn.style.transform = "scale(1.1)"; };
  btn.onmouseleave = function () { btn.style.transform = "scale(1)"; };

  /* ── Chat container ── */
  var container = document.createElement("div");
  container.style.cssText = [
    "position:fixed",
    "bottom:96px",
    "right:24px",
    "width:380px",
    "height:560px",
    "border-radius:16px",
    "overflow:hidden",
    "box-shadow:0 8px 40px rgba(0,0,0,0.3)",
    "z-index:2147483646",
    "display:none",
    "border:1px solid rgba(124,58,237,0.3)",
    "transition:opacity 0.2s,transform 0.2s",
    "opacity:0",
    "transform:translateY(12px)",
  ].join(";");

  var iframe = document.createElement("iframe");
  iframe.src = chatUrl;
  iframe.title = "CustomBot Chat";
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("width", "380");
  iframe.setAttribute("height", "560");
  iframe.style.cssText = "width:100%;height:100%;border:none;overflow:hidden;display:block;";
  container.appendChild(iframe);

  /* ── Toggle ── */
  var isOpen = false;
  btn.onclick = function () {
    isOpen = !isOpen;
    if (isOpen) {
      container.style.display = "block";
      requestAnimationFrame(function () {
        container.style.opacity = "1";
        container.style.transform = "translateY(0)";
      });
      btn.textContent = "✕";
    } else {
      container.style.opacity = "0";
      container.style.transform = "translateY(12px)";
      setTimeout(function () { container.style.display = "none"; }, 200);
      btn.textContent = "💬";
    }
  };

  /* ── Mobile: full-screen on narrow viewports ── */
  function applyMobileStyles() {
    if (window.innerWidth < 480) {
      container.style.width = "100vw";
      container.style.height = "100vh";
      container.style.bottom = "0";
      container.style.right = "0";
      container.style.borderRadius = "0";
      iframe.setAttribute("width", String(window.innerWidth));
      iframe.setAttribute("height", String(window.innerHeight));
    } else {
      container.style.width = "380px";
      container.style.height = "560px";
      container.style.bottom = "96px";
      container.style.right = "24px";
      container.style.borderRadius = "16px";
      iframe.setAttribute("width", "380");
      iframe.setAttribute("height", "560");
    }
  }
  applyMobileStyles();
  window.addEventListener("resize", applyMobileStyles);

  document.body.appendChild(container);
  document.body.appendChild(btn);
})();
