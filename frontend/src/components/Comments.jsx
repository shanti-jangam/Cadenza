import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Collapse,
    IconButton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../contexts/AuthContext';

const Comments = ({ composition, onAddComment }) => {
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const { user } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            onAddComment(comment);
            setComment('');
        }
    };

    return (
        <Box>
            <IconButton 
                onClick={() => setShowComments(!showComments)}
                color={showComments ? 'primary' : 'default'}
            >
                <CommentIcon />
                <Typography variant="caption" sx={{ ml: 1 }}>
                    {composition.comments?.length || 0}
                </Typography>
            </IconButton>

            <Collapse in={showComments}>
                <Box sx={{ mt: 2 }}>
                    <AnimatePresence>
                        <List>
                            {composition.comments?.map((comment, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar>{comment.user.username[0]}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={comment.user.username}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2">
                                                        {comment.text}
                                                    </Typography>
                                                    <Typography variant="caption" display="block">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                </motion.div>
                            ))}
                        </List>
                    </AnimatePresence>

                    {user && (
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    disabled={!comment.trim()}
                                >
                                    Send
                                </Button>
                            </Box>
                        </form>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};

export default Comments; 