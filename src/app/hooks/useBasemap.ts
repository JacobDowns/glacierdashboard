import { useEffect } from "react";
import { Map } from "maplibre-gl";
import BASEMAPS from "@/app/lib/basemaps";

export function useBasemap(map: Map | null, mapLoaded: boolean, basemap: string) {
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Remove all existing basemap layers
    Object.values(BASEMAPS).forEach((basemapDef) => {
      const id = basemapDef.layer.id;
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
    });

    // Add the new basemap layer
    const basemapDef = BASEMAPS[basemap];
    if (basemapDef) {
      const sourceName = `${basemap}-source`;
      if (!map.getSource(sourceName)) {
        map.addSource(sourceName, basemapDef.source);
      }

      let beforeLayer = map.getLayer("vector-layer") ? "vector-layer" : undefined;

      if (map.getLayer("raster-layer")) {
        beforeLayer = "raster-layer";
      }

      map.addLayer(
        {
          ...basemapDef.layer,
          source: sourceName,
        },
        beforeLayer // only insert before glacier layer if it exists
      );
    }
  }, [map, mapLoaded, basemap]);
}