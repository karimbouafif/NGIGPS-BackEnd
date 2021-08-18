const mongoose = require('mongoose');
const missionTypes = require('../enums/mission.types');
const Schema = mongoose.Schema;
const reclamationSchema = mongoose.Schema(
  {
    titre: String,
    description:String,
    cause:String,
   
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    mission: { type: Schema.Types.ObjectId, ref: 'mission' },
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('reclamtion', reclamationSchema);

