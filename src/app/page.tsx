"use client";
import React, { Suspense, useEffect, useState, useRef } from "react";
import { CircularProgress } from "@mui/material";
import DataBar from "@/app/ui/DataBar";
import Map from "@/app/ui/Map";
import { Dataset } from "@/app/types/datasets";
import { useSearchParams, useRouter } from "next/navigation";

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const initialLoad = useRef(true);
  const firstRange = useRef<[number | null, number | null]>([null, null]);

  useEffect(() => {
    if (!initialLoad.current) return;

    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");
    const zoomParam = searchParams.get("zoom");
    const colormapParam = searchParams.get("colormap");
    const minParam = searchParams.get("min");
    const maxParam = searchParams.get("max");

    if (latParam) setLat(parseFloat(latParam));
    if (lonParam) setLon(parseFloat(lonParam));
    if (zoomParam) setZoom(parseInt(zoomParam, 10));
    if (colormapParam) setColormap(colormapParam);

    const min = minParam ? parseFloat(minParam) : null;
    const max = maxParam ? parseFloat(maxParam) : null;
    firstRange.current = [min, max];
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

        const idFromParam = searchParams.get("dataset") ? parseInt(searchParams.get("dataset")!, 10) : null;
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

    fetchData();
  }, []);

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

    // On initial load, use colormap from URL or dataset default
    if (initialLoad.current) {
      const colormapParam = searchParams.get("colormap");
      if (colormapParam) {
        setColormap(colormapParam);
      } else if (selectedDataset.data_type_colormap) {
        setColormap(selectedDataset.data_type_colormap);
      }
    } else {
      // On dataset change after initial load, always reset to default
      if (selectedDataset.data_type_colormap) {
        setColormap(selectedDataset.data_type_colormap);
      }
    }

    initialLoad.current = false;
  }, [selectedDataset]);

  useEffect(() => {
    if (!selectedDataset || !range) return;

    const newParams = new URLSearchParams(searchParams.toString());

    newParams.set("dataset", String(selectedDataset.id));
    newParams.set("colormap", colormap || "viridis");
    newParams.set("min", range[0].toString());
    newParams.set("max", range[1].toString());

    const round4 = (val: number) => Number(val.toFixed(4));
    if (lat !== null) newParams.set("lat", round4(lat).toString());
    if (lon !== null) newParams.set("lon", round4(lon).toString());
    if (zoom !== null) newParams.set("zoom", round4(zoom).toString());

    const currentUrl = searchParams.toString();
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
          )
        )}
      </div>
    </Suspense>
  );
}