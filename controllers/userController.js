import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';


// Register User (Set - header + cookies.jwt) -> POST /api/users
// !Auth - application/json(Auto) For all
// name, email, password -> reponse {_id, name, email}
const registerUser = asyncHandler(async (req, res) => {

    // Destructuring the values from request object
    const { name, email, password } = req.body;

    // check whether if user already present
    const userExists = await User.findOne({email});
    if(userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // If no user Then create user
    const user = await User.create({
        name,
        email,
        password
    });

    if(user) {
        const token = generateToken(res, user._id);
        res.status(201).json({
            message: "User Created Successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        })
    } // !token in res like others
    
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }

    
});


// Auth User (Set - header + cookies.jwt) 
// POST /api/users/auth
// !Auth
// email, password -> reponse {_id, name, email}
const authUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({email});

    // Password match
    if(user && (await user.matchPasswords(password))) {

        const token = generateToken(res, user._id);
        res.status(201).json({
            message: "User Authenticated Successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
    
    res.status(200).json({message: "Auth User"});
});


// Logout User (Generate Token -> header + cookies.jwt, "") 
// POST /api/users/logout
// Auth || Private route
// response {message}
const logoutUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({message: "User Logged Out"});
});


// Get User Profile 
// GET /api/users/profile
// Auth + protected || cookies.jwt
// _id -> response {_id, name, email, ...}
const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.body._id).select("-password");
    res.status(200).json(user);
});


// Update User Profile - User same or Unique Password
// PUT /api/users/profile
// Auth + protected || cookies.jwt
// name, email, password -> response {_id, name, email, message}
const updateUserProfile = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;

        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "User profile updated successfully",
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        },);
    }  
    else {
        res.status(404);
        throw new Error("User not found");
    }
    
});


export { 
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile 
};