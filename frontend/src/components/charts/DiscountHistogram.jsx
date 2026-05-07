import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { fetchDiscountDistribution } from '../../store/slices/analyticsSlice';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,183,77,0.3)', borderRadius: 2, p: 1.5 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Discount range: {payload[0].payload.bucket}
        </Typography>
        <Typography variant="body2" fontWeight={700} color="warning.main">
          {payload[0].value} Products
        </Typography>
      </Box>
    );
  }
  return null;
};

const DiscountHistogram = () => {
  const dispatch = useDispatch();
  const { discountDistribution, loading } = useSelector(s => s.analytics);

  useEffect(() => { dispatch(fetchDiscountDistribution()); }, [dispatch]);

  const maxVal = Math.max(...discountDistribution.map(d => Number(d.count) || 0));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Discount Distribution
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Histogram of discount percentages across products
        </Typography>
        {loading.charts ? (
          <Skeleton variant="rectangular" height={300} sx={{ mt: 2, borderRadius: 2 }} />
        ) : discountDistribution.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" height={300}>
            <Typography color="text.secondary">No data available</Typography>
          </Box>
        ) : (
          <Box mt={2} sx={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart
                data={discountDistribution}
                margin={{ top: 5, right: 10, left: 0, bottom: 10 }}
                barCategoryGap="2%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#8B8DB8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#8B8DB8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,183,77,0.08)' }} />
                <ReferenceLine
                  x={discountDistribution.find(d => Number(d.count) === maxVal)?.bucket}
                  stroke="rgba(255,183,77,0.3)"
                  strokeDasharray="4 4"
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {discountDistribution.map((d, i) => {
                    const intensity = maxVal > 0 ? Number(d.count) / maxVal : 0;
                    const alpha = 0.4 + intensity * 0.6;
                    return <Cell key={i} fill={`rgba(255,183,77,${alpha})`} />;
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

export default DiscountHistogram;
