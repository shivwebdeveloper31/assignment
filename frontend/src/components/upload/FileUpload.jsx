import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Button, Alert, LinearProgress,
  Paper, Chip, List, ListItem, ListItemText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { uploadFile, resetUpload } from '../../store/slices/uploadSlice';

const FileUpload = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, success, error, result } = useSelector(s => s.upload);
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      dispatch(resetUpload());
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleUpload = () => {
    if (selectedFile) {
      dispatch(uploadFile(selectedFile)).then((action) => {
        if (action.type.endsWith('/fulfilled') && onSuccess) {
          onSuccess();
        }
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    dispatch(resetUpload());
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          border: `2px dashed`,
          borderColor: isDragActive ? 'primary.main' : 'rgba(108,99,255,0.3)',
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'rgba(108,99,255,0.08)' : 'background.paper',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'rgba(108,99,255,0.06)',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop your file here' : 'Drag & drop your dataset'}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Supports CSV, XLS, XLSX files (max 10MB)
        </Typography>
        <Button variant="outlined" size="small">
          Browse Files
        </Button>
      </Paper>

      {selectedFile && !success && (
        <Box mt={2} display="flex" alignItems="center" gap={1} justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <InsertDriveFileIcon color="primary" />
            <Typography variant="body2">{selectedFile.name}</Typography>
            <Chip
              label={`${(selectedFile.size / 1024).toFixed(1)} KB`}
              size="small"
              variant="outlined"
            />
          </Box>
          <Box display="flex" gap={1}>
            <Button variant="text" size="small" onClick={handleReset} color="inherit">
              Remove
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleUpload}
              disabled={loading}
            >
              Import
            </Button>
          </Box>
        </Box>
      )}

      {loading && (
        <Box mt={2}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
            Processing file...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={handleReset}>
          {error}
        </Alert>
      )}

      {success && result && (
        <Alert
          severity="success"
          sx={{ mt: 2 }}
          icon={<CheckCircleIcon />}
          action={
            <Button color="inherit" size="small" onClick={handleReset}>
              Upload Another
            </Button>
          }
        >
          <Typography variant="body2" fontWeight={600}>Import Successful!</Typography>
          <List dense sx={{ p: 0, mt: 0.5 }}>
            {[
              ['Total Rows', result.stats?.total],
              ['Inserted', result.stats?.inserted],
              ['Updated', result.stats?.updated],
              ['Reviews', result.stats?.reviewsInserted],
              ['Errors', result.stats?.errors],
            ].map(([label, val]) => val !== undefined && (
              <ListItem key={label} sx={{ p: 0 }}>
                <ListItemText
                  primary={`${label}: ${val}`}
                  primaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;
