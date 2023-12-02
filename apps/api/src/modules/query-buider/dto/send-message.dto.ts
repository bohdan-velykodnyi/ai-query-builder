import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class SendMessageDto {
  @Field(() => ID)
  database_id: string;

  @Field(() => String)
  message: string;
}
