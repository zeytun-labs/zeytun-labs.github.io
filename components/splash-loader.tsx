export function SplashLoader() {
  const fullPath =
    "M0 21.4821C10.2275 21.4821 18.5187 29.7726 18.5189 40C8.29146 40 0.000269965 31.7095 0 21.4821ZM40 21.4821C39.9997 31.7093 31.7093 39.9998 21.4821 40C21.4823 29.7727 29.7727 21.4823 40 21.4821ZM18.5189 0C18.5189 10.2276 10.2276 18.5189 0 18.5189C0 8.2913 8.2913 0 18.5189 0ZM21.4821 0C31.7095 0.000236235 40 8.29144 40 18.5189C29.7726 18.5187 21.4821 10.2275 21.4821 0Z"

  const maskSvg = `url('data:image/svg+xml;utf8,<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="${fullPath}" fill="black"/></svg>')`

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
#app-splash {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: #070807;
  color: var(--primary, oklch(0.768 0.233 130.85));
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s ease;
  user-select: none;
}
#app-splash.splash-fade {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.splash-logo-wrap {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.splash-sheen-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: screen;
  mask-image: ${maskSvg};
  mask-size: 100% 100%;
  -webkit-mask-image: ${maskSvg};
  -webkit-mask-size: 100% 100%;
  overflow: hidden;
}
.splash-sheen-beam {
  position: absolute;
  top: -60%;
  left: -60%;
  width: 220%;
  height: 220%;
  background: linear-gradient(
    90deg,
    transparent 20%,
    rgba(255, 255, 255, 0.05) 35%,
    rgba(255, 255, 255, 0.35) 48%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(255, 255, 255, 0.35) 52%,
    rgba(255, 255, 255, 0.05) 65%,
    transparent 80%
  );
  animation: splashSheenMove 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes splashSheenMove {
  0% { transform: translateX(-160%) rotate(35deg); }
  45% { transform: translateX(180%) rotate(35deg); }
  100% { transform: translateX(180%) rotate(35deg); }
}
.splash-track {
  width: 64px;
  height: 4px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
}
.splash-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  border-radius: 9999px;
  background: var(--primary, oklch(0.768 0.233 130.85));
  box-shadow: 0 0 10px oklch(0.768 0.233 130.85 / 0.7);
  animation: splashProgress 1.4s ease-in-out infinite;
}
@keyframes splashProgress {
  0% { transform: translateX(-120%); }
  50% { transform: translateX(30%); }
  100% { transform: translateX(220%); }
}
@media (prefers-reduced-motion: reduce) {
  .splash-sheen-beam, .splash-bar {
    animation: none;
  }
}
`,
        }}
      />
      <div id="app-splash" aria-hidden="true">
        <div className="splash-logo-wrap">
          <svg
            width="56"
            height="56"
            viewBox="0 0 40 40"
            fill="currentColor"
            style={{ filter: "drop-shadow(0 0 12px oklch(0.768 0.233 130.85 / 0.35))" }}
          >
            <path d={fullPath} />
          </svg>
          <div className="splash-sheen-overlay">
            <div className="splash-sheen-beam" />
          </div>
        </div>
        <div className="splash-track">
          <div className="splash-bar" />
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function() {
  function dismiss() {
    var el = document.getElementById('app-splash');
    if (el && !el.classList.contains('splash-fade')) {
      el.classList.add('splash-fade');
      setTimeout(function() {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }, 350);
    }
  }
  if (document.readyState === 'complete') {
    setTimeout(dismiss, 150);
  } else {
    window.addEventListener('load', function() {
      setTimeout(dismiss, 150);
    });
    setTimeout(dismiss, 3000);
  }
})();
`,
        }}
      />
    </>
  )
}
