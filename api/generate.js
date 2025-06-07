// Using standard Node.js runtime for better compatibility

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: 'Method not allowed' });
  }

  const { name = "", details = "", clue = "" } = req.body;
  
  // Handle both old and new API format for backwards compatibility
  const personName = name || clue;
  
  // Handle empty input
  if (!personName.trim()) {
    return res.status(200).json({ text: "Please enter a name to write a love letter for." });
  }
  
  // Build the prompt based on whether details are provided
  let userPrompt = `Write a beautiful love letter addressed to someone named "${personName}". Make it heartfelt, romantic, and personal. Start with "My Dearest ${personName}," and end with "Forever yours," followed by a signature line.`;
  
  if (details.trim()) {
    userPrompt += ` Include these personal details naturally in the letter: ${details}`;
  }
  
  const messages = [
    { role: "system",
      content: "You are a poetic assistant who writes heartfelt, original love letters. Write sincere, romantic letters that are personal but not overly cheesy. Always address the letter to the specific name provided. When given personal details, weave them naturally into the letter to make it more personal and meaningful." },
    { role: "user",
      content: userPrompt }
  ];

  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://yourdomain.example",   // optional, shown on OR leaderboard
      "X-Title": "LoveLetterDemo"                     // optional
    },
    body: JSON.stringify({
      model: "mistral-7b-instruct:free",
      messages
    })
  }).then(r => r.json());

  return res.status(200).json({ text: resp.choices?.[0]?.message?.content });
};

