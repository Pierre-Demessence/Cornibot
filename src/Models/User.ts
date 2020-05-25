import { getModelForClass, prop } from "@typegoose/typegoose";

import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class User extends TimeStamps {
    @prop()
    public _id!: string;
    @prop({ default: 0 })
    nbMessages!: number;
    @prop({ default: 0 })
    karmaReceived!: number;
    @prop({ default: 0 })
    karmaGiven!: number;
}

export default getModelForClass(User);
