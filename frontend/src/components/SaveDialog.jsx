import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Box,
  Typography,
  IconButton,
  styled
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    background: 'rgba(18, 18, 18, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
}));

const SaveDialog = ({ open, onClose, onSave, data, onChange, isSaving }) => {
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MusicNoteIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Save Your Composition</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            sx={{ mb: 3 }}
            InputProps={{
              sx: {
                '&:hover': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Add Tags"
            variant="outlined"
            value={data.currentTag}
            onChange={(e) => onChange({ ...data, currentTag: e.target.value })}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && data.currentTag.trim()) {
                onChange({
                  ...data,
                  tags: [...new Set([...data.tags, data.currentTag.trim()])],
                  currentTag: ''
                });
              }
            }}
            helperText="Press Enter to add tags"
          />

          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <AnimatePresence>
              {data.tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Chip
                    label={tag}
                    onDelete={() => {
                      onChange({
                        ...data,
                        tags: data.tags.filter((_, i) => i !== index)
                      });
                    }}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                      },
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        p: 2
      }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!data.title || isSaving}
          sx={{
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          {isSaving ? 'Saving...' : 'Save Composition'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default SaveDialog; 