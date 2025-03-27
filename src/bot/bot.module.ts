import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { RegisterScene } from './scines/register.scince';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProdDelete_scince } from './scines/prodDelete.scince';
import { ProdPatch_scince } from './scines/prodPatch.scince';
import { ProdGet_scince } from './scines/prodGet.scince';
import { ProdCreate_scince } from './scines/prodCreate.scince';
import { Admin_Panel_1 } from './scines/AdminHisobTuldirish.scince';

@Module({
  imports: [PrismaModule],
  providers: [BotUpdate, RegisterScene, ProdDelete_scince, ProdPatch_scince, ProdGet_scince, ProdCreate_scince,Admin_Panel_1],
})
export class BotModule {}
