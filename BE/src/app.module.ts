import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { GeoModule } from './geo/geo.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60000, // 60 seconds default
      max: 1000,
    }),
    DatabaseModule,
    GeoModule,
  ],
})
export class AppModule {}
