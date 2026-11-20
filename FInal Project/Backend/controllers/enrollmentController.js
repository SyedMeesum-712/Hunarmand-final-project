import User from '../models/User.js'
import Course from '../models/Courses.js'

export const enrollCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User not found' })

        const course = await Course.findById(courseId)
        if (!course) return res.status(404).json({ message: 'Course not found' })

        const alreadyEnrolled = user.enrolledCourses.find(
            (e) => e.course.toString() === courseId
        )
        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'Already enrolled in this course' })
        }

        user.enrolledCourses.push({
            course: courseId,
            dateJoining: new Date().toISOString().split('T')[0],
            completedModules: 0
        })

        await user.save()
        const updated = await User.findById(userId).populate({
            path: 'enrolledCourses.course',
            populate: { path: 'instructor', select: 'name email' }
        })
        res.status(200).json(updated.enrolledCourses)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const unenrollCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User not found' })

        user.enrolledCourses = user.enrolledCourses.filter(
            (e) => e.course.toString() !== courseId
        )

        await user.save()
        const updated = await User.findById(userId).populate({
            path: 'enrolledCourses.course',
            populate: { path: 'instructor', select: 'name email' }
        })
        res.status(200).json(updated.enrolledCourses)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getEnrolledCourses = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({
            path: 'enrolledCourses.course',
            populate: { path: 'instructor', select: 'name email' }
        })
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.status(200).json(user.enrolledCourses)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateProgress = async (req, res) => {
    try {
        const { userId, courseId, completedModules } = req.body
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User not found' })

        const enrollment = user.enrolledCourses.find(
            (e) => e.course.toString() === courseId
        )
        if (!enrollment) {
            return res.status(404).json({ message: 'Not enrolled in this course' })
        }

        enrollment.completedModules = completedModules
        await user.save()

        const updated = await User.findById(userId).populate({
            path: 'enrolledCourses.course',
            populate: { path: 'instructor', select: 'name email' }
        })
        res.status(200).json(updated.enrolledCourses)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
