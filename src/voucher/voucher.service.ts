import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Voucher} from "./voucher.schema";
import {Model} from "mongoose";
import {createVoucher} from "../dto/createVoucher.dto";
import { UseVoucherDto } from 'src/dto/useVoucher.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class VoucherService{
    constructor(@InjectModel(Voucher.name) private readonly voucherModel: Model<Voucher>) {}

    // create voucher
    async createVoucher(createVoucher : createVoucher, userId: string): Promise<Voucher> {
        const newVoucher = new this.voucherModel({
            // spread the value of createVoucher dto into the new document
            ...createVoucher,
            createdBy: userId
        });
        // save the new voucher to the database
        return await newVoucher.save();
    }

    // get all voucher by user
    async getAllVoucherByUser(userId: string): Promise<Voucher[]> {
        return this.voucherModel.find({ 
            createdBy: userId 
        })
        .sort({ createdAt: -1 }) 
        .exec();
    }

    // apply voucher (user ke liye)
    async applyVoucher(useVoucherDto: UseVoucherDto, userId: string): Promise<any> {
        const voucher = await this.voucherModel.findOne({
            voucherCode: useVoucherDto.voucherCode 
        });

        if (!voucher) {
            throw new NotFoundException("Voucher not found");
        }

        if (!voucher.isActive) {
            throw new BadRequestException("Voucher is not active");
        }

        if (new Date() > new Date(voucher.expiryDate)) {
            throw new BadRequestException("Voucher has expired");
        }

        if (new Date() < new Date(voucher.activationDate)) {
            throw new BadRequestException("Voucher is not yet active");
        }

        if (voucher.totalUsageCount >= voucher.usageLimit) {
            throw new BadRequestException("Voucher usage limit reached");
        }
        if(!voucher.reusable){
            if (voucher.usedBy.includes(userId)) {
                throw new BadRequestException("Voucher already used by this user");
            }
        }

        if (voucher.minCartValue && useVoucherDto.cartValue < voucher.minCartValue) {
            throw new BadRequestException(`Cart value must be at least ${voucher.minCartValue}`);
        }

        // calculate discount
        let discountAmount = 0;
        if (voucher.discountType === 'percentage') {
            discountAmount = (useVoucherDto.cartValue * voucher.discountValue) / 100;
            if (voucher.maxDiscount) {
                discountAmount = Math.min(discountAmount, voucher.maxDiscount);
            }
        } else {
            discountAmount = voucher.discountValue;
        }

        // return value after applying voucher
        return {
            voucher: voucher,
            discountAmount: discountAmount,
            finalPrice: useVoucherDto.cartValue - discountAmount,
            isValid: true
        };
    }

    // checkout ke time call krna he 
    async useVoucher(voucherCode: string, userId: string, cartValue: number): Promise<any> {
        // First apply the voucher to validate it
        const voucherApplication = await this.applyVoucher(
            { voucherCode, cartValue },
            userId
        );

        const updatedVoucher = await this.voucherModel.findOneAndUpdate(
            { voucherCode: voucherCode },
            {
                $inc: { totalUsageCount: 1 },
                $push: { usedBy: userId }
            },
            { new: true }
        );

        if (!updatedVoucher) {
            throw new BadRequestException("Failed to update voucher");
        }

        return {
            ...voucherApplication,
            voucher: updatedVoucher,
            used: true
        };
    }

    async deleteVoucher(id:string):Promise<void>{
        return this.voucherModel.findOneAndDelete({_id:id});
    }
}

