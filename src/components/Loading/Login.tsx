import LoginForm from './LoginForm'

export default function Login() {
  return (
    <section 
      className="h-svh w-screen relative overflow-hidden z-10 bg-black"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dlpskz98w/image/upload/v1765632412/Windows11lock_kmlruz.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Blur/tint overlay applied over shared wallpaper */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-44 h-44 rounded-full bg-white/15 border-2 border-white/25 overflow-hidden flex items-center justify-center">
            <img 
              src="https://res.cloudinary.com/dlpskz98w/image/upload/v1765632519/profile_t066kq.png" 
              alt="User Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML = '<svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" fill="white" fill-opacity="0.8" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="white" fill-opacity="0.8" /></svg>'
              }}
            />
          </div>
          <div className="text-white mt-6 text-2xl md:text-3xl font-semibold">SNK</div>
          <LoginForm className="mt-4" />
        </div>
      </div>

      <style jsx>{`
        section::after {
          content: '';
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.35);
          pointer-events: none;
        }
      `}</style>
    </section>
  )
}
