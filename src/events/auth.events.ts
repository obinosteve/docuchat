import { appEvents } from '../lib/events.ts';
import { prisma } from '../lib/prisma.ts';
import logger from '../services/logger.service.ts';


// ── Define the event names as constants ─────────────
export const AUTH_EVENTS = {
    USER_REGISTERED: 'auth:user-registered',
    USER_LOGGED_IN: 'auth:user-logged-in',
    USER_LOGGED_OUT: 'auth:user-logged-out',
    TOKEN_REFRESHED: 'auth:token-refreshed',
    LOGIN_FAILED: 'auth:login-failed',
} as const;


// Listener 1: Log signups for analytics
appEvents.on(AUTH_EVENTS.USER_REGISTERED, async (user) => {
    try {
    await prisma.usageLog.create({
        data: {
            userId: user.id,
            action: 'signup',
            tokens: 0,
            costUsd: 0,
            metadata: JSON.stringify({
                email: user.email,
                tier: user.tier,
                registeredAt: new Date().toISOString(),
            }),
        },
    });
    } catch (error) {
        logger.info('Failed to log user registration:', error);
    }
});


// Listener 2: Create a default welcome conversation
appEvents.on(AUTH_EVENTS.USER_REGISTERED, async (user) => {
    try {
    await prisma.conversation.create({
        data: {
            userId: user.id,
            title: 'Welcome to DocuChat',
            },
        });
    } catch (error) {
        logger.info('Failed to create welcome conversation:', error);
    }
});


// Listener 3: Log login events (useful for security audits)
appEvents.on(AUTH_EVENTS.USER_LOGGED_IN, async (data) => {
 try {
    await prisma.usageLog.create({
                data: {
                    userId: data.userId,
                    action: 'login',
                    tokens: 0,
                    costUsd: 0,
                    metadata: JSON.stringify({
                        deviceInfo: data.deviceInfo,
                        loginAt: new Date().toISOString(),
                    }),
                },
            });
    } catch (error) {
        logger.info('Failed to log login:', error);
    }
});

// Listener 4: Track failed login attempts
appEvents.on(AUTH_EVENTS.LOGIN_FAILED, async (data) => {
 try {
    logger.info(
        `Failed login attempt for ${data.email} from ${data.deviceInfo}`
    );
 } catch (error) {
    logger.info('Failed to log failed login:', error);
 }
});


appEvents.on(AUTH_EVENTS.USER_REGISTERED, async (user) => {
    try {
    // Race: either the notification finishes in 3 seconds, or we give up
    await Promise.race([
            notifySlack(`New signup: ${user.email}`), 
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Slack timeout')), 3000)
            ),
        ]);
    } catch (error) {
        console.error('Slack notification failed or timed out:', error);
    }
});
