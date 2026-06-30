// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findByEmail, createUser } from '../models/userModel.js';

dotenv.config();

class AuthController {
static async register(req, res) {
    try {
        const { email, password, name, role } = req.body;
        
        const existingUser = await findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);
        
        const newUser = await createUser(email, password_hash, name, role || 'user');
        
        // Generate token for immediate login
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = await findByEmail(email);
            
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            
            const validPassword = await bcrypt.compare(password, user.password_hash);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default AuthController;