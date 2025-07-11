"use client"

import React from 'react'
import { Slider, Box } from '@mui/material'
import { Dataset } from '@/app/types/datasets'

type RangeSliderProps = {
  selectedDataset: Dataset | null
  value: [number, number]
  onChange: (value: [number, number]) => void
}
export default function RangeSlider({
  selectedDataset,
  value,
  onChange,
}: RangeSliderProps) {
  const marks = React.useMemo(() => {
    if (!selectedDataset) return []

    const min = selectedDataset.data_type_min_val
    const max = selectedDataset.data_type_max_val
    const numMarks = 5
    const step = (max - min) / (numMarks - 1)

    return Array.from({ length: numMarks }, (_, i) => {
      const val = Math.round(min + i * step)
      return { value: val, label: val.toString() }
    })
  }, [selectedDataset])

  if (!selectedDataset) return null

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onChange([newValue[0], newValue[1]])
    }
  }

  return (
    <Box sx={{ width: 300, mt: 1 }}>
      <Slider
        value={value}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={selectedDataset.data_type_min_val}
        max={selectedDataset.data_type_max_val}
        step={1}
        marks={marks}
        disableSwap
      />
    </Box>
  )
}