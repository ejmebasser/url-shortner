import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlsService {
  constructor(private prisma: PrismaService) {}

  async create(createUrlDto: CreateUrlDto, userId?: string) {
    const { originalUrl, customSlug } = createUrlDto;

    let slug = customSlug;

    // If custom slug provided, check if it's available
    if (customSlug) {
      const existing = await this.prisma.url.findUnique({
        where: { slug: customSlug },
      });

      if (existing) {
        throw new ConflictException('This slug is already in use');
      }
    } else {
      // Generate unique slug
      slug = await this.generateUniqueSlug();
    }

    // Create URL record
    const url = await this.prisma.url.create({
      data: {
        originalUrl,
        slug,
        userId,
      },
    });

    return url;
  }

  async findAll(userId?: string) {
    if (userId) {
      // Return only user's URLs
      return this.prisma.url.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { visits: true },
          },
        },
      });
    }

    // Return all URLs (for demo purposes)
    return this.prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { visits: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const url = await this.prisma.url.findUnique({
      where: { slug },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    return url;
  }

  async update(id: string, updateUrlDto: UpdateUrlDto, userId: string) {
    // Check if URL exists and belongs to user
    const url = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('You can only update your own URLs');
    }

    // Check if new slug is available
    const existing = await this.prisma.url.findUnique({
      where: { slug: updateUrlDto.slug },
    });

    if (existing && existing.id !== id) {
      throw new ConflictException('This slug is already in use');
    }

    // Update URL
    return this.prisma.url.update({
      where: { id },
      data: { slug: updateUrlDto.slug },
    });
  }

  async delete(id: string, userId: string) {
    // Check if URL exists and belongs to user
    const url = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('You can only delete your own URLs');
    }

    // Delete URL
    await this.prisma.url.delete({
      where: { id },
    });

    return { message: 'URL deleted successfully' };
  }

  async redirect(slug: string, ipAddress?: string, userAgent?: string, referrer?: string) {
    const url = await this.findBySlug(slug);

    // Track the visit
    await this.prisma.visit.create({
      data: {
        urlId: url.id,
        ipAddress,
        userAgent,
        referrer,
      },
    });

    return url.originalUrl;
  }

  private async generateUniqueSlug(): Promise<string> {
    let slug: string;
    let isUnique = false;

    while (!isUnique) {
      slug = nanoid(6); // Generate 6-character random string
      
      const existing = await this.prisma.url.findUnique({
        where: { slug },
      });

      if (!existing) {
        isUnique = true;
      }
    }

    return slug;
  }
}