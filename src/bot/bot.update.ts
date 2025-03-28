import { Action, Ctx, On, Start, Update } from '@maks1ms/nestjs-telegraf';
import { Context, Markup, Scenes } from 'telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
@Update()
export class BotUpdate {
  constructor(private readonly prisma: PrismaService) {}

  @Start()
  async start(ctx: Scenes.WizardContext) {
    const userId = ctx.from?.id;
    const CHANNEL_ID_1 = '@Saidkamol_Saymamutov';
    const member = await ctx.telegram.getChatMember(CHANNEL_ID_1, userId!);
    const statuses = ['member', 'administrator', 'creator'];

    let ChechAdmin = await this.prisma.users.findFirst({
      where: { role: 'ADMIN', userId: String(ctx.from?.id) },
    });

    let ChechRegister = await this.prisma.users.findFirst({
      where: { userId: String(ctx.from?.id) },
    });

    if (ChechAdmin) {
      ctx.reply(
        'Admin Panelga Xush Kelibsiz😊',
        Markup.keyboard([
          ['Userlar hisobini tuldirish', 'Reklama Yaratish'],
          ["Userlarni ko'rish"],
        ]).resize(),
      );
      return;
    }

    if (statuses.includes(member.status) && !ChechRegister) {
      await ctx.scene.enter('create_product');
      return;
    }
    if (statuses.includes(member.status) && ChechRegister) {
      ctx.reply(
        'Siz Asosiy menyudasiz',
        Markup.keyboard([
          ['Hisobim', "hisob to'dirish"],
          ['Prezentatsiya yaratish'],
        ]).resize(),
      );
    } 
    else {
      await ctx.reply(
        'Assalomu Aleykum😊\nBotimizga Xush Kelibsiz!\nBotdan foydalanish uchun Iltimos Quyidagi amallarni bajaring',
        Markup.keyboard([['Boshlash']]).resize(),
      );
      return;
    }
  }

  @On('text')
  async OnText(@Ctx() ctx: Scenes.WizardContext) {
    if (ctx.text === 'Boshlash') {
      await Kanallar(ctx);
    }
    if (ctx.text === "Asosiy Menyuga O'tish") {
      await ctx.reply(
        'Siz Asosiy Menyudasiz😊',
        Markup.keyboard([['Product']]).resize(),
      );
    }
    if (ctx.text === 'Product' || ctx.text === '/product') {
      let id = ctx.message?.from.id.toString();
      let checkUser = await this.prisma.users.findFirst({
        where: { userId: id },
      });

      if (!checkUser) {
        ctx.reply(
          "Xurmatlik foydalanuvchi sz Xali ro'yxatdan o'tmagansiz",
          Markup.keyboard([["Ro'yxatdan o'tish"]]).resize(),
        );
        return;
      }

      ctx.reply(
        'Siz Asosiy menyudasiz',
        Markup.keyboard([
          ['Hisobim', "hisob to'dirish"],
          ['Prezentatsiya yaratish'],
        ]).resize(),
      );
    }
    if (ctx.text === "Ro'yxatdan o'tish") {
      await ctx.scene.enter('create_product');
      return;
    }
    if (ctx.text === 'Userlar hisobini tuldirish') {
      await ctx.scene.enter('admin-panel-1');
      return;
    }
    if (ctx.text === 'Hisobim') {
      await ctx.scene.enter('prodGet_scince');
      return;
    }
    if (ctx.text === "hisob to'dirish") {
      await ctx.scene.enter('prodCreate_scince');
      return;
    }
    if (ctx.text === 'Prezentatsiya yaratish') {
      await ctx.scene.enter('create-presentation');
      return;
    }
    if (ctx.text === "Userlarni ko'rish") {
      await ctx.scene.enter('admin-get-user');
      return;
    }
    if (ctx.text === 'Reklama Yaratish') {
      await ctx.scene.enter('admin-create-reklama');
      return;
    }
  }

  @Action('check_subscribe')
  async verify(@Ctx() ctx: Scenes.WizardContext) {
    let obuna = await checkCHANNEL(ctx);
    if (obuna === true) {
      if (!ctx.scene) {
        await ctx.reply('❌ Xatolik: Sahna mavjud emas!');
      } else {
        let checkUser = await this.prisma.users.findFirst({
          where: { userId: String(ctx.from?.id) },
        });
        if (!checkUser) {
          await ctx.scene.enter('create_product');
          return;
        }
        ctx.reply(
          'Siz Asosiy menyudasiz',
          Markup.keyboard([
            ['Hisobim', "hisob to'dirish"],
            ['Prezentatsiya yaratish'],
          ]).resize(),
        );
      }
    }
  }
}

async function checkCHANNEL(ctx: Scenes.WizardContext) {
  const userId = ctx.from?.id;
  const CHANNEL_ID_1 = '@Saidkamol_Saymamutov';
  const member = await ctx.telegram.getChatMember(CHANNEL_ID_1, userId!);
  const statuses = ['member', 'administrator', 'creator'];
  if (statuses.includes(member.status)) {
    return true;
  } else {
    await Kanallar(ctx);
  }
}

async function Kanallar(ctx: any) {
  const CHANNEL_ID_1 = '@Saidkamol_Saymamutov';

  await ctx.reply(
    '❌ Siz hali kanallarga obuna bo‘lmadingiz. Iltimos, avval obuna bo‘ling!',
    Markup.inlineKeyboard([
      [
        Markup.button.url(
          '📢 1-kanalga obuna bo‘lish',
          `https://t.me/${CHANNEL_ID_1.replace('@', '')}`,
        ),
      ],
      [
        Markup.button.url(
          '📢 2-kanalga obuna bo‘lish',
          `https://www.instagram.com/saidkamolofficial?igsh=Mm16ajI4dXBvNWM3`,
        ),
      ],
      [Markup.button.callback('✅ Obuna bo‘ldim', 'check_subscribe')],
    ]),
  );
}
