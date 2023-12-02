import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QueryBuilderService } from './query-buider.service';
import { DatabaseCredentials } from 'modules/database/entity/database.entity';
import { CurrentUser } from 'modules/authorization/decorator/current-user';
import { JwtPayload } from 'modules/authorization/token/types/jwt-payload';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'modules/authorization/guards/auth.guard';
import { SaveDatabase } from './dto/save-database.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Resolver()
export class QueryBuilderResolver {
  constructor(private readonly queryBuilderService: QueryBuilderService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [DatabaseCredentials])
  getAllDatabases(
    @CurrentUser()
    { user_id }: JwtPayload,
  ): Promise<DatabaseCredentials[]> {
    return this.queryBuilderService.getAllDatabases(user_id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DatabaseCredentials)
  saveDatabase(
    @Args('saveDatabase', { type: () => SaveDatabase })
    saveDatabase: SaveDatabase,
    @CurrentUser()
    { user_id }: JwtPayload,
  ): Promise<DatabaseCredentials> {
    return this.queryBuilderService.saveDatabase({ ...saveDatabase, user_id });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  sendMessage(
    @Args('sendMessageDto', { type: () => SendMessageDto })
    sendMessageDto: SendMessageDto,
  ): Promise<string> {
    return this.queryBuilderService.sendMessage(sendMessageDto);
  }
}
