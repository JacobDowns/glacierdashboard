"use client";

import { useEffect, useState } from "react";
import DataBar from '@/app/ui/DataBar';
import ExpandableContainer from '@/app/ui/ExpandableContainer';
import { Dataset } from "@/app/types/datasets";
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CircularProgress,
} from '@mui/material';

export default function Home() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const datasetIdParam = searchParams.get('dataset');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/datasets");
        const data = await res.json();

        const parsedData = data.map((d: Dataset) => ({
          ...d,
          dataset_start_date: new Date(d.dataset_start_date).getFullYear(),
          dataset_end_date: new Date(d.dataset_end_date).getFullYear(),
        }));

        setDatasets(parsedData);

        const idFromParam = datasetIdParam ? parseInt(datasetIdParam, 10) : null;
        const matchedDataset = parsedData.find(d => d.id === idFromParam);

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
  }, [datasetIdParam]);

  // Keep URL in sync when user selects a dataset
  useEffect(() => {
    if (selectedDataset) {
      const current = searchParams.get('dataset');
      if (current !== String(selectedDataset.id)) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('dataset', String(selectedDataset.id));
        router.replace(`?${newParams.toString()}`);
      }
    }
  }, [selectedDataset, searchParams, router]);

  return (
    <div>
      <h1>Home</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <DataBar
          datasets={datasets}
          selectedDataset={selectedDataset}
          setSelectedDataset={setSelectedDataset}
        />
      )}
    </div>
  );
}