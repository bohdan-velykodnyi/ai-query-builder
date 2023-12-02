import { FindOptionsWhere, Repository } from 'typeorm';
import { Token } from './entity/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenResponse } from './types/token';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './types/jwt-payload';
import { randomBytes } from 'crypto';
import * as moment from 'moment';
import { GraphQLError } from 'graphql';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'core/config/config';

export class TokenService {
  private jwtKey: string;
  private expiresInRefresh: string | number;
  private expiresInAccess: string | number;

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    configService: ConfigService,
  ) {
    const jwtConfig = configService.get<ConfigType['jwt']>('jwt');
    this.jwtKey = jwtConfig.key;
    this.expiresInRefresh = jwtConfig.refresh_expire;
    this.expiresInAccess = jwtConfig.access_expire;
  }

  public async createAccessTokenFromRefreshToken(
    refresh_token: string,
    access_payload: JwtPayload,
  ): Promise<TokenResponse> {
    const token = await this.validateRefreshToken(refresh_token);

    const access_token = await this.createAccessToken({
      ...access_payload,
    });

    const new_refresh_token = await this.createRefreshToken(token.user_id);

    await this.deleteByCriteria({ id: token.id });

    return {
      access_token,
      refresh_token: new_refresh_token,
    };
  }

  public async createAccessToken(
    payload: JwtPayload,
    jwt_options?: jwt.SignOptions,
  ): Promise<string> {
    const options: jwt.SignOptions = {
      expiresIn: this.expiresInAccess,
      ...jwt_options,
    };

    const res = await jwt.sign(payload, this.jwtKey, options);

    return res;
  }

  public async createRefreshToken(user_id: string): Promise<string> {
    const refresh_token = randomBytes(64).toString('hex');
    const expires_in = moment().add(this.expiresInRefresh, 'd').unix();

    const refresh: Omit<Token, 'id'> = {
      user_id,
      refresh_token,
      expires_in,
    };

    await this.tokenRepository.save(refresh);

    return refresh_token;
  }

  public async deleteRefreshTokenForUser(user_id: string): Promise<void> {
    await this.deleteByCriteria({ user_id });
  }

  public async deleteRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<void> {
    await this.deleteByCriteria({
      user_id,
      refresh_token,
    });
  }

  public async validateAccessToken(
    token: string,
    ignoreExpiration = false,
  ): Promise<Token> {
    return jwt.verify(token, this.jwtKey, { ignoreExpiration });
  }

  public async validateRefreshToken(refresh_token: string): Promise<Token> {
    const token = await this.tokenRepository.findOne({
      where: { refresh_token },
    });

    if (!token) throw new GraphQLError('Refresh token not found');

    const current_date = moment().unix();

    if (token.expires_in < current_date) {
      throw new GraphQLError('Refresh token expired');
    }

    return token;
  }

  private async deleteByCriteria(
    criteria: FindOptionsWhere<Token>,
  ): Promise<void> {
    try {
      await this.tokenRepository.delete(criteria);
    } catch (error) {
      throw new GraphQLError('The records was not found');
    }
  }
}
