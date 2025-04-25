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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import * as d3 from 'd3'
import { Dataset } from '@/app/types/datasets'
import { colormaps, getColormapInterpolator } from '@/app/lib/colormaps'
import RangeSlider from './RangeSlider'
import ColorBar from './ColorBar'

interface Props {
  dataset: Dataset,
  colormap: string,
  range: [number, number],
  onColormapChange: (colormap: string) => void,
  onRangeChange: (range: [number, number]) => void
}

export default function GlacierMapLegend({
  dataset,
  colormap,
  range,
  onColormapChange,
  onRangeChange,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  const isContinuous = dataset?.data_type_type === 'continuous'

  const selectedInterpolator = getColormapInterpolator(colormap)

  // Update range if dataset changes
  useEffect(() => {
    if (!dataset) return

    console.log('here');
  }, [range])

  if (!dataset) return null

  return (
    <Box sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10 }}>
      <Card sx={{ p: 2, bgcolor: 'white', boxShadow: 3, minWidth: 280 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            {dataset.data_type_name}
            {dataset.data_type_unit ? ` (${dataset.data_type_unit})` : ''}
          </Typography>
          <IconButton size="small" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? <CloseIcon fontSize="small" /> : <AddIcon fontSize="small" />}
          </IconButton>
        </Box>

        {isContinuous ? (
          <>
            <ColorBar
              label=""
              min={range[0]}
              max={range[1]}
              tickCount={4}
              width={280}
              height={50}
              colormap={selectedInterpolator}
            />
            <Collapse in={expanded}>
              <Box mt={2}>
                <Typography variant="body2">Range</Typography>
                <RangeSlider
                  selectedDataset={dataset}
                  value={range}
                  onChange={onRangeChange}
                />
                <Typography variant="body2" mt={2}>
                  Colormap
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <Select
                    value={colormap}
                    onChange={(e) => onColormapChange(e.target.value)}
                  >
                    {colormaps.map((c : any) => (
                      <MenuItem key={c.name} value={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Collapse>
          </>
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
      </Card>
    </Box>
  )
}
