'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Url } from '@/types';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [urls, setUrls] = useState<Url[]>([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadUrls();
    }
  }, [user]);

  const loadUrls = async () => {
    try {
      const data = await apiClient.getMyUrls();
      setUrls(data);
    } catch (err: any) {
      console.error('Failed to load URLs:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.createUrl(originalUrl, customSlug || undefined);
      setOriginalUrl('');
      setCustomSlug('');
      loadUrls();
    } catch (err: any) {
      setError(err.message || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      await apiClient.deleteUrl(id);
      loadUrls();
    } catch (err: any) {
      alert('Failed to delete URL');
    }
  };

  const handleCopy = (slug: string) => {
    const shortUrl = 'http://localhost:3001/' + slug;
    navigator.clipboard.writeText(shortUrl);
    setCopySuccess(slug);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  if (authLoading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const baseUrl = 'http://localhost:3001/';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>URL Shortener Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px' }}>{user.email}</span>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Shorten a URL</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Original URL</label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Custom Slug (optional)
            </label>
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="my-custom-slug"
              pattern="[a-zA-Z0-9_-]+"
              maxLength={20}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            {loading ? 'Creating...' : 'Shorten URL'}
          </button>
        </form>
      </div>

      <div>
        <h2 style={{ marginBottom: '20px' }}>Your URLs ({urls.length})</h2>
        {urls.length === 0 ? (
          <p style={{ color: '#666' }}>No URLs yet. Create your first shortened URL above!</p>
        ) : (
          <div>
            {urls.map((url) => {
              const shortUrl = baseUrl + url.slug;
              return (
                <div
                  key={url.id}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '15px',
                  }}
                >
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Short URL: </strong>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0070f3' }}
                    >
                      {shortUrl}
                    </a>
                    <button
                      onClick={() => handleCopy(url.slug)}
                      style={{
                        marginLeft: '10px',
                        padding: '4px 12px',
                        backgroundColor: copySuccess === url.slug ? '#28a745' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      {copySuccess === url.slug ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ marginBottom: '10px', color: '#666' }}>
                    <strong>Original: </strong> {url.originalUrl}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#999' }}>
                      Visits: {url._count?.visits || 0} | Created: {new Date(url.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(url.id)}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}