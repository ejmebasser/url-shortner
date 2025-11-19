import { IsString, Matches, MaxLength } from 'class-validator';

export class UpdateUrlDto {
  @IsString()
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Slug can only contain letters, numbers, hyphens, and underscores',
  })
  slug: string;
}