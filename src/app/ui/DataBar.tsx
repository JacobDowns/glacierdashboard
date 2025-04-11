"use client"

import { useState, useMemo, useEffect } from "react"
import {Dataset} from "@/app/types/datasets"
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_ExpandAllButton,
  type MRT_RowSelectionState
} from 'material-react-table';
import { Box, Stack } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';

type Props = {
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  setSelectedDataset: (dataset: Dataset | null) => void;
}

export default function DataBar({ datasets, selectedDataset, setSelectedDataset} : Props) {

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

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
    data : datasets,
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
          backgroundColor: isSelected ? '#e3f2fd' : isGroupRow ? '#f5f5f5' : 'inherit',
          border: isGroupRow ? '1px solid #aaa' : undefined,
          borderRadius: isGroupRow ? '1px' : undefined,
          mx: isGroupRow ? 1 : 0, // horizontal margin to separate groups slightly
        },
      };
    },

    positionToolbarAlertBanner: 'none',
    
    
  
  });

  return (
    <MaterialReactTable table={table}  />
  )
}
