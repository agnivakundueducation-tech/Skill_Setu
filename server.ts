import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '2mb' }));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Health endpoint
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    service: 'SkillSetu AI Intelligence Server',
    geminiConfigured: hasGeminiKey,
    timestamp: new Date().toISOString()
  });
});

/**
 * Primary Setu AI Context-Aware Chat Endpoint (Phase 15-A)
 */
app.post('/api/setu/chat', async (req, res) => {
  try {
    const { prompt, systemInstruction, history, role, model = 'gemini-3.7-flash', isDemo } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on server',
        fallbackAvailable: true
      });
    }

    // Prepare contents array
    const contents: any[] = [];

    // Add prior turn messages if available
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(msg.content) }]
          });
        }
      }
    }

    // Add current user prompt with context payload
    contents.push({
      role: 'user',
      parts: [{ text: String(prompt) }]
    });

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction: systemInstruction || 'You are Setu, the SkillSetu AI Assistant.',
        temperature: 0.2, // Low temperature for high factual precision
        maxOutputTokens: 1200
      }
    });

    const text = response.text || '';
    return res.json({
      text,
      model: model || 'gemini-3.7-flash',
      role,
      isDemo: Boolean(isDemo),
      success: true
    });
  } catch (error: any) {
    console.error('Error generating Setu AI response:', error);
    return res.status(500).json({
      error: error.message || 'Error communicating with Gemini model',
      fallbackAvailable: true
    });
  }
});

/**
 * Backward-compatible endpoint for Copilot Chat
 */
app.post('/api/copilot/chat', async (req, res) => {
  try {
    const { prompt, history, model = 'gemini-3.7-flash' } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key not configured' });
    }

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: String(prompt) }] }],
      config: {
        temperature: 0.3,
        maxOutputTokens: 1000
      }
    });

    return res.json({ text: response.text, model });
  } catch (error: any) {
    console.error('Error in /api/copilot/chat:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Setup Vite middleware in development or serve static assets in production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillSetu AI Server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic();
