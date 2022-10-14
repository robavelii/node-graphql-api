import { getModelForClass, prop, pre } from "@typegoose/typegoose"
import bcrypt from 'bcrypt';
import { Field, ObjectType, InputType } from "type-graphql"
import {IsEmail, MinLength, MaxLength} from 'class-validator';

@pre<User>('save', async function(){
    // check the password is being modified
    if(!this.isModified('password')){
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hashSync(this.password, salt);

    this.password = hash;
} )

@ObjectType()
export class User{
    @Field(()=> String)
    _id: string;

    @Field(()=> String)
    @prop({required: true})
    name: string;

    @Field(()=> String)
    @prop({required: true})
    email: string;


    @prop({required: true})
    password: string;
}

export const UserModel = getModelForClass(User);

@InputType()
export class CreateUserInput{
    @Field(()=> String)
    name: string;
    
    @IsEmail()
    @Field(()=> String)
    email: string;

    @MinLength(6, {
        message: "Password must be at least 6 characters long"
    })
   
    @MaxLength(50, {
        message: "Password must not be longer than 50 characters"
    })
    @Field(()=> String)
    password: string;
    
}