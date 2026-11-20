import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        instructorName: {
            type: String,
            required: false
        },
        category: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: false,
            default: '8 Weeks'
        },
        price: {
            type: Number,
            required: false,
            default: 0
        },
        modules :{
            type: Number,
            required: true,
            default: 5
        }
    },
    { timestamps: true }
)

const Course = mongoose.model('Course', courseSchema)
export default Course