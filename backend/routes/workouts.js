// файл лежит в my-app/backend/routes
// название файла workouts.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

// ===== ПОЛУЧИТЬ ВСЕ ТРЕНИРОВКИ ПОЛЬЗОВАТЕЛЯ =====
router.get('/', auth, async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.userId })
            .sort({ date: -1 });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ===== ПОЛУЧИТЬ ОДНУ ТРЕНИРОВКУ =====
router.get('/:id', auth, async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        if (!workout) {
            return res.status(404).json({ message: 'Тренировка не найдена' });
        }
        res.json(workout);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ===== СОЗДАТЬ ТРЕНИРОВКУ =====
router.post('/', auth, async (req, res) => {
    try {
        const { title, date, duration, notes, exercises } = req.body;
        
        const workout = new Workout({
            userId: req.userId,
            title: title || 'Моя тренировка',
            date: date || new Date(),
            duration: duration || 0,
            notes: notes || '',
            exercises: exercises || []
        });
        
        await workout.save();
        res.status(201).json(workout);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера: ' + error.message });
    }
});

// ===== ОБНОВИТЬ ТРЕНИРОВКУ =====
router.put('/:id', auth, async (req, res) => {
    try {
        const workout = await Workout.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        if (!workout) {
            return res.status(404).json({ message: 'Тренировка не найдена' });
        }
        res.json(workout);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ===== УДАЛИТЬ ТРЕНИРОВКУ =====
router.delete('/:id', auth, async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        if (!workout) {
            return res.status(404).json({ message: 'Тренировка не найдена' });
        }
        res.json({ message: 'Тренировка удалена' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;

