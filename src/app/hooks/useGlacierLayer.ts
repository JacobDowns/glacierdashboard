import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { Dataset } from "@/app/types/datasets";
import { getColormapInterpolator } from "@/app/lib/colormaps";

type SelectedGlacier = { gid: number; rgi_id: string } | null;

export function useGlacierLayer(
  mapRef: React.RefObject<maplibregl.Map | null>,
  mapLoaded: boolean,
  selectedDataset: Dataset,
  colormap: string,
  range: [number, number],
  selectedGlacier: SelectedGlacier,
  layerOpacity: number
) {
  const vectorLayerId = "vector-layer";
  const outlineLayerId = "selected-glacier-layer";
  const rasterSourceId = "raster-source";
  const rasterLayerId = "raster-layer";
  const vectorSourceId = "vector-source";


  // Setup glacier layer and outline
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !selectedDataset) return;

    const interpolator = getColormapInterpolator(colormap);
    const [min, max] = range;
    const isRaster = selectedDataset.dataset_format === "raster";
    const datasetName = `${selectedDataset.collection_short_name}_${selectedDataset.dataset_short_name}`;

    const colorStops = Array.from({ length: 16 }, (_, i) => {
      const t = i / 15;
      const value = min + t * (max - min);
      return [value, interpolator(t)];
    }).flat();

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const DATA_URL = `${process.env.NEXT_PUBLIC_DATA_URL}/${selectedDataset.collection_short_name}/${selectedDataset.dataset_short_name}/mosaic.json`

    const tilesUrl =
      isRaster
        ? `${API_URL}/vector_tiles/tiles/{z}/{x}/{y}`
        : `${API_URL}/vector_tiles/tiles/{z}/{x}/{y}?dataset_name=${datasetName}`;

    const rasterTilesUrl = 
    `${API_URL}/mosaicjson/tiles/WebMercatorQuad/{z}/{x}/{y}@2x?url=${DATA_URL}&rescale=${min},${max}&colormap_name=${colormap}&format=png&unscale=true`;

    // Clean up previous layers/sources
    if (map.getLayer(vectorLayerId)) map.removeLayer(vectorLayerId);
    if (map.getLayer(outlineLayerId)) map.removeLayer(outlineLayerId);
    if (map.getSource(vectorSourceId)) map.removeSource(vectorSourceId);
    if(map.getLayer(rasterLayerId)) map.removeLayer(rasterLayerId);
    if(map.getSource(rasterSourceId)) map.removeSource(rasterSourceId);


    if(isRaster) {
      map.addSource(rasterSourceId, {
        type: "raster",
        tiles: [rasterTilesUrl],
        minzoom: 0,
        maxzoom: 14,
      });
      map.addLayer({
        id: rasterLayerId,
        type: "raster",
        source: rasterSourceId,
        paint: {
          'raster-opacity': layerOpacity
        }
      });
    }

    map.addSource(vectorSourceId, {
      type: "vector",
      tiles: [tilesUrl],
      minzoom: 0,
      maxzoom: 14,
    });

    map.addLayer({
      id: vectorLayerId,
      type: "fill",
      source: vectorSourceId,
      "source-layer": "glaciers",
      paint: isRaster
        ? {
            "fill-color": "rgba(0, 0, 0, 0)",
            "fill-opacity": 1.0,
            "fill-outline-color": "black",
          }
        : {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["to-number", ["get", "stat_value"]],
              ...colorStops,
            ],
            "fill-opacity": layerOpacity,
          },
    });

    map.addLayer({
      id: outlineLayerId,
      type: "line",
      source: vectorSourceId,
      "source-layer": "glaciers",
      paint: {
        "line-color": "red",
        "line-width": 2,
      },
      filter: ["==", "gid", -1], // default hidden
    });

  }, [mapLoaded, mapRef, selectedDataset, colormap, range, layerOpacity]);

  // Update outline filter when glacier selection changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    if (selectedGlacier) {
        map.setFilter(outlineLayerId, ["==", "gid", selectedGlacier.gid]);
      } else {
        map.setFilter(outlineLayerId, ["==", "gid", -1]); // Hide
    }

  }, [selectedGlacier, mapLoaded]);

  return {};
}