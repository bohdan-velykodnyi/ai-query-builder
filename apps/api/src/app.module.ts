import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import config, {
  GqlConfigService,
  TypeOrmConfigService,
} from './core/config/config';
import { AuthorizationModule } from 'modules/authorization/authorization.module';
import { QueryBuilderModule } from 'modules/query-buider/query-buider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthorizationModule,
    QueryBuilderModule,
  ],
})
export class AppModule {}
