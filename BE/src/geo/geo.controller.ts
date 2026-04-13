import { Controller, Get, Param, Query, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GeoService } from './geo.service';
import { PlacesQueryDto, ServicesQueryDto, NearbyQueryDto, RoadsQueryDto } from './dto/bbox-query.dto';

@ApiTags('geo')
@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Get('provinces')
  @ApiOperation({ summary: 'Get all provinces with boundaries' })
  @ApiResponse({ status: 200, description: 'GeoJSON FeatureCollection of provinces' })
  async getProvinces() {
    return this.geoService.getProvinces();
  }

  @Get('places')
  @ApiOperation({ summary: 'Get tourist places with optional bbox and filters' })
  @ApiResponse({ status: 200, description: 'GeoJSON FeatureCollection of places' })
  async getPlaces(@Query() query: PlacesQueryDto) {
    return this.geoService.getPlaces(query);
  }

  @Get('places/nearby')
  @ApiOperation({ summary: 'Get places near a location' })
  @ApiResponse({ status: 200, description: 'GeoJSON FeatureCollection of nearby places with distance' })
  async getNearbyPlaces(@Query() query: NearbyQueryDto) {
    return this.geoService.getNearbyPlaces(query);
  }

  @Get('places/categories')
  @ApiOperation({ summary: 'Get all place categories' })
  @ApiResponse({ status: 200, description: 'Array of category strings' })
  async getCategories() {
    return this.geoService.getCategories();
  }

  @Get('places/trending')
  @ApiOperation({ summary: 'Get trending/popular places' })
  @ApiResponse({ status: 200, description: 'Array of popular places' })
  async getTrendingPlaces() {
    return this.geoService.getTrendingPlaces();
  }

  @Get('places/:id')
  @ApiOperation({ summary: 'Get a single place by ID' })
  @ApiResponse({ status: 200, description: 'GeoJSON Feature of the place' })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async getPlaceById(@Param('id', ParseIntPipe) id: number) {
    const place = await this.geoService.getPlaceById(id);
    if (!place) throw new NotFoundException(`Place with ID ${id} not found`);
    return place;
  }

  @Get('roads')
  @ApiOperation({ summary: 'Get roads with optional bbox filter' })
  @ApiResponse({ status: 200, description: 'GeoJSON FeatureCollection of roads' })
  async getRoads(@Query() query: RoadsQueryDto) {
    return this.geoService.getRoads(query);
  }

  @Get('services')
  @ApiOperation({ summary: 'Get services with optional bbox and type filters' })
  @ApiResponse({ status: 200, description: 'GeoJSON FeatureCollection of services' })
  async getServices(@Query() query: ServicesQueryDto) {
    return this.geoService.getServices(query);
  }

  @Get('services/types')
  @ApiOperation({ summary: 'Get all service types' })
  @ApiResponse({ status: 200, description: 'Array of service type strings' })
  async getServiceTypes() {
    return this.geoService.getServiceTypes();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get database statistics' })
  @ApiResponse({ status: 200, description: 'Counts of all entities' })
  async getStats() {
    return this.geoService.getStats();
  }
}
