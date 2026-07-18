// файл лежит в my-app/backend/models
// название файла Workout.js

const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Название тренировки обязательно'],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number,
        default: 0,
        min: 0
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    exercises: [{
        exerciseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise',
            // УБИРАЕМ required: true
            default: null
        },
        name: {
            type: String,
            default: 'Упражнение'
        },
        sets: {
            type: Number,
            required: true,
            min: 1,
            default: 3
        },
        reps: {
            type: Number,
            required: true,
            min: 1,
            default: 10
        },
        weight: {
            type: Number,
            default: 0,
            min: 0
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Workout', WorkoutSchema);