const express = require("express");
const router = express.Router();
const { Tour, Category, Variant, TourImage, Sequelize } = require("../models");
const { Op } = Sequelize;
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");

const tourWithRelations = {
  include: [
    { model: Category, as: "category" },
    { model: Variant, as: "variants" },
    { model: TourImage, as: "images" },
  ],
};

// GET /api/tours - lấy tất cả tour, hỗ trợ filter qua query params
router.get("/", async (req, res, next) => {
  try {
    const { categoryId, search } = req.query;
    const where = {};
    if (categoryId) where.category_id = categoryId;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const tours = await Tour.findAll({ where, ...tourWithRelations });
    res.json(tours);
  } catch (err) {
    next(err);
  }
});

// GET /api/tours phân trang . Sửa gọi FE để gọi endpoint này thay vì GET /api/tours?page=1&categoryId=2
router.get("/page/:pageNumber", async (req, res, next) => {
  try {
    const pageSize = 6;
    const pageNumber = parseInt(req.params.pageNumber) || 1;
    const offset = (pageNumber - 1) * pageSize;

    const { categoryId } = req.query;
    const where = {};
    if (categoryId) where.category_id = categoryId;

    const { rows: tours, count } = await Tour.findAndCountAll({
      where,
      ...tourWithRelations,
      limit: pageSize,
      offset,
    });
    res.json({ data: tours, total: count, page: pageNumber, pageSize });
  } catch (err) {
    next(err);
  }
});

// GET /api/tours/search - tìm kiếm/lọc nâng cao (home filter)
router.get("/search", async (req, res, next) => {
  try {
    const { categoryId, departure, destination, startDate, durationRange } =
      req.query;
    const where = {};
    const variantWhere = {};

    if (categoryId) where.category_id = categoryId;
    if (departure) where.location = departure;
    if (destination) where.destination = { [Op.like]: `%${destination}%` };
    if (durationRange) {
      const ranges = {
        "1-3 ngày": [1, 3],
        "4-7 ngày": [4, 7],
        "8-14 ngày": [8, 14],
        "Trên 14 ngày": [15, 999],
      };
      const range = ranges[durationRange];
      if (range) where.duration = { [Op.between]: range };
    }
    if (startDate) variantWhere.start_date = { [Op.gte]: startDate };

    const tours = await Tour.findAll({
      where,
      include: [
        { model: Category, as: "category" },
        {
          model: Variant,
          as: "variants",
          where: Object.keys(variantWhere).length ? variantWhere : undefined,
          required: false,
        },
      ],
    });

    res.json({ data: tours, total: tours.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/tours/related/:slug - tour liên quan
router.get("/related/:slug", async (req, res, next) => {
  try {
    const tour = await Tour.findOne({ where: { slug: req.params.slug } });
    if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });

    const related = await Tour.findAll({
      where: { category_id: tour.category_id, id: { [Op.ne]: tour.id } },
      ...tourWithRelations,
      limit: 4,
    });
    res.json(related);
  } catch (err) {
    next(err);
  }
});

// GET /api/tours/:slug - lấy tour theo slug
router.get("/:slug", async (req, res, next) => {
  try {
    const tour = await Tour.findOne({
      where: { slug: req.params.slug },
      ...tourWithRelations,
    });
    if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
    res.json(tour);
  } catch (err) {
    next(err);
  }
});

// POST /api/tours - tạo tour mới (admin)
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res, next) => {
    try {
      const tour = await Tour.create(req.body);
      res.status(201).json(tour);
    } catch (err) {
      next(err);
    }
  },
);

// PUT /api/tours/:id - cập nhật tour (admin)
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res, next) => {
    try {
      const [updated] = await Tour.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated)
        return res.status(404).json({ error: "Không tìm thấy tour" });
      const tour = await Tour.findByPk(req.params.id, tourWithRelations);
      res.json(tour);
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /api/tours/:id - xóa tour (admin)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res, next) => {
    try {
      const deleted = await Tour.destroy({ where: { id: req.params.id } });
      if (!deleted)
        return res.status(404).json({ error: "Không tìm thấy tour" });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
