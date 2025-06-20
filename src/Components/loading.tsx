import React from 'react'
import { Cardio } from 'ldrs/react'
import 'ldrs/react/Cardio.css'

export default function Loading({ size = 50 }) {
  return (
    <Cardio
      size={size}  // Dynamically sets the size
      stroke="4"
      color="#297c8f"
      // color="#81D2E4"
      speed="1"
    />
  )
}
