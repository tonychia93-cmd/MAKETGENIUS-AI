
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MarketingStrategy, MarketingContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMarketingCopy = async (strategy: MarketingStrategy): Promise<MarketingContent> => {
  const textPrompt = `
    Based on the following marketing strategy and the attached product photo, generate high-converting copy using the AIDA model.
    Goal: ${strategy.goal}
    Audience: ${strategy.audience}
    Product Keywords: ${strategy.keywords.join(', ')}
    Promotion: ${strategy.promoMechanism}
    Style: ${strategy.style}

    Instructions:
    - Social Post should focus on customer pain points and how this product solves them.
    - Slogan should be short, punchy, and reflect the value proposition.
    - Promo Tagline should emphasize the urgency or benefit of the mechanism.
    - Return ONLY valid JSON.
  `;

  const parts: any[] = [{ text: textPrompt }];
  
  if (strategy.productImage && strategy.productImage !== "(Image Stored)") {
    try {
      const base64Data = strategy.productImage.includes(',') 
        ? strategy.productImage.split(',')[1] 
        : strategy.productImage;
        
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      });
    } catch (e) {
      console.warn("Failed to process image for copy generation", e);
    }
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          socialPost: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              solution: { type: Type.STRING },
              cta: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'description', 'solution', 'cta', 'hashtags']
          },
          slogan: { type: Type.STRING },
          promoTagline: { type: Type.STRING },
          dataVizValue: { type: Type.STRING }
        },
        required: ['socialPost', 'slogan', 'promoTagline']
      }
    }
  });

  const text = response.text;
  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
};

export const generatePosterBackground = async (strategy: MarketingStrategy): Promise<string> => {
  const sceneDesc = strategy.scenePreference ? `The scene should be: ${strategy.scenePreference}.` : '';
  const textPrompt = `A professional, clean, commercial-quality advertising background image for a ${strategy.style} campaign. 
    Campaign Goal: ${strategy.goal}. 
    Targeting: ${strategy.audience}.
    ${sceneDesc}
    The background should look like studio photography with perfect lighting.
    Ensure large areas of negative space (empty areas) for placing text. 
    NO TEXT, NO LETTERS in the image. High resolution, aesthetic, professional.`;

  const parts: any[] = [{ text: textPrompt }];
  
  if (strategy.productImage && strategy.productImage !== "(Image Stored)") {
    try {
      const base64Data = strategy.productImage.includes(',') 
        ? strategy.productImage.split(',')[1] 
        : strategy.productImage;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      });
    } catch (e) {
      console.warn("Failed to process image for background generation", e);
    }
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }
  return imageUrl;
};
