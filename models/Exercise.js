// файл лежит в my-app/backend/models
// название файла Exercise.js

const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Название упражнения обязательно'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Грудь', 'Спина', 'Ноги', 'Плечи', 'Руки', 'Кардио', 'Пресс', 'Другое'],
        default: 'Другое'
    },
    muscle: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    defaultSets: {
        type: Number,
        default: 3,
        min: 1
    },
    defaultReps: {
        type: Number,
        default: 10,
        min: 1
    },
    isCustom: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);