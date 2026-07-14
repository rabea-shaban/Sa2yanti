import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: 'sy2antek',
    },
    logo: {
      type: String,
      default: '',
    },
    supportEmail: {
      type: String,
      default: 'support@sy2antek.com',
    },
    phone: {
      type: String,
      default: '+123456789',
    },
    socialMedia: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    address: {
      type: String,
      default: 'العدوة، المنيا، مصر',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
