
import { auth } from '@/auth';
import { getGuides } from '@/actions/schedule';
import GuideList from '@/components/schedule/guide-list';
import { redirect } from 'next/navigation';

export default async function GuidesPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');

    if (session.user.role === 'GUIDE') {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Directory</h1>
                <p>As a Guide, you can view other guides in the directory.</p>
                {/* We could show the list here too, but booking is disabled for guides in the server action */}
                <div className="mt-8">
                    {/* Re-use guide list but booking will fail or be disabled if we updated the component to check role. 
                     For now, server action blocks it. */}
                    <p className="text-gray-500">Guide browsing implementation coming soon for peer connection.</p>
                </div>
            </div>
        )
    }

    const { guides, error } = await getGuides();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Find a Guide</h1>
            {error && <p className="text-red-500">{error}</p>}
            {guides && <GuideList guides={guides} />}
        </div>
    );
}
