import { withIronSession } from 'next-iron-session';
import { COOKIE_NAME } from './config';

export default function withSession(handler) {
    return withIronSession(handler, {
        password: process.env.COOKIE_PASSWORD,
        cookieName: COOKIE_NAME,
        cookieOptions: {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV == 'production',  // ? true : false,
        }
    })
}