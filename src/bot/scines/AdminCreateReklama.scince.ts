import { Ctx, Message, Wizard, WizardStep } from '@maks1ms/nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes, Telegraf } from 'telegraf';

@Wizard('admin-create-reklama')
export class AdminCreateReklama {
    constructor(private readonly prisma: PrismaService, private readonly bot: Telegraf) {}

    @WizardStep(1)
    async Reklama(@Ctx() ctx: Scenes.WizardContext, @Message() msg: any) {
      await ctx.reply("Reklamangizni yuboring...")

    ctx.wizard.next();
    }

  @WizardStep(2)
  async getName(@Ctx() ctx: Scenes.WizardContext, @Message() msg: any) {

    const reklamaText = msg.text || msg.caption || "📢 Reklama";

    try {
      const users = await this.prisma.users.findMany();

      for (const user of users) {
        try {
          await this.bot.telegram.sendMessage(user.userId, reklamaText);
        } catch (error) {
          console.error(`Foydalanuvchiga xabar yuborishda xatolik: ${user.userId}`, error);
        }
      }

      await ctx.reply("✅ Reklama muvaffaqiyatli yuborildi!");
    } catch (error) {
      console.error("❌ Xatolik yuz berdi:", error);
      await ctx.reply("❌ Reklama yuborishda xatolik yuz berdi.");
    }

    ctx.scene.leave();
  }
}
