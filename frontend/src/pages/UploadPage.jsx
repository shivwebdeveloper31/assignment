import React from 'react';
import { Box, Grid, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PageHeader from '../components/common/PageHeader';
import FileUpload from '../components/upload/FileUpload';
import { fetchSummary } from '../store/slices/analyticsSlice';
import { fetchCategories } from '../store/slices/productsSlice';

const EXPECTED_COLS = [
  'product_id', 'product_name', 'category',
  'discounted_price', 'actual_price', 'discount_percentage',
  'rating', 'rating_count', 'about_product',
  'img_link', 'product_link',
  'user_id', 'user_name', 'review_id',
  'review_title', 'review_content',
];

const UploadPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = () => {
    dispatch(fetchSummary());
    dispatch(fetchCategories());
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <Box>
      <PageHeader
        title="Import Data"
        subtitle="Upload a CSV or Excel file to populate the analytics dashboard"
        breadcrumbs={[{ label: 'ReviewIQ', href: '/' }, { label: 'Import Data' }]}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Upload Dataset</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Supports CSV, XLS, XLSX. Max file size: 10MB. On conflict, existing records are updated automatically.
              </Typography>
              <FileUpload onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Expected Columns</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Your file should contain these column headers (case-insensitive):
              </Typography>
              <List dense disablePadding>
                {EXPECTED_COLS.map(col => (
                  <ListItem key={col} disablePadding sx={{ py: 0.2 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 15, color: 'success.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={col}
                      primaryTypographyProps={{ variant: 'caption', fontFamily: 'monospace', color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                * <strong>product_id</strong> and <strong>product_name</strong> are required. All others are optional.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadPage;
