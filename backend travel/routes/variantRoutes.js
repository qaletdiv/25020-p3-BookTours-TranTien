const express = require("express");
const router = express.Router();
const { Variant, Tour } = require("../models");


router.get("/", async (req, res, next) => {
    try {
        const variants = await Variant.findAll({
            include: [{
                model: Tour,
                as: 'tour'
            }]
        });
        res.json(variants);
    } catch (err) {
        next(err);
    }
});



module.exports = router;