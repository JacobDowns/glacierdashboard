import { Dataset } from "@/app/types/datasets"

import { 
  Paper,
  Box,
  Typography, 
  Breadcrumbs, 
  Link,
  Collapse,
  IconButton,
  Grid,
  Card,
  Divider
} from '@mui/material';



type Props = {
  selectedDataset: Dataset | null;
}


// Example usage
function DatasetCard({selectedDataset}: Props) {

  return (
    <Grid container spacing={2}>
    <Grid size={4}>
       <Card elevation={3}  sx={{ padding: 2}}>
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
            <b>Time Span:</b> {selectedDataset?.dataset_start_date} - {selectedDataset?.dataset_end_date} 
        </Typography>
       </Card>
    </Grid>
    <Grid size={4}>
    <Card elevation={3}  sx={{ padding: 2}}>
        <Typography variant="h6">
            Collection 
        </Typography>
        <Divider />
        <br></br>
        <Typography variant="body1">
            <b>Collection Name:</b> {selectedDataset?.collection_short_name} 
        </Typography>
        <Typography variant="body1">
            <b>Description:</b> {selectedDataset?.dataset_name} 
        </Typography>
       </Card>
    </Grid>
    <Grid size={4}>
    <Card elevation={3}  sx={{ padding: 2}}>
        <Typography variant="h6">
            Publication 
        </Typography> 

        <Divider />
        <br></br>
        <Link href={selectedDataset?.publication_url} variant="h7">{selectedDataset?.publication_title} </Link> 
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