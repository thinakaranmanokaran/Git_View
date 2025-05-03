exports.registerRequest = (req, res, next) => {
    const { name, email, phoneNo, password } = req.body;

    if (!name || !email || !phoneNo || !password ) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    next();
};

exports.signinRequest = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    next();
};   