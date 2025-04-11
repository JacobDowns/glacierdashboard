"use client"

import { useState, useMemo, useEffect } from "react"
import { Dataset } from "@/app/types/datasets"
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Container,
  Grid,
  CardHeader,
  Link,
  Breadcrumbs,
  Slider,
  Paper,
  IconButton,
  Collapse,
  Tabs,
  Tab,

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
}



export default function DataBar({ datasets, selectedDataset, setSelectedDataset }: Props) {

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [sliderValue, setSliderValue] = useState<number[]>([selectedDataset ? selectedDataset.dataset_plot_min : 0, selectedDataset ? selectedDataset.dataset_plot_max : 0]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);

  const columns = useMemo<MRT_ColumnDef<Dataset>[]>(
    //column definitions...
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
        header: 'Publication Year',
        accessorKey: 'publication_year',
      },
      {
        header: 'Data Type',
        accessorKey: 'data_type_name',
      },

    ],
    [],
  );

  // Update the slider value when the selected dataset changes
  useEffect(() => {
    if (selectedDataset) {
      setSliderValue([
        selectedDataset.dataset_plot_min,
        selectedDataset.dataset_plot_max,
      ]);
    }
  }, [selectedDataset]);

  const handleSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    // Update the slider value on change
    if (Array.isArray(newValue)) {
      setSliderValue(newValue);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Set rowSelection from selectedDataset on mount or change
  useEffect(() => {
    if (selectedDataset) {
      const index = datasets.findIndex(d => d.id === selectedDataset.id);
      if (index !== -1) {
        setRowSelection({ [index]: true });
      }
    }
  }, [selectedDataset, datasets]);

  useEffect(() => {
    const selectedIndex = Object.keys(rowSelection)[0];
    const selected = selectedIndex !== undefined ? datasets[parseInt(selectedIndex)] : null;
    setSelectedDataset(selected ?? null);
  }, [rowSelection, datasets, setSelectedDataset]);



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
      density: 'compact',
      expanded: {},
      grouping: ['collection_short_name'],
      pagination: { pageIndex: 0, pageSize: 20 },
    },

    muiTableBodyRowProps: ({ row }) => {
      const isSelected = selectedDataset?.id === row.original.id;
      const isGroupRow = row.getIsGrouped();

      return {
        onClick: () => {
          if (!isGroupRow) {
            setSelectedDataset(row.original);
          }
        },
        sx: {
          cursor: isGroupRow ? 'default' : 'pointer',
          backgroundColor: isSelected ? '#e3f2fd' : isGroupRow ? '#ccc' : 'inherit',
          border: isGroupRow ? '1px solid #aaa' : undefined,
          borderRadius: isGroupRow ? '1px' : undefined,
          mx: isGroupRow ? 1 : 0, // horizontal margin to separate groups slightly
        },
      };
    },

    positionToolbarAlertBanner: 'none',



  });


  const handleBreadcrumbClick = (event: React.MouseEvent): void => {
    // Prevent default link behavior
    event.preventDefault();
    setExpanded(!expanded);
  };

  const toggleExpanded = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      {/* Header with breadcrumbs */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: expanded ? 1 : 0,
          borderColor: 'divider'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="#" onClick={handleBreadcrumbClick}>
            {selectedDataset?.collection_short_name}
          </Link>
          <Link underline="hover" color="inherit" href="#" onClick={handleBreadcrumbClick}>
            {selectedDataset?.dataset_name}
          </Link>
        </Breadcrumbs>
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
              <Tab label="Details" {...a11yProps(0)} />
              <Tab label="Datasets" {...a11yProps(1)} />
              <Tab label="Tab Three" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <DatasetCard selectedDataset={selectedDataset} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <MaterialReactTable table={table} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Typography>
              Tab Three content is shown when this tab is selected.
            </Typography>
          </TabPanel>
        </Box>

      </Collapse>
    </Paper>
  )
}
