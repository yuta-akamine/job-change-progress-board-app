import type { Application } from '@/types';

interface KanbanColumnProps {
    title: string;
    applications: Application[];
}

export default function KanbanColumn({ title, applications }: KanbanColumnProps) {
    return (
        <section className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">
                    {title}
                </h3>
                <span className="text-xs font-medium text-gray-500">
                    {applications.length}
                </span>
            </header>

            <div className="mt-2 space-y-2">
                {applications.length === 0 ? (
                    <p className="text-xs text-gray-400">No applications</p>
                ) : (
                    applications.map((application) => {
                        const createdAtLabel = application.created_at
                            ? new Date(application.created_at).toLocaleDateString()
                            : '—';

                        return (
                            <article
                                key={application.id}
                                className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                            >
                                <div className="text-sm font-semibold text-gray-800">
                                    {application.company_name}
                                </div>
                                {application.role && (
                                    <div className="mt-0.5 text-xs text-gray-600">
                                        {application.role}
                                    </div>
                                )}
                                <div className="mt-1 text-[11px] text-gray-500">
                                    Created:{' '}
                                    <span className="font-medium">
                                        {createdAtLabel}
                                    </span>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </section>
    );
}

