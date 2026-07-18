// файл лежит в my-app/backend/routes
// название файла auth.js

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// ===== РЕГИСТРАЦИЯ =====
router.post('/register', [
    body('name').trim().isLength({ min: 2 }).withMessage('Имя минимум 2 символа'),
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password').isLength({ min: 8 }).withMessage('Пароль минимум 8 символов')
], async (req, res) => {
    try {
        // Проверка валидации
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array()[0].msg 
            });
        }

        const { name, email, password } = req.body;

        // Проверка существующего пользователя
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Пользователь с таким email уже существует' 
            });
        }

        // Создание пользователя
        const user = new User({ name, email, password });
        await user.save();

        // Создание JWT токена
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Регистрация успешна!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ===== ВХОД =====
router.post('/login', [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password').notEmpty().withMessage('Введите пароль')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array()[0].msg 
            });
        }

        const { email, password } = req.body;

        // Поиск пользователя
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: 'Неверный email или пароль' 
            });
        }

        // Проверка пароля
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Неверный email или пароль' 
            });
        }

        // Создание JWT токена
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Вход выполнен!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ===== ПРОВЕРКА ТОКЕНА (защищенный маршрут) =====
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;

// ===== ОБНОВИТЬ ПРОФИЛЬ =====
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Проверяем, не занят ли email другим пользователем
        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: req.userId } 
            });
            if (existingUser) {
                return res.status(400).json({ message: 'Этот email уже используется' });
            }
        }

        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;

        const user = await User.findByIdAndUpdate(
            req.userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ 
            message: 'Профиль обновлён!', 
            user 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});