import { InputType, OmitType } from '@nestjs/graphql';
import { CreateDatabaseDto } from 'modules/database/dto/database.dto';

@InputType()
export class SaveDatabase extends OmitType(CreateDatabaseDto, ['user_id']) {}
