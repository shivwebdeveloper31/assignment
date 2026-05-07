import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { fetchTopReviewed } from '../../store/slices/analyticsSlice';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,101,132,0.3)', borderRadius: 2, p: 1.5, maxWidth: 220 }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          {d.product_name?.slice(0, 60)}{d.product_name?.length > 60 ? '…' : ''}
        </Typography>
        <Typography variant="body2" fontWeight={700} color="secondary.main">
          {Number(d.rating_count).toLocaleString()} Ratings
        </Typography>
        {d.rating && (
          <Typography variant="caption" color="warning.main">★ {d.rating}</Typography>
        )}
      </Box>
    );
  }
  return null;
};

const TopReviewedChart = () => {
  const dispatch = useDispatch();
  const { topReviewed, loading } = useSelector(s => s.analytics);

  useEffect(() => { dispatch(fetchTopReviewed(10)); }, [dispatch]);

  const data = topReviewed.map(d => ({
    ...d,
    shortName: d.product_name?.slice(0, 18) + (d.product_name?.length > 18 ? '…' : ''),
  }));

  const maxVal = Math.max(...data.map(d => Number(d.rating_count) || 0));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Top Reviewed Products
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Products with the most ratings
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
                  dataKey="shortName"
                  tick={{ fontSize: 11, fill: '#8B8DB8' }}
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#8B8DB8' }}
                  tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,101,132,0.08)' }} />
                <Bar dataKey="rating_count" radius={[6, 6, 0, 0]}>
                  {data.map((d, i) => {
                    const intensity = maxVal > 0 ? Number(d.rating_count) / maxVal : 0;
                    const r = Math.round(108 + (255 - 108) * intensity);
                    const g = Math.round(99 + (101 - 99) * intensity);
                    const b = Math.round(255 + (132 - 255) * intensity);
                    return <Cell key={i} fill={`rgb(${r},${g},${b})`} />;
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

export default TopReviewedChart;
