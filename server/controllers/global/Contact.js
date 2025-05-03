const { Contact } = require('./../../models');

exports.postContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contact = await Contact.create({ name, email, message });
        res.status(201).json({ message: 'Contact request submitted successfully', contact });
    } catch (error) {
        console.error('Error in postContact:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getContact = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error in getContact:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully', contact });
    } catch (error) {
        console.error('Error in deleteContact:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, message } = req.body;
        const contact = await Contact.findByIdAndUpdate(id, { name, email, message }, { new: true });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact updated successfully', contact });
    } catch (error) {
        console.error('Error in updateContact:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getContactByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const contact = await Contact.find({ email });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {   
        console.error('Error in getContactById:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}