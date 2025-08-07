'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState
} from 'material-react-table';
import {
  Typography,
  Box
} from '@mui/material';


import type { Dataset } from '@/app/types/datasets';

interface Props {
  datasets : Dataset[],
  selectedDataset: Dataset | null;
  setSelectedDataset: (dataset: Dataset | null) => void;
}

export default function DatasetsTable({ datasets, selectedDataset, setSelectedDataset }: Props) {

    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

    const columns = useMemo<MRT_ColumnDef<Dataset>[]>(
        () => [
          {
            header: 'Dataset Name',
            accessorKey: 'dataset_name',
            size : 270
          },
          {
            header: 'Collection',
            accessorKey: 'collection_name',
            size : 270
          },
          {
            header: 'Data Type',
            accessorKey: 'data_type_name',
          },
          {
            header: 'Format',
            accessorKey: 'dataset_format',
          },
          {
            header: 'Start Date',
            accessorKey: 'dataset_start_date',
            accessorFn: row => row.dataset_start_date?.toISOString(), // Ensure sorting works
            Cell: ({ cell }) => {
              const date = new Date(cell.getValue<string>());
              const year = date.getUTCFullYear();
              const month = String(date.getUTCMonth() + 1).padStart(2, '0');
              const day = String(date.getUTCDate()).padStart(2, '0');
              return `${month}/${day}/${year}`;
            }
          },
          {
            header: 'End Date',
            accessorKey: 'dataset_end_date',
            accessorFn: row => row.dataset_end_date?.toISOString(),
            Cell: ({ cell }) => {
              const date = new Date(cell.getValue<string>());
              const year = date.getUTCFullYear();
              const month = String(date.getUTCMonth() + 1).padStart(2, '0');
              const day = String(date.getUTCDate()).padStart(2, '0');
              return `${month}/${day}/${year}`;
            }
          },
          {
            header: 'Available Times',
            accessorKey: 'time_steps',
             size : 200
          },
          {
            header: 'Authors',
            accessorKey: 'publication_authors',
          },
          
    
        ],
        [],
      );
 

  const table = useMaterialReactTable({
    columns,
    data: datasets ?? [],
    getRowId: (row) => row.id.toString(),
    enableGrouping: true,
    initialState: {
      density : 'compact',
      grouping: ['collection_name'],
      expanded: true,
      pagination: { pageSize: 50, pageIndex: 0 },
    },
    enableColumnResizing: true,
    enableColumnFilters: false,
    enableSorting: true,
    enableRowSelection: false,
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
          borderRadius: isGroupRow ? '2px' : undefined,
          mx: isGroupRow ? 0.5 : 0,
        },
      };
    },
    muiTableBodyCellProps: ({ cell }) => {
      const isGrouped = cell.row.getIsGrouped();
      const depth = cell.row.depth;
    
      return {
        sx: isGrouped
          ? {
              pl: `${5 + depth * 5}px`, // reduce from the default (which is usually 16px * depth)
            }
          : {},
      };
    },
  });

  useEffect(() => {
    if (selectedDataset) {
      const index = datasets.findIndex(d => d.id === selectedDataset.id);
      if (index !== -1) {
        setRowSelection({ [index]: true });
      }
    }
  }, [selectedDataset, datasets]);

  if (!datasets) return null;

  return (
    <>
    <Typography variant="h6">Available Datasets</Typography>
    <Box sx={{ mt: 2 }}>
        <MaterialReactTable table={table} />
    </Box>
    </>
  );
}