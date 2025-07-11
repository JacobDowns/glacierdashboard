"use client";
import { Dataset } from "@/app/types/datasets"
import { formatDateUTC } from '@/app/utils/formatDate';

import {
    Typography,
    Link,
    Grid,
    Card,
    Divider
} from '@mui/material';



type Props = {
    selectedDataset: Dataset | null;
}


// Example usage
function DatasetCard({ selectedDataset }: Props) {



    //if (loading) return <CircularProgress />;
    if (!selectedDataset) return <Typography variant="body1">No dataset selected</Typography>;
    
    const startTime = formatDateUTC(selectedDataset?.dataset_start_date);
    const endTime = formatDateUTC(selectedDataset?.dataset_end_date);
    const timePeriod = selectedDataset?.dataset_time_format === "range" ? `${startTime} - ${endTime}` : `${startTime}`;

    return (
        <Grid container spacing={2}>
            <Grid size={4}>
                <Card elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6">
                        Dataset
                    </Typography>
                    <Divider />
                    <br></br>
                    <Typography variant="body1">
                        <b>Selected Dataset:</b> {selectedDataset?.dataset_name}
                    </Typography>
                    <Typography variant="body1">
                        <b>Format:</b> {selectedDataset?.dataset_format}
                    </Typography>
                    <Typography variant="body1">
                        <b>Description:</b> {selectedDataset?.dataset_description}
                    </Typography>
                    <Typography variant="body1">
                        <b>Time Format:</b> {selectedDataset?.dataset_time_format === "range" ? "Dataset reflects a time range" : "Dataset reflects a point in time"}
                    </Typography>
                    <Typography variant="body1">
                        <b>Temporal Period:</b> {timePeriod}
                    </Typography>
                </Card>
            </Grid>
            <Grid size={4}>
                <Card elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6">
                        Collection
                    </Typography>
                    <Divider />
                    <br></br>
                    <Typography variant="body1">
                        <b>Collection Name:</b> {selectedDataset?.collection_name}
                    </Typography>
                    <Typography variant="body1">
                        <b>Description:</b> {selectedDataset?.collection_description}
                    </Typography>
                </Card>
            </Grid>
            <Grid size={4}>
                <Card elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6">
                        Publication
                    </Typography>

                    <Divider />
                    <br></br>
                    <Link href={selectedDataset?.publication_url} variant="h6">{selectedDataset?.publication_title} </Link>
                    <Typography variant="body1">
                        <b>Authors:</b> {selectedDataset?.publication_authors}
                    </Typography>
                    <Typography variant="body1">
                        <b>Year:</b> {selectedDataset?.publication_year}
                    </Typography>
                </Card>
            </Grid>
        </Grid>
    );
}

export default DatasetCard;