const mongoose = require('mongoose');

class DatabaseConnector{
  static connect = async () => {
    try {
      const mongoURI = process.env.DATABASE_URL;
      await mongoose.connect(mongoURI)
      console.log('Database is connected successfully');
    }
    catch(error){
      console.log(error);
    }
  }
}

module.exports = DatabaseConnector;
