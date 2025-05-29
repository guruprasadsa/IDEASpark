import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import type { Idea, LearningPreferences } from '../types';

const MODEL_NAME = "gemini-2.5-flash-preview-04-17";

let ai: GoogleGenAI | null = null;

const initializeApi = () => {
  if (ai) return ai;
  if (typeof process.env.API_KEY !== 'string' || !process.env.API_KEY) {
    console.error("API_KEY environment variable is not set.");
    throw new Error("API_KEY environment variable is not set. Please configure it before running the application.");
  }
  try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai;
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
    throw new Error(`Failed to initialize Gemini API client: ${e instanceof Error ? e.message : String(e)}`);
  }
};

const generateIdeasPrompt = (interest: string, prefs: LearningPreferences): string => {
  let prompt = `
You are an expert career counselor and futurist specializing in identifying emerging fields and skills for students.
A student is looking for ideas on new and evolving things to learn.
Please generate 3 distinct, actionable learning ideas. For each idea, provide:
1. A unique "id" (e.g., a short, URL-friendly slug or a UUID).
2. A concise "title".
3. A brief (2-3 sentences) "description" of what it is and why it's evolving or important.
4. Suggested "firstSteps" (2-3 actionable bullet points or a short paragraph) to start learning.
5. A "category" (e.g., "Technology", "Science", "Creative Arts", "Social Impact", "Business", "Health & Wellness").

The response MUST be a JSON array of objects, where each object has "id", "title", "description", "firstSteps", and "category" keys. Do not include any other text or explanation outside the JSON array.
Example format:
[
  {
    "id": "example-idea-1",
    "title": "Example Title 1",
    "description": "Example description 1.",
    "firstSteps": "- Step 1\\n- Step 2",
    "category": "Example Category"
  }
]`;

  if (interest.trim() !== '') {
    prompt += `\n\nThe student's current area of interest is: "${interest}". Please tailor the ideas to this interest.`;
  } else {
    prompt += `\n\nThe student has not specified an area of interest. Please provide general ideas across various domains.`;
  }

  if (prefs.focus !== 'any' || prefs.depth !== 'any') {
    prompt += `\n\nPlease also consider the student's learning preferences:`;
    if (prefs.focus !== 'any') {
      prompt += `\n- Learning Focus: Prefers ${prefs.focus === 'practical' ? 'practical, project-based learning' : prefs.focus === 'theoretical' ? 'theoretical understanding and concepts' : 'a quick overview'}.`;
    }
    if (prefs.depth !== 'any') {
      prompt += `\n- Desired Depth: Looking for ideas suitable for a ${prefs.depth} level (e.g., ${prefs.depth === 'beginner' ? 'easy to start' : prefs.depth === 'intermediate' ? 'some challenge' : 'advanced exploration'}).`;
    }
  }
  return prompt;
};

const generateMoreDetailsPrompt = (ideaTitle: string, ideaDescription: string): string => {
  return `
The student is interested in learning more about the following idea:
Title: "${ideaTitle}"
Description: "${ideaDescription}"

Please provide more detailed information about this topic. This could include:
- Key sub-topics or specializations within this field.
- Potential real-world applications or impact.
- Types of projects one could undertake to learn more.
- Important tools, technologies, or foundational knowledge required.
- Suggestions for further learning resources (e.g., types of online courses, communities, key researchers/experts to follow).

Present this information as a well-structured, informative text. Aim for 3-5 paragraphs.
Do not output JSON. Just provide the textual explanation.
`;
};

const parseJsonResponse = (responseText: string): any => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (parseError) {
    console.error("Failed to parse JSON response from AI:", parseError, "Raw response text:", responseText);
    throw new Error("The AI returned an invalid JSON response. Please try again.");
  }
};


export const generateIdeas = async (interest: string, prefs: LearningPreferences): Promise<Idea[]> => {
  const currentAi = initializeApi();
  if (!currentAi) throw new Error("Gemini API client is not initialized.");

  const prompt = generateIdeasPrompt(interest, prefs);

  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });
    
    const parsedIdeasData = parseJsonResponse(response.text);

    if (!Array.isArray(parsedIdeasData) || !parsedIdeasData.every(idea => idea.id && idea.title && idea.description && idea.firstSteps && idea.category)) {
      console.error("Parsed JSON is not in the expected format (Array<Idea>):", parsedIdeasData);
      // Attempt to salvage if some ideas are valid, or assign UUIDs if missing
      const ideas = parsedIdeasData.map((idea: any) => ({
          id: idea.id || uuidv4(),
          title: idea.title || "Untitled Idea",
          description: idea.description || "No description provided.",
          firstSteps: idea.firstSteps || "No first steps provided.",
          category: idea.category || "General",
      }));
      if (ideas.length > 0 && ideas.every(idea => idea.title && idea.description && idea.firstSteps && idea.category)) {
        return ideas;
      }
      throw new Error("Received an unexpected format for ideas from the AI.");
    }
    return parsedIdeasData.map(idea => ({ ...idea, id: idea.id || uuidv4() })); // Ensure ID exists
  } catch (error) {
    console.error('Error calling Gemini API for generating ideas:', error);
    if (error instanceof Error && (error.message.includes('API_KEY_INVALID') || error.message.includes('PERMISSION_DENIED'))) {
      throw new Error('API Key is invalid or missing permissions.');
    }
    throw new Error(`An error occurred while fetching ideas: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getMoreDetailsForIdea = async (ideaTitle: string, ideaDescription: string): Promise<string> => {
  const currentAi = initializeApi();
  if (!currentAi) throw new Error("Gemini API client is not initialized.");

  const prompt = generateMoreDetailsPrompt(ideaTitle, ideaDescription);

  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.5, // Slightly more focused for details
      },
    });
    
    return response.text.trim();
  } catch (error) {
    console.error('Error calling Gemini API for more details:', error);
     if (error instanceof Error && (error.message.includes('API_KEY_INVALID') || error.message.includes('PERMISSION_DENIED'))) {
      throw new Error('API Key is invalid or missing permissions.');
    }
    throw new Error(`An error occurred while fetching more details: ${error instanceof Error ? error.message : String(error)}`);
  }
};
