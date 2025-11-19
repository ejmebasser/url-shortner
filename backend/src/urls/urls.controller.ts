import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Req,
  Res,
  HttpStatus
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createUrlDto: CreateUrlDto,
    @CurrentUser() user: any,
  ) {
    return this.urlsService.create(createUrlDto, user.id);
  }

  @Get('urls')
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: any) {
    return this.urlsService.findAll(user.id);
  }

  @Get('urls/all')
  async findAllPublic() {
    return this.urlsService.findAll();
  }

  @Patch('urls/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @CurrentUser() user: any,
  ) {
    return this.urlsService.update(id, updateUrlDto, user.id);
  }

  @Delete('urls/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.urlsService.delete(id, user.id);
  }

  @Get(':slug')
  async redirect(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const originalUrl = await this.urlsService.redirect(
        slug,
        req.ip,
        req.headers['user-agent'],
        req.headers['referer'],
      );

      return res.redirect(HttpStatus.MOVED_PERMANENTLY, originalUrl);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: 'URL not found',
      });
    }
  }
}