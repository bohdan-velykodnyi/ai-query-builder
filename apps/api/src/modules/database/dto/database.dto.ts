import { InputType, OmitType } from '@nestjs/graphql';
import { DatabaseCredentials } from '../entity/database.entity';

@InputType()
export class DatabaseInput extends OmitType(DatabaseCredentials, ['user']) {}

@InputType()
export class CreateDatabaseDto extends OmitType(DatabaseInput, ['id']) {}
