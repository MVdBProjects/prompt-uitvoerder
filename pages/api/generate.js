export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt ontbreekt' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ message: 'Geen geldige GPT-output ontvangen.' });
    }

    res.status(200).json({ output: data.choices[0].message.content });
  } catch (error) {
    console.error('GPT API Error:', error);
    res.status(500).json({ message: 'OpenAI request failed' });
  }
}
