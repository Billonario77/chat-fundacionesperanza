
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
    });

    if (!profile) {
        redirect("/onboarding");
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar would go here */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header would go here */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
