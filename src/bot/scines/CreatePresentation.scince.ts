import {
  Ctx,
  Wizard,
  WizardStep,
} from '@maks1ms/nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Markup, Scenes } from 'telegraf';

@Wizard('create-presentation')
export class CreatePresentation {
  constructor(private readonly prisma: PrismaService) {}

  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext) {
    let prod = await this.prisma.users.findFirst({
      where: { userId: String(ctx.from?.id) },
    });

    if (!prod) {
      await ctx.reply('🛑 Sizning Xisobingiz topilmadi.');
      ctx.scene.leave();
      return;
    }

    let message =
      `👤 *Sizning ID raqamingiz:* \`${ctx.from?.id}\`\n` +
      `💵 *Balansingiz:* \`${prod!.balans || 0}\``;

    ctx.reply(message, { parse_mode: 'Markdown' });

    ctx.scene.leave();
  }
}
