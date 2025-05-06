import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    IconButton,
    Tooltip,
    Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import Comments from './Comments';
import CompositionVisualizer from './CompositionVisualizer';
import AudioService from '../services/AudioService';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CompositionCard = ({ composition, onUpdate }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(composition.likes?.includes(user?.id));
    const [showSnackbar, setShowSnackbar] = useState(false);
    const { user } = useAuth();

    const handlePlay = () => {
        setIsPlaying(true);
        const notes = JSON.parse(composition.melody);
        AudioService.playComposition(notes);
        setTimeout(() => setIsPlaying(false), notes.length * 500);
    };

    const handleStop = () => {
        setIsPlaying(false);
        AudioService.stopAll();
    };

    const handleLike = async () => {
        if (!user) return;
        try {
            await axios.post(`http://localhost:5000/api/compositions/${composition._id}/like`);
            setIsLiked(!isLiked);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error liking composition:', error);
        }
    };

    const handleShare = async () => {
        try {
            await axios.post(`http://localhost:5000/api/compositions/${composition._id}/share`);
            const shareUrl = `${window.location.origin}/composition/${composition._id}`;
            await navigator.clipboard.writeText(shareUrl);
            setShowSnackbar(true);
        } catch (error) {
            console.error('Error sharing composition:', error);
        }
    };

    const handleAddComment = async (text) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/compositions/${composition._id}/comment`,
                { text }
            );
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
            }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        {composition.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        By {composition.creator.username}
                    </Typography>

                    <CompositionVisualizer 
                        notes={JSON.parse(composition.melody)}
                        isPlaying={isPlaying}
                    />

                    <Box sx={{ mt: 1 }}>
                        {composition.tags?.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                            />
                        ))}
                    </Box>
                </CardContent>

                <CardActions>
                    <Tooltip title={isPlaying ? "Stop" : "Play"}>
                        <IconButton 
                            onClick={isPlaying ? handleStop : handlePlay}
                            color="primary"
                        >
                            {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={isLiked ? "Unlike" : "Like"}>
                        <IconButton onClick={handleLike} color="secondary">
                            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                        <IconButton onClick={handleShare}>
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                    <Comments 
                        composition={composition}
                        onAddComment={handleAddComment}
                    />
                </CardActions>
            </Card>

            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
                message="Share link copied to clipboard!"
            />
        </motion.div>
    );
};

export default CompositionCard; 