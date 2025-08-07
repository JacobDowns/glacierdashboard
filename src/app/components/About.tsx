"use client";

import {
    Typography,
    Link,
    ListItem,
    Card,
    Divider,
    Container,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    AccordionActions
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Example usage
function About() {



    return (
        <Box sx={{ mt: 2, width: '100%', maxWidth: 1200, mx: 'auto' }}>
            <Card elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5">
                    About
                </Typography>
                <Divider />
                <br></br>
                <Typography variant="body1">
                    The Glacier Dashboard is a collaborative effort between the U.S. Geological Survey Alaska Climate Adaptation Science Center, the Alaska Science Center,
                    the Northern Rocky Mountain Science Center, and the University of Montana to compile and visualize published glacier datasets in order to assess the vulnerability
                    of Alaskan glaciers. Here, users can visualize and compare glacier datasets, view glacier statistics, and explore regional trends in glacier data.
                </Typography>

            </Card>
            <br></br>
            <Card elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5">
                    User Interface
                </Typography>
                <Divider />
                <br></br>
                The main components of the Glacier Dashboard's user interface are provided below for user reference.
                <br></br>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel0-content"
                        id="panel0-header"
                    >
                        <Typography component="span">Map</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        The map is the main component of the Glacier Dashboard where users can explore geographic data.
                        The top left of the map contains a basemap selector, which allows users to switch between different
                        background layers. Below the basemap selector is the subregion selector. Here you can you can  select between  displaying RGI regions,
                        RGI subregions, or national park boundaries. Selecting "None" hides all subregions on the map.
                        Hover over a subregion in the map to see its name.
                        The bottom left of the map contains the data legend, which displays the type and units and units of the data being displayed on the map.
                        The legend also allows users to customize how data is displayed.
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel0-content"
                        id="panel0-header"
                    >
                        <Typography component="span">Data Legend</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        The data legend includes options to customize how data is displayed on the map. Here you can change the  opacity, colormap,
                        and data range for the currently selected dataset.  By default, some options are hidden. To view all options, click on the arrow in the top right corner
                        of the legend.
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography component="span">Information Bar</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        Below the map is the information bar, which displays the name of the currently selected dataset and the RGI id of the currently 
                        selected glacier (if any). It also contains the search bar. 

                        <ul style={{ marginTop: 8, paddingLeft: 20 , listStyleType: 'disc'}}>
                            <li> Clicking on the datasets button on the left hand side of the information bar displays the datasets selection table.</li>
                            <li>
                        The name of the currently selected dataset is displayed to the right
                        of the "datasets" button. Clicking on the name of the selected dataset will display all dataset metadata.</li>
                            <li>If a glacier has been selected in the map (by clicking anywhere within its outline), its RGI id is displayed in the "Selected Glacier" button. 
                                Clicking on this
                                button will show additional information and statistics for the currently selected glacier.</li>
                        <li>
                        Clicking on arrow at the right hand side of the information bar will expand / collapse
                        a set of tabs that allow for more interactivity. See the tabs section for more information.</li>
                               <li>
                        The right hand side of the information bar contains the search bar. See the search bar section for more information.</li>
                        </ul>


                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <Typography component="span">Search Bar</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        On the right hand side of the information bar is the search bar. Here you can search for glaciers by name or RGI id.
                        Selecting a glacier will automatically navigate to it in the map. 
                    </AccordionDetails>

                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4-content"
                        id="panel4-header"
                    >
                        <Typography component="span">Tabs</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Below the information bar are a number of tabs.  Tabs can be hidden or revealed by clicking the arrow on the right hand side of the information bar.
                        <br></br>
                        <br></br>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Tab Name</TableCell>
                                        <TableCell align="left">Description</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Select Dataset
                                        </TableCell>
                                        <TableCell align="left">This tab displays a table of all available datasets in the dashboard. This table can be filtered, sorted, and searched
                                            by dataset name, data type, temporal range, and more.
                                        </TableCell>
                                    </TableRow>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Dataset Details
                                        </TableCell>
                                        <TableCell align="left">Displays metadata for the currently selected dataset such its name, format (vector or rster), temporal coverage, and authors.</TableCell>
                                    </TableRow>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Glacier Details
                                        </TableCell>
                                        <TableCell align="left">This tab will display basic information and statistics for the currently selected glacier.</TableCell>
                                    </TableRow>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Regional Statistics
                                        </TableCell>
                                        <TableCell align="left">If both a vector dataset has been selected and a subregion has been selected, this tab
                                            will display regional statistics for all glaciers within each subregion. 
                                        </TableCell>
                                    </TableRow>


                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>

                </Accordion>


            </Card>
            <br></br>
            <Card elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5">
                    Datasets
                </Typography>
                <Divider />
                <br></br>
                <Typography variant="body1">
                    The Glacier Dashboard includes several datasets covering region 1 (Alaska) and region 2 (Northewestern Canada and the USA)
                    of the Randolph Glacier Inventory (RGI) 7.0. These datasets include ice thickness and velocity estimates, elvation change rates, 
                    end of the year snow cover, and more.
                    Datasets generally represent glacier characteristics in the modern era
                    but are not all contemporaneous. Note that these data fields are estimates and are subject to uncertainties and gaps in coverage.
                    Please refer to the relevant publications for more details on the individual datasets.

                    <br></br>

                </Typography>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel0-content"
                        id="panel0 -header"
                    >
                        <Typography component="span">Dataset Selection</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        To view all available datasets, click on the "Datasets" button in the information bar or the "Select Dataset" tab.
                        There are currently two primary types of data in the Glacier Dashboard:

                          <ul style={{ marginTop: 8, paddingLeft: 20 , listStyleType: 'disc'}}>
                            <li> Raster Datasets: These are spatially resolved fields displayed at a resolution of 100 meters. Examples include glacier elevation change patterns,
                                 and ice thickness estimates.</li>
                            <li>Vector Datasets: These datasets represent single values for each glacier, such as average elevation or maximum thickness. They can generally 
                                be thought of as glacier statistics. 
                            </li>
                          </ul>

                        
                        
                        The datasets table can be filtered, sorted, searched and grouped into different categories. By default, datasets are organized into a number of collections,
                        that contain datasets from particular publications. 
                        Metadata, including the dataset name, collection, authors,
                        and temporal coverage is available for each dataset in the "Dataset Details" tab. You can navigate to this tab manually,
                        or click the button in the information displaying the selected dataset name.

                        To select any dataset, simply click the corresponding row in the datasets table. 
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography component="span">Visualizing Raster Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        To view a raster dataset, click any row in the datasets table where the format field has a value of "raster".
                        The legend in the lower left hand corner of the map allows you to change the colormap, opacity, and data range.
                        Additionally, if the dataset contains multiple time steps, a time sldier will appear in the legend. 
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography component="span">Visualizing Vector Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Vector datasets contain a single value per glacier and can be thought of as glacier statistics. These statistics are typically computed 
                        from raster datasets. 
                        To view a vector dataset, click any row in in the datasets table where the format field has a value of "vector".
                        Similarly to raster datasets, the legend in the lower left hand corner of the map allows you to change the colormap, opacity, and data range.
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <Typography component="span">Regional Statistics</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        The Glacier Dashboard can collate regional statistics for different
                        geographic regions including primary and secondary regions in the Randolph Glacier Inventory (RGI) 7.0, as
                        well as for national parks. To view regional statistics,  make sure you have a vector dataset selected and 
                        select the desired subregions of interest in the "Subregions" selector
                        in the top left corner of the map. Next, click on the "Regional Statistics" tab 
                        which will display statistics for all galciers in each subregion, such as each national park.
                        Descriptions of the available statistics are given below.

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Statistic</TableCell>
                                        <TableCell align="left">Description</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Glacierized Area
                                        </TableCell>
                                        <TableCell align="left">Total area of all RGI glaciers in a given subregion. The actual modern glacierized area may be smaller
                                            than estimated from the RGI.  
                                            .</TableCell>
                                    </TableRow>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Population Min.
                                        </TableCell>
                                        <TableCell align="left">Minimum value of the selected statistic across all glaciers in a given subregion.</TableCell>
                                    </TableRow>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Population Max.
                                        </TableCell>
                                        <TableCell align="left">Maximum value of the selected statistic across all glaciers in a given subregion.</TableCell>
                                    </TableRow>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Population Avg.
                                        </TableCell>
                                        <TableCell align="left">Average value of the selected statistic across all glaciers in a given subregion.</TableCell>
                                    </TableRow>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Area Weighted Sum
                                        </TableCell>
                                        <TableCell align="left">The statistic for each glacier is multiplied by the glaciers area, then summed.</TableCell>
                                    </TableRow>


                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Area Weighted Avg.
                                        </TableCell>
                                        <TableCell align="left">The area weighted sum divided by the total glacierized area.</TableCell>
                                    </TableRow>


                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4-content"
                        id="panel4-header"
                    >
                        <Typography component="span">Temporal Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Some datasets cover multiple time steps. Ice surface velocity from ITS LIVE, for example, is available annually. 
                        The number of time steps for a given dataset is displayed in the "Available Times" column in the
                        datasets table. If the dataset contains multiple time steps, selecting it will reveal a time sldier in the map legend. Use the time 
                        slider to view data for a specific time step.
                    </AccordionDetails>
                </Accordion>


            </Card>

            <Card elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5">
                    Contact
                </Typography>
                <Divider />
                <br></br>
                <Typography variant="body1">
                    Need help or interested in adding your data to the Glacier Dashboard? Please reach out!
                </Typography>
                  <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Name</TableCell>
                                        <TableCell align="left">Institution</TableCell>
                                        <TableCell align="left">Email</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            Jacob Downs
                                        </TableCell>
                                        <TableCell align="left">University of Montana
                                        </TableCell>
                                        <TableCell align="left">jacob.downs@umt.edu
                                        </TableCell>
                                    </TableRow>

                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                           Louis Sass 
                                        </TableCell>
                                        <TableCell align="left">Alaska Science Center</TableCell>
                                        <TableCell align="left">lsass@usgs.gov</TableCell>
                                    </TableRow>



                                </TableBody>
                            </Table>
                        </TableContainer>
                </Card>
        </Box>
    );
}

export default About;