import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'modules/database/database.service';
import { CreateDatabaseDto } from 'modules/database/dto/database.dto';
import { OpenaiService } from 'modules/openai/openai.service';
import { SendMessageDto } from './dto/send-message.dto';
import { DatabaseCredentials } from 'modules/database/entity/database.entity';
import { GraphQLError } from 'graphql';

@Injectable()
export class QueryBuilderService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly openaiService: OpenaiService,
  ) {}

  public getAllDatabases(user_id: string): Promise<DatabaseCredentials[]> {
    return this.databaseService.find({
      where: {
        user_id,
      },
    });
  }

  public saveDatabase(
    createDatabaseDto: CreateDatabaseDto,
  ): Promise<DatabaseCredentials> {
    return this.databaseService.saveDatabase(createDatabaseDto);
  }

  public async sendMessage(sendMessageDto: SendMessageDto): Promise<string> {
    const database_query = await this.openaiService.generateSqlQuery(
      sendMessageDto,
    );

    if (!database_query) {
      throw new GraphQLError('Request is not correct');
    }

    const query_result = await this.databaseService.runQuery(
      sendMessageDto.database_id,
      database_query,
    );

    const final_result = await this.openaiService.generateFinalResponse(
      sendMessageDto.message,
      query_result,
    );

    return final_result;
  }
}
