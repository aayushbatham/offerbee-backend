import {IsDate, IsNumber, IsString, IsBoolean} from "class-validator";
import {Type} from "class-transformer";

export class createVoucher{
    @IsString()
    name: string;
    @IsString()
    voucherCode: string;
    @IsString()
    discountType: string;
    @IsNumber()
    discountValue: number;
    @IsNumber()
    minCartValue?: number;
    @IsNumber()
    maxDiscount?: number;
    @IsDate()
    @Type(()=>Date)
    activationDate: Date;
    @IsDate()
    @Type(()=>Date)
    expiryDate: Date;
    @IsNumber()
    usageLimit?: number;
    @IsBoolean()
    reusable: boolean;
}