//Import semua library yang dibutuhkan
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

//Inisialisasi variable expres, multer, dan GoogleGenAI
const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//Inisialisasi variable untuk model yang akan digunakan
const GEMINI_MODEL = 'gemini-2.5-flash';

//Gunakan express.json() untuk parsing JSON
app.use(express.json());

//Menjalankan server pada port 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

//endpoint untuk generate text
app.post('/generate-from-text', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toString('base64');

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt, type: 'text' },
                { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
            ]
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString('base64');

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt ?? 'Tolong buatkan ringkasan dari dokumen ini.', type: 'text' },
                { inlineData: { data: base64Document, mimeType: req.file.mimetype } }
            ],
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    const { prompt } = req.body;
    const base64Audio = req.file.buffer.toString('base64');

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt ?? 'Tolong buatkan transkripsi dari audio ini.', type: 'text' },
                { inlineData: { data: base64Audio, mimeType: req.file.mimetype } }
            ],
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});