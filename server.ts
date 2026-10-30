import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusLost Backend',
    timestamp: new Date().toISOString()
  });
});

// Gemini AI Lost & Found Matching Endpoint
app.post('/api/ai-match', async (req, res) => {
  const { lostItem, foundItem } = req.body;

  if (!lostItem || !foundItem) {
    return res.status(400).json({ error: 'Both lostItem and foundItem are required' });
  }

  // Fallback heuristic scoring
  let confidence = 50;
  const matchReasons: string[] = [];

  if (lostItem.category && foundItem.category && lostItem.category === foundItem.category) {
    confidence += 30;
    matchReasons.push(`Matching category: ${lostItem.category}`);
  }

  const lostLoc = (lostItem.location || '').toLowerCase();
  const foundLoc = (foundItem.location || '').toLowerCase();
  if (lostLoc && foundLoc && (lostLoc.includes(foundLoc) || foundLoc.includes(lostLoc) || (lostLoc.includes('library') && foundLoc.includes('library')))) {
    confidence += 15;
    matchReasons.push(`Proximity match: Both items in ${lostItem.location} area`);
  }

  // Keyword overlap
  const lostTokens = (lostItem.title + ' ' + (lostItem.description || '')).toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const foundText = (foundItem.title + ' ' + (foundItem.description || '')).toLowerCase();
  let commonCount = 0;
  for (const token of lostTokens) {
    if (foundText.includes(token)) commonCount++;
  }
  if (commonCount > 0) {
    confidence = Math.min(98, confidence + Math.min(20, commonCount * 5));
    matchReasons.push(`Identified ${commonCount} matching keyword attributes`);
  }

  // If Gemini API is available, ask Gemini to analyze match deeply
  if (aiClient) {
    try {
      const prompt = `You are a campus lost-and-found security matching engine. Analyze whether this lost item report and found item report could be the same physical object.

LOST ITEM:
Title: ${lostItem.title}
Category: ${lostItem.category}
Description: ${lostItem.description}
Location: ${lostItem.location}

FOUND ITEM:
Title: ${foundItem.title}
Category: ${foundItem.category}
Description: ${foundItem.description}
Location: ${foundItem.location}

Respond with pure JSON only in the following schema:
{
  "confidence": number between 10 and 99,
  "matchReason": string (1-2 sentences explaining reason),
  "aiAnalysis": string (detailed breakdown of visual/category/location match),
  "verificationQuestions": array of 3 specific questions security should ask the claimant to verify genuine ownership without revealing identifying features
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({
          confidence: parsed.confidence || confidence,
          matchReason: parsed.matchReason || matchReasons.join('. '),
          aiAnalysis: parsed.aiAnalysis,
          verificationQuestions: parsed.verificationQuestions || [
            "Can you describe any unique marks or scratches on the item?",
            "Can you specify the exact brand or model number?",
            "What were the exact contents or accessories accompanying the item?"
          ]
        });
      }
    } catch (error) {
      console.warn('Gemini AI inference notice, using fallback heuristic engine:', error);
    }
  }

  // Return heuristic response
  return res.json({
    confidence: Math.min(98, Math.max(25, confidence)),
    matchReason: matchReasons.join('. ') || 'Potential category and campus zone correlation',
    aiAnalysis: `Automated matching evaluated category (${lostItem.category}), geographic vicinity (${lostItem.location} vs ${foundItem.location}), and keyword correlation. Score: ${confidence}%.`,
    verificationQuestions: [
      "Can you describe any unique marks or scratches on the item?",
      "Can you specify the exact brand or model number?",
      "What were the exact contents or accessories accompanying the item?"
    ]
  });
});

// Dev vs Prod Vite middleware
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`CampusLost Server running on port ${PORT}`);
});
