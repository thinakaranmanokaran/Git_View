exports.EnrollmentRequest = (req, res, next) => {
    const { name, email, phone, course } = req.body;

    if (!name || !email || !phone || !course) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string' || typeof course !== 'string') {
        return res.status(400).json({ message: "Invalid data type" });
    }

    next();
};