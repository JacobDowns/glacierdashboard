"use client";

import { useState, useEffect } from "react";
import { Dataset } from "@/app/types/datasets";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  Typography,
  Stack,
  Box,
  Paper,
  IconButton,
  Collapse,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import type { GlacierStatsQueryResult } from '@/app/types/glaciers';
import DatasetsTable from '@/app/ui/DatasetsTable';
import DatasetCard from '@/app/ui/DatasetCard';
import RegionalStats from '@/app/ui/RegionalStats';
import GlacierSearch from '@/app/components/GlacierSearch';
import StatsTable from '@/app/ui/StatsTable';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Article from '@mui/icons-material/Article';
import LandscapeIcon from '@mui/icons-material/Landscape';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type Props = {
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  setSelectedDataset: (dataset: Dataset | null) => void;
  selectedGlacier: { gid: number; rgi_id: string } | null;
  onNavigateToGlacier: ({ cenlat, cenlng }: { cenlat: number; cenlng: number }) => void;
  timeIndex: number;
};

export default function DataBar({
  datasets,
  selectedDataset,
  setSelectedDataset,
  selectedGlacier,
  onNavigateToGlacier,
  timeIndex
}: Props) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);
  const [glacierStats, setGlacierStats] = useState<GlacierStatsQueryResult | null>(null);
  const [glacierStatsLoading, setGlacierStatsLoading] = useState(false);
  const [glacierStatsError, setGlacierStatsError] = useState<string | null>(null);




  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (!selectedGlacier) return;

    setGlacierStats(null);
    setGlacierStatsError(null);
    setGlacierStatsLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${API_URL}/api/glacier/${selectedGlacier.gid}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: GlacierStatsQueryResult) => {
        console.log(data);
        setGlacierStats(data);
      })
      .catch((err) => {
        console.error(err);
        setGlacierStatsError('Failed to fetch glacier statistics.');
      })
      .finally(() => {
        setGlacierStatsLoading(false);
      });
  }, [selectedGlacier?.gid]);

  const toggleExpanded = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Paper elevation={4} sx={{ overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: expanded ? 1 : 0,
          backgroundColor: '#F5FBFF',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ArrowDropDownIcon />}
            onClick={() => {
              setExpanded(true);
              setTabValue(0);
            }}
            size="large">
            Datasets
          </Button>
          <Button
            variant="outlined"
            startIcon={<Article />}
            onClick={() => {
              setExpanded(true);
              setTabValue(1);
            }}
            size="large"
          >
            {selectedDataset?.collection_name} / {selectedDataset?.dataset_name}
          </Button>


          <Button
            component="button"
            variant="outlined"
            startIcon={<LandscapeIcon />}
            onClick={() => {
              setExpanded(true);
              setTabValue(2);
            }}
            size="large"
          >
            Selected Glacier: {selectedGlacier ? selectedGlacier.rgi_id : "None"}
          </Button>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <GlacierSearch
            onNavigateToGlacier={(cenlat, cenlng) => {
              // Call the fly-to function you passed down
              onNavigateToGlacier({ cenlat, cenlng });
            }}
          />
          <IconButton
            onClick={toggleExpanded}
            size="small"
            aria-expanded={expanded}
            aria-label="show details"
            sx={{ ml: 2 }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

      </Box>

      {/* Collapsible content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Select Dataset" {...a11yProps(0)} />
              <Tab label="Dataset Details" {...a11yProps(1)} />
              <Tab label="Glacier Details" {...a11yProps(2)} />
              <Tab label="Regional Statistics" {...a11yProps(3)} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <DatasetsTable
              datasets={datasets}
              selectedDataset={selectedDataset}
              setSelectedDataset={setSelectedDataset}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <DatasetCard selectedDataset={selectedDataset} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>

            {selectedGlacier === null ? (
              <Typography>No glacier selected.</Typography>
            ) : (
              <StatsTable
                glacierStats={glacierStats}
                loading={glacierStatsLoading}
                error={glacierStatsError}
              />
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <RegionalStats dataset={selectedDataset} timeIndex={timeIndex}/>
          </TabPanel>

        </Box>
      </Collapse>
    </Paper>
  );
}
