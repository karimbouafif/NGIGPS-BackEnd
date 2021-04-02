const mongoose = require('mongoose');
const missionTypes = require('../enums/mission.types');
const Schema = mongoose.Schema;
const missionSchema = mongoose.Schema(
  {
    title: String,
    dateStart: Date,
    dateEnd: Date,
    description: String,
    archived: {
      type: Boolean,
      required: false
    },
    type: {
      type: String,
      enum: missionTypes
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

