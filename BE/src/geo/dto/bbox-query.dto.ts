import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BboxQueryDto {
  @ApiPropertyOptional({ description: 'Minimum longitude', example: 106.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  minLng?: number;

  @ApiPropertyOptional({ description: 'Minimum latitude', example: 10.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  minLat?: number;

  @ApiPropertyOptional({ description: 'Maximum longitude', example: 107.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  maxLng?: number;

  @ApiPropertyOptional({ description: 'Maximum latitude', example: 11.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  maxLat?: number;
}

export class PlacesQueryDto extends BboxQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category', example: 'temple' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Search by name', example: 'Ben Thanh' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by province ID', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  provinceId?: number;

  @ApiPropertyOptional({ description: 'Minimum rating', example: 4.0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ description: 'Show only featured places', example: true })
  @IsOptional()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'Number of results to return', example: 100 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(500)
  limit?: number;
}

export class ServicesQueryDto extends BboxQueryDto {
  @ApiPropertyOptional({ description: 'Filter by service type', example: 'hotel' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Filter by province ID', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  provinceId?: number;

  @ApiPropertyOptional({ description: 'Number of results to return', example: 100 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(500)
  limit?: number;
}

export class NearbyQueryDto {
  @ApiPropertyOptional({ description: 'Longitude of user location', example: 106.7 })
  @IsNumber()
  @Type(() => Number)
  lng: number;

  @ApiPropertyOptional({ description: 'Latitude of user location', example: 10.8 })
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @ApiPropertyOptional({ description: 'Radius in kilometers', example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0.1)
  @Max(100)
  radius?: number;

  @ApiPropertyOptional({ description: 'Max results', example: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;
}

export class RoadsQueryDto extends BboxQueryDto {
  @ApiPropertyOptional({ description: 'Filter by road type', example: 'highway' })
  @IsOptional()
  @IsString()
  type?: string;
}
