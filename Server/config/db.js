import mongoose from 'mongoose';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URL)
    console.log('Database connected')
}

export default connectDB;