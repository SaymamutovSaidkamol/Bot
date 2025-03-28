import { Module } from '@nestjs/common';
import { TelegrafModule } from '@maks1ms/nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { session } from 'telegraf';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '7798443665:AAFYkZNXsdc5yKPEpJvDCO3C3DFPMXRGD80',
      middlewares: [session()],
    }),
    BotModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
