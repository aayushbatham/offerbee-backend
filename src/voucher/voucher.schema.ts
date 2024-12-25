import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


@Schema()
export class Voucher extends Document {

    @Prop({ required: true})
    name: string;

    @Prop({required: true, unique: true})
    voucherCode: string;

    @Prop({required: true, enum:['percentage','fixed']})
    discountType: string;

    @Prop({required:true})
    discountValue: number;

    @Prop({default:null})
    minCartValue: number;

    @Prop({default:null})
    maxDiscount: number;

    @Prop({required:true})
    activationDate: Date;

    @Prop({required:true})
    expiryDate: Date;

    @Prop({default:1})
    usageLimit: number;

    @Prop({ type: Object, default: null })
    conditions: any; // e.g., product restrictions, category restrictions, etc.

    @Prop({default:true})
    isActive: boolean;

    @Prop({default:0})
    totalUsageCount: number;

    @Prop({
        type: [String], // Assuming user IDs are strings
        default: [],
        description: 'Array of user IDs who have used this voucher'
    })
    usedBy: string[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    createdBy: string;

    @Prop({default: false})
    reusable: boolean;

}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);