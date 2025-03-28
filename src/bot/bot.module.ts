import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { RegisterScene } from './scines/register.scince';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProdDelete_scince } from './scines/prodDelete.scince';
import { ProdPatch_scince } from './scines/prodPatch.scince';
import { ProdGet_scince } from './scines/prodGet.scince';
import { ProdCreate_scince } from './scines/prodCreate.scince';
import { Admin_Panel_1 } from './scines/AdminHisobTuldirish.scince';
import { AdminGetUser } from './scines/AdminGetUser.scince';
import { AdminCreateReklama } from './scines/AdminCreateReklama.scince';
import { Telegraf } from 'telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePresentation } from './scines/CreatePresentation.scince';

@Module({
  imports: [PrismaModule],
  providers: [
    BotUpdate,
    RegisterScene,
    ProdDelete_scince,
    ProdPatch_scince,
    ProdGet_scince,
    ProdCreate_scince,
    Admin_Panel_1,
    AdminGetUser,
    AdminCreateReklama,
    Telegraf,
    CreatePresentation,
    {
      provide: Telegraf,
      useFactory: () => {
        const token = '8076038346:AAFq648VZXSHTmMtj0aZkNdelzJoWvi8Nco';
        if (!token) {
          throw new Error('BOT_TOKEN topilmadi! Iltimos, tokenni tekshiring.');
        }
        return new Telegraf(token);
      },
    },
    PrismaService,
  ],
  exports: [Telegraf],
})
export class BotModule {}
