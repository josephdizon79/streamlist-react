import Link from 'next/link';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <nav style={{ padding: '15px', background: '#eee' }}>
        <Link href="/" style={{ marginRight: '15px' }}>Home</Link>
        <Link href="/movies" style={{ marginRight: '15px' }}>Movies</Link>
        <Link href="/cart" style={{ marginRight: '15px' }}>Cart</Link>
        <Link href="/about">About</Link>
      </nav>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
