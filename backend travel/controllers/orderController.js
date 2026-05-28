const { Order, Passenger, Tour, Variant, User } = require('../models');

exports.createOrder = async (req, res, next) => {
    try {
        const { userInfo, orderByUser, adultCount, childCount, guests, Total, userNote, selectedPayment } = req.body;

        const order = await Order.create({
            user_id: req.user.id,
            tour_id: orderByUser.productId,
            variant_id: orderByUser.variantId || null,
            contact_name: userInfo.name,
            contact_email: userInfo.email,
            contact_phone: userInfo.phone,
            contact_address: userInfo.address || '',
            adult_count: adultCount,
            child_count: childCount,
            total_price: Total,
            payment_method: typeof selectedPayment === 'object' ? selectedPayment.text : selectedPayment,
            special_note: userNote?.takeNote || '',
            status: 'pending'
        });

        if (guests && guests.length > 0) {
            const passengerData = guests.map((g, i) => ({
                order_id: order.id,
                full_name: g.fullName,
                sex: typeof g.sex === 'object' ? g.sex?.label : g.sex,
                birthday: g.birthday,
                type: i < adultCount ? 'adult' : 'child'
            }));
            await Passenger.bulkCreate(passengerData);
        }

        const fullOrder = await Order.findByPk(order.id, {
            include: [
                { model: Tour, as: 'tour', attributes: ['id', 'title', 'thumbnail', 'slug'] },
                { model: Variant, as: 'variant', attributes: ['id', 'start_date', 'end_date', 'final_price'] },
                { model: Passenger, as: 'passengers' }
            ]
        });

        res.status(201).json({
            message: "Đặt tour thành công",
            order: fullOrder,
            orderByUser,
            guests,
            Total
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id },
            include: [
                { model: Tour, as: 'tour', attributes: ['id', 'title', 'thumbnail', 'slug', 'location'] },
                { model: Variant, as: 'variant', attributes: ['id', 'start_date', 'end_date', 'final_price'] },
                { model: Passenger, as: 'passengers' }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};
