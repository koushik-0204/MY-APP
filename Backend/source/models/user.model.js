import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            monlength: 1,
            maxlength: 30
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 50,
        },
        email: {
            type:String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,

        }
    },
    {
        timestamps: true,
    }
)

//before saving password we need to hash it
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//compare password method
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
export const User = mongoose.model("User",userSchema);

export default User;