import { RasterSourceSpecification, RasterLayerSpecification } from "maplibre-gl";

type BasemapDefinition = {
  source: RasterSourceSpecification;
  layer: RasterLayerSpecification;
};

const BASEMAPS: Record<string, BasemapDefinition> = {
    OpenStreetMap: {
      source: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      },
      layer: {
        id: "basemap",
        type: "raster",
        source: "OpenStreetMap-source",
        minzoom: 0,
        maxzoom: 16
      }
    },
    ESRI: {
      source: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      },
      layer: {
        id: "basemap",
        type: "raster",
        source: "ESRI-source",
        minzoom: 0,
        maxzoom: 16
      }
    }
  };
  

export default BASEMAPS;