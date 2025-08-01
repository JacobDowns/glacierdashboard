"use client";

import { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Dataset } from "@/app/types/datasets";
import Legend from "@/app/ui/Legend";
import { useBasemap } from "@/app/hooks/useBasemap";
import BasemapSelector from "@/app/components/BasemapSelector";
import { useGlacierLayer } from "@/app/hooks/useGlacierLayer";
import { useSubregionLayer } from "@/app/hooks/useSubregionLayer";
import type { FeatureCollection, Geometry } from "geojson";

type Props = {
  mapRef: React.RefObject<maplibregl.Map | null>;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  selectedDataset: Dataset;
  lat: number;
  lng: number;
  zoom: number;
  onMoveEnd: (lat: number, lng: number, zoom: number) => void;
  colormap: string;
  range: [number, number];
  setRange: (range: [number, number]) => void;
  timeIndex: number;
  setTimeIndex: (index: number) => void;
  setColormap: (colormap: string) => void;
  selectedGlacier: { gid: number; rgi_id: string } | null;
  setSelectedGlacier: (glacier: { gid: number; rgi_id: string } | null) => void;
  parksGeoJSON: FeatureCollection<Geometry> | null;
  o1GeoJSON: FeatureCollection<Geometry> | null;
  o2GeoJSON: FeatureCollection<Geometry> | null;
  selectedSubregion: "parks" | "o1" | "o2" | "None";
  setSelectedSubregion: (subregion: "parks" | "o1" | "o2" | "None") => void;
};

export default function Map({
  mapRef,
  mapContainerRef,
  selectedDataset,
  lat,
  lng,
  zoom,
  onMoveEnd,
  colormap,
  range,
  setRange,
  timeIndex,
  setTimeIndex,
  setColormap,
  selectedGlacier,
  setSelectedGlacier,
  parksGeoJSON,
  o1GeoJSON,
  o2GeoJSON, 
  selectedSubregion,
  setSelectedSubregion
}: Props) {

  const [mapLoaded, setMapLoaded] = useState(false);
  const [basemap, setBasemap] = useState("OpenStreetMap");
  const [layerOpacity, setLayerOpacity] = useState(1);

  useBasemap(
    mapRef.current,
    mapLoaded,
    basemap
  );

  useGlacierLayer(
    mapRef,
    mapLoaded,
    selectedDataset,
    colormap,
    range,
    timeIndex,
    selectedGlacier,
    layerOpacity
  );

  useSubregionLayer({
    map: mapRef.current,
    selectedSubregion,
    parksGeoJSON,
    o1GeoJSON,
    o2GeoJSON,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {},
        layers: [],
      },
      center: [lng, lat],
      zoom,
    });

    map.on("load", () => {
      setMapLoaded(true);

      // Blur focus from map to prevent scroll hijacking
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    map.on("click", (event) => {
      if (!selectedDataset) return;
      const features = map.queryRenderedFeatures(event.point, {
        layers: ["vector-layer"],
      });

      console.log(features);
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

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={mapContainerRef} style={{ width: "100vw", height: "1000px" }} />
      <BasemapSelector 
        basemap={basemap} 
        setBasemap={setBasemap} 
        selectedSubregion={selectedSubregion}
        setSelectedSubregion={setSelectedSubregion}
        
      />
      <div className="absolute bottom-4 left-4 z-10">
        {selectedDataset && (
          <Legend
            dataset={selectedDataset}
            colormap={colormap}
            range={range}
            onColormapChange={setColormap}
            onRangeChange={setRange}
            timeIndex={timeIndex}
            setTimeIndex={setTimeIndex}
            layerOpacity={layerOpacity}
            setLayerOpacity={setLayerOpacity}
          />
        )}
      </div>
    </div>
  );
}