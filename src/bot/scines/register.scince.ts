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

@Wizard('create_product')
export class RegisterScene {
  constructor(private readonly prisma: PrismaService) {}
  @WizardStep(1)
  async getName(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    await ctx.reply('2-Chi Qadam!', {
      reply_markup: { remove_keyboard: true },
    });
    await ctx.reply('👤Iltimos Ismingizni kriting...');
    ctx.wizard.next();
  }

  @WizardStep(2)
  async getPrice(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    date.lastName = message.text;

    if (date.lastName === "/start") {
      ctx.scene.leave();
      return
    }

    await ctx.reply('👤Familiyangizni kriting...');
    ctx.wizard.next();
  }

  @WizardStep(3)
  async getCount(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    date.firtsName = message.text;

    if (date.firtsName === "/start") {
      ctx.scene.leave();
      return
    }
    await ctx.reply(
      '📞Telefon raqamingizni kriting...',
      Markup.keyboard([
        Markup.button.contactRequest('📱Telefon raqamni ulashish📱'),
      ]).resize(),
    );
    ctx.wizard.next();
  }

  @WizardStep(4)
  async getAge(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    if (message.contact) {
      date.phone = message.contact.phone_number;
    } else {
      date.phone = message.text;
    }

    await ctx.reply(
      'Hammasi ok bo‘lsa, ma’lumotlarni saqlang:',
      Markup.keyboard([['✅ Saqlash'], ['❌ Bekor qilish']]).resize(),
    );
    ctx.wizard.next();
  }

  @WizardStep(5)
  async saveData(@Ctx() ctx: Scenes.WizardContext, @Message() message: any) {
    date.userId = message.from.id.toString();

    if (message.text === '✅ Saqlash') {
      try {
        let checkUser = await this.prisma.users.findFirst({
          where: { userId: date.userId },
        });

        if (checkUser) {
          await ctx.reply(
            `Xurmatli ${checkUser.lastName}, siz allaqachon ro‘yxatdan o‘tib bo‘lgansiz!`,
            Markup.keyboard([["Asosiy Menyuga O'tish"]]).resize(),
          );
          return ctx.scene.leave();
        }

        await this.prisma.users.create({
          data: {
            userId: date.userId,
            firstName: date.firtsName,
            lastName: date.lastName,
            phone: date.phone,
          },
        });

        await ctx.reply('✅ Ma’lumotlar saqlandi!', {
          reply_markup: { remove_keyboard: true },
        });
        ctx.scene.leave();
      } catch (error) {
        console.error(error);
        await ctx.reply('❌ Xatolik yuz berdi, qayta urinib ko‘ring.', {
          reply_markup: { remove_keyboard: true },
        });
      }
    } else {
      await ctx.reply('❌ Saqlash bekor qilindi.', {
        reply_markup: { remove_keyboard: true },
      });
    }
    ctx.scene.leave();
  }
}
