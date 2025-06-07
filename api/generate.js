// Using standard Node.js runtime for better compatibility

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: 'Method not allowed' });
  }

  const { 
    name = "", 
    details = "", 
    senderName = "",
    language = "english",
    length = "normal",
    clue = "" 
  } = req.body;
  
  // Handle both old and new API format for backwards compatibility
  const personName = name || clue;
  
  // Handle empty input
  if (!personName.trim()) {
    return res.status(200).json({ text: "Please enter a name to write a love letter for." });
  }
  
  // Language mapping
  const languageMap = {
    english: "English",
    dutch: "Dutch (Nederlands)", 
    spanish: "Spanish (Español)"
  };
  
  // Length mapping  
  const lengthMap = {
    short: "short (around 50 words)",
    normal: "normal length (around 200 words)", 
    long: "long and detailed (around 300 words)"
  };
  
  const selectedLanguage = languageMap[language] || "English";
  const selectedLength = lengthMap[length] || "normal length (around 200 words)";
  
  // Build the enhanced prompt
  let userPrompt = `Write a ${selectedLength} love letter in ${selectedLanguage} addressed to someone named "${personName}". Make it heartfelt, romantic, and personal.`;
  
  // Add language-specific greeting
  if (language === "dutch") {
    userPrompt += ` Start with "Mijn liefste ${personName}," and end with "Voor altijd de jouwe,"`;
  } else if (language === "spanish") {
    userPrompt += ` Start with "Mi querido/a ${personName}," and end with "Tuyo para siempre,"`;
  } else {
    userPrompt += ` Start with "My Dearest ${personName}," and end with "Forever yours,"`;
  }
  
  if (details.trim()) {
    userPrompt += ` Include these personal details naturally in the letter: ${details}`;
  }
  
  if (senderName.trim()) {
    userPrompt += ` Sign the letter with the name "${senderName}".`;
  } else {
    userPrompt += ` End with a romantic signature line.`;
  }
  
  const messages = [
    { role: "system",
      content: `You are a multilingual poetic assistant who writes heartfelt, original love letters in different languages. Write sincere, romantic letters that are personal but not overly cheesy. Always write in the specified language with proper grammar and natural expressions. When given personal details, weave them naturally into the letter. Follow the exact length requirements and use culturally appropriate romantic expressions for each language.` },
    { role: "user",
      content: userPrompt }
  ];

  const requestBody = {
    model: "mistralai/mistral-7b-instruct:free",
    messages
  };
  
  console.log("Sending to OpenRouter:", JSON.stringify(requestBody, null, 2));

  try {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://love-letter-generator.vercel.app",
        "X-Title": "LoveLetterDemo"
      },
      body: JSON.stringify(requestBody)
    });

    console.log("OpenRouter response status:", resp.status);
    
    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("OpenRouter API error:", resp.status, errorText);
      return res.status(200).json({ 
        text: `Sorry, I'm having trouble writing your letter right now. Please try again in a moment. (Error: ${resp.status})` 
      });
    }

    const data = await resp.json();
    console.log("OpenRouter response data:", JSON.stringify(data, null, 2));

    const generatedText = data.choices?.[0]?.message?.content;
    
    if (!generatedText) {
      console.error("No content in OpenRouter response:", data);
      return res.status(200).json({ 
        text: "I'm sorry, but I couldn't generate your love letter right now. Please try again!" 
      });
    }

    return res.status(200).json({ text: generatedText });
    
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    return res.status(200).json({ 
      text: "I'm experiencing technical difficulties. Please try again in a moment!" 
    });
  }
};

