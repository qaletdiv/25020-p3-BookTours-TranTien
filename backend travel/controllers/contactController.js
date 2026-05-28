const { Contact } = require('../models');

exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

exports.createContact = async (req, res, next) => {
  try {
    const { name, phone, email, tour, description } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ họ tên, điện thoại và email" });
    }
    const contact = await Contact.create({ name, phone, email, tour_interest: tour || null, description: description || null });
    res.status(201).json({ message: "Gửi yêu cầu tư vấn thành công", contact });
  } catch (error) {
    next(error);
  }
};
