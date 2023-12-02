import { Field, InputType, OmitType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@InputType()
export class UserInput extends OmitType(User, ['databases']) {}

@InputType()
export class CreateUserDto extends OmitType(UserInput, ['id']) {
  @Field(() => String)
  password: string;
}
