import Link from "next/link"
import { MapPin, Clock, Phone } from "lucide-react"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-[#203dce] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Plot 38 Martyr's village, Intinda</span>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Mon - Fri | 08:00 - 17:00. Sat - Sun CLOSED</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Toll Free: 123456788688</span>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-3">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#3d4fd4] p-2 text-white hover:bg-[#3d4fd4]/90 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#3d4fd4] p-2 text-white hover:bg-[#3d4fd4]/90 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#3d4fd4] p-2 text-white hover:bg-[#3d4fd4]/90 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
