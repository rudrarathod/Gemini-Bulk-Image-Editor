
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // The API can return multiple parts, find the image part.
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    } else {
      // Check for text response which might contain an error or explanation
      const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
      const safetyRatings = response.candidates?.[0]?.safetyRatings;
      let errorMessage = 'No image was generated.';
      if (textPart?.text) {
        errorMessage = `Model returned text instead of image: "${textPart.text}"`;
      } else if (safetyRatings?.some(r => r.probability !== 'NEGLIGIBLE')) {
        errorMessage = 'Image generation failed due to safety settings.';
      }
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    let finalErrorMessage = 'An unknown error occurred while editing the image.';
    if (error instanceof Error) {
        // Attempt to parse a JSON response in the error message for a cleaner display.
        try {
            const jsonError = JSON.parse(error.message);
            finalErrorMessage = jsonError?.error?.message || error.message;
        } catch (e) {
            // If it's not JSON, use the message directly.
            finalErrorMessage = error.message;
        }
    }
    throw new Error(finalErrorMessage);
  }
};