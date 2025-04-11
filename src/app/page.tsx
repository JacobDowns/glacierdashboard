"use client";

import { useEffect, useState, useRef } from "react";
import DataBar from '@/app/ui/DataBar'
import {Dataset} from "@/app/types/datasets"
import { useSearchParams, useRouter } from 'next/navigation';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Box,
  Paper,
  Container, 
  CircularProgress,
  Grid,
  CardHeader,
  Link,
  Breadcrumbs
} from '@mui/material';


export default function Home() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);


  const searchParams = useSearchParams();
  const router = useRouter();
  const datasetIdParam = searchParams.get('dataset');

  // When the URL param changes, set the selectedDataset
  useEffect(() => {
    const id = datasetIdParam ? parseInt(datasetIdParam, 10) : null;
    if (id && datasets.length > 0) {
      const match = datasets.find(d => d.id === id);
      if (match) setSelectedDataset(match);
    }
  }, [datasetIdParam, datasets]);


  // When selectedDataset changes, update the URL
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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/datasets") // or /api/datasets
        const data = await res.json()

        const parsedData = data.map((d : Dataset) => ({
          ...d,
          dataset_start_date: new Date(d.dataset_start_date).getFullYear(),
          dataset_end_date: new Date(d.dataset_end_date).getFullYear(),
        }));

        setDatasets(parsedData);
        setSelectedDataset(parsedData[0]);
      } catch (err) {
        console.error("Failed to fetch datasets:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>Home</h1> 
      {loading ? <CircularProgress /> : 
      <>
       <Accordion>
       <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="#">
          {selectedDataset?.collection_short_name}
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="#"
          >
            {selectedDataset?.dataset_name}
          </Link>
         
        </Breadcrumbs>
  
        </AccordionSummary>
        <AccordionDetails>
          <Container>
        <Grid container spacing={3}>
        <Grid size={4}>
          <Card elevation={4}>
            <CardContent>
              <CardHeader title="Selected Dataset" />
              <Typography variant="body2" component="div">
                {selectedDataset?.dataset_name}
              </Typography>
        
              <Typography variant="body2" component="div">
                Format: {selectedDataset?.dataset_format}
              </Typography>
              <Typography variant="body2" component="div">
                Extent: {selectedDataset?.dataset_start_date}- {selectedDataset?.dataset_end_date}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
        <Card elevation={4}>
            <CardContent>
              <CardHeader title="Collection Information" />
              <Typography variant="body2" component="div">
                Data Collection: {selectedDataset?.collection_short_name}
              </Typography>
              <Typography variant="body2" component="div">
                Description: 
                <Box>{selectedDataset?.collection_description}</Box>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
        <Card elevation={4}>
            <CardContent>
              <CardHeader title="Publication" />
              <Typography variant="body2" component="div">
              Source: <Link href="{selectedDataset?.publication_url}">{selectedDataset?.publication_authors}</Link>
              </Typography>
              <Typography variant="body2" component="div">
                Title: {selectedDataset?.publication_title}
              </Typography>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Container>
      <br></br>
        <DataBar 
          datasets={datasets}
          selectedDataset={selectedDataset}
          setSelectedDataset={setSelectedDataset} 
          />
        </AccordionDetails>
          </Accordion>
      </>
      }
    </div>
  );
}
