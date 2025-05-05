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
    },
    StamenTerrain: {
      source: {
        type: "raster",
        tiles: [
          "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      },
      layer: {
        id: "basemap",
        type: "raster",
        source: "StamenTerrain-source",
        minzoom: 0,
        maxzoom: 16
      }
    },
    CartoDB: {
      source: {
        type: "raster",
        tiles: [
          "https://abcd.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      },
      layer: {
        id: "basemap",
        type: "raster",
        source: "CartoDB-source",
        minzoom: 0,
        maxzoom: 16
      }
    }
  };
  

export default BASEMAPS;