import { useEffect } from "react";
import maplibregl from "maplibre-gl";

type SubregionType = "parks" | "o1" | "o2" | "None";

interface Props {
    map: maplibregl.Map | null;
    selectedSubregion: SubregionType;
    parksGeoJSON: any | null;
    o1GeoJSON: any | null;
    o2GeoJSON: any | null;
}

export function useSubregionLayer({
    map,
    selectedSubregion,
    parksGeoJSON,
    o1GeoJSON,
    o2GeoJSON,
}: Props) {
    useEffect(() => {


        if (!map) return;
        console.log('heresdfsd');

        // Choose data + id based on selected type
        const sourceId = "subregion";
        const layerId = "subregion-fill";
        let data = null;

        switch (selectedSubregion) {
            case "parks":
                data = parksGeoJSON;
                break;
            case "o1":
                data = o1GeoJSON;
                break;
            case "o2":
                data = o2GeoJSON;
                break;
            case "None":
            default:
                data = null;
        }

        console.log('dataness', data);
        if (!data) return;

        // Remove old source/layer if they exist
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);

        console.log('subregion', data);

        map.addSource(sourceId, {
            type: "geojson",
            data,
        });

        map.addLayer({
            id: layerId,
            type: "fill",
            source: sourceId,
            paint: {
                "fill-color": "#f59e0b",
                "fill-opacity": 0.3,
            },
        });

        map.addLayer({
            id: `${layerId}-outline`,
            type: "line",
            source: sourceId,
            paint: {
                "line-color": "black",
                "line-width": 1,
            },
        });

        // Add hover interaction
        const onMouseMove = (e: maplibregl.MapMouseEvent) => {
            const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
            if (features.length > 0) {
                const props = features[0].properties;
                map.getCanvas().style.cursor = "pointer";

                // For now: simple tooltip
                const info = Object.entries(props)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join("\n");
                map.getCanvas().title = info;
            } else {
                map.getCanvas().style.cursor = "";
                map.getCanvas().title = "";
            }
        };

        map.on("mousemove", onMouseMove);

        return () => {
            map.off("mousemove", onMouseMove);
            if (map.getLayer(layerId)) map.removeLayer(layerId);
            if (map.getLayer(`${layerId}-outline`)) map.removeLayer(`${layerId}-outline`);
            if (map.getSource(sourceId)) map.removeSource(sourceId);
            
            map.getCanvas().style.cursor = "";
            map.getCanvas().title = "";
        };
    }, [map, selectedSubregion, parksGeoJSON, o1GeoJSON, o2GeoJSON]);
}