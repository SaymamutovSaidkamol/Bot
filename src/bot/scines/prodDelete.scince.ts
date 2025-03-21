import {
  Ctx,
  Message,
  Wizard,
  WizardStep,
} from '@maks1ms/nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes } from 'telegraf';

interface WizardState extends Scenes.WizardSessionData {
  id?: number;
}

@Wizard('prodDelete_scince')
export class ProdDelete_scince {
  constructor(private readonly prisma: PrismaService) {}

  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply("O'chirmoqchi bo'lgan product ID sini kiriting...", {
      reply_markup: { remove_keyboard: true },
    });
    ctx.wizard.next();
  }

  @WizardStep(2)
  async getDel(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    let state = ctx.wizard.state as WizardState;
    state.id = Number(message.text);

    if (isNaN(state.id) || state.id <= 0) {
      await ctx.reply("Noto‘g‘ri ID! Iltimos, faqat ijobiy raqam kiriting ❌");
      ctx.scene.leave();
      return;
    }

    let checkProd = await this.prisma.product.findFirst({
      where: { id: state.id },
    });

    if (!checkProd) {
      await ctx.reply('Bunday ID lik product topilmadi ❌');
      ctx.scene.leave();
      return;
    }

    await this.prisma.product.delete({ where: { id: state.id } });

    await ctx.reply("Product muvaffaqiyatli o'chirildi ✅");
    ctx.scene.leave();
  }
}
