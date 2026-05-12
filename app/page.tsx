import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Queensgate International School | Coming Soon",
  description: "Queensgate International School is coming soon. Your place and space to thrive.",
}

export default function HoldingPage() {
  return (
    <div className="min-h-screen bg-[#032f36] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background pattern */}
      <div
        className="absolute inset-0 bg-center bg-repeat opacity-10"
        style={{ backgroundImage: "url('/images/blue_sholastic_pattern.webp')" }}
      />

      {/* Gold accent bar — top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#efbf04]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-10">
          <Image
            src="/images/logo_white.png"
            alt="Queensgate International School"
            width={140}
            height={140}
            className="mx-auto"
            priority
          />
        </div>

        {/* School name */}
        <h1 className="font-serif text-white text-4xl sm:text-5xl font-medium leading-tight mb-4">
          Queensgate<br />International School
        </h1>

        {/* Tagline */}
        <p className="font-serif text-white/70 text-lg sm:text-xl mb-10">
          Your place and space to{" "}
          <span className="text-[#efbf04] italic">thrive</span>
        </p>

        {/* Divider */}
        <div className="w-16 h-px bg-[#efbf04] mb-10" />

      </div>

      {/* Gold accent bar — bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#efbf04]" />
    </div>
  )
}
