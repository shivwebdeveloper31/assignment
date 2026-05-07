import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, TextField, MenuItem, InputAdornment,
  IconButton, Tooltip, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { setFilters } from '../../store/slices/productsSlice';
import { useDebouncedCallback } from '../../utils/hooks';

const RATING_OPTIONS = [
  { value: '', label: 'All Ratings' },
  { value: '4.5', label: '4.5+ ★' },
  { value: '4', label: '4.0+ ★' },
  { value: '3', label: '3.0+ ★' },
  { value: '2', label: '2.0+ ★' },
];

const FiltersBar = () => {
  const dispatch = useDispatch();
  const { filters, categories } = useSelector(s => s.products);

  const debouncedSearch = useDebouncedCallback((value) => {
    dispatch(setFilters({ search: value }));
  }, 400);

  const handleCategory = (e) => dispatch(setFilters({ category: e.target.value }));
  const handleRating = (e) => dispatch(setFilters({ minRating: e.target.value, maxRating: '' }));

  const activeFilterCount = [
    filters.search, filters.category, filters.minRating
  ].filter(Boolean).length;

  const clearAll = () => dispatch(setFilters({ search: '', category: '', minRating: '', maxRating: '' }));

  return (
    <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
      <Box display="flex" alignItems="center" gap={0.5}>
        <FilterListIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        {activeFilterCount > 0 && (
          <Chip
            label={`${activeFilterCount} active`}
            size="small"
            color="primary"
            onDelete={clearAll}
          />
        )}
      </Box>

      <TextField
        placeholder="Search product name…"
        size="small"
        defaultValue={filters.search}
        onChange={e => debouncedSearch(e.target.value)}
        sx={{ minWidth: 240 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        size="small"
        label="Category"
        value={filters.category}
        onChange={handleCategory}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">All Categories</MenuItem>
        {categories.map(c => (
          <MenuItem key={c.category} value={c.category}>
            {c.category?.split('|')[0]?.trim()?.slice(0, 30)} ({c.count})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Min Rating"
        value={filters.minRating}
        onChange={handleRating}
        sx={{ minWidth: 140 }}
      >
        {RATING_OPTIONS.map(o => (
          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
        ))}
      </TextField>

      {activeFilterCount > 0 && (
        <Tooltip title="Clear all filters">
          <IconButton size="small" onClick={clearAll} sx={{ color: 'text.secondary' }}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default FiltersBar;
