import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"

export default function PoliciesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BlueSiteHeader />

      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#3d4fd4] mb-12 text-center lg:text-left leading-tight">
              Lorem ipsum dolor sit amet, consectetuer
            </h1>

            <div className="grid md:grid-cols-2 gap-8 border-t-4 border-[#3d4fd4] pt-12">
              {/* Left Column */}
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-gray-800">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                  laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                  ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor
                  in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis
                  at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue
                  duis dolore te feugait nulla facilisi.
                </p>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-gray-800">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                  laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                  ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor
                  in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis
                  at vero eros et ac.
                </p>
              </div>
            </div>

            {/* Additional Content Section */}
            <div className="mt-12 bg-[#ffd500] rounded-lg p-8 lg:p-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3d4fd4] mb-6 leading-tight">
                Lorem ipsum dolor sit amet, con-
              </h2>

              <div className="space-y-6 text-black">
                <p className="text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                  laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                  ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor
                  in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis
                  at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue
                  duis dolore te feugait nulla facilisi.
                </p>

                <p className="text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                  laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                  ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                </p>

                <p className="text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                  laoreet dolore magna aliquam erat volutpat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
