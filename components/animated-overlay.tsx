"use client"

import { motion } from "framer-motion"
import React from "react"

export default function AnimatedOverlay() {
  return (
    <>
      <div
        className="absolute inset-0 bg-center bg-repeat"
        style={{ backgroundImage: "url('/images/pattern.webp')" }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: '#EFBF04', opacity: 0.88 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.88 }}
        transition={{ duration: 0.4 }}
      />
    </>
  )
}
