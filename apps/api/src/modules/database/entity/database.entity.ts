import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'modules/User/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class DatabaseCredentials {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  host: string;

  @Field(() => String)
  @Column()
  port: number;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => String)
  @Column()
  database: string;

  @Field(() => String)
  @Column()
  username: string;

  @Field(() => ID)
  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, (user) => user.databases, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
