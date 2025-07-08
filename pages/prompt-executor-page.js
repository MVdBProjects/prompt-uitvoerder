import { useState } from 'react';

export default function PromptExecutorPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setResponse('');
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Onbekende fout');
      }

      setResponse(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Prompt Executor</h1>
      <textarea
        rows={6}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Typ hier je prompt..."
        style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
      />
      <br />
      <button
        onClick={handleSubmit}
        disabled={loading || !prompt}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Even geduld...' : 'Verzend prompt'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>⚠️ {error}</p>}
      {response && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Antwoord:</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{response}</pre>
        </div>
      )}
    </div>
  );
}
