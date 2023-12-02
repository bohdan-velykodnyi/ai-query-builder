import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseCredentials } from './entity/database.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseCredentials])],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
