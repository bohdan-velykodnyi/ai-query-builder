import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Token {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  user_id: string;

  @Field(() => String)
  @Column()
  refresh_token: string;

  @Field(() => Int)
  @Column({ type: 'bigint' })
  expires_in: number;
}
