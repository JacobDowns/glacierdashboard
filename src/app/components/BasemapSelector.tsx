import { FormControl, InputLabel, Select, MenuItem, Box, Stack } from '@mui/material';
import BASEMAPS from "../lib/basemaps";

type Props = {
  basemap: string;
  setBasemap: (name: string) => void;
  selectedSubregion: "parks" | "o1" | "o2" | "None";
  setSelectedSubregion: (subregion: "parks" | "o1" | "o2" | "None") => void;
};

export default function BasemapSelector({
  basemap,
  setBasemap,
  selectedSubregion,
  setSelectedSubregion }: Props) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: 1,
        borderRadius: 1,
        minWidth: 200,
      }}
    >
      <Stack spacing={1}>
        <FormControl fullWidth size="small">
          <InputLabel id="basemap-label">Basemap</InputLabel>
          <Select
            labelId="basemap-label"
            value={basemap}
            label="Basemap"
            onChange={(e) => setBasemap(e.target.value)}
          >
            {Object.keys(BASEMAPS).map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel id="region-label">Subregions</InputLabel>
          <Select
            labelId="region-label"
            value={selectedSubregion}
            label="Subregions"
            onChange={(e) => setSelectedSubregion(e.target.value as "parks" | "o1" | "o2" | "None")}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="o1">RGI Regions</MenuItem>
            <MenuItem value="o2">RGI Subregions</MenuItem>
            <MenuItem value="parks">National Parks</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}