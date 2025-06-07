export const config = { runtime: "edge" };           // fast, cold-start-free

export default async (req) => {
  const { clue = "" } = await req.json();
  const messages = [
    { role: "system",
      content: "You are a poetic assistant who writes heartfelt, original love letters (tone: sincere, not cheesy)." },
    { role: "user",
      content: `Write a love letter. Details: ${clue}` }
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

  return new Response(JSON.stringify({ text: resp.choices?.[0]?.message?.content }), {
    headers: { "Content-Type": "application/json" }
  });
};

