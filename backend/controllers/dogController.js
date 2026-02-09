const Dog = require('../models/dog');

// Get all dogs
const getAllDogs = async (req, res) => {
    try {
        const dogs = await Dog.find({});
        res.status(200).json(dogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get dog by ID
const getDogById = async (req, res) => {
    try {
        const { id } = req.params;
        const dog = await Dog.findById(id);

        if (!dog) {
            return res.status(404).json({ message: `Cannot find any dog with ID ${id}` });
        }

        res.status(200).json(dog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new dog
const addDog = async (req, res) => {
    try {
        // Check if dog with same name already exists
        const existingDog = await Dog.findOne({ dogName: req.body.dogName });
        if (existingDog) {
            return res.status(400).json({ message: `A pet with the name "${req.body.dogName}" already exists` });
        }

        const newDog = await Dog.create(req.body);
        res.status(201).json({ message: 'Dog Added Successfully', dog: newDog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a dog
const updateDog = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDog = await Dog.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedDog) {
            return res.status(404).json({ message: `Cannot find any dog with ID ${id}` });
        }

        res.status(200).json({ message: 'Dog Updated Successfully', dog: updatedDog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a dog
const deleteDog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDog = await Dog.findByIdAndDelete(id);

        if (!deletedDog) {
            return res.status(404).json({ message: `Cannot find any dog with ID ${id}` });
        }

        res.status(200).json({ message: 'Dog Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllDogs,
    getDogById,
    addDog,
    updateDog,
    deleteDog
};
