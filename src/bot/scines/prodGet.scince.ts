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

let date = {
  firtsName: '',
  lastName: '',
  phone: '',
  userId: '',
};

@Wizard('prodGet_scince')
export class ProdGet_scince {
  constructor(private readonly prisma: PrismaService) {}
  
  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext) {
    let prod = await this.prisma.users.findMany({where: {userId: String(ctx.from?.id)}})

    if (prod.length === 0) {
      await ctx.reply("🛑 Sizning Xisobingiz topilmadi.");
      ctx.scene.leave();
      return;
    }

    let message = prod.map(
      (prod, index) =>
        `🆔 *👤 Sizning ID raqamingiz:* ${prod.userId}\n` +
        `👤 *💵 Balansingiz:* ${(prod.balans)|| 0}\n`
    ).join("\n──────────────────\n");

    await ctx.replyWithMarkdown(message);

    ctx.scene.leave();
  }
}
