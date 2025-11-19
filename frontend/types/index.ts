export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Url {
  id: string;
  originalUrl: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  _count?: {
    visits: number;
  };
}

export interface Visit {
  id: string;
  urlId: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface UrlStats {
  url: {
    id: string;
    originalUrl: string;
    slug: string;
    createdAt: string;
  };
  stats: {
    totalVisits: number;
    visitsByDate: Array<{ date: string; count: number }>;
    recentVisits: Visit[];
  };
}

export interface Dashboard {
  summary: {
    totalUrls: number;
    totalVisits: number;
  };
  topUrls: Array<{
    id: string;
    originalUrl: string;
    slug: string;
    visits: number;
  }>;
  recentVisits: Visit[];
}