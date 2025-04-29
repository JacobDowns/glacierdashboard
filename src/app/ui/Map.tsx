"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Dataset } from "@/app/types/datasets";
import Legend from "@/app/ui/Legend";
import { getColormapInterpolator } from "@/app/lib/colormaps";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";


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
  setSelectedGlacier
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapLoadedRef = useRef(false);

  const layerId = "glacier-layer";
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

    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    map.addSource(sourceId, {
      type: "vector",
      tiles: [tilesUrl],
      minzoom: 0,
      maxzoom: 14,
    });

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: "fill",
        source: sourceId,
        "source-layer": "glaciers",
        paint: {},
      });
    }

    // Paint update logic based on dataset format
    const paintProps =
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
        };

    map.setPaintProperty(layerId, "fill-color", paintProps["fill-color"]);
    map.setPaintProperty(layerId, "fill-opacity", paintProps["fill-opacity"]);
    if ("fill-outline-color" in paintProps) {
      map.setPaintProperty(layerId, "fill-outline-color", paintProps["fill-outline-color"]);
    }
  };

  useEffect(() => {


    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [lng, lat],
      zoom,
    });

    map.on("load", () => {
      mapLoadedRef.current = true;
      updateGlacierLayer();
    });

    map.on("click", (event) => {
      if (!selectedDataset) return;
      const features = map.queryRenderedFeatures(event.point, {
        layers: [layerId],
      });
      if (features.length > 0) {
        console.log("Clicked Glacier Properties:", features[0].properties);
        const gid = features[0].properties.gid;
        const rgi_id = features[0].properties.rgi_id;
        setSelectedGlacier({ gid, rgi_id });  
      } else {
        setSelectedGlacier(null);
        console.log("No glacier found at this location.");
      }
    });

    map.on("moveend", () => {
      const center = map.getCenter();
      onMoveEnd(center.lat, center.lng, map.getZoom());
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      mapLoadedRef.current = false;
    };
  }, []);

  useEffect(() => {
    updateGlacierLayer();
  }, [selectedDataset, colormap, range]);

  return (
    <div className="relative">
      <div ref={mapContainerRef} style={{ width: "100vw", height: "800px" }} />
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
    </div>
  );
}