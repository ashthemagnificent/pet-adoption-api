const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  ratings: [Number],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
});

// Pet Schema
const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  age: Number,
  gender: String,
  sterilized: Boolean,
  city: String,
  adoptionStatus: { type: String, enum: ['Available', 'Adopted'], default: 'Available' },
});

// Adoption Request Schema
const adoptionRequestSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

// Care Tips Schema
const careTipSchema = new mongoose.Schema({
  type: { type: String, required: true },
  tips: { type: [String], required: true },
});

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
// Veterinarian Schema
const veterinarianSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    location: {
      type: { type: String, default: 'Point' }, // GeoJSON Point
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
  });
  
  veterinarianSchema.index({ location: '2dsphere' }); // Enable geospatial indexing
  
  const Veterinarian = mongoose.model('Veterinarian', veterinarianSchema);
  

const User = mongoose.model('User', userSchema);
const Pet = mongoose.model('Pet', petSchema);
const AdoptionRequest = mongoose.model('AdoptionRequest', adoptionRequestSchema);
const CareTip = mongoose.model('CareTip', careTipSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { User, Pet, AdoptionRequest, CareTip, Message, Veterinarian };
