import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { fetchCategoryAvgRating } from '../../store/slices/analyticsSlice';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(67,217,173,0.3)', borderRadius: 2, p: 1.5 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {d.category}
        </Typography>
        <Typography variant="body2" fontWeight={700} color="success.main">
          ★ {d.avg_rating} avg rating
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {d.product_count} products
        </Typography>
      </Box>
    );
  }
  return null;
};

const CategoryAvgRatingChart = () => {
  const dispatch = useDispatch();
  const { categoryAvgRating, loading } = useSelector(s => s.analytics);

  useEffect(() => { dispatch(fetchCategoryAvgRating()); }, [dispatch]);

  const data = categoryAvgRating.map(d => ({
    ...d,
    shortCat: d.category?.split('|')[0]?.trim()?.slice(0, 18) || d.category,
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Category-wise Avg Rating
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Average star rating per product category
        </Typography>
        {loading.charts ? (
          <Skeleton variant="rectangular" height={300} sx={{ mt: 2, borderRadius: 2 }} />
        ) : data.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" height={300}>
            <Typography color="text.secondary">No data available</Typography>
          </Box>
        ) : (
          <Box mt={2} sx={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="shortCat"
                  tick={{ fontSize: 11, fill: '#8B8DB8' }}
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  domain={[0, 5]}
                  tick={{ fontSize: 11, fill: '#8B8DB8' }}
                  ticks={[1, 2, 3, 4, 5]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(67,217,173,0.08)' }} />
                <ReferenceLine y={4} stroke="rgba(67,217,173,0.3)" strokeDasharray="4 4" label={{ value: '4★', fill: '#43D9AD', fontSize: 11 }} />
                <Bar dataKey="avg_rating" radius={[6, 6, 0, 0]}>
                  {data.map((d, i) => {
                    const rating = parseFloat(d.avg_rating);
                    const color = rating >= 4 ? '#43D9AD' : rating >= 3 ? '#FFB74D' : '#FF6584';
                    return <Cell key={i} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryAvgRatingChart;
