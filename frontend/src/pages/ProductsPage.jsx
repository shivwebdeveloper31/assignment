import React, { useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import PageHeader from '../components/common/PageHeader';
import FiltersBar from '../components/filters/FiltersBar';
import ProductsTable from '../components/table/ProductsTable';
import { fetchCategories } from '../store/slices/productsSlice';

const ProductsPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Box>
      <PageHeader
        title="Products"
        subtitle="Browse, search and filter all imported products"
        breadcrumbs={[{ label: 'ReviewIQ', href: '/' }, { label: 'Products' }]}
      />

      <Paper sx={{ p: 2, mb: 2 }}>
        <FiltersBar />
      </Paper>

      <ProductsTable />
    </Box>
  );
};

export default ProductsPage;
