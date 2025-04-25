import * as d3 from 'd3';

export type Colormap = {
  name: string;
  interpolator: (t: number) => string;
};

export const colormaps: Colormap[] = [
  { name: 'viridis', interpolator: d3.interpolateViridis },
  { name: 'inferno', interpolator: d3.interpolateInferno },
  { name: 'plasma', interpolator: d3.interpolatePlasma },
  { name: 'magma', interpolator: d3.interpolateMagma },
  { name: 'RdBu', interpolator: d3.interpolateRdBu },
];

export function getColormapInterpolator(name: string): (t: number) => string {
  return colormaps.find((c) => c.name === name)?.interpolator ?? d3.interpolateViridis;
}