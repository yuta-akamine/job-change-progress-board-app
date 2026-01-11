import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import KanbanColumn from '@/Components/Kanban/KanbanColumn';
import CreateApplicationModal from '@/Components/Kanban/CreateApplicationModal';
import {
    KANBAN_STATUSES,
    ARCHIVED_STATUSES,
    Status,
} from '@/constants/statuses';

interface Application {
    id: number;
    user_id: number;
    company_name: string;
    role: string | null;
    status: string;
    interview_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    applications: Application[];
}

export default function Dashboard({ applications }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState<Application | null>(null);
    const [localApps, setLocalApps] = useState<Application[]>(applications);

    useEffect(() => {
        setLocalApps(applications);
    }, [applications]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const applicationId = parseInt(
            (active.id as string).replace('app-', ''),
            10,
        );
        const newStatus = over.id as string;

        const application = localApps.find((app) => app.id === applicationId);
        if (!application || application.status === newStatus) return;

        const prevApps = localApps.map((app) => ({ ...app }));
        setLocalApps((prev) =>
            prev.map((app) =>
                app.id === applicationId ? { ...app, status: newStatus } : app,
            ),
        );

        let hasSucceeded = false;

        const rollback = () => {
            if (!hasSucceeded) {
                setLocalApps(prevApps);
                console.error('Failed to update application status: network or server error');
                alert('ステータスの更新に失敗しました。ネットワークエラーまたはサーバーエラーの可能性があります。');
            }
        };

        try {
            const visit = router.patch(
                `/applications/${applicationId}/status`,
                { status: newStatus },
                {
                    onSuccess: () => {
                        hasSucceeded = true;
                    },
                    onError: (errors) => {
                        rollback();
                        console.error('Failed to update application status:', errors);
                    },
                    onFinish: () => {
                        if (!hasSucceeded) {
                            rollback();
                        }
                    },
                },
            ) as any;
            if (visit && typeof visit.catch === 'function') {
                visit.catch((e: any) => {
                    rollback();
                    console.error('Failed to update application status:', e);
                });
            }
        } catch (e) {
            rollback();
            console.error('Failed to update application status:', e);
        }
    };

    // applications を status ごとに groupBy（未知ステータスは 'その他' に集約）
    const groupedByStatus = localApps.reduce(
        (acc, application) => {
            const status = application.status;
            const normalizedStatus: Status =
                [...KANBAN_STATUSES, ...ARCHIVED_STATUSES].includes(
                    status as Status,
                )
                    ? (status as Status)
                    : 'その他';

            if (!acc[normalizedStatus]) {
                acc[normalizedStatus] = [];
            }
            acc[normalizedStatus].push(application);
            return acc;
        },
        {} as Partial<Record<Status, Application[]>>,
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    Applications ({localApps.length})
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    + 追加
                                </button>
                            </div>

                            <DndContext onDragEnd={handleDragEnd}>
                                {/* KANBAN ステータス群 */}
                                <div className="space-y-6 mb-8">
                                    {KANBAN_STATUSES.map((status) => (
                                        <KanbanColumn
                                            key={status}
                                            title={status}
                                            applications={groupedByStatus[status] || []}
                                            onEdit={(app) => setEditingApplication(app)}
                                        />
                                    ))}
                                </div>

                                {/* その他（未知ステータス） */}
                                {groupedByStatus['その他'] &&
                                    groupedByStatus['その他'].length > 0 && (
                                        <div className="space-y-6 mb-8">
                                            <KanbanColumn
                                                title="その他"
                                                applications={groupedByStatus['その他']}
                                                onEdit={(app) => setEditingApplication(app)}
                                            />
                                        </div>
                                    )}

                                {/* ARCHIVED ステータス群 */}
                                <div className="space-y-6 border-t border-gray-300 pt-6">
                                    {ARCHIVED_STATUSES.map((status) => (
                                        <KanbanColumn
                                            key={status}
                                            title={status}
                                            applications={groupedByStatus[status] || []}
                                            onEdit={(app) => setEditingApplication(app)}
                                        />
                                    ))}
                                </div>
                            </DndContext>
                        </div>
                    </div>
                </div>
            </div>
            <CreateApplicationModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <CreateApplicationModal
                open={!!editingApplication}
                onClose={() => setEditingApplication(null)}
                application={editingApplication}
                onSuccess={() => {
                    if (editingApplication) {
                        router.reload({
                            only: ['applications'],
                            onSuccess: (page) => {
                                setLocalApps((page.props as Props).applications);
                            },
                        });
                    }
                }}
            />
        </AuthenticatedLayout>
    );
}

