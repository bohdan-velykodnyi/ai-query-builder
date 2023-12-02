import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangePasswordDto {
  @Field(() => String)
  old_password: string;

  @Field(() => String)
  new_password: string;
}
