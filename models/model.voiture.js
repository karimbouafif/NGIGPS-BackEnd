const mongoose = require('mongoose');
const { voitureStateTypes, voitureDisponibilityTypes, voitureTypes } = require('../enums/voiture.types');
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
    type: {
      type: String,
      enum: voitureTypes,
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
const event = mongoose.model('voiture', voiturechema);

module.exports = event;
