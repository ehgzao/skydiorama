import { WeatherCondition } from './store';

// Default free tier uses a proxy endpoint (you'd set this up)
// For BYOK, uses direct Gemini API
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export interface GenerateDioramaParams {
  city: string;
  country: string;
  condition: WeatherCondition;
  temperature: number;
  isDay: boolean;
  apiKey?: string;
}

export function buildDioramaPrompt(params: GenerateDioramaParams): string {
  const { city, country, condition, temperature, isDay } = params;
  const timeOfDay = isDay ? 'daytime with natural sunlight' : 'nighttime with warm artificial city lights and a dark sky';
  const weatherEffects = getWeatherEffects(condition);
  const locationLine = country ? `${city}, ${country}` : city;

  return `Create a beautiful miniature 3D isometric diorama of ${locationLine}.

CRITICAL REQUIREMENT — CITY IDENTITY:
This diorama MUST be immediately recognizable as ${city}, ${country}. Include the city's most famous and iconic real-world landmarks, buildings, and architectural elements. The viewer should be able to identify the city at a glance without reading any text. Do NOT create a generic cityscape — every building and element must reflect the real architecture, culture, and visual identity of ${city}.

Examples of what this means:
- Paris, France: Eiffel Tower, Notre-Dame Cathedral, Arc de Triomphe, Sacré-Cœur, Louvre Pyramid
- Porto, Portugal: Torre dos Clérigos, Ponte D. Luís I, colorful houses of Ribeira, São Bento Station
- Tokyo, Japan: Tokyo Tower/Skytree, Shibuya Crossing, Senso-ji Temple, Mount Fuji in background
- New York, USA: Statue of Liberty, Empire State Building, Central Park, Brooklyn Bridge
- London, UK: Big Ben, Tower Bridge, London Eye, Buckingham Palace
- Rio de Janeiro, Brazil: Christ the Redeemer, Sugarloaf Mountain, Copacabana Beach

COMPOSITION:
- 45-degree top-down isometric perspective
- Square 1:1 aspect ratio
- The city's 3-5 most iconic landmarks should be prominently featured as the focal points
- Surrounding buildings should match the real architectural style of ${city} (not generic)
- Streets, vegetation, and urban elements should reflect the real city's character

VISUAL STYLE:
- Adorable miniature tilt-shift diorama aesthetic
- Soft, refined textures with realistic PBR materials
- ${timeOfDay} lighting
- Highly detailed, professional quality, award-winning 3D illustration
- Clean, minimalistic composition with neutral background
- IMPORTANT: Use only natural, realistic colors. No filters, tints, or color effects applied.

WEATHER & ATMOSPHERE (current conditions):
- Weather: ${condition}, ${temperature}°C
- ${weatherEffects}
- Weather effects should be naturally integrated into the scene (not overlaid)
- IMPORTANT: Preserve natural colors of all elements. No color filters or mood-based color shifts.

TEXT OVERLAY:
At the top-center of the image, place:
1. "${city}" in large, bold, elegant text
2. A weather icon representing ${condition} just beneath the city name
3. The date and "${temperature}°C" in medium text below the icon
All text must be centered, with consistent spacing. Text may subtly overlap the top edges of buildings. Use white or light-colored text with a subtle shadow for readability.

COLOR FIDELITY (CRITICAL):
The diorama MUST have rich, natural, vibrant colors throughout. Every building, landmark, water body, and vegetation element should display its own distinct, realistic color. Do NOT apply any sepia, golden, warm wash, cool wash, or monochromatic color filter over the image. Weather conditions should affect lighting direction and shadow intensity, but NEVER wash out or uniformly tint the color palette. Water should be blue/teal. Vegetation should be green. Rooftops should have varied, realistic colors. The scene should look like a high-quality product photograph of a miniature — not a filtered Instagram photo.

DO NOT generate a generic city. This MUST look like ${city}, ${country} specifically.`;
}

function getWeatherEffects(condition: WeatherCondition): string {
  const effects: Record<WeatherCondition, string> = {
    clear: 'Crystal clear atmosphere with excellent visibility. Natural bright lighting.',
    sunny: 'Bright sunbeams casting crisp, defined shadows. Natural daylight colors on all surfaces.',
    cloudy: 'Soft, diffused light filtering through clouds. Gentle, even shadows.',
    overcast: 'Heavy cloud cover creating flat, even lighting. Sky is gray but city retains color.',
    rainy: 'Rain droplets falling visibly, wet glossy surfaces reflecting city colors, puddles on streets.',
    stormy: 'Dark dramatic clouds above, lightning flashes, heavy rain. City still colorful below.',
    snowy: 'Gentle snowfall, white snow on rooftops and streets contrasting with colorful buildings.',
    foggy: 'Fog rolling through streets, buildings partially obscured at distance, close buildings sharp.',
    windy: 'Trees bending, flags waving, dynamic movement. Full color clarity maintained.',
  };
  
  return effects[condition] || effects.cloudy;
}

export async function generateDiorama(
  params: GenerateDioramaParams
): Promise<string> {
  // Use Gemini 2.5 Flash Image (latest model for image generation)
  try {
    return await generateDioramaGemini(params);
  } catch (geminiError: any) {
    console.error('Gemini 2.5 Flash Image failed:', geminiError.message);
    
    // Provide clear error message without Imagen fallback
    if (geminiError.message?.includes('not found') || geminiError.message?.includes('not supported')) {
      throw new Error(`The Gemini 2.5 Flash Image model is not available with your current API key or region. Please ensure you have a valid Gemini API key with image generation capabilities.`);
    }
    
    throw new Error(`Image generation failed: ${geminiError.message}`);
  }
}

async function generateDioramaGemini(
  params: GenerateDioramaParams
): Promise<string> {
  const prompt = buildDioramaPrompt(params);
  const apiKey = params.apiKey;
  
  if (!apiKey) {
    throw new Error('API key required. Please add your Gemini API key in settings or use the demo mode.');
  }
  
  // Using Gemini 2.5 Flash Image model for image generation
  const response = await fetch(
    `${GEMINI_API_BASE}/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Please generate a high-quality image of: ${prompt}`,
              },
            ],
          },
        ],
      }),
    }
  );
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // DEBUG: Log full response structure
  console.log('Gemini API response structure:', JSON.stringify({
    hasCandidates: !!data.candidates,
    candidateCount: data.candidates?.length,
    hasContent: !!data.candidates?.[0]?.content,
    partsCount: data.candidates?.[0]?.content?.parts?.length,
    parts: data.candidates?.[0]?.content?.parts?.map((p: any) => ({
      hasText: !!p.text,
      hasInlineData: !!p.inlineData,
      mimeType: p.inlineData?.mimeType,
      textLength: p.text?.length
    }))
  }, null, 2));
  
  // Extract image from response
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));
  
  if (imagePart?.inlineData?.data) {
    const mimeType = imagePart.inlineData.mimeType || 'image/png';
    console.log('Successfully extracted image:', { mimeType, dataLength: imagePart.inlineData.data.length });
    return `data:${mimeType};base64,${imagePart.inlineData.data}`;
  }
  
  // If no image found, log what we got instead
  console.error('No image found in response. Available parts:', parts.map((p: any) => ({
    type: p.text ? 'text' : p.inlineData ? 'inlineData' : 'unknown',
    textPreview: p.text ? p.text.substring(0, 200) + '...' : null,
    mimeType: p.inlineData?.mimeType
  })));
  
  throw new Error('No image generated. The model may not support image generation or the prompt was rejected.');
}

// Demo mode: Returns a placeholder
export function getDemoImage(condition: WeatherCondition, isDay: boolean): string {
  // Returns a gradient placeholder based on weather
  const gradients: Record<string, string> = {
    'sunny-day': 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
    'clear-night': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    'cloudy-day': 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
    'rainy-day': 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    'stormy-day': 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
    'snowy-day': 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
  };
  
  const key = `${condition}-${isDay ? 'day' : 'night'}`;
  return gradients[key] || gradients['cloudy-day'];
}
