import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUrlStats(urlId: string, userId?: string) {
    const url = await this.prisma.url.findUnique({
      where: { id: urlId },
      include: {
        visits: {
          orderBy: { timestamp: 'desc' },
          take: 100, // Last 100 visits
        },
        _count: {
          select: { visits: true },
        },
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    // If userId provided, check ownership
    if (userId && url.userId !== userId) {
      throw new ForbiddenException('You can only view stats for your own URLs');
    }

    // Calculate basic stats
    const totalVisits = url._count.visits;
    const recentVisits = url.visits;

    // Group visits by date
    const visitsByDate = this.groupVisitsByDate(recentVisits);

    return {
      url: {
        id: url.id,
        originalUrl: url.originalUrl,
        slug: url.slug,
        createdAt: url.createdAt,
      },
      stats: {
        totalVisits,
        visitsByDate,
        recentVisits: recentVisits.slice(0, 10), // Last 10 visits
      },
    };
  }

  async getDashboard(userId: string) {
    const urls = await this.prisma.url.findMany({
      where: { userId },
      include: {
        _count: {
          select: { visits: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalUrls = urls.length;
    const totalVisits = urls.reduce((sum, url) => sum + url._count.visits, 0);

    // Get top 5 most visited URLs
    const topUrls = urls
      .sort((a, b) => b._count.visits - a._count.visits)
      .slice(0, 5)
      .map((url) => ({
        id: url.id,
        originalUrl: url.originalUrl,
        slug: url.slug,
        visits: url._count.visits,
      }));

    // Get recent visits across all user's URLs
    const recentVisits = await this.prisma.visit.findMany({
      where: {
        url: { userId },
      },
      orderBy: { timestamp: 'desc' },
      take: 10,
      include: {
        url: {
          select: {
            slug: true,
            originalUrl: true,
          },
        },
      },
    });

    return {
      summary: {
        totalUrls,
        totalVisits,
      },
      topUrls,
      recentVisits,
    };
  }

  private groupVisitsByDate(visits: any[]) {
    const grouped = visits.reduce((acc, visit) => {
      const date = new Date(visit.timestamp).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}