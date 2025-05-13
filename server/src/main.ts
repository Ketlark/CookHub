import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestFastifyApplication, FastifyAdapter } from "@nestjs/platform-fastify";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  //app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(3000, "0.0.0.0");
}

bootstrap();
