export default function ProfilePicture({ className }: { className?: string }) {
  return (
    <div className={`rounded-full bg-profile-pic bg-cover bg-center ${className || ''}`}>
      {/* Profile picture background from CSS */}
    </div>
  )
}
