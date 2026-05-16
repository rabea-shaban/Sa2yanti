import mongoose from 'mongoose';

const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: 'Sa2yanti',
    });

    console.log('Database Connected');
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
