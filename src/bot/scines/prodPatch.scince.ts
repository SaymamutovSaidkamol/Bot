import {
  Action,
  Ctx,
  Message,
  On,
  Scene,
  SceneEnter,
  Wizard,
  WizardStep,
} from '@maks1ms/nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Markup, Scenes } from 'telegraf';

let date = {
  id: '',
  name: '',
  price: '',
  color: '',
};

interface WizardState extends Scenes.WizardSessionData {
  selectedField?: string;
}

@Wizard('prodPatch_scince')
export class ProdPatch_scince {
  constructor(private readonly prisma: PrismaService) {}
  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    await ctx.reply('Product id sini kriting...', {
      reply_markup: { remove_keyboard: true },
    });
    ctx.wizard.next();
  }

  @WizardStep(2)
  async getButtons(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    date.id = (message.text);

    let { id } = date;

    let checkProd = await this.prisma.product.findFirst({ where: { id: Number(date.id) } });

    if (!checkProd) {
      await ctx.reply('Product topilmadi❌', {
        reply_markup: { remove_keyboard: true },
      });
      ctx.scene.leave();
      return;
    }

    await ctx.reply(
      "O'zgartirmoqchi bulgan tugmangizni tanlang👇",
      Markup.keyboard([['name', 'price'], ['color']]).resize(),
    );
    ctx.wizard.next();
    // ctx.scene.leave();
  }

  @WizardStep(3)
  @On('text')
  async OnButton(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    let state = ctx.wizard.state as WizardState; // Tipini to‘g‘ri beramiz
    let selectButton = message.text;

    if (['name', 'price', 'color'].includes(selectButton)) {
      state.selectedField = selectButton;
      await ctx.reply(
        `O'zgartirmoqchi bo'lgan ${selectButton} qiymatini kiriting...`,
        {
          reply_markup: { remove_keyboard: true },
        },
      );
      ctx.wizard.next();
    } else {
      await ctx.reply(
        "Noto‘g‘ri tugma! Iltimos, 'name', 'price' yoki 'color' ni tanlang.",
      );
    }
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

    let updateData: any = {
      [selectedField]: selectedField === 'price' ? Number(newValue) : newValue,
    };

    await this.prisma.product.updateMany({
      where: { id: Number(date.id) },
      data: updateData,
    });

    await ctx.reply(
      `Siz ${selectedField} ni ${newValue} ga o‘zgartirdingiz ✅`,
    );
    ctx.scene.leave();
  }
}
