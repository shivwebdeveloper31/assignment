import React from 'react';
import { Grid, Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import ProductsPerCategoryChart from '../components/charts/ProductsPerCategoryChart';
import TopReviewedChart from '../components/charts/TopReviewedChart';
import DiscountHistogram from '../components/charts/DiscountHistogram';
import CategoryAvgRatingChart from '../components/charts/CategoryAvgRatingChart';

const AnalyticsPage = () => (
  <Box>
    <PageHeader
      title="Analytics"
      subtitle="Visual breakdown of product performance and review data"
      breadcrumbs={[{ label: 'ReviewIQ', href: '/' }, { label: 'Analytics' }]}
    />
    <Grid container spacing={2.5}>
      <Grid item xs={12} lg={6}>
        <ProductsPerCategoryChart />
      </Grid>
      <Grid item xs={12} lg={6}>
        <TopReviewedChart />
      </Grid>
      <Grid item xs={12} lg={6}>
        <DiscountHistogram />
      </Grid>
      <Grid item xs={12} lg={6}>
        <CategoryAvgRatingChart />
      </Grid>
    </Grid>
  </Box>
);

export default AnalyticsPage;
