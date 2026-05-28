const express = require('express');
const router = express.Router();
const {User, Profile} = require('../models')

router.get('/', async (req, res,next) => {
    try {
        const profiles = await Profile.findAll();
        res.json(profiles);
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res,next) => {
    try {
        const profile = await Profile.findByPk(req.params.id);
        if(!profile){
            return res.status(404).json({message: "Không tìm thấy hồ sơ"})
        }
        res.json(profile);
    } catch (err) {
        next(err)
    }
})


router.post('/', async (req, res,next) => {
    try {
        const newProfile = await Profile.create(req.body);
        res.json(newProfile);
    } catch (err) {
        next(err)
    }
})

router.put('/:id', async (req, res,next) => {
    try {
        const [updatedRows] = await Profile.update(req.body,{
            where: {id: req.params.id}
        });
        if(updatedRows===0){
            return res.status(404).json({message: "Không tìm thấy hồ sơ"})
        }
        const updatedProfile= await Profile.findByPk(req.params.id);
        res.json(updatedProfile);
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res,next) => {
    try {
        const deletedRows = await Profile.destroy({
            where: {id: req.params.id}
        });
        if(deletedRows===0){
            return res.status(404).json({message: "Không tìm thấy hồ sơ"})
        }
        res.status(204).send();
    } catch (err) {
        next(err)
    }
})

module.exports = router;