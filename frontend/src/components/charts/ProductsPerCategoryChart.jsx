import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { fetchProductsPerCategory } from '../../store/slices/analyticsSlice';

const COLORS = ['#6C63FF','#FF6584','#43D9AD','#FFB74D','#FF8C00',
  '#00BCD4','#9C27B0','#E91E63','#4CAF50','#FF5722',
  '#3F51B5','#009688','#CDDC39','#795548','#607D8B'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 2, p: 1.5 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {payload[0].payload.category}
        </Typography>
        <Typography variant="body2" fontWeight={700} color="primary.main">
          {payload[0].value} Products
        </Typography>
      </Box>
    );
  }
  return null;
};

const ProductsPerCategoryChart = () => {
  const dispatch = useDispatch();
  const { productsPerCategory, loading } = useSelector(s => s.analytics);

  useEffect(() => { dispatch(fetchProductsPerCategory()); }, [dispatch]);

  const data = productsPerCategory.map(d => ({
    ...d,
    shortCat: d.category?.split('|')[0]?.trim()?.slice(0, 20) || d.category,
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Products per Category
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Distribution of products across categories
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
                <YAxis tick={{ fontSize: 11, fill: '#8B8DB8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.08)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsPerCategoryChart;
