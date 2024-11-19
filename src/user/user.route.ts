import express, { Request, Response } from 'express';
import { db } from '../database';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, universityId, subjectIds } = req.body;
    const university = await db.models.University.findByPk(universityId); 

    if (!university) {
      res.status(404).json({ error: 'University not found' });
      return;
    }

    if (await db.models.User.findOne({ where: { email } })) {
      throw new Error("User already exists.")
    }
    
    const user = await db.models.User.create({ name, email, universityId });

    // Add subjects to the user if `subjectIds` are provided
    if (Array.isArray(subjectIds) && subjectIds.length > 0) {
      const subjects = await db.models.Subject.findAll({
        where: { id: subjectIds },
      });

      if (subjects.length !== subjectIds.length) {
        res.status(400).json({ error: 'One or more subjects not found.' });
        return;
      }

    
    for (const subjectId of subjectIds) {
      const subject = await db.models.Subject.findByPk(subjectId);
      if (!subject) {
        continue;
      }
      
      // Add the subject to the user
      await user.addSubject(subject);
    }
  }

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await db.models.User.findAll({
      include: {
        model: db.models.University,
        as: 'university',
      }
    });

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:userId/add-subjects', async (_req: Request, res: Response) => {
  try {
    const { userId } = _req.params; // Extract userId from URL parameter
    const { subjectIds } = _req.body; // Expecting an array of subject IDs in the body

    if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
      res.status(400).json({ error: 'subjectIds must be a non-empty array' });
      return;
    }

    // Find the user by userId
    const user = await db.models.User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Find the subjects by their IDs
    const subjects = await db.models.Subject.findAll({ where: { id: subjectIds } });
    if (subjects.length !== subjectIds.length) {
      res.status(404).json({ error: 'Some subjects not found' });
      return;
    }

    for (const subjectId of subjectIds) {
      const subject = await db.models.Subject.findByPk(subjectId);
      if (!subject) {
        continue;
      }
      
      // Add the subject to the user
      await user.addSubject(subject);
    }

    res.status(200).json({ message: 'Subjects added successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
