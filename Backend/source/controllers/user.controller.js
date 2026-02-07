import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if(!username || !password || !email){
            return res.status(400).json({message:"All fields are important!"})
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if(existing){
            return res.status(400).json({ message: "user already exists!" });
        }

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            loggedIn: false,
        });

        res.status(201).json({
            message: "User registered",
            user: { id:user._id, email: user.email, username: user.username }
        });
        

} catch(error){
    res.status(500).json({ message: "Internal server error", error: error.message });
}
};

const loginUser = async (req, res) => {
    try{
        //checking if user exists
        const { email, password } =req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if(!user) return res.status(400).json({
            message: "User not found!"
        });

        //compare password
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({
            message: "Invalid credentials!"
        });

        res.status(200).json({
            message: "user logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });
    } catch (error){
        res.status(500).json({
            message: "Internal server error", error: error.message
        })
    }
}

export {
    registerUser,
    loginUser
}