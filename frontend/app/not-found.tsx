import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>404</h1>
      <h2 style={{ marginBottom: '20px' }}>URL Not Found</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        The shortened URL you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          display: 'inline-block',
        }}
      >
        Go Home
      </Link>
    </div>
  );
}