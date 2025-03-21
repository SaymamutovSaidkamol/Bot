import {
  Ctx,
  Message,
  On,
  Wizard,
  WizardStep,
} from '@maks1ms/nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Markup, Scenes } from 'telegraf';

interface WizardState extends Scenes.WizardSessionData {
  id?: number;
  selectedField?: string;
}

@Wizard('prodPatch_scince')
export class ProdPatch_scince {
  constructor(private readonly prisma: PrismaService) {}

  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply('Product id sini kiriting...', {
      reply_markup: { remove_keyboard: true },
    });
    ctx.wizard.next();
  }

  @WizardStep(2)
  async getButtons(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    let state = ctx.wizard.state as WizardState;
    state.id = Number(message.text); // ✅ To‘g‘ri format

    if (isNaN(state.id)) {
      await ctx.reply("Noto‘g‘ri ID! Iltimos, faqat raqam kiriting ❌");
      ctx.scene.leave();
      return;
    }

    let checkProd = await this.prisma.product.findFirst({ where: { id: state.id } });

    if (!checkProd) {
      await ctx.reply('Bunday ID lik product topilmadi ❌', {
        reply_markup: { remove_keyboard: true },
      });
      ctx.scene.leave();
      return;
    }

    await ctx.reply(
      "O'zgartirmoqchi bo'lgan tugmangizni tanlang 👇",
      Markup.keyboard([['name', 'price'], ['color']]).resize(),
    );
    ctx.wizard.next();
  }

  @WizardStep(3)
  @On('text')
  async OnButton(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    let state = ctx.wizard.state as WizardState;
    let selectButton = message.text;

    if (!['name', 'price', 'color'].includes(selectButton)) {
      await ctx.reply("Noto‘g‘ri tugma! Iltimos, 'name', 'price' yoki 'color' ni tanlang.");
      return;
    }

    state.selectedField = selectButton;
    await ctx.reply(`O'zgartirmoqchi bo'lgan ${selectButton} qiymatini kiriting...`, {
      reply_markup: { remove_keyboard: true },
    });
    ctx.wizard.next();
  }

  @WizardStep(4)
  @On('text')
  async GetUpdate(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    let state = ctx.wizard.state as WizardState;
    let selectedField = state.selectedField;
    let newValue = message.text;

    if (!selectedField) {
      await ctx.reply("Xatolik: O'zgartiriladigan maydon tanlanmadi ❌");
      ctx.scene.leave();
      return;
    }

    let updateData: any = { [selectedField]: selectedField === 'price' ? Number(newValue) : newValue };

    if (selectedField === 'price' && isNaN(updateData.price)) {
      await ctx.reply("Noto‘g‘ri qiymat! `price` faqat raqam bo‘lishi kerak ❌");
      return;
    }

    await this.prisma.product.updateMany({
      where: { id: state.id },
      data: updateData,
    });

    await ctx.reply(`Siz ${selectedField} ni ${newValue} ga o‘zgartirdingiz ✅`);
    ctx.scene.leave();
  }
}
