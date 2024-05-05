import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/dummy-paytm-db`)
        console.log(`\nMongoDB Connected!! \nDB HOST ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`MongoDB Connection FAILED!!\n ERROR: ${error}`)
        process.exit(1)
    }
}

export default connectDB