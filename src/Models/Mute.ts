import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";

import { User } from "./User";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Mute extends TimeStamps {
    @prop({ required: true, ref: User, refType: mongoose.Schema.Types.String })
    user!: Ref<User>;
    @prop({ required: true, ref: User, refType: mongoose.Schema.Types.String })
    author!: Ref<User>;
    @prop()
    dateEnd!: Date;
    @prop()
    reason!: string;
    @prop()
    channel!: string;
}

export default getModelForClass(Mute);
