const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sa2yanti')
  .then(async () => {
    console.log('Connected to DB');
    
    // We can define a minimal User model to query
    const UserSchema = new mongoose.Schema({
      name: String,
      role: String,
      location: String,
      latitude: Number,
      longitude: Number,
      locationGeo: Object,
      services: Array
    }, { collection: 'users' });
    
    const User = mongoose.model('User', UserSchema);
    
    const techs = await User.find({ role: 'technician' });
    console.log(`Found ${techs.length} technicians:`);
    techs.forEach(t => {
      console.log(`- Name: ${t.name}`);
      console.log(`  Location: ${t.location}`);
      console.log(`  Coordinates: Lat ${t.latitude}, Lng ${t.longitude}`);
      console.log(`  LocationGeo:`, JSON.stringify(t.locationGeo));
      console.log(`  Services Count: ${t.services ? t.services.length : 0}`);
    });
    
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
