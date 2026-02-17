
import { UserRole } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
    role: UserRole;
    id: string;
};

declare module 'next-auth' {
    interface Session {
        user: ExtendedUser;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: UserRole;
    }
}
