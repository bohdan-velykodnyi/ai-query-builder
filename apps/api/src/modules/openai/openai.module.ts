import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { DatabaseModule } from 'modules/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
