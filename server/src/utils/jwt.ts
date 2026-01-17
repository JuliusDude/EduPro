import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

/**
 * Generate access token
 */
export const generateAccessToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (payload: JWTPayload) => {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};
