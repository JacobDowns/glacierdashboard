'use client';

import { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

interface Glacier {
  gid: number;
  glac_name: string;
  rgi_id: string;
  cenlat: number;
  cenlon: number;
}

export default function GlacierSearch({
  onNavigateToGlacier,
}: {
  onNavigateToGlacier: (lat: number, lon: number) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Glacier[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (inputValue.length < 4) {
      setOptions([]);
      setLoading(false);
      return;
    }
  
    setLoading(true);
  
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  
    debounceRef.current = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
  
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      fetch(`${API_URL}/api/glacier_lookup?q=${encodeURIComponent(inputValue)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => setOptions(data))
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Fetch error:', err);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        });
    }, 100); // debounce delay
  }, [inputValue]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => `${option.glac_name || 'Unnamed glacier'} (${option.rgi_id})`}
      filterSelectedOptions
      loading={loading}
      noOptionsText={inputValue.length < 4 ? 'Type at least 4 characters' : 'No matching glaciers'}
      onChange={(event, newValue) => {
        if (newValue) {
          onNavigateToGlacier(newValue.cenlat, newValue.cenlon);
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          sx={{ width: 350 }}
          {...params}
          label="Glacier Search"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
