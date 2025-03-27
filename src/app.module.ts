import { Module } from '@nestjs/common';
import { TelegrafModule } from '@maks1ms/nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { session } from 'telegraf';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '8076038346:AAFq648VZXSHTmMtj0aZkNdelzJoWvi8Nco',
      middlewares: [session()],
    }),
    BotModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
