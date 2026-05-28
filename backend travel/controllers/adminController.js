const { User, Profile, Order, Tour, Category, Variant, TourImage, Passenger } = require('../models');
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            include: [{ model: Profile, as: 'profile' }],
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Role không hợp lệ" });
        }
        const [updated] = await User.update({ role }, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        const user = await User.findByPk(req.params.id);
        res.json({ message: "Cập nhật quyền thành công", user });
    } catch (error) {
        next(error);
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id', 'username', 'email', 'phone'] },
                { model: Tour, as: 'tour', attributes: ['id', 'title', 'thumbnail', 'slug'] },
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

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }
        const [updated] = await Order.update({ status }, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
                { model: Tour, as: 'tour', attributes: ['id', 'title'] }
            ]
        });
        res.json({ message: "Cập nhật trạng thái thành công", order });
    } catch (error) {
        next(error);
    }
};

exports.getStats = async (req, res, next) => {
    try {
        const [totalUsers, totalOrders, totalTours] = await Promise.all([
            User.count(),
            Order.count(),
            Tour.count()
        ]);

        const revenueResult = await Order.findOne({
            attributes: [[require('sequelize').fn('SUM', require('sequelize').col('total_price')), 'total']],
            where: { status: 'confirmed' },
            raw: true
        });

        res.json({
            totalUsers,
            totalOrders,
            totalTours,
            totalRevenue: parseInt(revenueResult?.total || 0)
        });
    } catch (error) {
        next(error);
    }
};

const tourFullInclude = [
    { model: Category, as: 'category' },
    { model: Variant, as: 'variants' },
    { model: TourImage, as: 'images' }
];

exports.createTour = async (req, res, next) => {
    try {
        const { variants, images, ...tourData } = req.body;
        const tour = await Tour.create(tourData);

        if (variants?.length > 0) {
            const variantRows = variants.map(v => ({
                start_date: v.start_date,
                end_date: v.end_date || v.start_date,
                price: parseInt(v.price) || 0,
                discount_percent: parseInt(v.discount_percent) || 0,
                child_discount_percent: parseInt(v.child_discount_percent) || 0,
                final_price: v.discount_percent
                    ? Math.round(parseInt(v.price) * (1 - parseInt(v.discount_percent) / 100))
                    : parseInt(v.price) || 0,
                tour_id: tour.id
            }));
            await Variant.bulkCreate(variantRows);
        }

        if (images?.length > 0) {
            const imageRows = images.map(img => ({
                image_url: img.image_url,
                is_thumbnail: !!img.is_thumbnail,
                tour_id: tour.id
            }));
            await TourImage.bulkCreate(imageRows);
        }

        const full = await Tour.findByPk(tour.id, { include: tourFullInclude });
        res.status(201).json(full);
    } catch (error) {
        next(error);
    }
};

exports.updateTour = async (req, res, next) => {
    try {
        const { variants, images, ...tourData } = req.body;
        const [updated] = await Tour.update(tourData, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ message: "Không tìm thấy tour" });

        if (variants !== undefined) {
            await Variant.destroy({ where: { tour_id: req.params.id } });
            if (variants.length > 0) {
                const variantRows = variants.map(v => ({
                    start_date: v.start_date,
                    end_date: v.end_date || v.start_date,
                    price: parseInt(v.price) || 0,
                    discount_percent: parseInt(v.discount_percent) || 0,
                    child_discount_percent: parseInt(v.child_discount_percent) || 0,
                    final_price: v.discount_percent
                        ? Math.round(parseInt(v.price) * (1 - parseInt(v.discount_percent) / 100))
                        : parseInt(v.price) || 0,
                    tour_id: parseInt(req.params.id)
                }));
                await Variant.bulkCreate(variantRows);
            }
        }

        if (images !== undefined) {
            await TourImage.destroy({ where: { tour_id: req.params.id } });
            if (images.length > 0) {
                const imageRows = images.map(img => ({
                    image_url: img.image_url,
                    is_thumbnail: !!img.is_thumbnail,
                    tour_id: parseInt(req.params.id)
                }));
                await TourImage.bulkCreate(imageRows);
            }
        }

        const tour = await Tour.findByPk(req.params.id, { include: tourFullInclude });
        res.json(tour);
    } catch (error) {
        next(error);
    }
};

exports.deleteTour = async (req, res, next) => {
    try {
        const deleted = await Tour.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy tour" });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

exports.uploadTourImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Không có file nào được upload" });
        }

        const toursDir = path.join(__dirname, '..', 'public', 'uploads', 'tours');
        if (!fs.existsSync(toursDir)) fs.mkdirSync(toursDir, { recursive: true });

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const urls = [];

        for (const file of req.files) {
            const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const filename = `tour-${suffix}.jpeg`;
            const finalPath = path.join(toursDir, filename);

            await sharp(file.path)
                .resize(1200, null, { withoutEnlargement: true })
                .toFormat('jpeg')
                .jpeg({ quality: 85 })
                .toFile(finalPath);

            fs.unlink(file.path, () => {});
            urls.push(`/uploads/tours/${filename}`);
        }

        res.json({ urls });
    } catch (error) {
        next(error);
    }
};
