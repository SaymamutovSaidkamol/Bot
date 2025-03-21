import { Action, Ctx, On, Start, Update } from '@maks1ms/nestjs-telegraf';
import { verify } from 'crypto';
import { Context, Markup, Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { RegisterScene } from './scines/register.scince';
import { PrismaService } from 'src/prisma/prisma.service';

@Update()
export class BotUpdate {
  constructor(private readonly prisma: PrismaService) {}

  @Start()
  async start(ctx: Context) {
    await ctx.reply(
      'Assalomu Aleykum😊\nBotimizga Xush Kelibsiz!\nBotdan foydalanish uchun Iltimos Quyidagi amallarni bajaring',
      Markup.keyboard([['Boshlash']]).resize(),
    );
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
          Markup.keyboard([
            ["Ro'yxatdan o'tish"],
          ]).resize(),
        );
        return;
      }

      ctx.reply(
        'Productlar',
        Markup.keyboard([
          ['🟢Post🟢', '🔵Get🔵'],
          ['🟣Patch🟣', '🔴Delete🔴'],
        ]).resize(),
      );
    }
    if (ctx.text === "Ro'yxatdan o'tish") {
      await ctx.scene.enter('create_product');
      return
    }

    if (ctx.text === "🔵Get🔵") {
      await ctx.scene.enter('prodGet_scince');
      return
    }
    if (ctx.text === "🟢Post🟢") {
      await ctx.scene.enter('prodCreate_scince');
      return
    }
    if (ctx.text === "🟣Patch🟣") {
      await ctx.scene.enter('prodPatch_scince');
      return
    }
    if (ctx.text === "🔴Delete🔴") {
      await ctx.scene.enter('prodDelete_scince');
      return
    }
  }

  @Action('check_subscribe')
  async verify(@Ctx() ctx: Scenes.WizardContext) {
    let obuna = await checkCHANNEL(ctx);

    if (obuna === true) {
      if (!ctx.scene) {
        await ctx.reply('❌ Xatolik: Sahna mavjud emas!');
      } else {
        await ctx.scene.enter('create_product'); // Sahna nomi to‘g‘ri bo‘lishi kerak
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
