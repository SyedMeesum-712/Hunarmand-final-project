import Course from '../models/Courses.js'

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'name email')
        res.status(200).json(courses)
    }

    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name email')
        if (!course) return res.status(404).json({ message: 'Course not found' })
        res.status(200).json(course);
    }

    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createCourse = async (req, res) => {
    try {
        const newCourse = await Course.create(req.body)
        res.status(201).json(newCourse);
    }

    catch (error) {
        res.status(400).json({ message: error.message })
    }
};

export const updateCourse = async (req, res) => {
    try {
        const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updated) {
            return res.status(404).json({ message: 'Course not found' })
        }
        res.status(200).json(updated)
    }

    catch (error) {
        res.status(400).json({ message: error.message })

    }
};

export const deleteCourse = async (req, res) => {
    try {
        const deleted = await Course.findByIdAndDelete(req.params.id)
        if (!deleted) {
            return res.status(404).json({ message: 'Course not found' })
        }
        res.status(200).json({ message: 'Course deleted successfully' })
    }

    catch (error) {
        res.status(500).json({ message: error.message })
    }
};