import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('StreamList Input:', input);
    setInput('');
  };

  return (
    <main>
      <h1>StreamList</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span className="material-icons" style={{ fontSize: '28px', color: '#e50914' }}>
          search
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a movie or show..."
        />
        <button type="submit">Add</button>
      </form>
    </main>
  );
}
