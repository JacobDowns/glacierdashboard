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
  Card,
  Stack,
  Paper
} from '@mui/material';
import { InlineMath } from 'react-katex';


import type { GlacierStatsQueryResult, GlacierStat } from '@/app/types/glaciers';

interface Props {
  glacierStats: GlacierStatsQueryResult | null;
  loading: boolean;
  error: string | null;
}

export default function StatsTable({ glacierStats, loading, error }: Props) {


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

      <Stack>
        <Typography variant="body1"> Region : {glacierStats.o2region} </Typography>
        <Typography variant="body1"> Latitude : {glacierStats.cenlat} </Typography>
        <Typography variant="body1"> Longitude : {glacierStats.cenlon} </Typography>
        <br></br>
      </Stack>
      <MaterialReactTable table={table} />
    </Box>
  );
}