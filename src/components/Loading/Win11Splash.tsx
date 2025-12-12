export default function Win11Splash() {
  return (
    <section className="h-svh w-screen bg-black relative select-none">
      <img src="/img/Windows11Logo.png" alt="Windows 11 logo" className="win11-logo" />
      <div className="win11-spinner" aria-label="loading" />
      <style jsx>{`
        .win11-logo {
          position: absolute;
          top: 38%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
        }

        .win11-spinner {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 12%;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.18);
          border-top-color: #ffffff;
          animation: win11-spin 0.9s linear infinite;
        }

        @keyframes win11-spin {
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }
      `}</style>
    </section>
  )
}
