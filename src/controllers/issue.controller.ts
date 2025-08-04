import { Request, Response, NextFunction } from 'express';
import { Issue } from '../models';

export const reportIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, title, description, priority, category, screenshots } = req.body;
    if (!userId || !title || !description ) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }
    const issue = await Issue.create({ userId, title, description, priority, category, screenshots });
    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
};

export const getIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    next(err);
  }
};
