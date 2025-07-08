// pages/api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ error: 'Lege prompt is niet toegestaan' });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('OpenAI API error:', errorDetails);
      return res.status(500).json({ error: 'OpenAI API call failed', details: errorDetails });
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      return res.status(500).json({ error: 'Geen resultaat van OpenAI ontvangen' });
    }

    return res.status(200).json({ result: generatedText });

  } catch (error) {
    console.error('Serverfout:', error);
    return res.status(500).json({ error: 'Interne serverfout', details: error.message });
  }
}
