import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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

const STATUS_ORDER = [
    'カジュアル面談',
    '応募予定',
    '書類選考',
    '筆記試験',
    '面接',
    '内定',
    '辞退/見送り',
];

export default function Dashboard({ applications }: Props) {
    // applications を status ごとに groupBy
    const groupedByStatus = applications.reduce(
        (acc, application) => {
            const status = application.status;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(application);
            return acc;
        },
        {} as Record<string, Application[]>,
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
                            <h3 className="text-lg font-semibold mb-6">
                                Applications ({applications.length})
                            </h3>
                            <div className="space-y-6">
                                {STATUS_ORDER.map((status) => {
                                    const statusApplications = groupedByStatus[status] || [];
                                    return (
                                        <div key={status} className="border-b border-gray-200 pb-6 last:border-b-0">
                                            <h4 className="text-md font-semibold mb-3">
                                                {status} ({statusApplications.length})
                                            </h4>
                                            {statusApplications.length === 0 ? (
                                                <p className="text-sm text-gray-500">
                                                    No applications in this status.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {statusApplications.map((application) => (
                                                        <div
                                                            key={application.id}
                                                            className="border border-gray-200 rounded p-4"
                                                        >
                                                            <div className="font-semibold">
                                                                {application.company_name}
                                                            </div>
                                                            {application.role && (
                                                                <div className="text-sm text-gray-600">
                                                                    Role: {application.role}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
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
        </AuthenticatedLayout>
    );
}

