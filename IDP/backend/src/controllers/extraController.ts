import { Request, Response } from 'express';
import { syncBeachData } from '../services/externalApiService';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Beach } from '../models';
import axios from 'axios';

export const getWeather = async (req: Request, res: Response) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ error: 'lat and lon are required' });
        }
        
        const apiKey = '40c00170642d361d99156dacec66cf9c';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        
        const response = await axios.get(url);
        const data = response.data;
        
        res.json({
            temperature: data.main.temp,
            condition: data.weather[0].description,
            windSpeed: data.wind.speed,
            humidity: data.main.humidity
        });
    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({ error: 'Weather unavailable' });
    }
};

export const getLiveData = async (req: Request, res: Response) => {
    try {
        const liveData = await syncBeachData(Number(req.params.id));
        res.json(liveData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch live data' });
    }
};

export const chat = async (req: Request, res: Response) => {
    try {
        const { message, beachContext, history } = req.body;
        console.log("Incoming message:", message);
        
        if (!process.env.GEMINI_API_KEY) {
            console.log("No API Key found in process.env");
            return res.json({ reply: "Hi there! I'm your CoastWise beach assistant. (Note: Gemini API key is missing. Please add it to .env to enable full AI responses.)" });
        }

        // Fetch all beaches to prevent hallucination
        const beaches = await Beach.findAll({ raw: true });
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const prompt = `You are an intelligent beach assistant.

User question:
${message}

Context:
Selected beach: ${JSON.stringify(beachContext || {})}
Available beaches: ${JSON.stringify(beaches || [])}

Instructions:
- Understand user intent
- Use ONLY provided beach data
- If recommendation -> choose best 1-2 beaches
- If tips -> give practical travel advice
- If safety -> analyze conditions

Answer in 3-5 clear bullet points.
Always be specific. Never give vague answers.`;
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("API Timeout")), 10000)
        );

        // Build contents payload with conversation history
        const contents = [];
        if (history && Array.isArray(history)) {
            history.forEach(m => {
                if (m.content) {
                   contents.push({ role: m.role || 'user', parts: [{ text: m.content }] });
                }
            });
        }
        contents.push({ role: 'user', parts: [{ text: prompt }] });

        let apiPromise = model.generateContent({
            contents: contents,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.5
            }
        });

        let result: any = await Promise.race([apiPromise, timeoutPromise]);
        let response = await result.response;
        let text = response.text();

        console.log("Gemini response:", text);

        res.json({ reply: text });
    } catch (error: any) {
        if (error.message === "API Timeout") {
            return res.json({ reply: "Try Gokarna Beach - low crowd, calm waves, good for relaxing." });
        }
        console.error("Gemini API Error Full Stack:", error);
        res.json({ reply: "Try Gokarna Beach - low crowd, calm waves, good for relaxing." });
    }
};
