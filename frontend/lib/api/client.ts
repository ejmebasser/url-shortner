import { AuthResponse, Url, UrlStats, Dashboard } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Auth
  async register(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async getMe() {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: this.getAuthHeader(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  // URLs
  async createUrl(originalUrl: string, customSlug?: string): Promise<Url> {
    const res = await fetch(`${API_URL}/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ originalUrl, customSlug }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async getMyUrls(): Promise<Url[]> {
    const res = await fetch(`${API_URL}/urls`, {
      headers: this.getAuthHeader(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async getAllUrls(): Promise<Url[]> {
    const res = await fetch(`${API_URL}/urls/all`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async updateUrl(id: string, slug: string): Promise<Url> {
    const res = await fetch(`${API_URL}/urls/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ slug }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async deleteUrl(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/urls/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    if (!res.ok) throw new Error(await res.text());
  }

  // Analytics
  async getDashboard(): Promise<Dashboard> {
    const res = await fetch(`${API_URL}/analytics/dashboard`, {
      headers: this.getAuthHeader(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async getUrlStats(id: string): Promise<UrlStats> {
    const res = await fetch(`${API_URL}/analytics/url/${id}`, {
      headers: this.getAuthHeader(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}

export const apiClient = new ApiClient();