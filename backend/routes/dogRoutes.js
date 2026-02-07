const express = require('express');
const router = express.Router();
const {
    getAllDogs,
    getDogById,
    addDog,
    updateDog,
    deleteDog
} = require('../controllers/dogController');
const { validateToken, isAdmin } = require('../middleware/auth');

// GET all dogs (Public - users can view)
router.get('/', getAllDogs);

// GET dog by ID (Public - users can view)
router.get('/:id', getDogById);

// POST add new dog (Admin only)
router.post('/', validateToken, isAdmin, addDog);

// PUT update dog (Admin only)
router.put('/:id', validateToken, isAdmin, updateDog);

// DELETE dog (Admin only)
router.delete('/:id', validateToken, isAdmin, deleteDog);

module.exports = router;
