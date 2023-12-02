import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DatabaseCredentials } from 'modules/database/entity/database.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({
    unique: true,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => [DatabaseCredentials], { nullable: true })
  @OneToMany(() => DatabaseCredentials, (db) => db.user, { eager: true })
  databases: DatabaseCredentials[];
}
