"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // trigger a micro task to allow initial DOM paint before animate
    setVisible(false)
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <div key={pathname} className={`page-transition ${visible ? "enter" : ""}`}>
      {children}
    </div>
  )
}
