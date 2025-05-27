import { Request, Response } from 'express';
import { UserModel } from '../models';

// Basic API controllers
export const getWelcomeMessage = (req: Request, res: Response): void => {
  res.status(200).json({ message: 'Welcome to the API!' });
};

export const getHealthStatus = (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  });
};

// User controllers
export const getAllUsers = (req: Request, res: Response): void => {
  try {
    const users = UserModel.findAll();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    const user = UserModel.findById(id);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const createUser = (req: Request, res: Response): void => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }
    
    const newUser = UserModel.create({ name, email });
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    if (!name && !email) {
      res.status(400).json({ error: 'At least one field to update is required' });
      return;
    }
    
    const updatedUser = UserModel.update(id, { name, email });
    
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    const result = UserModel.delete(id);
    
    if (!result) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
