import User from '../models/User.js'

export const registerUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).json(newUser)
    }

    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email, password })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        res.status(200).json(user)
    }

    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
