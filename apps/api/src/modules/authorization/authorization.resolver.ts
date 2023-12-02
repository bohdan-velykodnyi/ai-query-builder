import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationService } from './authorization.service';
import { LoginDto } from './dto/login.dto';
import { TokenResponse } from './token/types/token';
import { User } from 'modules/User/entity/user.entity';
import { CreateUserDto } from 'modules/User/dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorator/current-user';
import { JwtPayload } from './token/types/jwt-payload';
import { ChangePasswordDto } from './dto/change-password.dto';

@Resolver()
export class AuthorizationResolver {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Mutation(() => TokenResponse)
  login(
    @Args('credentials', { type: () => LoginDto })
    credentials: LoginDto,
  ): Promise<TokenResponse> {
    return this.authorizationService.login(credentials);
  }

  @Mutation(() => User)
  registration(
    @Args('credentials', { type: () => CreateUserDto })
    credentials: CreateUserDto,
  ): Promise<User> {
    return this.authorizationService.registration(credentials);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  logout(
    @Args('refresh_token') refresh_token: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<string> {
    return this.authorizationService.logout(user.user_id, refresh_token);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  logoutFromAll(@CurrentUser() user: JwtPayload): Promise<string> {
    return this.authorizationService.logoutFromAll(user.user_id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  changePassword(
    @Args('passwords', { type: () => ChangePasswordDto })
    passwords: ChangePasswordDto,
    @CurrentUser() { user_id }: JwtPayload,
  ): Promise<string> {
    return this.authorizationService.changePassword(passwords, user_id);
  }

  @Query(() => String)
  hello(): string {
    return 'Hello World!';
  }
}
