import { auth, signOut } from '@/auth';

export default async function DashboardPage() {
    const session = await auth();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome, {session?.user?.name}!</p>
            <p>Your role is: {session?.user?.role as string}</p>

            <form
                action={async () => {
                    'use server';
                    await signOut();
                }}
            >
                <button className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600">
                    Sign Out
                </button>
            </form>
        </div>
    );
}
