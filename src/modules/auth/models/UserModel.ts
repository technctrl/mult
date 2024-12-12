import { Schema, model } from 'mongoose';
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export interface IUserModel {
  _id: ObjectId,
  firstname: string;
  lastname: string;
  email: string;
  phone : string;
  birthday? : Date;
  sex? : string;
  password: string;
  role: number;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiration?: string;
  email_verified: boolean;
  ip_address?: string;
  last_logged?: Date;
  status: boolean;
  token?: string;
  created_at?: Date;
  updated_at?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserModel>({

    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    birthday: { type: Date, required: false },
    sex: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: Number, required: true },
    avatar: { type: String, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordTokenExpiration: { type: String, required: false },
    email_verified: { type: Boolean, required: false, default : false },
    ip_address: { type: String, required: false },
    last_logged: { type: Date, required: false },
    status: { type: Boolean, required: false, default : true },
    created_at: { type: Date, required: false, default: new Date() },
    updated_at: { type: Date, required: false },
},
  { collection: "users" }
  );

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};


const UserModel = model<IUserModel>('users', userSchema);


export default UserModel
