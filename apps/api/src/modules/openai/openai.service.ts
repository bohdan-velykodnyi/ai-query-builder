import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'modules/database/database.service';
import OpenAI from 'openai';
import { getTablesQuery } from './queries/get-tables';
import { DBTable } from './types/db_table';
import { getTableInfoQuery } from './queries/get-table-info';
import { DBTableInfo } from './types/db_table_info';
import { SendMessageDto } from 'modules/query-buider/dto/send-message.dto';
import { GraphQLError } from 'graphql';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('app.open_ai_key'),
    });
  }

  public async generateSqlQuery({
    message,
    database_id,
  }: SendMessageDto): Promise<string> {
    let system_content = `Given the following SQL tables, your job is to write queries given a user’s request.`;

    const getTables = await this.databaseService.runQuery<DBTable[]>(
      database_id,
      getTablesQuery,
    );

    for await (const table of getTables) {
      const getTableInfo = await this.databaseService.runQuery<DBTableInfo[]>(
        database_id,
        getTableInfoQuery(table.tablename),
      );

      system_content += `\n
        CREATE TABLE ${table.tablename} (
${getTableInfo
  .map((info) => `          ${info.column_name} ${info.data_type}`)
  .join(`,\n`)}
          PRIMARY KEY (id)
        );
        \n`;
    }

    return await this.openai.chat.completions
      .create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: system_content,
          },
          {
            role: 'user',
            content: `Write a SQL query which will get all related for this question: ${message}`,
          },
        ],
      })
      .then(async (r) => {
        return r.choices[0].message.content;
      })
      .catch((e) => {
        throw new GraphQLError(e.response.data);
      });
  }

  public async generateFinalResponse(
    message: string,
    data: unknown,
  ): Promise<string> {
    return this.openai.chat.completions
      .create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Your job is to answer question to the user using only the results as context',
          },
          {
            role: 'user',
            content: `question: ${message} - Search Results: ${JSON.stringify(
              data,
            )}`,
          },
        ],
      })
      .then(async (r) => {
        return r.choices[0].message.content;
      })
      .catch((e) => {
        console.log(e.response.data);
        throw e.response.data;
      });
  }
}
