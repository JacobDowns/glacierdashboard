'use client'

import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'

interface ColorbarProps {
  label: string
  min: number
  max: number
  colormap?: (t: number) => string
  tickCount?: number
  width?: number
  height?: number
}

const ColorBar = ({
  label,
  min,
  max,
  colormap = d3.interpolateViridis,
  tickCount = 5,
  width = 500,
  height = 60,
}: ColorbarProps) => {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove() // Clear previous render

    const margin = { top: 10, right: 20, bottom: 10, left: 10 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const defs = svg.append('defs')

    const gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`
    const n = 32

    // Create gradient
    const gradient = defs
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%')

    for (let i = 0; i < n; ++i) {
      gradient
        .append('stop')
        .attr('offset', `${(100 * i) / (n - 1)}%`)
        .attr('stop-color', colormap(i / (n - 1)))
    }

    // Color bar rectangle
    svg
      .append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .style('fill', `url(#${gradientId})`)

    // Axis
    const scale = d3.scaleLinear().domain([min, max]).range([margin.left, width - margin.right])
    const axis = d3.axisBottom(scale).ticks(tickCount)

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(axis)

    // Label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .text(label)
  }, [label, min, max, tickCount, width, height, colormap])

  return <svg ref={ref} width={width} height={height + 30} />
}

export default ColorBar