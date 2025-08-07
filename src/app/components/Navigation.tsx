'use client';

import { Box, Button, Card, Stack } from '@mui/material';

const navLinks = [
  { label: 'Alaska CASC', href: 'https://akcasc.org/' },
  { label: 'Alaska Science Center', href: 'https://www.usgs.gov/centers/alaska-science-center' },
  { label: 'NOROCK', href: 'https://www.usgs.gov/centers/norock' },
  { label: 'Benchmark Glacier Project', href: 'https://www.usgs.gov/publications/us-geological-survey-benchmark-glacier-project' },
];

export default function NavBar() {
  return (
    <Card
      elevation={4}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 0,
        pb: 1,
        pt: 0,
        boxShadow: 6,
        borderRadius: 2,
        mb: 0.5, // Add bottom margin to make shadow more visible
      }}
    >
      {/* Left logos */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <img
          src="/logos/usgs.png"
          alt="USGS"
          style={{ height: '70px', objectFit: 'contain' }}
        />
        <img
          src="/logos/casc.jpg"
          alt="CASC"
          style={{ height: '70px', objectFit: 'contain' }}
        />
      </Box>

      {/* Center buttons */}
      <Stack direction="row" spacing={2}>
        {navLinks.map((link) => (
          <Button
            key={link.label}
            href={link.href}
            variant="text"
            sx={{ fontSize: '1rem' }}
          >
            {link.label}
          </Button>
        ))}
      </Stack>

      {/* Right logo */}
      <Box sx={{ display: 'flex' }}>
        <img
          src="/logos/um.png"
          alt="University of Montana"
          style={{ height: '70px', objectFit: 'contain' }}
        />
      </Box>
    </Card>
  );
}