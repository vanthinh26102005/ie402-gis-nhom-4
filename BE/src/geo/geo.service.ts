import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DatabaseService } from '../database/database.service';
import { PlacesQueryDto, ServicesQueryDto, NearbyQueryDto, RoadsQueryDto } from './dto/bbox-query.dto';

@Injectable()
export class GeoService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private buildCacheKey(prefix: string, params: Record<string, any>): string {
    const sorted = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    return `${prefix}:${sorted}`;
  }

  async getProvinces() {
    const cacheKey = 'provinces:all';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const provinces = await this.db.province.findMany({
      select: {
        id: true,
        name: true,
        nameEn: true,
        geometry: true,
      },
    });

    const result = {
      type: 'FeatureCollection',
      features: provinces.map((p) => ({
        type: 'Feature',
        id: p.id,
        properties: {
          id: p.id,
          name: p.name,
          nameEn: p.nameEn,
        },
        geometry: p.geometry,
      })),
    };

    await this.cacheManager.set(cacheKey, result, 300000); // 5 min
    return result;
  }

  async getPlaces(query: PlacesQueryDto) {
    const cacheKey = this.buildCacheKey('places', query);
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const where: any = {};

    if (query.category) {
      where.category = query.category;
    }
    if (query.provinceId) {
      where.provinceId = query.provinceId;
    }
    if (query.minRating) {
      where.rating = { gte: query.minRating };
    }
    if (query.featured !== undefined) {
      where.featured = query.featured;
    }
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    // Bounding box filter
    if (query.minLng !== undefined && query.minLat !== undefined &&
        query.maxLng !== undefined && query.maxLat !== undefined) {
      where.longitude = { gte: query.minLng, lte: query.maxLng };
      where.latitude = { gte: query.minLat, lte: query.maxLat };
    }

    const places = await this.db.place.findMany({
      where,
      take: query.limit || 200,
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
      ],
      include: {
        province: {
          select: { id: true, name: true },
        },
      },
    });

    const result = {
      type: 'FeatureCollection',
      features: places.map((p) => ({
        type: 'Feature',
        id: p.id,
        properties: {
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          rating: p.rating,
          featured: p.featured,
          address: p.address,
          imageUrl: p.imageUrl,
          province: p.province?.name || null,
          provinceId: p.provinceId,
        },
        geometry: {
          type: 'Point',
          coordinates: [p.longitude, p.latitude],
        },
      })),
    };

    await this.cacheManager.set(cacheKey, result, 60000); // 1 min
    return result;
  }

  async getPlaceById(id: number) {
    const place = await this.db.place.findUnique({
      where: { id },
      include: {
        province: { select: { id: true, name: true } },
      },
    });

    if (!place) return null;

    return {
      type: 'Feature',
      id: place.id,
      properties: {
        id: place.id,
        name: place.name,
        category: place.category,
        description: place.description,
        rating: place.rating,
        featured: place.featured,
        address: place.address,
        imageUrl: place.imageUrl,
        province: place.province?.name || null,
        provinceId: place.provinceId,
      },
      geometry: {
        type: 'Point',
        coordinates: [place.longitude, place.latitude],
      },
    };
  }

  async getRoads(query: RoadsQueryDto) {
    const cacheKey = this.buildCacheKey('roads', query);
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const where: any = {};
    if (query.type) {
      where.type = query.type;
    }

    const roads = await this.db.road.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        geometry: true,
      },
    });

    const result = {
      type: 'FeatureCollection',
      features: roads.map((r) => ({
        type: 'Feature',
        id: r.id,
        properties: {
          id: r.id,
          name: r.name,
          type: r.type,
        },
        geometry: r.geometry,
      })),
    };

    await this.cacheManager.set(cacheKey, result, 300000); // 5 min
    return result;
  }

  async getServices(query: ServicesQueryDto) {
    const cacheKey = this.buildCacheKey('services', query);
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const where: any = {};
    if (query.type) {
      where.type = query.type;
    }
    if (query.provinceId) {
      where.provinceId = query.provinceId;
    }

    if (query.minLng !== undefined && query.minLat !== undefined &&
        query.maxLng !== undefined && query.maxLat !== undefined) {
      where.longitude = { gte: query.minLng, lte: query.maxLng };
      where.latitude = { gte: query.minLat, lte: query.maxLat };
    }

    const services = await this.db.service.findMany({
      where,
      take: query.limit || 200,
      include: {
        province: { select: { id: true, name: true } },
      },
    });

    const result = {
      type: 'FeatureCollection',
      features: services.map((s) => ({
        type: 'Feature',
        id: s.id,
        properties: {
          id: s.id,
          name: s.name,
          type: s.type,
          address: s.address,
          province: s.province?.name || null,
          provinceId: s.provinceId,
        },
        geometry: {
          type: 'Point',
          coordinates: [s.longitude, s.latitude],
        },
      })),
    };

    await this.cacheManager.set(cacheKey, result, 60000);
    return result;
  }

  async getNearbyPlaces(query: NearbyQueryDto) {
    const radiusKm = query.radius || 10;
    const limit = query.limit || 20;

    // Approximate bounding box for the radius
    const latDelta = radiusKm / 111.0;
    const lngDelta = radiusKm / (111.0 * Math.cos((query.lat * Math.PI) / 180));

    const places = await this.db.place.findMany({
      where: {
        latitude: { gte: query.lat - latDelta, lte: query.lat + latDelta },
        longitude: { gte: query.lng - lngDelta, lte: query.lng + lngDelta },
      },
      include: {
        province: { select: { id: true, name: true } },
      },
    });

    // Calculate actual distances and sort
    const withDistance = places.map((p) => {
      const distance = this.haversineDistance(query.lat, query.lng, p.latitude, p.longitude);
      return { ...p, distance };
    })
    .filter((p) => p.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

    return {
      type: 'FeatureCollection',
      features: withDistance.map((p) => ({
        type: 'Feature',
        id: p.id,
        properties: {
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          rating: p.rating,
          featured: p.featured,
          address: p.address,
          distance: Math.round(p.distance * 100) / 100,
          province: p.province?.name || null,
        },
        geometry: {
          type: 'Point',
          coordinates: [p.longitude, p.latitude],
        },
      })),
    };
  }

  async getCategories() {
    const categories = await this.db.place.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return categories.map((c) => c.category);
  }

  async getServiceTypes() {
    const types = await this.db.service.findMany({
      select: { type: true },
      distinct: ['type'],
      orderBy: { type: 'asc' },
    });
    return types.map((t) => t.type);
  }

  async getStats() {
    const [placesCount, provincesCount, roadsCount, servicesCount] = await Promise.all([
      this.db.place.count(),
      this.db.province.count(),
      this.db.road.count(),
      this.db.service.count(),
    ]);
    return { places: placesCount, provinces: provincesCount, roads: roadsCount, services: servicesCount };
  }

  async getTrendingPlaces(limit = 10) {
    return this.db.place.findMany({
      orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
      take: limit,
      include: { province: { select: { id: true, name: true } } },
    });
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
