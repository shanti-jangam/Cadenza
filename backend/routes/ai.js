const router = require('express').Router();
const auth = require('../middleware/auth');
const NeuralMusicService = require('../services/NeuralMusicService');
const Composition = require('../models/composition.model');

// Train the model with existing compositions
router.post('/train', auth, async (req, res) => {
  try {
    console.log('Starting model training...');
    
    // Add more detailed logging
    const result = await NeuralMusicService.train();
    
    console.log('Training completed successfully:', result);
    res.json({ 
      message: 'Model trained successfully', 
      result 
    });
  } catch (error) {
    // Log the full error
    console.error('Training failed with error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Training failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Test route to verify API is working
router.get('/test', (req, res) => {
  try {
    const testNote = {
      note: 'C4',
      timestamp: Date.now(),
      duration: 500
    };
    
    res.json({
      message: 'AI API is working',
      modelStatus: !!NeuralMusicService.model,
      testNote
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Melody Completion
router.post('/complete-melody', auth, async (req, res) => {
  try {
    const { notes, options } = req.body;
    console.log('Received request for melody completion:');
    console.log('Notes:', JSON.stringify(notes, null, 2));
    console.log('Options:', JSON.stringify(options, null, 2));

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        message: 'Invalid input: notes must be a non-empty array'
      });
    }

    // Pass musical context to the generation function
    const generatedNotes = await NeuralMusicService.generateContinuation(
      notes,
      {
        length: options?.length || 8,
        context: options?.context || {}
      }
    );

    console.log('Generated notes:', JSON.stringify(generatedNotes, null, 2));
    res.json({ generatedNotes });
  } catch (error) {
    console.error('AI generation failed:', error);
    res.status(500).json({
      message: 'AI generation failed',
      error: error.message
    });
  }
});

// AI Variation Generation
router.post('/generate-variation', auth, async (req, res) => {
  try {
    const { melody, temperature } = req.body;
    const variation = await NeuralMusicService.generateVariation(
      melody,
      temperature
    );
    res.json({ variation });
  } catch (error) {
    res.status(500).json({ message: 'Variation generation failed' });
  }
});

module.exports = router; 