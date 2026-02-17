
import { auth } from '@/auth';
import { getJournalEntries } from '@/actions/journal';
import JournalForm from '@/components/journal/journal-form';
import JournalList from '@/components/journal/journal-list';
import { redirect } from 'next/navigation';

export default async function JournalPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const { entries, error } = await getJournalEntries();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">My Journal</h1>
            <div className="mb-8">
                <JournalForm />
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Past Entries</h2>
                {error && <p className="text-red-500">{error}</p>}
                {entries && <JournalList entries={entries} />}
            </div>
        </div>
    );
}
