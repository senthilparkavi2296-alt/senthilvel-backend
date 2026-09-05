const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Force the cloud database URL if the Render environment is misconfigured
    let uri = process.env.MONGO_URI;
    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
      console.log('Bypassing local/missing URI and forcing cloud database...');
      uri = 'mongodb+srv://senthilparkavi2209_db_user:BfS3COKEfH81wnM5@cluster0.nomyegh.mongodb.net/senthilvel-cms?retryWrites=true&w=majority&appName=Cluster0';
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
