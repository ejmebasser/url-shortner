import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getDashboard(user.id);
  }

  @Get('url/:id')
  async getUrlStats(@Param('id') id: string, @CurrentUser() user: any) {
    return this.analyticsService.getUrlStats(id, user.id);
  }
}