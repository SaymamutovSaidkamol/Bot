import { Ctx, Message, Wizard, WizardStep } from '@maks1ms/nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes } from 'telegraf';

@Wizard('admin-panel-1')
export class Admin_Panel_1 {
  constructor(private readonly prisma: PrismaService) {}

  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext) {
    ctx.reply('👤 Userning Telegram ID sini kiriting\n\nMisol: `6958996923`', {
      parse_mode: 'Markdown',
    });
    ctx.wizard.next();
  }

  @WizardStep(2)
  async CheckId(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    let UserID = message.text;
    console.log(`Kiritilgan user ID: ${UserID}`);

    let checkUser = await this.prisma.users.findFirst({
      where: { userId: String(UserID) },
    });

    if (!checkUser) {
      ctx.reply('❌ User topilmadi!');
      ctx.scene.leave();
      return;
    }

    (ctx.wizard.state as any)['userId'] = checkUser.id;
    (ctx.wizard.state as any)['tgId'] = checkUser.userId;

    ctx.reply('💸 Summani kiriting\n\nMisol: `10000`', {
      parse_mode: 'Markdown',
    });
    ctx.wizard.next();
  }

  @WizardStep(3)
  async updateUserBalance(
    @Ctx() ctx: Scenes.WizardContext,
    @Message() message: any,
  ) {
    let amount = parseInt(message.text);

    if (isNaN(amount) || amount <= 0) {
      ctx.reply('❌ Noto‘g‘ri miqdor kiritildi, qaytadan kiriting!');
      return;
    }

    let userId = (ctx.wizard.state as any)['userId'];
    let tgId = (ctx.wizard.state as any)['tgId'];

    if (!userId || !tgId) {
      ctx.reply('❌ Xatolik yuz berdi, qaytadan urinib ko‘ring.');
      ctx.scene.leave();
      return;
    }

    let user = await this.prisma.users.findFirst({
      where: { id: userId },
    });

    if (!user) {
      ctx.reply('❌ Foydalanuvchi topilmadi.');
      return;
    }

    user.balans = user.balans! + amount

    await this.prisma.users.update({
      where: { id: userId },
      data: { balans: user.balans ? { increment: amount } : amount },
    });

    console.log('amount', amount);

    ctx.telegram.sendMessage(
      tgId,
      `✅ Sizning balansingizga *${amount} so'm* muvaffaqiyatli qo'shildi.`,
      { parse_mode: 'Markdown' },
    );

    ctx.reply('✅ Foydalanuvchi balansiga pul qo‘shildi.');
    ctx.scene.leave();
  }
}
