import Link from 'next/link';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>

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
