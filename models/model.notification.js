const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
    {
       
        user: {
            type : String,
            },
          read: {
              type: Boolean,
              default: false
          },
          body: {
              type: String,
              required: true
          },
          object: {
              type: String
          },
          sender: {
              type: String
          },
          target: {
              type: String,
          }
   
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('notification', NotificationSchema);
