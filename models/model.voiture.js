const mongoose = require('mongoose');
const { voitureStateTypes, voitureDisponibilityTypes } = require('../enums/voiture.types');
const Schema = mongoose.Schema;
const voiturechema = mongoose.Schema(
  {
    title: String,
    matricule: String,
    etat: {
      type: String,
      enum: voitureStateTypes,
      required: false,
    },
    disponibilite: {
      type: String,
      enum: voitureDisponibilityTypes,
      required: false,
    },
    description: String,
    archived: {
      type: Boolean,
      required: false,
    },

    image: {
      type: String,
      required: false,
    },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    mission: { type: Schema.Types.ObjectId, ref: 'mission' },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('voiture', voiturechema );

