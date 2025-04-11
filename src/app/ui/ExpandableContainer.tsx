import React, { useState, MouseEvent } from 'react';
import { 
  Paper,
  Box,
  Typography, 
  Breadcrumbs, 
  Link,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface ExpandableBreadcrumbContainerProps {
  breadcrumbs: BreadcrumbItem[];
  onBreadcrumbClick: (path: string) => void;
  children: React.ReactNode;
}

const ExpandableBreadcrumbContainer: React.FC<ExpandableBreadcrumbContainerProps> = ({
  breadcrumbs,
  onBreadcrumbClick,
  children
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleBreadcrumbClick = (event: MouseEvent<HTMLAnchorElement>, path: string): void => {
    // Prevent default link behavior
    event.preventDefault();
    
    // Toggle expanded state
    setExpanded(!expanded);
    
    // Call the parent handler with the path
    onBreadcrumbClick(path);
  };

  const toggleExpanded = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      {/* Header with breadcrumbs */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderBottom: expanded ? 1 : 0,
          borderColor: 'divider'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((item, index) => (
            index === breadcrumbs.length - 1 ? (
              <Typography key={item.path} color="text.primary">
                {item.label}
              </Typography>
            ) : (
              <Link
                key={item.path}
                color="inherit"
                href={item.path}
                onClick={(e) => handleBreadcrumbClick(e as MouseEvent<HTMLAnchorElement>, item.path)}
                underline="hover"
              >
                {item.label}
              </Link>
            )
          ))}
        </Breadcrumbs>
        <IconButton 
          onClick={toggleExpanded}
          size="small"
          aria-expanded={expanded}
          aria-label="show details"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Collapsible content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Paper>
  );
};

// Example usage
function ExpandableContainer() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Product Details', path: '/products/details' }
  ];

  const handleBreadcrumbClick = (path: string): void => {
    console.log(`Navigating to: ${path}`);
    // Add your navigation logic here
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <ExpandableBreadcrumbContainer 
        breadcrumbs={breadcrumbItems}
        onBreadcrumbClick={handleBreadcrumbClick}
      >
        <Typography>
          This is the expanded content that will show when you click a breadcrumb link
          or the expand/collapse icon.
        </Typography>
        <Typography>
          You can place any components here - text, images, forms, tables, etc.
        </Typography>
        {/* Add any other components you need here */}
      </ExpandableBreadcrumbContainer>
    </Box>
  );
}

export default ExpandableContainer;