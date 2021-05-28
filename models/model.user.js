const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
       
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
            isActive: {
                type: Boolean,
                default: false
              },
       
     
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('users', UserSchema);
