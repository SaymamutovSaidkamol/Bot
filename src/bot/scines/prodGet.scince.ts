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
    let prod = await this.prisma.product.findMany()

    console.log(prod);
    
    if (prod.length === 0) {
      await ctx.reply("🛑 Hech qanday foydalanuvchi topilmadi.");
      ctx.scene.leave();
      return;
    }
    

    // let message = prod.map(
    //   (prod, index) => 
    //   `📌 *Product raqam #${index + 1}* \n` +
    //   `🆔 *Product Id raqami:* ${prod.id}\n` +
    //   `👤 *Name:* ${prod.name}\n` +
    //   `👤 *Price:* ${prod.price}\n` +
    //   `📞 *Color:* ${prod.color}\n`
    // ).join("\n──────────────────\n");

    let escapeMarkdown = (text: string) =>
      text.replace(/[_*[\]()~`>#\+\-=|{}.!]/g, "\\$&");    

    let message = prod.map(
      (prod, index) =>
        `📌 *Product raqam #${index + 1}* \n` +
        `🆔 *Product Id raqami:* ${(prod.id)}\n` +
        `👤 *Name:* ${escapeMarkdown(prod.name)}\n` +
        `💰 *Price:* ${prod.price}\n` +
        `🎨 *Color:* ${escapeMarkdown(prod.color)}\n`
    ).join("\n──────────────────\n");

    await ctx.replyWithMarkdown(message, {
      reply_markup: { remove_keyboard: true },
    });

    ctx.scene.leave();
  }
}
