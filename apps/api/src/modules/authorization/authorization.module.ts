import { Module } from '@nestjs/common';
import { UserModule } from '../User/user.module';
import { AuthorizationResolver } from './authorization.resolver';
import { AuthorizationService } from './authorization.service';
import { TokenModule } from './token/token.module';

@Module({
  imports: [UserModule, TokenModule],
  providers: [AuthorizationService, AuthorizationResolver],
})
export class AuthorizationModule {}
