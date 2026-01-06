import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
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

    // applications を status ごとに groupBy（未知ステータスは 'その他' に集約）
    const groupedByStatus = applications.reduce(
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
                                    Applications ({applications.length})
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    + 追加
                                </button>
                            </div>

                            {/* KANBAN ステータス群 */}
                            <div className="space-y-6 mb-8">
                                {KANBAN_STATUSES.map((status) => (
                                    <KanbanColumn
                                        key={status}
                                        title={status}
                                        applications={groupedByStatus[status] || []}
                                    />
                                ))}
                            </div>

                            {/* その他（未知ステータス） */}
                            {groupedByStatus['その他'] &&
                                groupedByStatus['その他'].length > 0 && (
                                    <div className="space-y-6 mb-8">
                                        <div className="border-b border-gray-200 pb-6">
                                            <h4 className="text-md font-semibold mb-3">
                                                その他 (
                                                {groupedByStatus['その他']
                                                    .length}
                                                )
                                            </h4>
                                            <div className="space-y-2">
                                                {groupedByStatus['その他'].map(
                                                    (application) => (
                                                        <div
                                                            key={application.id}
                                                            className="border border-gray-200 rounded p-4"
                                                        >
                                                            <div className="font-semibold">
                                                                {
                                                                    application.company_name
                                                                }
                                                            </div>
                                                            {application.role && (
                                                                <div className="text-sm text-gray-600">
                                                                    Role:{' '}
                                                                    {
                                                                        application.role
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* ARCHIVED ステータス群（別セクション） */}
                            <div className="space-y-6 border-t border-gray-300 pt-6">
                                {ARCHIVED_STATUSES.map((status) => {
                                    const statusApplications =
                                        groupedByStatus[status] || [];
                                    return (
                                        <div
                                            key={status}
                                            className="border-b border-gray-200 pb-6 last:border-b-0"
                                        >
                                            <h4 className="text-md font-semibold mb-3">
                                                {status} ({statusApplications.length})
                                            </h4>
                                            {statusApplications.length === 0 ? (
                                                <p className="text-sm text-gray-500">
                                                    No applications in this
                                                    status.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {statusApplications.map(
                                                        (application) => (
                                                            <div
                                                                key={
                                                                    application.id
                                                                }
                                                                className="border border-gray-200 rounded p-4"
                                                            >
                                                                <div className="font-semibold">
                                                                    {
                                                                        application.company_name
                                                                    }
                                                                </div>
                                                                {application.role && (
                                                                    <div className="text-sm text-gray-600">
                                                                        Role:{' '}
                                                                        {
                                                                            application.role
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CreateApplicationModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </AuthenticatedLayout>
    );
}

