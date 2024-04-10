import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ZodValidationFilter } from "./common/exceptions/zod-validation.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalFilters(new ZodValidationFilter());
    await app.listen(3000);
}
bootstrap();
