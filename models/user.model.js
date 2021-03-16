const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        

        local: {
            username: {
                type: String,
                index: true
            },
            fullname: {
                type: String,
            },
            email: {
                type: String,
                lowercase: true
            },
            password: {
                type: String,
            },
            number: {
                type: Number,
                //unique: true
            },
            avatar: {
                type: String
            },
            role:{
                type: String
            },
        },
       
    
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('users', UserSchema);
