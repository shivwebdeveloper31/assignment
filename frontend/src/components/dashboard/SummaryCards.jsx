import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { fetchSummary } from '../../store/slices/analyticsSlice';

const stats = [
  { key: 'total_products', label: 'Total Products', icon: InventoryIcon, color: '#6C63FF', format: v => Number(v).toLocaleString() },
  { key: 'total_categories', label: 'Categories', icon: CategoryIcon, color: '#FF6584', format: v => v },
  { key: 'avg_rating', label: 'Avg Rating', icon: StarIcon, color: '#FFB74D', format: v => `${v} ★` },
  { key: 'total_reviews', label: 'Total Reviews', icon: RateReviewIcon, color: '#43D9AD', format: v => Number(v).toLocaleString() },
  { key: 'avg_discount', label: 'Avg Discount', icon: LocalOfferIcon, color: '#FF8C00', format: v => `${v}%` },
];

const SummaryCards = () => {
  const dispatch = useDispatch();
  const { summary, loading } = useSelector(s => s.analytics);

  useEffect(() => { dispatch(fetchSummary()); }, [dispatch]);

  return (
    <Grid container spacing={2}>
      {stats.map(({ key, label, icon: Icon, color, format }) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={key}>
          <Card sx={{
            background: `linear-gradient(135deg, ${color}18, ${color}08)`,
            border: `1px solid ${color}30`,
            height: '100%',
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {label}
                  </Typography>
                  {loading.summary ? (
                    <Skeleton width={80} height={36} sx={{ mt: 0.5 }} />
                  ) : (
                    <Typography variant="h5" fontWeight={700} sx={{ color, mt: 0.5 }}>
                      {summary ? format(summary[key] ?? 0) : '—'}
                    </Typography>
                  )}
                </Box>
                <Box sx={{
                  width: 40, height: 40, borderRadius: 2,
                  bgcolor: `${color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon sx={{ color, fontSize: 22 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
