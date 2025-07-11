'use client';

import React, {useMemo } from 'react';
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
  Divider
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
            header: 'Time',
            accessorKey: 'time_code',
            accessorFn: row => new Date(row.time_code).toISOString(), // Ensure sorting works
            Cell: ({ cell }) => {
              const date = new Date(cell.getValue<string>());
              const year = date.getUTCFullYear();
              const month = String(date.getUTCMonth() + 1).padStart(2, '0');
              const day = String(date.getUTCDate()).padStart(2, '0');
              return `${month}/${day}/${year}`;
            }
    },
    {
      header: 'Value',
      accessorKey: 'value',
      Cell: ({ cell }) => {
        const val = cell.getValue<number | null>();
        return val === null || val === undefined ? (
          <span style={{ fontStyle: 'italic', color: '#888' }}>No Data</span>
        ) : (
          val.toFixed(3)
        );
      },
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
    }
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: glacierStats?.stats ?? [],
    getRowId: (row) => row.id.toString(),
    enableGrouping: true,
    initialState: {
      density : 'compact',
      grouping: ['collection_name', 'dataset_name'],
      expanded: true,
      //columnVisibility: { dataset_start_date: false, dataset_end_date :false },
      pagination: { pageSize: 250, pageIndex: 0 },
      sorting: [{ id: 'time_code', desc: false }]
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

    

      <Card elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        {glacierStats.glac_name ?? 'Unnamed Glacier'} ({glacierStats.rgi_id})
      </Typography>
      <Divider sx={{ mb :2 }}/>
        <Stack spacing={0.6}>
        <Typography variant="body1"> <b>Region: </b> {glacierStats.o2region} </Typography>
        <Typography variant="body1"><b>Latitude: </b> {glacierStats.cenlat.toFixed(4)} </Typography>
        <Typography variant="body1"><b>Longitude :</b> {glacierStats.cenlon.toFixed(4)} </Typography>
        <Typography variant="body1"><b>Area :</b> {glacierStats.rgi_area.toFixed(3)} km<sup>2</sup> </Typography>
        <Typography variant="body1"><b>Surge Type :</b> {glacierStats.surge_type ? 'Yes' : 'No'} </Typography>
      </Stack>
      </Card>
      <br></br>
      <Typography variant="h6" gutterBottom>
        Glacier Statistics
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  );
}