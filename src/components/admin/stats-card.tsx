export default function StatsCard({ title, value, icon, color }: { title: string, value: number, icon?: React.ReactNode, color?: string }) {
    return (
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 ${color || 'border-blue-500'}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
                </div>
                {icon && <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">{icon}</div>}
            </div>
        </div>
    );
}
