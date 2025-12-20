"use client"

import React from "react"
import { motion } from "framer-motion"

type Props = {
  children: React.ReactNode
  className?: string
}

const variants = {
  hidden: { opacity: 0, y: 8, scale: 0.998 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: [0.2, 0.9, 0.2, 1] },
  },
  exit: { opacity: 0, y: 6, scale: 0.998, transition: { duration: 0.28 } },
}

export default function MotionWrapper({ children, className }: Props) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
