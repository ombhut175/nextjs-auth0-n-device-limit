import { auth0 } from '@/lib/auth/auth0';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import {
  responseUnauthorized,
  responseBadRequest,
  responseNotFound,
  responseInternalServerError,
  responseSuccessfulWithData,
} from '@/helpers/responseHelpers';

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return responseUnauthorized('Unauthorized');
    }

    const { phoneNumber, countryCode, fullName } = await request.json();

    if (!phoneNumber || !countryCode || !fullName) {
      return responseBadRequest('Phone number, country code, and full name are required');
    }

    // Validate full name
    const trimmedName = fullName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 255) {
      return responseBadRequest('Full name must be between 2 and 255 characters');
    }

    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) {
      return responseBadRequest('Invalid phone number format');
    }

    const fullPhone = `${countryCode}${cleaned}`;

    const [updatedUser] = await db
      .update(users)
      .set({
        fullName: trimmedName,
        phone: fullPhone,
        updatedAt: new Date(),
      })
      .where(eq(users.auth0Id, session.user.sub))
      .returning();

    if (!updatedUser) {
      return responseNotFound('User not found');
    }

    return responseSuccessfulWithData({
      message: 'Profile updated successfully',
      data: { phone: updatedUser.phone, fullName: updatedUser.fullName },
    });
  } catch (error) {
    return responseInternalServerError('Failed to update phone number');
  }
}

export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return responseUnauthorized('Unauthorized');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.auth0Id, session.user.sub),
    });

    if (!user) {
      return responseNotFound('User not found');
    }

    return responseSuccessfulWithData({
      message: 'Profile retrieved successfully',
      data: { phone: user.phone, fullName: user.fullName },
    });
  } catch (error) {
    return responseInternalServerError('Failed to fetch phone number');
  }
}
