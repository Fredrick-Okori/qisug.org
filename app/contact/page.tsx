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
import { motion } from "framer-motion"
import { Mail, Phone, Clock, MapPin, Send } from "lucide-react"
import { CTA } from "@/components/home/cta"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log("Form submitted:", formData)
    setIsSubmitting(false)
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    })
  }

  return (
    <div className="min-h-screen flex flex-col ">
      <BlueSiteHeader />
{/* Full-Page Background Pattern - Independent Layer */}
              <div
                className="fixed inset-0 bg-center bg-repeat -z-10"
                style={{ backgroundImage: "url('/images/pattern.webp')" }}
              />
              
              <motion.div
                className="fixed inset-0 -z-[5]"
                style={{ backgroundColor: '#EFBF04', opacity: 0.88 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.88 }}
                transition={{ duration: 0.4 }}
              />
      <main className="flex-1">
        
          {/* Hero Section */}
          <section className="relative overflow-hidden  pt-[120px] md:pt-[200px] lg:pt-[240px] pb-16">
            <div className="absolute inset-0" />
            <div className="absolute inset-0" />
            
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8" >
              <div className="mx-auto max-w-3xl text-left">
                <h1 className="mb-6 font-serif text-4xl  text-[#053F52] sm:text-5xl lg:text-6xl animate-fade-in">
                  Get in Touch
                </h1>
                <p className="text-lg text-[#053F52] sm:text-xl lg:text-2xl animate-fade-in-up">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16 lg:py-24 bg-[#efbf04]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl">
                <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
                  {/* Contact Info Cards - Left Side */}
                  <div className="space-y-6 lg:col-span-2">
                    <div className="space-y-4">
                      <h2 className="font-serif text-2xl  text-[#053F52] sm:text-3xl">
                        Contact Information
                      </h2>
                      <p className="text-gray-600">
                        Reach out to us through any of these channels
                      </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="space-y-4">
                      <div className="group rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                        <div className="flex items-start space-x-4">
                          <div className="rounded-full bg-[#EFBF04] p-3 transition-colors duration-300 group-hover:bg-[#ffd500]/30">
                            <Mail className="h-6 w-6 text-[#053F52]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-gray-900">Email</h3>
                            <a
                              href="mailto:queensgateinternational@gmail.com"
                              className="text-sm text-gray-600 hover:text-[#053F52] transition-colors break-all"
                            >
                              queensgateinternational@gmail.com
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="group rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                        <div className="flex items-start space-x-4">
                          <div className="rounded-full bg-[#EFBF04] p-3 transition-colors duration-300 group-hover:bg-[#EFBF04]/30">
                            <Phone className="h-6 w-6 text-[#053F52]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-gray-900">Phone</h3>
                            <p className="text-sm text-gray-600">123456788688</p>
                          </div>
                        </div>
                      </div>

                      <div className="group rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                        <div className="flex items-start space-x-4">
                          <div className="rounded-full bg-[#EFBF04] p-3 transition-colors duration-300 group-hover:bg-[#EFBF04]/30">
                            <Clock className="h-6 w-6 text-[#053F52]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-gray-900">Hours</h3>
                            <p className="text-sm text-gray-600">Mon - Fri | 08:00 - 17:00</p>
                            <p className="text-sm text-gray-600">Sat - Sun | CLOSED</p>
                          </div>
                        </div>
                      </div>

                      <div className="group rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                        <div className="flex items-start space-x-4">
                          <div className="rounded-full bg-[#EFBF04] p-3 transition-colors duration-300 group-hover:bg-[#EFBF04]/30">
                            <MapPin className="h-6 w-6 text-[#053F52]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-gray-900">Location</h3>
                            <p className="text-sm text-gray-600">
                              Plot 38 Martyr's village, Intinda
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form - Right Side */}
                  <div className="lg:col-span-3">
                    <div className="rounded-3xl bg-white p-8 shadow-xl border border-gray-100 sm:p-10">
                      <h2 className="mb-8 font-serif text-2xl  text-[#053F52] sm:text-3xl">
                        Send Us a Message
                      </h2>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label
                              htmlFor="firstName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              First Name *
                            </Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) =>
                                setFormData({ ...formData, firstName: e.target.value })
                              }
                              className="h-12 rounded-xl border-gray-300 bg-gray-50 transition-all focus:border-[#053F52] focus:bg-white focus:ring-2 focus:ring-[#053F52]/20"
                              placeholder="John"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="lastName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Last Name *
                            </Label>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) =>
                                setFormData({ ...formData, lastName: e.target.value })
                              }
                              className="h-12 rounded-xl border-gray-300 bg-gray-50 transition-all focus:border-[#053F52] focus:bg-white focus:ring-2 focus:ring-[#053F52]/20"
                              placeholder="Doe"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="h-12 rounded-xl border-gray-300 bg-gray-50 transition-all focus:border-[#053F52] focus:bg-white focus:ring-2 focus:ring-[#053F52]/20"
                            placeholder="john.doe@example.com"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                            How can we help? *
                          </Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                            className="min-h-[160px] rounded-xl border-gray-300 bg-gray-50 transition-all focus:border-[#053F52] focus:bg-white focus:ring-2 focus:ring-[#053F52]/20 resize-none"
                            placeholder="Tell us about your inquiry..."
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="group h-14 w-full rounded-xl bg-gradient-to-r from-[#053F52] to-[#053F52] text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="mr-2 h-5 w-5 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              Send Message
                              <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </span>
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                  <h2 className="mb-4 font-serif text-3xl  text-[#053F52] sm:text-4xl lg:text-5xl">
                    Visit Our Campus
                  </h2>
                  <p className="text-lg text-gray-600">
                    Come see our facilities and meet our team in person
                  </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Campus Image */}
                  <div className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src="/images/queen-27s-20gate-20web-20nw-06.jpeg"
                        alt="Queensgate International School Campus"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#053F52]/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  </div>

                  {/* Map */}
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <div className="aspect-[4/3] relative">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7567!2d32.5825!3d0.3476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMjAnNTEuNCJOIDMywrAzNCc1Ny4wIkU!5e0!3m2!1sen!2s!4v1234567890"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                        title="Queensgate International School Location"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        <CTA/>
  
      </main>

      <SiteFooter />
    </div>
  )
}