import dotenv from 'dotenv';
import mongoose, { Connection } from 'mongoose';

dotenv.config();

class Database {
  private connection: Connection | null;

  constructor() {
    this.connection = null;
  }
  //Veritabanı bağlantısını sağlar
  async connect(): Promise<Connection> {
    if (!this.connection) {
      const uri = process.env.MONGODB_URI as string;
      const connection = await mongoose.connect(uri);
      this.connection = connection.connection; 
      console.log('MongoDB connected!');
    }

    return this.connection;
  }
}

export default new Database();
