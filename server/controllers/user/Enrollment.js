const { Enrollment } = require('./../../models');
const nodemailer = require('nodemailer');

exports.postEnrollment = async (req, res) => {
    try {
        const { name, email, phone, course } = req.body;

        const exist = await Enrollment.findOne({ email });
        if (exist) {
            return res.status(409).json({ message: 'User Already Applied' });
        } 

        const enrollment = await Enrollment.create({ name, email, phone, course });

        // After successful enrollment, send an email
        // Setup transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS  // Your email password or App Password
            }
        });

        // Email options
        const mailOptions = {
            from: '"Justpass Team" <your-email@gmail.com>', // Sender address
            to: email, // Recipient email
            subject: 'Enrollment Confirmation - Justpass',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">Hello ${name},</h2>
                    <p style="font-size: 16px; color: #555;">
                        Thank you for enrolling in <strong>${course}</strong> with Justpass!
                    </p>
                    <p style="font-size: 16px; color: #555;">
                        Our team will get in touch with you within <strong>24 hours</strong> to guide you through the next steps.
                    </p>
                    <p style="font-size: 16px; color: #555;">If you have any questions, feel free to reply to this email.</p>
                    <br />
                    <p style="font-size: 16px; color: #555;">Best regards,<br />The Justpass Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Enrollment request submitted successfully', enrollment });

    } catch (error) {
        console.error('Error in postEnrollment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getEnrollment = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({});
        res.status(200).json(enrollments);
    } catch (error) {
        console.error('Error in getEnrollment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const enrollment = await Enrollment.findByIdAndDelete(id);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json({ message: 'Enrollment deleted successfully', enrollment }); 
    } catch (error) {
        console.error('Error in deleteEnrollment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.updateEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, course } = req.body;
        const enrollment = await Enrollment.findByIdAndUpdate(id, { name, email, phone, course }, { new: true });
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json({ message: 'Enrollment updated successfully', enrollment });
    } catch (error) {
        console.error('Error in updateEnrollment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getEnrollmentByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const enrollment = await Enrollment.find({ email });
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json(enrollment);
    } catch (error) {
        console.error('Error in getEnrollmentByEmail:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}