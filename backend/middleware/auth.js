//файл лежит в my-app/backend/middleware
//название файла auth.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    
    if (!token) {
        return res.status(401).json({ 
            message: 'Нет токена, доступ запрещен' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        res.status(401).json({ 
            message: 'Неверный или просроченный токен' 
        });
    }
};