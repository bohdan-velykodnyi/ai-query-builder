import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../config/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private config: ConfigType['typeorm'];
  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<ConfigType['typeorm']>('typeorm');
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      dropSchema: false,
      keepConnectionAlive: true,
      logging: this.configService.get('app.nodeEnv') !== 'production',
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      ...this.config,
    };
  }
}
