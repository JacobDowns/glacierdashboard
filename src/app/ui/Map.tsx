"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Dataset } from "@/app/types/datasets";
import Legend from "@/app/ui/Legend";
import { getColormapInterpolator } from "@/app/lib/colormaps";

// Define multiple free basemaps
const BASEMAPS = {
  "Carto Light": "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  "OpenStreetMap": "https://demotiles.maplibre.org/style.json",
  "ESRI Satellite": "https://tiles.openaerialmap.org/styles/osm-bright/style.json",
};

type Props = {
  selectedDataset: Dataset;
  lat: number;
  lng: number;
  zoom: number;
  onMoveEnd: (lat: number, lng: number, zoom: number) => void;
  colormap: string;
  range: [number, number];
  setRange: (range: [number, number]) => void;
  setColormap: (colormap: string) => void;
  selectedGlacier: { gid: number; rgi_id: string } | null;
  setSelectedGlacier: (glacier: { gid: number; rgi_id: string } | null) => void;
};

export default function Map({
  selectedDataset,
  lat,
  lng,
  zoom,
  onMoveEnd,
  colormap,
  range,
  setRange,
  setColormap,
  selectedGlacier,
  setSelectedGlacier,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapLoadedRef = useRef(false);
  const [basemap, setBasemap] = useState<string>(Object.values(BASEMAPS)[0]);

  const layerId = "glacier-layer";
  const outlineLayerId = "selected-glacier-outline";
  const sourceId = "glaciers";

  const updateGlacierLayer = () => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current || !selectedDataset) return;

    const interpolator = getColormapInterpolator(colormap);
    const [min, max] = range;
    const datasetName = `${selectedDataset.collection_short_name}_${selectedDataset.dataset_short_name}`;

    const colorStops = Array.from({ length: 8 }, (_, i) => {
      const t = i / 7;
      const value = min + t * (max - min);
      return [value, interpolator(t)];
    }).flat();

    const tilesUrl =
      selectedDataset.dataset_format === "vector"
        ? `http://127.0.0.1:8000/tiles/{z}/{x}/{y}?dataset_name=${datasetName}`
        : `http://127.0.0.1:8000/tiles/{z}/{x}/{y}`;

    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getLayer(outlineLayerId)) map.removeLayer(outlineLayerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    map.addSource(sourceId, {
      type: "vector",
      tiles: [tilesUrl],
      minzoom: 0,
      maxzoom: 14,
    });

    map.addLayer({
      id: layerId,
      type: "fill",
      source: sourceId,
      "source-layer": "glaciers",
      paint:
        selectedDataset.dataset_format === "vector"
          ? {
              "fill-color": [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "stat_value"]],
                ...colorStops,
              ],
              "fill-opacity": 0.9,
            }
          : {
              "fill-color": "rgba(0, 0, 0, 0)",
              "fill-opacity": 1.0,
              "fill-outline-color": "black",
            },
    });

    map.addLayer({
      id: outlineLayerId,
      type: "line",
      source: sourceId,
      "source-layer": "glaciers",
      paint: {
        "line-color": "red",
        "line-width": 2,
      },
      filter: ["==", "gid", -1],
    });
  };

  const updateSelectedGlacierOutline = () => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current) return;
    if (!map.getLayer(outlineLayerId)) return;

    map.setFilter(outlineLayerId, selectedGlacier ? ["==", "gid", selectedGlacier.gid] : ["==", "gid", -1]);
  };

  const initializeMap = () => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: basemap,
      center: [lng, lat],
      zoom,
    });

    mapRef.current = map;

    map.on("load", () => {
      mapLoadedRef.current = true;
      updateGlacierLayer();
      updateSelectedGlacierOutline();
    });

    map.on("click", (event) => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: [layerId],
      });
      if (features.length > 0) {
        const gid = features[0].properties?.gid;
        const rgi_id = features[0].properties?.rgi_id;
        setSelectedGlacier({ gid, rgi_id });
      } else {
        setSelectedGlacier(null);
      }
    });

    map.on("moveend", () => {
      const center = map.getCenter();
      onMoveEnd(center.lat, center.lng, map.getZoom());
    });
  };

  useEffect(() => {
    if (!mapRef.current) {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    updateGlacierLayer();
  }, [selectedDataset, colormap, range]);

  useEffect(() => {
    updateSelectedGlacierOutline();
  }, [selectedGlacier]);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setStyle(basemap);
    mapLoadedRef.current = false;

    mapRef.current.once("styledata", () => {
      mapLoadedRef.current = true;
      updateGlacierLayer();
      updateSelectedGlacierOutline();
    });
  }, [basemap]);

  return (
    <div className="relative">
      <div ref={mapContainerRef} style={{ width: "100vw", height: "800px" }} />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        {selectedDataset && (
          <Legend
            dataset={selectedDataset}
            colormap={colormap}
            range={range}
            onColormapChange={setColormap}
            onRangeChange={setRange}
          />
        )}
      </div>

      {/* Basemap Switcher */}
      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow">
        <label className="mr-2 text-sm font-medium">Base map:</label>
        <select
          value={basemap}
          onChange={(e) => setBasemap(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        >
          {Object.entries(BASEMAPS).map(([label, url]) => (
            <option key={label} value={url}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
