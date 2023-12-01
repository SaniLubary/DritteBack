import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { networkInterfaces } from 'os';
import { Logger } from '@nestjs/common';
import { SendRemindersService } from './cron/send-reminders.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const sendRemindersServiceCron = app.get(SendRemindersService);

  sendRemindersServiceCron.sendRetrospective();
  sendRemindersServiceCron.sendNewEntryReminder();

  await app.listen(3000);
  new Logger('Network').log(networkInterfaces());
  new Logger('Network access address').log(
    networkInterfaces().en0
      ? networkInterfaces().en0[1].address
      : networkInterfaces()?.['Wi-Fi']
      ? networkInterfaces()['Wi-Fi'][1].address
      : networkInterfaces(),
  );
}
bootstrap();
