'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import {
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { InlineMath } from 'react-katex';

import type { GlacierStatsQueryResult, GlacierStat } from '@/app/types/glaciers';

interface Props {
  gid: number;
}

export default function StatsTable({ gid }: Props) {
  const [glacierStats, setGlacierStats] = useState<GlacierStatsQueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gid) return;

    setLoading(true);
    setError(null);

    fetch(`http://127.0.0.1:8000/glacier/${gid}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: GlacierStatsQueryResult) => {
        setGlacierStats(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch glacier statistics.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [gid]);

  const columns = useMemo<MRT_ColumnDef<GlacierStat>[]>(() => [
    {
      header: 'Dataset',
      accessorKey: 'dataset_name',
      size : 300
    },
    {
      header: 'Collection',
      accessorKey: 'collection_name',
      enableGrouping: true,
      size : 300
    },
    {
        accessorKey: 'data_type_name',
        header: 'Data Type',
        Cell: ({ row }) => {
          const name = row.original.data_type_name;
          const latex = row.original.data_type_latex_unit;
      
          return (
            <span>
              {name}{' '}
              {latex ? (
                <>(<InlineMath math={latex} />)</>
              ) : (
                <span style={{ fontStyle: 'italic', color: '#666' }}>(unitless)</span>
              )}
            </span>
          );
        },
        size : 300
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
      header: 'Value',
      accessorKey: 'value',
      Cell: ({ cell }) => cell.getValue<number>().toFixed(3),
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: glacierStats?.stats ?? [],
    getRowId: (row) => row.id.toString(),
    enableGrouping: true,
    initialState: {
      grouping: ['collection_name'],
      expanded: true,
      columnVisibility: { dataset_start_date: false, dataset_end_date :false },
      pagination: { pageSize: 50, pageIndex: 0 }
    },
    enableColumnResizing: true,
    enableColumnFilters: false,
    enableSorting: true,
    enableRowSelection: false,
    muiTableBodyRowProps: ({ row }) => {
        const isGroupRow = row.getIsGrouped();
        return {
          onClick: isGroupRow ? row.getToggleExpandedHandler() : undefined,
          sx: {
            cursor: 'pointer',
            backgroundColor: isGroupRow ? '#f5f5f5' : 'inherit', // Style the group rows differently
            fontWeight: isGroupRow ? 'bold' : 'normal', // Make group rows bold
            '&:hover': {
              backgroundColor: isGroupRow ? '#e0e0e0' : 'inherit', // Highlight group rows on hover
            },
          },
        };
      },
  });

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!glacierStats) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        {glacierStats.glac_name ?? 'Unnamed Glacier'} ({glacierStats.rgi_id})
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  );
}