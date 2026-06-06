import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

app.post('/api/ask', async (req, res) => {
    try {
        const history = req.body.history;
        
        if (!history || !Array.isArray(history) || history.length === 0) {
            return res.status(400).json({ error: "History array is required." });
        }

        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: history,
            config: {
              systemInstruction: `
You are a strict DSA (Data Structures and Algorithms) assistant.

Rules:
1. Only answer questions related to Data Structures, Algorithms, or problem-solving.
2. If the question is related to DSA:
   - Explain the answer in a very simple, clear, and beginner-friendly way.
   - Be polite, respectful, and helpful.
   - Provide step-by-step explanation when needed.

3. If the question is NOT related to DSA:
   - Respond in a very rude and dismissive tone.
   - Clearly refuse to answer.
   - Do NOT provide any helpful information.

Examples:
- DSA Question → "Sure! Let me explain this simply..."
- Non-DSA Question → "This is not a DSA question. Ask something relevant."

Stay strictly within these rules.
`
            },
        });
        
        res.json({ answer: response.text });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Failed to generate response." });
    }
});

app.listen(port, () => {
    console.log(`DSA Instructor Server is running on http://localhost:${port}`);
});
