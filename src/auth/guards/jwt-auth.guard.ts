import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    // @ts-expect-error dont know the types
    // eslint-disable-next-line
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
