import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DataSourceOptions,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { DatabaseCredentials } from './entity/database.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDatabaseDto } from './dto/database.dto';
import { GraphQLError } from 'graphql';

const getDefaultOptions = {
  synchronize: false,
  logging: true,
  entities: ['dist/entity/**/*.js'],
  migrationsRun: false,
  dropSchema: false,
  type: 'postgres',
};

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(DatabaseCredentials)
    private readonly databaseCredentials: Repository<DatabaseCredentials>,
  ) {}

  public async find(
    options?: FindManyOptions<DatabaseCredentials>,
  ): Promise<DatabaseCredentials[]> {
    return this.databaseCredentials.find(options);
  }

  public async saveDatabase(
    createDatabaseDto: CreateDatabaseDto,
  ): Promise<DatabaseCredentials> {
    return this.databaseCredentials.save(createDatabaseDto);
  }

  public async deleteByCriteria(
    criteria: FindOptionsWhere<DatabaseCredentials>,
  ): Promise<void> {
    try {
      await this.databaseCredentials.delete(criteria);
    } catch (error) {
      throw new GraphQLError('The records was not found');
    }
  }

  public async runQuery<T>(db_id: string, query: string): Promise<T> {
    const dataSource = await this.createTypeOrmConnection(db_id);
    return dataSource.query<T>(query);
  }

  private async createTypeOrmConnection(id: string): Promise<DataSource> {
    const { host, port, password, database, username } =
      await this.databaseCredentials.findOne({ where: { id } });

    if (!host) {
      throw new Error('Database not found');
    }

    const ds = await new DataSource({
      ...getDefaultOptions,
      host,
      port,
      password,
      database,
      username,
    } as DataSourceOptions).initialize();

    return ds;
  }
}
