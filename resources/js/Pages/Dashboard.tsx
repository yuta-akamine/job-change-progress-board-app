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

export default function Dashboard({ applications }: Props) {
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
                            <h3 className="text-lg font-semibold mb-4">
                                Applications ({applications.length})
                            </h3>
                            <div className="space-y-2">
                                {applications.length === 0 ? (
                                    <p className="text-gray-500">No applications found.</p>
                                ) : (
                                    applications.map((application) => (
                                        <div
                                            key={application.id}
                                            className="border border-gray-200 rounded p-4"
                                        >
                                            <div className="font-semibold">
                                                {application.company_name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Status: {application.status}
                                            </div>
                                            {application.role && (
                                                <div className="text-sm text-gray-600">
                                                    Role: {application.role}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

