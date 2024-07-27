import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ZodValidationFilter } from "./common/exceptions/zod-validation.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    patchNestJsSwagger();

    const config = new DocumentBuilder()
        .setTitle("Tech Gear API")
        .setDescription("Tech Gear API Description")
        .setVersion("0.2")
        .addOAuth2(
            {
                type: "oauth2",
                flows: {
                    implicit: {
                        authorizationUrl: `${configService.get(
                            "AUTH0_DOMAIN",
                        )}authorize?audience=${configService.get("AUTH0_AUDIENCE")}`,
                        tokenUrl: configService.get("AUTH0_AUDIENCE"),
                        scopes: {
                            openid: "Open Id",
                            profile: "Profile",
                            email: "E-mail",
                        },
                    },
                },
                scheme: "bearer",
                bearerFormat: "JWT",
                in: "header",
            },
            "Auth0",
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);

    app.enableCors();
    app.useGlobalFilters(new ZodValidationFilter());
    SwaggerModule.setup("api", app, document, {
        swaggerOptions: {
            oauth2RedirectUrl: "http://localhost:3000/api/oauth2-redirect.html",
            initOAuth: {
                clientId: configService.get("AUTH0_CLIENT_ID"),
            },
        },
    });
    await app.listen(3000);
}
bootstrap();
