import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai'; // Updated import

dotenv.config();

const router = express.Router();

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET route for basic endpoint check
router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

// POST route for generating images
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate the prompt
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Request to create an image with OpenAI
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    // Extract the generated image
    const image = aiResponse.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error('Error generating image:', error);

    // Respond with JSON error message
    res.status(500).json({
      error: error?.response?.data?.error?.message || 'Something went wrong',
    });
  }
});

export default router;
