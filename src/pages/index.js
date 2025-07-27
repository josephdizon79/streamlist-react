import { useState } from 'react';

export default function Home() {
  const [movie, setMovie] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('StreamList Entry:', movie);
    setMovie('');
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>StreamList</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          placeholder="Enter movie title"
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button type="submit">Add to List</button>
      </form>
    </main>
  );
}
