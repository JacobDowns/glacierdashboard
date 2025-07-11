'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  Typography,
  IconButton,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  Slider
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import * as d3 from 'd3'
import { Dataset } from '@/app/types/datasets'
import { colormaps, getColormapInterpolator } from '@/app/lib/colormaps'
import RangeSlider from './RangeSlider'
import ColorBar from './ColorBar'
import { InlineMath } from 'react-katex'
import { on } from 'events'

interface Props {
  dataset: Dataset,
  colormap: string,
  range: [number, number],
  onColormapChange: (colormap: string) => void,
  onRangeChange: (range: [number, number]) => void,
  timeIndex: number,
  setTimeIndex: (index: number) => void,
  layerOpacity: number,
  setLayerOpacity: (opacity: number) => void
}

export default function GlacierMapLegend({
  dataset,
  colormap,
  range,
  onColormapChange,
  onRangeChange,
  timeIndex,
  setTimeIndex,
  layerOpacity,
  setLayerOpacity
}: Props) {
  const [expanded, setExpanded] = useState(false)

  const isContinuous = dataset.data_type_type === 'continuous'
  const timeDependent = dataset.dataset_times.length > 2;

  const times = dataset.dataset_time_format === "range" ?  dataset.dataset_times.slice(0,-1) : dataset.dataset_times

  const formattedTimes = times.map(
    t => {
      const date = new Date(t);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${month}/${day}/${year}`;
  });


  const timeMarks = formattedTimes.map((label, index) => {
    const timeSteps = formattedTimes.length - 1

    dataset.dataset_times.length
    if (index === 0 || index === timeSteps) {
      return { value: index, label }
    }
    return { value: index }  // tick mark only, no label
  })

  const selectedInterpolator = getColormapInterpolator(colormap)

  if (!dataset) return null

  return (
    <Box sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10 }}>
      <Card sx={{ p: 2, bgcolor: 'white', boxShadow: 3, minWidth: 375 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            {dataset.data_type_name}
            {dataset.data_type_unit ? (<> (<InlineMath math={dataset.data_type_latex_unit} />)</>) : ''}
          </Typography>
          <IconButton size="small" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>



        {isContinuous ? (
          <ColorBar
            label=""
            min={range[0]}
            max={range[1]}
            tickCount={4}
            width={350}
            height={50}
            colormap={selectedInterpolator}
          />
        ) : (
          <Box mt={1}>
            {dataset.data_type_categories.map((cat, i) => {
              const colorScale = d3
                .scaleOrdinal(d3.schemeCategory10)
                .domain(dataset.data_type_categories.map(String))
              return (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      backgroundColor: colorScale(String(cat)),
                    }}
                  />
                  <Typography variant="body2">{dataset.data_type_labels[i]}</Typography>
                </Box>
              )
            })}
          </Box>
        )}

        {timeDependent && (
          <>
            <Typography variant="body2" gutterBottom>
              Time
            </Typography>
            <Box mt={2} sx={{ paddingLeft: 3, paddingRight: 3 }}>

              <Slider
                value={timeIndex}
                onChange={(event, value) => {
                  setTimeIndex(value)
                  console.log('change', value);
                }}
                step={1}
                min={0}
                max={formattedTimes.length - 1}
                marks={timeMarks}
                valueLabelDisplay="auto"
                valueLabelFormat={(index) => formattedTimes[index]}
              />
            </Box>
          </>
        )}

        <Collapse in={expanded}>
          <Box mt={2}>
            {isContinuous && (
              <>
                <Typography variant="body2">Range</Typography>
                <RangeSlider
                  selectedDataset={dataset}
                  value={range}
                  onChange={onRangeChange}
                />
                <Typography variant="body2" mt={2}>Colormap</Typography>
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <Select
                    value={colormap}
                    onChange={(e) => onColormapChange(e.target.value)}
                  >
                    {colormaps.map((c: { name: string }) => (
                      <MenuItem key={c.name} value={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            <Typography variant="body2" mt={2}>Opacity</Typography>
            <FormControl fullWidth size="small" sx={{ mt: 1, px: 1 }}>
              <Slider
                value={layerOpacity}
                onChange={(_, value) => {
                  if (typeof value === 'number') {
                    setLayerOpacity(value)
                  }
                }}
                valueLabelDisplay="auto"
                step={0.1}
                marks
                min={0}
                max={1}
              />
            </FormControl>
          </Box>
        </Collapse>
      </Card>
    </Box>
  )
}
