exports.ContactRequest = async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    next();
}