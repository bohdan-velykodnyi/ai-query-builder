import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/user.dto';
import {
  Brackets,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(user: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.save(user);

    return newUser;
  }

  public async getUserWithPass(
    where:
      | string
      | Brackets
      | ObjectLiteral
      | ObjectLiteral[]
      | ((qb: SelectQueryBuilder<User>) => string),
  ): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select()
      .addSelect('user.password')
      .where(where)
      .getOne();

    if (!user) {
      throw new GraphQLError('User not found');
    }

    return user;
  }

  public async updateAndReturn(
    id: string,
    partialEntity: QueryDeepPartialEntity<User>,
  ) {
    await this.update(id, partialEntity);
    const new_user = await this.userRepository.findOne({ where: { id } });

    if (new_user) {
      throw new Error('User not found');
    }

    return new_user;
  }

  public async update(
    id: string,
    partialEntity: QueryDeepPartialEntity<User>,
  ): Promise<UpdateResult> {
    try {
      return await this.userRepository.update(id, partialEntity);
    } catch (error) {
      throw new GraphQLError('The record was not found');
    }
  }
}
