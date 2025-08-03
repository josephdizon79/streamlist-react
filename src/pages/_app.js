import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import '../styles/globals.css';

// Material UI imports
import { AppBar, Toolbar, Button } from '@mui/material';
import { Movie, Home as HomeIcon, ShoppingCart, Info } from '@mui/icons-material';

function MyApp({ Component, pageProps }) {
  const [activePage, setActivePage] = useState('home');

  return (
    <>
      <Head>
        {/* Keep Google Material Icons for search icon */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>

      {/* MATERIAL UI NAVIGATION BAR */}
      <AppBar position="static" style={{ backgroundColor: '#1a1a1a', marginBottom: '20px' }}>
        <Toolbar style={{ display: 'flex', gap: '15px' }}>
          <Link href="/" passHref>
            <Button
              startIcon={<HomeIcon />}
              style={{ color: activePage === 'home' ? '#e50914' : '#fff' }}
              onClick={() => setActivePage('home')}
            >
              Home
            </Button>
          </Link>

          <Link href="/movies" passHref>
            <Button
              startIcon={<Movie />}
              style={{ color: activePage === 'movies' ? '#e50914' : '#fff' }}
              onClick={() => setActivePage('movies')}
            >
              Movies
            </Button>
          </Link>

          <Link href="/cart" passHref>
            <Button
              startIcon={<ShoppingCart />}
              style={{ color: activePage === 'cart' ? '#e50914' : '#fff' }}
              onClick={() => setActivePage('cart')}
            >
              Cart
            </Button>
          </Link>

          <Link href="/about" passHref>
            <Button
              startIcon={<Info />}
              style={{ color: activePage === 'about' ? '#e50914' : '#fff' }}
              onClick={() => setActivePage('about')}
            >
              About
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      {/* PAGE CONTENT */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
