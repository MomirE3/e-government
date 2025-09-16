import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // koristi @prisma/client, ne generated

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close().catch((err) => {
        console.error(
          'Error during app shutdown Zavod Za Statistiku Service',
          err,
        );
      });
    });
  }
}
