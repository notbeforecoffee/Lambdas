import mongoose from 'mongoose';

const connectDB = async () => {
  const dbURI = process.env.MONGO_URI;

  try {
    if (dbURI) {
      await mongoose.connect(dbURI);
      console.log('MongoDB Connected...');
    } else {
      console.error('No MongoDB URI found');
      process.exit(1);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
