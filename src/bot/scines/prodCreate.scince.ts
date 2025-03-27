import {
  Ctx,
  Message,
  Scene,
  SceneEnter,
  Wizard,
  WizardStep,
} from '@maks1ms/nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Markup, Scenes } from 'telegraf';

@Wizard('prodCreate_scince')
export class ProdCreate_scince {
  constructor(private readonly prisma: PrismaService) {}
  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply(
      "Saymamutov Saidkamol\n5614682009437452\n\nTo'lov qilib bo'lgach iltimos Adminga To'lov qilganingiz haqida sikrinshot yuboring va Admin to'lovingizni tasdiqlashini kuting\n\n\n@Saymamutov_Saidkamol",
      {
        reply_markup: { remove_keyboard: true },
      },
    );
    ctx.scene.leave();
  }
}
