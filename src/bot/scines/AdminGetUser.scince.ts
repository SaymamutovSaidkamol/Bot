import { Ctx, Message, Wizard, WizardStep } from '@maks1ms/nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes } from 'telegraf';

@Wizard('admin-get-user')
export class AdminGetUser {
  constructor(private readonly prisma: PrismaService) {}

  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext) {
    let prod = await this.prisma.users.findMany();

    if (prod.length === 0) {
      await ctx.reply('🛑 Foydalanuvchilar topilmadi.');
      ctx.scene.leave();
      return;
    }

    let message = prod
      .map(
        (prod, index) =>
          `*🆔  ID:* ${prod.id}\n` +
          `*👤  User ID raqami:* ${prod.userId}\n` +
          `*👤  Foydalanuvchi ismi:* ${prod.firstName} ${prod.lastName}\n` +
          `*📞  Phone:* ${prod.phone}\n` +
          `*👥  Role:* ${prod.role}\n` +
          `*💵  Balans:* ${prod.balans || 0}\n`,
      )
      .join('\n──────────────────\n');

    await ctx.replyWithMarkdown(message);

    ctx.reply(`Foydalanuvchilar soni ${String(prod.length)}`);

    ctx.scene.leave();
  }
}
