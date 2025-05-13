"use client";
import React, { Suspense, useEffect, useState, useRef } from "react";
import { CircularProgress } from "@mui/material";
import DataBar from "@/app/ui/DataBar";
import Map from "@/app/ui/Map";
import { Dataset } from "@/app/types/datasets";
import { useRouter } from "next/navigation";

export default function Home() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState<number>(62.0);
  const [lon, setLon] = useState<number>(-157.0);
  const [zoom, setZoom] = useState<number>(3.5);
  const [range, setRange] = useState<[number, number] | null>(null);
  const [colormap, setColormap] = useState<string | null>(null);
  const [selectedGlacier, setSelectedGlacier] = useState<{ gid: number; rgi_id: string } | null>(null);
  const [searchParamsState, setSearchParamsState] = useState<URLSearchParams | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const router = useRouter();
  const initialLoad = useRef(true);
  const firstRange = useRef<[number | null, number | null]>([null, null]);

  // Hydrate search params after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchParamsState(params);

      const latParam = params.get("lat");
      const lonParam = params.get("lon");
      const zoomParam = params.get("zoom");
      const colormapParam = params.get("colormap");
      const minParam = params.get("min");
      const maxParam = params.get("max");

      if (latParam) setLat(parseFloat(latParam));
      if (lonParam) setLon(parseFloat(lonParam));
      if (zoomParam) setZoom(parseFloat(zoomParam));
      if (colormapParam) setColormap(colormapParam);

      const min = minParam ? parseFloat(minParam) : null;
      const max = maxParam ? parseFloat(maxParam) : null;
      firstRange.current = [min, max];
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_URL}/api/datasets`);
        const data = await res.json();

        const parsedData = data.map((d: Dataset) => ({
          ...d,
          dataset_start_date: new Date(d.dataset_start_date).getFullYear(),
          dataset_end_date: new Date(d.dataset_end_date).getFullYear(),
        }));

        setDatasets(parsedData);

        const idFromParam = searchParamsState?.get("dataset") ? parseInt(searchParamsState.get("dataset")!, 10) : null;
        const matchedDataset = parsedData.find((d: Dataset) => d.id === idFromParam);

        if (matchedDataset) {
          setSelectedDataset(matchedDataset);
        } else if (parsedData.length > 0) {
          setSelectedDataset(parsedData[0]);
        }
      } catch (err) {
        console.error("Failed to fetch datasets:", err);
      } finally {
        setLoading(false);
      }
    }

    if (searchParamsState) {
      fetchData();
    }
  }, [searchParamsState]);

  useEffect(() => {
    if (!selectedDataset) return;

    const defaultMin = selectedDataset.data_type_plot_min ?? 0;
    const defaultMax = selectedDataset.data_type_plot_max ?? 1;
    const [minOverride, maxOverride] = firstRange.current;

    if (minOverride !== null && maxOverride !== null) {
      setRange([minOverride, maxOverride]);
      firstRange.current = [null, null];
    } else {
      setRange([defaultMin, defaultMax]);
    }

    if (initialLoad.current) {
      const colormapParam = searchParamsState?.get("colormap");
      if (colormapParam) {
        setColormap(colormapParam);
      } else if (selectedDataset.data_type_colormap) {
        setColormap(selectedDataset.data_type_colormap);
      }
    } else {
      if (selectedDataset.data_type_colormap) {
        setColormap(selectedDataset.data_type_colormap);
      }
    }

    initialLoad.current = false;
  }, [selectedDataset, searchParamsState]);

  useEffect(() => {
    if (!selectedDataset || !range) return;

    const newParams = new URLSearchParams(searchParamsState?.toString() || "");

    newParams.set("dataset", String(selectedDataset.id));
    newParams.set("colormap", colormap || "viridis");
    newParams.set("min", range[0].toString());
    newParams.set("max", range[1].toString());

    const round4 = (val: number) => Number(val.toFixed(4));
    if (lat !== null) newParams.set("lat", round4(lat).toString());
    if (lon !== null) newParams.set("lon", round4(lon).toString());
    if (zoom !== null) newParams.set("zoom", round4(zoom).toString());

    const currentUrl = searchParamsState?.toString() || "";
    const newUrl = newParams.toString();

    if (currentUrl !== newUrl) {
      router.replace(`?${newUrl}`, { scroll: false });
    }
  }, [selectedDataset, colormap, range, lat, lon, zoom]);

  const handleMapMoveEnd = (newLat: number, newLon: number, newZoom: number) => {
    setLat(newLat);
    setLon(newLon);
    setZoom(newZoom);
  };

  const flyToGlacier = ({ cenlat, cenlng }: { cenlat: number; cenlng: number }) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [cenlng, cenlat],
        zoom: 12,
        essential: true,
      });
    }
  };

  return (
    <Suspense fallback={<CircularProgress />}>
      <div style={{ minWidth: "1400px", width: "100%" }}>
        {loading || !range ? (
          <CircularProgress />
        ) : (
          selectedDataset &&
          lat !== null &&
          lon !== null &&
          zoom !== null &&
          range &&
          colormap !== null && (
            <Suspense fallback={<CircularProgress />}>
              <div>
                <Map
                  mapRef={mapRef}
                  mapContainerRef={mapContainerRef}
                  selectedDataset={selectedDataset}
                  lat={lat}
                  lng={lon}
                  zoom={zoom}
                  onMoveEnd={handleMapMoveEnd}
                  colormap={colormap}
                  range={range}
                  setRange={setRange}
                  setColormap={setColormap}
                  selectedGlacier={selectedGlacier}
                  setSelectedGlacier={setSelectedGlacier}
                />
                <DataBar
                  onNavigateToGlacier={flyToGlacier}
                  datasets={datasets}
                  selectedDataset={selectedDataset}
                  setSelectedDataset={setSelectedDataset}
                  selectedGlacier={selectedGlacier}
                />
              </div>
            </Suspense>
          )
        )}
      </div>
    </Suspense>
  );
}
