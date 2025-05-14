import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Onbekende fout');
      setResponse(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/pcb.svg')] bg-cover bg-center text-white p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Prompt Executor</h1>
        <p className="mb-6 text-center text-slate-300">Typ een prompt hieronder en klik op Genereer</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Typ hier je prompt..."
          className="w-full p-4 rounded-md bg-black/70 text-white border border-slate-600 mb-4"
          rows={4}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !prompt.trim()}
          className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md mb-4"
        >
          {loading ? 'Even wachten...' : 'Genereer'}
        </button>
        {error && <p className="text-red-400">❗ {error}</p>}
        {response && (
          <div className="bg-black/60 border border-slate-700 p-4 rounded-md text-slate-100 whitespace-pre-wrap">
            {response}
          </div>
        )}
      </div>
    </div>
  );
}
