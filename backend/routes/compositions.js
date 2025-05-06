const router = require('express').Router();
const Composition = require('../models/composition.model');

// GET all compositions
router.get('/', async (req, res) => {
    try {
        const { filter, sortBy } = req.query;
        let query = {};
        let sort = {};

        // Apply filters
        switch (filter) {
            case 'popular':
                query.likesCount = { $gt: 0 };
                break;
            case 'ai':
                query.isAIGenerated = true;
                break;
            case 'collaborative':
                query.contributors = { $exists: true, $ne: [] };
                break;
        }

        // Apply sorting
        switch (sortBy) {
            case 'recent':
                sort.createdAt = -1;
                break;
            case 'popular':
                sort.likesCount = -1;
                break;
            case 'liked':
                sort.likesCount = -1;
                break;
        }

        const compositions = await Composition.find(query)
            .sort(sort)
            .populate('creator', 'username')
            .populate('comments.user', 'username')
            .populate('likes', 'username');

        res.json(compositions);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// POST new composition
router.post('/', async (req, res) => {
    try {
        const { title, melody, tags, isPublic } = req.body;

        // Validate input
        if (!title || !melody) {
            return res.status(400).json({ message: 'Title and melody are required' });
        }

        // Create new composition
        const newComposition = new Composition({
            title,
            melody,
            tags: tags || [],
            creator: req.user.userId,
            isPublic: isPublic !== undefined ? isPublic : true,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        // Save to database
        const savedComposition = await newComposition.save();

        // Populate creator info
        const populatedComposition = await savedComposition
            .populate('creator', 'username');

        res.status(201).json(populatedComposition);
    } catch (err) {
        console.error('Error saving composition:', err);
        res.status(500).json({ message: 'Error saving composition' });
    }
});

// AI completion endpoint
router.post('/complete', async (req, res) => {
    try {
        const { composition } = req.body;
        
        // TODO: Integrate with your AI model
        // This is a placeholder that just adds a few random notes
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const generatedNotes = Array(4).fill().map(() => ({
            note: notes[Math.floor(Math.random() * notes.length)],
            timestamp: Date.now(),
            aiGenerated: true
        }));

        res.json({ generatedNotes });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Like/Unlike composition
router.post('/:id/like', async (req, res) => {
    try {
        const composition = await Composition.findById(req.params.id);
        const userIndex = composition.likes.indexOf(req.user.userId);

        if (userIndex === -1) {
            composition.likes.push(req.user.userId);
            composition.likesCount = composition.likes.length;
        } else {
            composition.likes.splice(userIndex, 1);
            composition.likesCount = composition.likes.length;
        }

        await composition.save();
        res.json(composition);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Add comment
router.post('/:id/comment', async (req, res) => {
    try {
        const composition = await Composition.findById(req.params.id);
        composition.comments.push({
            user: req.user.userId,
            text: req.body.text,
            createdAt: Date.now()
        });
        await composition.save();
        
        const populatedComposition = await composition
            .populate('comments.user', 'username');
        
        res.json(populatedComposition);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Share composition
router.post('/:id/share', async (req, res) => {
    try {
        const composition = await Composition.findById(req.params.id);
        composition.shareCount = (composition.shareCount || 0) + 1;
        await composition.save();
        res.json(composition);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// GET all compositions (for testing)
router.get('/test', async (req, res) => {
  try {
    const compositions = await Composition.find()
      .populate('creator', 'username')
      .sort({ createdAt: -1 });
    res.json(compositions);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get compositions by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    console.log('Request params:', req.params);
    console.log('Authenticated user:', req.user);
    
    const userId = req.params.userId;
    console.log('Fetching compositions for user:', userId);
    
    // Verify the userId is valid
    if (!userId || userId.length !== 24) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const compositions = await Composition.find({ 
      creator: userId
    })
    .sort({ createdAt: -1 })
    .populate('creator', 'username');

    console.log('Found compositions:', compositions);
    res.json(compositions);
  } catch (error) {
    console.error('Error fetching compositions:', error);
    res.status(500).json({ 
      message: 'Error fetching compositions',
      error: error.message 
    });
  }
});

module.exports = router;