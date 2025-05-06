import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    TextField,
    Button,
    Divider,
    Chip,
    Stack,
    Alert,
    Avatar,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import SendIcon from '@mui/icons-material/Send';
import WebSocketService from '../services/WebSocketService';

const Collaborate = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [username] = useState('User_' + Math.floor(Math.random() * 1000));
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const seenMessages = new Set();

        WebSocketService.setCallbacks({
            onMessage: (data) => {
                // Only process chat messages, ignore system messages
                if (data.type === 'chat') {
                    const messageKey = `${data.timestamp}-${data.username}-${data.content}`;
                    if (!seenMessages.has(messageKey)) {
                        seenMessages.add(messageKey);
                        setMessages(prev => [...prev, data]);
                    }
                }
            },
            onConnect: () => {
                setIsConnected(true);
                enqueueSnackbar('Connected to chat', { variant: 'success' });
            },
            onDisconnect: () => {
                setIsConnected(false);
                enqueueSnackbar('Disconnected from chat', { variant: 'warning' });
            }
        });

        WebSocketService.connect();

        return () => {
            WebSocketService.disconnect();
        };
    }, [enqueueSnackbar]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = {
                type: 'chat',
                username: username,
                content: message,
                timestamp: new Date().toISOString()
            };
            
            WebSocketService.send(messageData);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const MessageItem = ({ msg }) => {
        const isCurrentUser = msg.username === username;

        return (
            <ListItem 
                sx={{ 
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    px: 2
                }}
            >
                <Box 
                    sx={{ 
                        display: 'flex',
                        flexDirection: isCurrentUser ? 'row' : 'row-reverse',
                        alignItems: 'flex-start',
                        gap: 1,
                        maxWidth: '70%'
                    }}
                >
                    <Avatar sx={{ bgcolor: isCurrentUser ? 'primary.main' : 'secondary.main' }}>
                        {msg.username[0].toUpperCase()}
                    </Avatar>
                    <Paper 
                        elevation={2}
                        sx={{
                            p: 2,
                            bgcolor: isCurrentUser ? 'primary.main' : 'background.paper',
                            color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            {msg.username}
                        </Typography>
                        <Typography variant="body1">
                            {msg.content}
                        </Typography>
                    </Paper>
                </Box>
            </ListItem>
        );
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Collaborate
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip 
                            label={isConnected ? 'Connected' : 'Disconnected'} 
                            color={isConnected ? 'success' : 'error'} 
                        />
                        <Chip 
                            label={username}
                            avatar={<Avatar>{username[0].toUpperCase()}</Avatar>}
                        />
                    </Stack>
                    {!isConnected && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Attempting to connect to chat server...
                        </Alert>
                    )}
                </Paper>

                <Paper 
                    elevation={3} 
                    sx={{ 
                        height: '60vh',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'grey.900'
                    }}
                >
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                        <List>
                            {messages.map((msg, index) => (
                                <MessageItem key={`${msg.timestamp}-${index}`} msg={msg} />
                            ))}
                        </List>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                disabled={!isConnected}
                            />
                            <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={handleSendMessage}
                                disabled={!isConnected || !message.trim()}
                            >
                                Send
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Collaborate; 