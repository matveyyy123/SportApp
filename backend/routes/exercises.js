// файл лежит в my-app/backend/routes
// название файла exercises.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Exercise = require('../models/Exercise');

// ===== ПОЛУЧИТЬ ВСЕ УПРАЖНЕНИЯ =====
router.get('/', auth, async (req, res) => {
    try {
        const exercises = await Exercise.find({ userId: req.userId })
            .sort({ name: 1 });
        res.json(exercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ===== СОЗДАТЬ УПРАЖНЕНИЕ =====
router.post('/', auth, async (req, res) => {
    try {
        const { name, category, muscle, description, defaultSets, defaultReps } = req.body;
        
        const exercise = new Exercise({
            userId: req.userId,
            name,
            category: category || 'Другое',
            muscle: muscle || '',
            description: description || '',
            defaultSets: defaultSets || 3,
            defaultReps: defaultReps || 10,
            isCustom: true
        });
        
        await exercise.save();
        res.status(201).json(exercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ===== УДАЛИТЬ УПРАЖНЕНИЕ =====
router.delete('/:id', auth, async (req, res) => {
    try {
        const exercise = await Exercise.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!exercise) {
            return res.status(404).json({ message: 'Упражнение не найдено' });
        }
        res.json({ message: 'Упражнение удалено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;