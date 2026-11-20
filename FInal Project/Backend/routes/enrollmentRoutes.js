import express from 'express'
import {
    enrollCourse,
    unenrollCourse,
    getEnrolledCourses,
    updateProgress
} from '../controllers/enrollmentController.js'

const router = express.Router()
router.post('/enroll', enrollCourse)
router.post('/unenroll', unenrollCourse)
router.get('/:userId', getEnrolledCourses)
router.put('/progress', updateProgress)

export default router
