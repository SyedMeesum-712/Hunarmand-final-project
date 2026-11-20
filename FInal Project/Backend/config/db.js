import mongoose from "mongoose";

const connectDB = async () => {
    try
    {
        await mongoose.connect('mongodb://localhost:27017/myDatabase');
        console.log('MongoDB Connected');
    }
    catch (error)
    {
        console.error('MongoDB Connection Error:', error.message);
    }
}

export default connectDB