const express = require('express');
const router = express.Router();
const {User, Profile} = require('../models')

router.get('/', async (req, res,next) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Profile,
                as: 'profile'
            }]
        });
        res.json(users);
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res,next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if(!user){
            return res.status(404).json({message: "Không tìm thấy người dùng"})
        }
        res.json(user);
    } catch (err) {
        next(err)
    }
})


router.post('/', async (req, res,next) => {
    try {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } catch (err) {
        next(err)
    }
})

router.put('/:id', async (req, res,next) => {
    try {
        const [updatedRows] = await User.update(req.body,{
            where: {id: req.params.id}
        });
        if(updatedRows===0){
            return res.status(404).json({message: "Không tìm thấy người dùng"})
        }
        const updatedUser= await User.findByPk(req.params.id);
        res.json(updatedUser);
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res,next) => {
    try {
        const deletedRows = await User.destroy({
            where: {id: req.params.id}
        });
        if(deletedRows===0){
            return res.status(404).json({message: "Không tìm thấy người dùng"})
        }
        res.status(204).send();
    } catch (err) {
        next(err)
    }
})

module.exports = router;