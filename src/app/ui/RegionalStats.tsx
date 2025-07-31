'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import {
    Typography,
    Box,
    Card,
    Divider,
    SelectChangeEvent,
    CircularProgress
} from '@mui/material';
import { InlineMath } from 'react-katex';
import type { Dataset } from '@/app/types/datasets';
import type { RegionStat } from '@/app/types/regions';
import { dateToSafeString, formatDateUTC } from '@/app/utils/formatDate';
import { start } from 'repl';

interface Props {
    dataset: Dataset | null;
    timeIndex: number;
    selectedSubregion: "parks" | "o1" | "o2" | "None";
}

export default function StatsTable({
    dataset,
    timeIndex,
    selectedSubregion
}: Props) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [regionStats, setRegionStats] = useState<RegionStat[]>([]);

    const columns = useMemo<MRT_ColumnDef<RegionStat>[]>(() => [
        {
            header: 'Region',
            accessorKey: 'region',
            size: 300
        },
        {
            header: 'Number of Glaciers',
            accessorKey: 'count',
            size: 200
        },
        {
            header: 'Region Area', // optional plain string, used for metadata
            Header: () => (
                <>
                    Glacierized Area (<InlineMath math={'\\text{km}^2'} />)
                </>
            ),
            accessorKey: 'total_area',
            size: 230,
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
            header: 'Population Min.',
            accessorKey: 'min',
            size: 200,
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
            header: 'Population Max.',
            accessorKey: 'max',
            size: 200,
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
            header: 'Area Weighted Avg.',
            accessorKey: 'weighted_avg',
            size: 250,
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
            header: 'Population Avg.',
            accessorKey: 'avg',
            size: 250,
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
            header: 'Sum',
            accessorKey: 'sum',
            size: 300, Cell: ({ cell }) => {
                const val = cell.getValue<number | null>();
                return val === null || val === undefined ? (
                    <span style={{ fontStyle: 'italic', color: '#888' }}>No Data</span>
                ) : (
                    val.toFixed(3)
                );
            },
        }
    ], []);

    const table = useMaterialReactTable({
        columns,
        data: regionStats ?? [],
        getRowId: (row) => row.region.toString(),
        initialState: {
            density: 'compact',
            expanded: true,
            //columnVisibility: { dataset_start_date: false, dataset_end_date :false },
            pagination: { pageSize: 250, pageIndex: 0 },
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


 
    useEffect(() => {

        if (!dataset) return;

        setLoading(true);
        setError(null);
        const time = dateToSafeString(dataset?.dataset_times[timeIndex]); //dataset?.dataset_times[timeIndex]
        const column_name = dataset?.collection_code + '_' + dataset?.dataset_code + '_' + time;

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${API_URL}/api/regional_stats?regions=${selectedSubregion}&column_name=${column_name}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then((data: RegionStat[]) => {
                setRegionStats(data);
            })
            .catch((err) => {

                setError('Failed to fetch regional statistics.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dataset, selectedSubregion, timeIndex]);

    if (dataset?.dataset_format !== 'vector' || selectedSubregion === "None") return <Typography variant="body1">Please select a vector dataset and subregions to see regional statistics.</Typography>;

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="body1">{error}</Typography>;


    const latex = dataset?.data_type_latex_unit;
    return (
        <Box sx={{ mt: 2 }}>
            <Card elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">
                    Selected Statistic
                </Typography>
                <Divider />
                <br></br>
                <Typography variant="body1">
                    <b>Selected Dataset:</b> {dataset?.dataset_name}
                </Typography>
                <Typography variant="body1">
                    <b>Description:</b> {dataset?.dataset_description}
                </Typography>
                <Typography variant="body1">
                    <b>Time:</b> {formatDateUTC(dataset?.dataset_times[timeIndex])}
                </Typography>
                <Typography variant="body1">
                    <b>Unit:</b> {latex ? <InlineMath math={latex} /> : <span style={{ fontStyle: 'italic', color: '#666' }}>unitless</span>}
                </Typography>  
            </Card>

            <MaterialReactTable table={table} />
        </Box>
    );
}