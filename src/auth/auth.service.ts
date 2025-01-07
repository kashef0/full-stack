import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // generera password hash
    const hash = await argon.hash(dto.password);

    try {
      // spara ny anv'ndaren i databas
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          role: dto.role,
        },
      });
      // return sparade data
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // hitta anv'ndaren via email

    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    // om användaren inte finns får amvändaren ett fel meddelande
    if (!user) {
      throw new ForbiddenException(
        'credentials inncorect',
      );
    }

    // jämföra password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );

    // om password är inte korrekt får användaren ett fel meddelande

    if (!pwMatches) {
      throw new ForbiddenException(
        'credetinals inncorect',
      );
    }
    // om allt bra skickar tillbacka anv'ndaren
    return this.signToken(user.id, user.email);
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const data = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(data, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
