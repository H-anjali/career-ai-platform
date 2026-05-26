const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Using the stable production endpoint along with the active gemini-2.5-flash model
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

/**
 * Send a prompt to Gemini 2.5 Flash and return the text response.
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The text response from Gemini
 */
export async function askGemini(prompt) {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Check your .env file.");
  }

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `API request failed with status ${response.status}`
    );
  }

  const data = await response.json();
  
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error("Invalid response format received from Gemini AI.");
  }

  return data.candidates[0].content.parts[0].text;
}