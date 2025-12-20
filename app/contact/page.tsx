"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import MotionWrapper from "@/components/motion-wrapper"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BlueSiteHeader />

      <main className="flex-1">
        <MotionWrapper className="">
          {/* Contact Form Section */}
          <section className="bg-[#ffd500] py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Lorem ipsum */}
              <div className="flex items-center">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#3d4fd4] leading-tight">Lorem ipsum</h2>
              </div>

              {/* Right Side - Contact Form */}
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#3d4fd4] mb-8 text-center">
                  Contact Us
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-black font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-white border-[#3d4fd4] focus:ring-[#3d4fd4]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-black font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-white border-[#3d4fd4] focus:ring-[#3d4fd4]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-black font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white border-[#3d4fd4] focus:ring-[#3d4fd4]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-black font-medium">
                      What can we help with
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-white border-[#3d4fd4] focus:ring-[#3d4fd4] min-h-[120px]"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#3d4fd4] text-white hover:bg-[#3d4fd4]/90 py-6 text-lg">
                    Contact us
                  </Button>
                </form>
              </div>
            </div>
          </div>
          </section>

        {/* Location Section */}
        <section className="bg-white py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#3d4fd4] mb-12 text-center lg:text-left">
              Our Location
            </h2>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Side - Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/images/queen-27s-20gate-20web-20nw-06.jpeg"
                  alt="International Day of Education - Students with globe"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right Side - Map */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7567!2d32.5825!3d0.3476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMjAnNTEuNCJOIDMywrAzNCc1Ny4wIkU!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
            </div>
          </div>
          </section>

          {/* Extended Footer with Logo and Menu */}
          <section className="bg-[#ffd500] py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Logo */}
              <div className="flex justify-center md:justify-start">
                <div className="relative h-32 w-32">
                  <div className="h-full w-full rounded-full bg-[#3d4fd4]/10 p-2">
                    <div className="grid h-full w-full grid-cols-2 gap-1 rounded-full bg-[#3d4fd4] p-2">
                      <div className="rounded-tl-full bg-white" />
                      <div className="rounded-tr-full bg-[#ffd500]" />
                      <div className="rounded-bl-full bg-[#ffd500]" />
                      <div className="rounded-br-full bg-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center mt-24">
                      <div className="text-xs font-bold uppercase text-[#3d4fd4]">Queensgate</div>
                      <div className="text-[10px] uppercase text-[#3d4fd4]">International School</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#3d4fd4] mb-6">Menu</h3>
                <ul className="space-y-3 text-black">
                  <li>
                    <a href="/" className="hover:text-[#3d4fd4] transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="hover:text-[#3d4fd4] transition-colors">
                      About us
                    </a>
                  </li>
                  <li>
                    <a href="/admissions" className="hover:text-[#3d4fd4] transition-colors">
                      Admissions
                    </a>
                  </li>
                  <li>
                    <a href="/academics" className="hover:text-[#3d4fd4] transition-colors">
                      Academics
                    </a>
                  </li>
                  <li>
                    <a href="/policies" className="hover:text-[#3d4fd4] transition-colors">
                      Policies
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="hover:text-[#3d4fd4] transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="/faq" className="hover:text-[#3d4fd4] transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact us */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#3d4fd4] mb-6">Contact us</h3>
                <div className="space-y-4 text-black">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:queensgateinternational@gmail.com"
                      className="hover:text-[#3d4fd4] transition-colors"
                    >
                      queensgateinternational@gmail.com
                    </a>
                  </p>
                  <p>
                    <strong>Toll Free:</strong> 123456788688
                  </p>
                  <p>
                    <strong>Hours:</strong> Mon - Fri | 08:00 - 17:00. Sat - Sun CLOSED
                  </p>
                  <p>
                    <strong>Location:</strong> Plot 38 Martyr's village, Intinda
                  </p>
                </div>
              </div>
            </div>
          </div>
          </section>
        </MotionWrapper>
      </main>

      <SiteFooter />
    </div>
  )
}
