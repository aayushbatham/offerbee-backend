import {IsDate, IsNumber, IsString, IsBoolean, IsOptional, IsEnum, IsArray, Min, Max} from "class-validator";
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
    @IsOptional()
    @IsEnum(['male', 'female', 'other'])
    gender?: 'male' | 'female' | 'other';

    @IsOptional()
    @IsArray()
    @Min(0, { each: true })
    @Max(150, { each: true })
    ageRange?: [number, number];

    @IsOptional()
    @IsEnum(['new', 'old'])
    userType?: 'new' | 'old';

}