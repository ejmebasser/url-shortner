import { IsString, IsUrl, IsOptional, Matches, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'Please provide a valid URL' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Slug can only contain letters, numbers, hyphens, and underscores',
  })
  customSlug?: string;
}