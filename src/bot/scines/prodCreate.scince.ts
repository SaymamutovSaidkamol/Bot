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
  name: '',
  price: '',
  color: '',
};

@Wizard('prodCreate_scince')
export class ProdCreate_scince {
  constructor(private readonly prisma: PrismaService) {}
  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply('Product name kriting...', {
      reply_markup: { remove_keyboard: true },
    });
    ctx.wizard.next();
  }

  @WizardStep(2)
  async getPrice(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    date.name = message.text;
    await ctx.reply('Product Narxini kriting...', {
      reply_markup: { remove_keyboard: true },
    });
    ctx.wizard.next();
  }

  @WizardStep(3)
  async getColor(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    date.price = (message.text);
    
    await ctx.reply('Product Rangini kriting...', {
      reply_markup: { remove_keyboard: true },
    });
    ctx.wizard.next();
  }

  @WizardStep(4)
  async getEnd(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    date.color = message.text;
    let { name, price, color } = date; 
    
    let saveProd = await this.prisma.product.createMany({data: { name, price: Number(price), color}});

    await ctx.reply('Product muvaffaqiyatlik saqlandi✅');
    ctx.scene.leave();
  }
}
