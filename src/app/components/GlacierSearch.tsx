'use client'

import { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

interface Glacier {
  gid: number;
  glac_name: string;
  rgi_id: string;
}


export default function GlacierAutocomplete() {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Glacier[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length < 2) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`http://0.0.0.0:8000/search/search?q=${encodeURIComponent(inputValue)}`);
        const data = await res.json();
        console.log(data);
        setOptions(data);
      } catch (error) {
        console.error('Failed to fetch glacier suggestions', error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 250); // debounce
    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => `${option.glac_name} (${option.rgi_id})`}
      filterSelectedOptions
      onChange={(event, newValue) => {
        console.log(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
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