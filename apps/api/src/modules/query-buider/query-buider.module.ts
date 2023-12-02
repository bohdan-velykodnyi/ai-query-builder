import { Module } from '@nestjs/common';
import { QueryBuilderService } from './query-buider.service';
import { QueryBuilderResolver } from './query-builder.resolver';
import { DatabaseModule } from 'modules/database/database.module';
import { OpenaiModule } from 'modules/openai/openai.module';

@Module({
  imports: [DatabaseModule, OpenaiModule],
  providers: [QueryBuilderService, QueryBuilderResolver],
})
export class QueryBuilderModule {}
