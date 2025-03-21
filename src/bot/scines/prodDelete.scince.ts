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

@Wizard('prodDelete_scince')
export class ProdDelete_scince {
  constructor(private readonly prisma: PrismaService) {}
  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    await ctx.reply("O'chirib yubormoqchi bulgan product ID sini kritinig...", {
      reply_markup: { remove_keyboard: true },
    });
    ctx.wizard.next();
  }

  @WizardStep(2)
  async getDel(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    let id = message.text;
    

    let chechProd = await this.prisma.product.findFirst({ where: { id } });

    console.log(chechProd);

    if (!chechProd) {
      await ctx.reply('Bunday ID lik product topilmadi❌');
      ctx.scene.leave();
      return;
    }
    let delProd = await this.prisma.product.delete({ where: { id: Number(id) } });

    await ctx.reply("Product muvaffaqiyatlik o'chirildi✅")
    // ctx.wizard.next();
    ctx.scene.leave();
  }
}
