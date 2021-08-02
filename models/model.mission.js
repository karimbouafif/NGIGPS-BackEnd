const mongoose = require('mongoose');
const missionTypes = require('../enums/mission.types');
const Schema = mongoose.Schema;
const missionSchema = mongoose.Schema(
  {
    taskTitle: String,
    start_adress:String,
    end_adress:String,
    taskStatus:String,
    taskTime: Date,
    email:Array,
    taskContent: String,
    archived: {
      type: Boolean,
      required: false
    },
    priorityIs: Number,
  
    
    isCompleted: {
      type: Boolean,
      required: false
    },
    isUpdated: {
      type: Boolean,
      required: false
    },
    url: String,
    image: {
      type: String,
      required: false
    },
    user: { type: Schema.Types.ObjectId, ref: 'users' }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('mission', missionSchema);

