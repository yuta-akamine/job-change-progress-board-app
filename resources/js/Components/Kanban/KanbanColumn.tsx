import { useState } from 'react';
import { router } from '@inertiajs/react';
import type { Application } from '@/types';
import { KANBAN_STATUSES } from '@/constants/statuses';

interface KanbanColumnProps {
    title: string;
    applications: Application[];
}

export default function KanbanColumn({ title, applications }: KanbanColumnProps) {
    const [processing, setProcessing] = useState<Map<number, boolean>>(new Map());
    const [optimisticRemoved, setOptimisticRemoved] = useState<Set<number>>(new Set());

    const handleStatusChange = (applicationId: number, newStatus: string) => {
        const application = applications.find((app) => app.id === applicationId);
        if (!application || newStatus === application.status) return;

        setOptimisticRemoved((prev) => new Set(prev).add(applicationId));
        setProcessing((prev) => new Map(prev).set(applicationId, true));
        const visit = router.patch(
            `/applications/${applicationId}/status`,
            { status: newStatus },
            {
                onError: () => {
                    // TODO: toast lib not found - if toast library is added, show error notification here
                    setOptimisticRemoved((prev) => {
                        const next = new Set(prev);
                        next.delete(applicationId);
                        return next;
                    });
                },
                onFinish: () => {
                    setProcessing((prev) => {
                        const next = new Map(prev);
                        next.delete(applicationId);
                        return next;
                    });
                    setOptimisticRemoved((prev) => {
                        const next = new Set(prev);
                        next.delete(applicationId);
                        return next;
                    });
                },
            },
        ) as any;
        if (visit && typeof visit.catch === 'function') {
            visit.catch((e: any) => {
                console.debug('Inertia patch error (ignored):', e);
            });
        }
    };

    const handleDelete = (applicationId: number) => {
        if (!confirm('この応募情報を削除しますか？')) {
            return;
        }

        // TODO: 楽観的削除を実装する場合は、onFinish で optimisticRemoved をクリアする処理を追加すること
        setProcessing((prev) => new Map(prev).set(applicationId, true));
        const visit = router.delete(
            `/applications/${applicationId}`,
            {
                onFinish: () => {
                    setProcessing((prev) => {
                        const next = new Map(prev);
                        next.delete(applicationId);
                        return next;
                    });
                },
            },
        ) as any;
        if (visit && typeof visit.catch === 'function') {
            visit.catch((e: any) => {
                console.debug('Inertia delete error (ignored):', e);
            });
        }
    };
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
                        if (optimisticRemoved.has(application.id)) return null;

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
                                <div className="mt-2">
                                    <select
                                        value={application.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                application.id,
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing.get(application.id) ?? false}
                                        className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                                    >
                                        {KANBAN_STATUSES.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <button
                                        onClick={() => handleDelete(application.id)}
                                        disabled={processing.get(application.id) ?? false}
                                        className="rounded border border-red-300 bg-white px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        削除
                                    </button>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </section>
    );
}

