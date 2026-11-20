import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
             unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['student', 'instructor'],
            default: 'student'
        },
        enrolledCourses: [{
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            },
            dateJoining: {
                type: String
            },
            completedModules: {
                type: Number,
                default: 0
            }
        }]
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User
