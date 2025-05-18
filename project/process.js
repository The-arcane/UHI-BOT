import multer from 'multer';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed: npm install node-fetch
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const upload = multer({ dest: '/tmp/' });
const uploadMiddleware = promisify(upload.single('file'));

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await uploadMiddleware(req, res);

  const { prompt } = req.body;
  const file = req.file;

  if (!prompt && !file) {
    return res.status(400).json({ error: 'No prompt or file provided' });
  }

  let fileSummary = '';
  let geminiResponse = '';

  try {
    // If a file is uploaded, process it
    if (file) {
      const filePath = path.join('/tmp', file.filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8'); // For text files
      fileSummary = `File "${file.originalname}" processed successfully. Content: ${fileContent.substring(0, 100)}...`;

      // Send the file content to the Gemini API
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('prompt', prompt || '');

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const result = await response.json();
      geminiResponse = result.response || 'No response from Gemini API';

      // Delete the file after processing
      fs.unlinkSync(filePath);
    } else if (prompt) {
      // If only a prompt is provided, send it to the Gemini API
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const result = await response.json();
      geminiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini API';
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Failed to process the request' });
  }

  const response = prompt
    ? `Prompt: "${prompt}". ${fileSummary} Gemini Response: ${geminiResponse}`
    : `Gemini Response: ${geminiResponse}`;

  res.json({ response });
}