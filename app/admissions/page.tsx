import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  GraduationCap,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from "lucide-react"

const admissionSteps = [
  {
    step: 1,
    title: "Submit Application",
    description: "Complete our online application form with basic student and family information.",
    icon: FileText
  },
  {
    step: 2,
    title: "Document Review",
    description: "Submit academic records, recommendation letters, and any required assessments.",
    icon: CheckCircle
  },
  {
    step: 3,
    title: "Assessment & Interview",
    description: "Complete entrance assessments and participate in an interview with our admissions team.",
    icon: Users
  },
  {
    step: 4,
    title: "Admission Decision",
    description: "Receive your admission decision and complete enrollment formalities.",
    icon: GraduationCap
  }
]

const admissionRequirements = [
  "Completed application form",
  "Academic transcripts from previous schools",
  "Two letters of recommendation",
  "Personal statement or essay",
  "Proof of English proficiency (if applicable)",
  "Copy of passport or birth certificate",
  "Recent photograph"
]

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BlueSiteHeader />

      <main className="flex-1 bg-[#ffd500]">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#3d4fd4] mb-12 text-center lg:text-left leading-tight">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
            </h1>

            <div className="bg-white/30 rounded-lg p-8 lg:p-12 space-y-6 text-black shadow-lg backdrop-blur-sm">
              <p className="text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor
                in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at
                vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis
                dolore te feugait nulla facilisi.
              </p>

              <p className="text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
              </p>

              <p className="text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor
                in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at
                vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis
                dolore te feugait nulla facilisi.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
