import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendConfirmationEmail } from '../services/email.service';
import { scheduleAutomation } from '../services/automation.service';
import { validateUserPreference } from '../validators/userPreference.validator';

const prisma = new PrismaClient();

export async function createUserPreference(req: Request, res: Response): Promise<void> {
  try {
    // 1. Create new preference in database using form data
    const validatedData = validateUserPreference(req.body);
    
    const userPreference = await prisma.userPreference.create({
      data: validatedData
    });

    // 2. Send confirmation email to user
    await scheduleAutomation(userPreference);
    await sendConfirmationEmail(userPreference.email, {
      firstName: userPreference.firstName,
      endDate: userPreference.endDate
    });

    // 3. Return success response
    res.status(201).json({
      success: true,
      data: userPreference
    });
  } catch (error) {
    // 4. Handle errors
    console.error('Error creating user preference:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user preference'
    });
  }
} 