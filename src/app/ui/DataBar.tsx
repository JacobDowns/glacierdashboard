"use client";

import { useState, useMemo, useEffect } from "react";
import { Dataset } from "@/app/types/datasets";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_ExpandAllButton,
  type MRT_RowSelectionState
} from 'material-react-table';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  Typography,
  Stack,
  Box,
  Link,
  Paper,
  IconButton,
  Collapse,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';

import DatasetCard from '@/app/ui/DatasetCard';

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
  setSelectedGlacier: (glacier: { gid: number; rgi_id: string } | null) => void;
};

export default function DataBar({
  datasets,
  selectedDataset,
  setSelectedDataset,
  selectedGlacier,
  setSelectedGlacier,
}: Props) {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [expanded, setExpanded] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);

  const [glacierStats, setGlacierStats] = useState<any>(null);
  const [loadingGlacierStats, setLoadingGlacierStats] = useState(false);

  const columns = useMemo<MRT_ColumnDef<Dataset>[]>(
    () => [
      {
        header: 'Dataset Name',
        accessorKey: 'dataset_name',
      },
      {
        header: 'Format',
        accessorKey: 'dataset_format',
      },
      {
        header: 'Start Date',
        accessorKey: 'dataset_start_date',
      },
      {
        header: 'End Date',
        accessorKey: 'dataset_end_date',
      },
      {
        header: 'Collection',
        accessorKey: 'collection_short_name',
      },
      {
        header: 'Authors',
        accessorKey: 'publication_authors',
      },
      {
        header: 'Data Type',
        accessorKey: 'data_type_name',
      },
    ],
    [],
  );

  const table = useMaterialReactTable<Dataset>({
    columns,
    data: datasets,
    getRowId: (row) => row.id.toString(),
    displayColumnDefOptions: {
      'mrt-row-expand': {
        Header: () => (
          <Stack direction="row" alignItems="center">
            <MRT_ExpandAllButton table={table} />
            <Box>Groups</Box>
          </Stack>
        ),
        GroupedCell: ({ row, table }) => {
          const { grouping } = table.getState();
          return row.getValue(grouping[grouping.length - 1]);
        },
        enableResizing: true,
        muiTableBodyCellProps: ({ row }) => ({
          sx: (theme) => ({
            color:
              row.depth === 0
                ? theme.palette.primary.main
                : row.depth === 1
                  ? theme.palette.secondary.main
                  : undefined,
          }),
        }),
        size: 200,
      },
    },
    enableRowSelection: false,
    enableGrouping: true,
    enableColumnResizing: true,
    groupedColumnMode: 'remove',
    initialState: {
      density: 'comfortable',
      expanded: {},
      grouping: ['collection_short_name'],
      pagination: { pageIndex: 0, pageSize: 20 },
    },
    muiTableBodyRowProps: ({ row }) => {
      const isSelected = selectedDataset?.id === row.original.id;
      const isGroupRow = row.getIsGrouped();

      return {
        onClick: isGroupRow
          ? row.getToggleExpandedHandler()
          : () => setSelectedDataset(row.original),
        sx: {
          cursor: 'pointer',
          backgroundColor: isSelected
            ? '#e3f2fd'
            : isGroupRow
              ? '#eee'
              : 'inherit',
          border: isGroupRow ? '1px solid #aaa' : undefined,
          borderRadius: isGroupRow ? '1px' : undefined,
          mx: isGroupRow ? 1 : 0,
        },
      };
    },
    positionToolbarAlertBanner: 'none',
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (selectedDataset) {
      const index = datasets.findIndex(d => d.id === selectedDataset.id);
      if (index !== -1) {
        setRowSelection({ [index]: true });
      }
    }
  }, [selectedDataset, datasets]);

  useEffect(() => {
    if (selectedGlacier) {
      setLoadingGlacierStats(true);

      // Simulate API call to get glacier stats
      setTimeout(() => {
        setGlacierStats({
          area: "12.3 km²",
          mean_elevation: "2345 m",
          status: "Retreating",
          rgi_id: selectedGlacier.rgi_id,
        });
        setLoadingGlacierStats(false);
      }, 1000);
    } else {
      setGlacierStats(null);
    }
  }, [selectedGlacier]);

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
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body1">Selected Dataset:</Typography>
          <Link
            component="button"
            variant="body1"
            onClick={() => {
              setExpanded(true);
              setTabValue(1);
            }}
          >
            {selectedDataset?.collection_name} / {selectedDataset?.dataset_name}
          </Link>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body1">Selected Glacier:</Typography>
          <Link
            component="button"
            variant="body1"
            onClick={() => {
              setExpanded(true);
              setTabValue(2);
            }}
          >
            {selectedGlacier ? selectedGlacier.rgi_id : "None"}
          </Link>
        </Stack>
        <IconButton
          onClick={toggleExpanded}
          size="small"
          aria-expanded={expanded}
          aria-label="show details"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
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
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <MaterialReactTable table={table} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <DatasetCard selectedDataset={selectedDataset} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {selectedGlacier === null ? (
              <Typography>No glacier selected.</Typography>
            ) : loadingGlacierStats ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={20} />
                <Typography>Loading glacier stats...</Typography>
              </Stack>
            ) : (
              glacierStats && (
                <Box>
                  <Typography variant="h6">Glacier Stats</Typography>
                  <Typography>RGI ID: {glacierStats.rgi_id}</Typography>
                  <Typography>Area: {glacierStats.area}</Typography>
                  <Typography>Mean Elevation: {glacierStats.mean_elevation}</Typography>
                  <Typography>Status: {glacierStats.status}</Typography>
                </Box>
              )
            )}
          </TabPanel>
        </Box>
      </Collapse>
    </Paper>
  );
}
