import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, TableSortLabel,
  Paper, Chip, Skeleton, Typography, Tooltip, Rating
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { fetchProducts, setPage, setSort } from '../../store/slices/productsSlice';

const COLUMNS = [
  { id: 'product_name', label: 'Product', sortable: true, minWidth: 260 },
  { id: 'category',     label: 'Category', sortable: true, minWidth: 160 },
  { id: 'actual_price', label: 'MRP', sortable: true, minWidth: 90, align: 'right' },
  { id: 'discounted_price', label: 'Price', sortable: true, minWidth: 90, align: 'right' },
  { id: 'discount_percentage', label: 'Discount', sortable: true, minWidth: 90, align: 'center' },
  { id: 'rating',       label: 'Rating', sortable: true, minWidth: 140 },
  { id: 'rating_count', label: 'Reviews', sortable: true, minWidth: 90, align: 'right' },
];

const ProductsTable = () => {
  const dispatch = useDispatch();
  const { items, pagination, filters, sortBy, sortOrder, loading } = useSelector(s => s.products);

  useEffect(() => {
    dispatch(fetchProducts({
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
      sortBy,
      sortOrder,
    }));
  }, [dispatch, pagination.page, pagination.limit, filters, sortBy, sortOrder]);

  const handleChangePage = (_, newPage) => dispatch(setPage(newPage + 1));

  const handleSort = (col) => {
    const isAsc = sortBy === col && sortOrder === 'ASC';
    dispatch(setSort({ sortBy: col, sortOrder: isAsc ? 'DESC' : 'ASC' }));
  };

  const fmtPrice = (v) => v != null ? `₹${Number(v).toLocaleString('en-IN')}` : '—';
  const fmtDiscount = (v) => v != null ? `${v}%` : '—';

  const skeletonRows = Array.from({ length: pagination.limit > 10 ? 10 : pagination.limit });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {COLUMNS.map(col => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    minWidth: col.minWidth,
                    bgcolor: 'background.paper',
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    color: 'text.secondary',
                    borderBottom: '1px solid rgba(108,99,255,0.2)',
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder.toLowerCase() : 'asc'}
                      onClick={() => handleSort(col.id)}
                      sx={{ '&.Mui-active': { color: 'primary.main' } }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? skeletonRows.map((_, i) => (
                  <TableRow key={i}>
                    {COLUMNS.map(col => (
                      <TableCell key={col.id}>
                        <Skeleton height={24} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : items.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No products found. Upload a dataset to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              : items.map(row => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ '&:hover': { bgcolor: 'rgba(108,99,255,0.04)' } }}
                  >
                    {/* Product name */}
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Tooltip title={row.product_name} placement="top-start">
                          <Typography variant="body2" noWrap sx={{ maxWidth: 240 }}>
                            {row.product_name}
                          </Typography>
                        </Tooltip>
                        {row.product_link && (
                          <a href={row.product_link} target="_blank" rel="noreferrer" style={{ color: 'inherit', display: 'flex' }}>
                            <OpenInNewIcon sx={{ fontSize: 13, color: 'text.secondary', flexShrink: 0 }} />
                          </a>
                        )}
                      </Box>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      {row.category ? (
                        <Chip
                          label={row.category.split('|')[0]?.trim()?.slice(0, 22)}
                          size="small"
                          sx={{ fontSize: 11, height: 22, bgcolor: 'rgba(108,99,255,0.12)', color: 'primary.light' }}
                        />
                      ) : '—'}
                    </TableCell>

                    {/* Prices */}
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: 12 }}>
                        {fmtPrice(row.actual_price)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {fmtPrice(row.discounted_price)}
                      </Typography>
                    </TableCell>

                    {/* Discount */}
                    <TableCell align="center">
                      {row.discount_percentage != null ? (
                        <Chip
                          label={fmtDiscount(row.discount_percentage)}
                          size="small"
                          sx={{
                            fontSize: 11, height: 22,
                            bgcolor: row.discount_percentage >= 50 ? 'rgba(255,101,132,0.15)' : 'rgba(255,183,77,0.15)',
                            color: row.discount_percentage >= 50 ? 'secondary.main' : 'warning.main',
                          }}
                        />
                      ) : '—'}
                    </TableCell>

                    {/* Rating */}
                    <TableCell>
                      {row.rating != null ? (
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Rating
                            value={parseFloat(row.rating)}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ fontSize: 14 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({row.rating})
                          </Typography>
                        </Box>
                      ) : '—'}
                    </TableCell>

                    {/* Review count */}
                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary">
                        {row.rating_count != null ? Number(row.rating_count).toLocaleString() : '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page - 1}
        rowsPerPage={pagination.limit}
        rowsPerPageOptions={[10, 20, 50]}
        onPageChange={handleChangePage}
        onRowsPerPageChange={e => dispatch(setPage(1))}
        sx={{ borderTop: '1px solid rgba(108,99,255,0.1)' }}
      />
    </Paper>
  );
};

export default ProductsTable;
