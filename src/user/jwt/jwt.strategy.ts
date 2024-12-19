import { Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly jwtService: JwtService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "SJkrjfk1jk4rfmekmkm23",
        });
    }

    async validate(payload: any){
        return {userId: payload.sub, email: payload.email};
    }
}
