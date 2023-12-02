import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { GraphQLError } from 'graphql';
import { TokenResponse } from './token/types/token';
import { TokenService } from './token/token.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserService } from '../User/user.service';
import { CreateUserDto } from '../User/dto/user.dto';
import { User } from '../User/entity/user.entity';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async registration(credentials: CreateUserDto): Promise<User> {
    const password = await this.hashPassword(credentials.password);

    const user = await this.userService.create({
      ...credentials,
      password,
    });

    return user;
  }

  public async login(credentials: LoginDto): Promise<TokenResponse> {
    const loginResult = await this.validateLogin(credentials);

    const user_id = loginResult.id;

    const access_token = await this.tokenService.createAccessToken({
      user_id,
    });
    const refresh_token = await this.tokenService.createRefreshToken(user_id);

    return {
      access_token,
      refresh_token,
    };
  }

  public async logout(user_id: string, refresh_token: string): Promise<string> {
    await this.tokenService.deleteRefreshToken(user_id, refresh_token);
    return 'Logged out successfully';
  }

  public async logoutFromAll(user_id: string): Promise<string> {
    await this.tokenService.deleteRefreshTokenForUser(user_id);
    return 'Logged out from all devices';
  }

  public async changePassword(
    { old_password, new_password }: ChangePasswordDto,
    user_id: string,
  ): Promise<string> {
    const user = await this.userService.getUserWithPass({ id: user_id });

    const passwordMatch = await compare(old_password, user.password);

    if (!passwordMatch) throw new GraphQLError('Incorrect password');

    const password = await this.hashPassword(new_password);

    await this.userService.updateAndReturn(user.id, {
      password,
    });

    return 'Password changed successfully';
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
  }

  private async validateLogin(credentials: LoginDto): Promise<User> {
    const { email, password } = credentials;

    const user = await this.userService.getUserWithPass({ email });

    if (!user) throw new GraphQLError('Incorrect email or password');

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) throw new GraphQLError('Incorrect email or password');

    return user;
  }
}
