import React from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PageHeader from '../components/common/PageHeader';
import SummaryCards from '../components/dashboard/SummaryCards';
import ProductsPerCategoryChart from '../components/charts/ProductsPerCategoryChart';
import TopReviewedChart from '../components/charts/TopReviewedChart';
import DiscountHistogram from '../components/charts/DiscountHistogram';
import CategoryAvgRatingChart from '../components/charts/CategoryAvgRatingChart';

const DashboardPage = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Product ratings and review analytics overview"
        breadcrumbs={[{ label: 'ReviewIQ' }, { label: 'Dashboard' }]}
        action={
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => navigate('/upload')}
            size="small"
          >
            Import Data
          </Button>
        }
      />

      {/* KPI cards */}
      <Box mb={3}>
        <SummaryCards />
      </Box>

      {/* Charts row 1 */}
      <Grid container spacing={2.5} mb={2.5}>
        <Grid item xs={12} md={6}>
          <ProductsPerCategoryChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopReviewedChart />
        </Grid>
      </Grid>

      {/* Charts row 2 */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <DiscountHistogram />
        </Grid>
        <Grid item xs={12} md={6}>
          <CategoryAvgRatingChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
