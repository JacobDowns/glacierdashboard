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
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function About() {
    return (
        <Box sx={{ mt: 2, width: "100%", maxWidth: 1200, mx: "auto" }}>
            <Card elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5">About</Typography>
                <Divider />
                <br />
                <Typography variant="body1">
                    The Glacier Dashboard is a collaborative effort between the U.S. Geological Survey Alaska Climate Adaptation Science Center, the Alaska Science Center,
                    the Northern Rocky Mountain Science Center, and the University of Montana to compile and visualize published glacier datasets in order to assess the vulnerability
                    of Alaskan glaciers. Here, users can visualize and compare glacier datasets, view glacier statistics, and explore regional trends in glacier data.
                </Typography>
            </Card>

            <br />

            <Card elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5">User Interface</Typography>
                <Divider />
                <br />
                <Typography>The main components of the Glacier Dashboard's user interface are provided below for user reference.</Typography>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-map-content" id="panel-map-header">
                        <Typography component="span">Map</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        The map is the main component of the Glacier Dashboard where users can explore geographic data.
                        The top left of the map contains a basemap selector, which allows users to switch between different
                        background layers. Below the basemap selector is the subregion selector. Here you can select between displaying RGI regions,
                        RGI subregions, or national park boundaries. Selecting "None" hides all subregions on the map.
                        Hover over a subregion in the map to see its name.
                        The bottom left of the map contains the data legend, which displays the type and units of the data being shown.
                        The legend also allows users to customize how data is displayed.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-legend-content" id="panel-legend-header">
                        <Typography component="span">Data Legend</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        The data legend includes options to customize how data is displayed on the map. Here you can change the opacity, colormap,
                        and data range for the currently selected dataset. By default, some options are hidden. To view all options, click on the arrow in the top right corner
                        of the legend.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-info-bar-content" id="panel-info-bar-header">
                        <Typography component="span">Information Bar</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Below the map is the information bar, which displays the name of the currently selected dataset and the RGI ID of the currently
                        selected glacier (if any). It also contains the search bar.

                        <ul style={{ marginTop: 8, paddingLeft: 20, listStyleType: "disc" }}>
                            <li>Clicking on the datasets button on the left-hand side of the information bar displays the datasets selection table.</li>
                            <li>
                                The name of the currently selected dataset is displayed to the right of the "Datasets" button. Clicking on the name of the selected dataset will display all dataset metadata.
                            </li>
                            <li>
                                If a glacier has been selected in the map (by clicking anywhere within its outline), its RGI ID is displayed in the "Selected Glacier" button.
                                Clicking this button will show additional information and statistics for the selected glacier.
                            </li>
                            <li>
                                Clicking the arrow on the right-hand side of the information bar will expand/collapse a set of tabs that allow for more interactivity. See the tabs section for more information.
                            </li>
                            <li>
                                The right-hand side of the information bar contains the search bar. See the search bar section for more information.
                            </li>
                        </ul>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-search-content" id="panel-search-header">
                        <Typography component="span">Search Bar</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        On the right-hand side of the information bar is the search bar. Here you can search for glaciers by name or RGI ID.
                        Selecting a glacier will automatically navigate to it in the map.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-tabs-content" id="panel-tabs-header">
                        <Typography component="span">Tabs</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Below the information bar are a number of tabs. Tabs can be hidden or revealed by clicking the arrow on the right-hand side of the information bar.
                        <br />
                        <br />
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Tab Name</TableCell>
                                        <TableCell align="left">Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Select Dataset</TableCell>
                                        <TableCell>
                                            This tab displays a table of all available datasets. The table can be filtered, sorted, and searched
                                            by dataset name, data type, temporal range, and more.
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Dataset Details</TableCell>
                                        <TableCell>
                                            Displays metadata for the currently selected dataset, such as its name, format (vector or raster), temporal coverage, and authors.
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Glacier Details</TableCell>
                                        <TableCell>Displays basic information and statistics for the currently selected glacier.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Regional Statistics</TableCell>
                                        <TableCell>
                                            Displays regional statistics for all glaciers within a subregion (if a vector dataset and subregion are selected).
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            </Card>

            <br />

            <Card elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5">Datasets</Typography>
                <Divider />
                <br />
                <Typography variant="body1">
                    The Glacier Dashboard includes several datasets covering region 1 (Alaska) and region 2 (Northwestern Canada and the USA)
                    of the Randolph Glacier Inventory (RGI) 7.0. These datasets include ice thickness and velocity estimates, elevation change rates,
                    end-of-year snow cover, and more. Datasets generally represent glacier characteristics in the modern era
                    but are not all contemporaneous. These data fields are estimates and are subject to uncertainties and gaps in coverage.
                    Please refer to the relevant publications for more details.
                </Typography>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-dataset-selection-content" id="panel-dataset-selection-header">
                        <Typography component="span">Dataset Selection</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Click the "Datasets" button in the information bar or the "Select Dataset" tab to view all available datasets.
                        The Glacier Dashboard contains two primary types of data:

                        <ul style={{ marginTop: 8, paddingLeft: 20, listStyleType: "disc" }}>
                            <li>Raster Datasets: These are spatially resolved fields displayed at 100-meter resolution. Examples include elevation change and ice thickness.</li>
                            <li>Vector Datasets: These represent single values per glacier, such as average elevation or maximum thickness (i.e., glacier statistics).</li>
                        </ul>

                        The datasets table can be filtered, sorted, searched, and grouped. By default, datasets are organized into collections based on publication.
                        Metadata (e.g., dataset name, collection, authors, and temporal coverage) is available in the "Dataset Details" tab.
                        You can navigate there manually or click the dataset name in the information bar.

                        To select a dataset, click its row in the datasets table.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-raster-content" id="panel-raster-header">
                        <Typography component="span">Visualizing Raster Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        To view a raster dataset, click any row in the datasets table where the format field is "raster".
                        The legend in the lower-left corner of the map allows you to adjust the colormap, opacity, and data range.
                        If the dataset has multiple time steps, a time slider will appear.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-vector-content" id="panel-vector-header">
                        <Typography component="span">Visualizing Vector Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Vector datasets contain a single value per glacier and are often computed from raster datasets.
                        To view a vector dataset, click any row in the datasets table where the format field is "vector".
                        The map legend provides the same customization options as raster datasets.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-stats-content" id="panel-stats-header">
                        <Typography component="span">Regional Statistics</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        The Glacier Dashboard computes statistics for different subregions (e.g., RGI regions or national parks).
                        Select a vector dataset and choose your desired subregion from the subregion selector in the top-left corner of the map.
                        Then click the "Regional Statistics" tab.

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Statistic</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Glacierized Area</TableCell>
                                        <TableCell>Total area of RGI glaciers in a subregion. Actual modern area may be smaller.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Population Min.</TableCell>
                                        <TableCell>Minimum value of the statistic across glaciers in a subregion.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Population Max.</TableCell>
                                        <TableCell>Maximum value of the statistic across glaciers in a subregion.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Population Avg.</TableCell>
                                        <TableCell>Average value across glaciers in a subregion.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Area Weighted Sum</TableCell>
                                        <TableCell>Each value is weighted by glacier area and summed.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Area Weighted Avg.</TableCell>
                                        <TableCell>Area-weighted sum divided by total area.</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-temporal-content" id="panel-temporal-header">
                        <Typography component="span">Temporal Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Some datasets cover multiple time steps. For example, ITS LIVE velocity is available annually.
                        The number of time steps is shown in the "Available Times" column of the datasets table.
                        When such a dataset is selected, a time slider appears in the map legend.
                    </AccordionDetails>
                </Accordion>
            </Card>

            <Card elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5">Contact</Typography>
                <Divider />
                <br />
                <Typography variant="body1">
                    Need help or interested in adding your data to the Glacier Dashboard? Please reach out!
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Institution</TableCell>
                                <TableCell>Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Jacob Downs</TableCell>
                                <TableCell>University of Montana</TableCell>
                                <TableCell>jacob.downs@umt.edu</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Louis Sass</TableCell>
                                <TableCell>Alaska Science Center</TableCell>
                                <TableCell>lsass@usgs.gov</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}

export default About;
