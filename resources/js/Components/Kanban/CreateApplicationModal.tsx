import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import type { FormEvent } from 'react';
import { KANBAN_STATUSES } from '@/constants/statuses';

interface Application {
    id: number;
    company_name: string;
    role: string | null;
    status: string;
    interview_at: string | null;
    notes: string | null;
}

interface CreateApplicationModalProps {
    open: boolean;
    onClose: () => void;
    application?: Application | null;
    onSuccess?: () => void;
}

export default function CreateApplicationModal({
    open,
    onClose,
    application,
    onSuccess,
}: CreateApplicationModalProps) {
    const isEditMode = !!application;
    const form = useForm({
        company_name: application?.company_name || '',
        role: application?.role || '',
        status: application?.status || KANBAN_STATUSES[0],
        interview_at: application?.interview_at
            ? new Date(application.interview_at).toISOString().slice(0, 16)
            : '',
        notes: application?.notes || '',
    });

    useEffect(() => {
        if (application) {
            form.setData({
                company_name: application.company_name,
                role: application.role || '',
                status: application.status,
                interview_at: application.interview_at
                    ? new Date(application.interview_at).toISOString().slice(0, 16)
                    : '',
                notes: application.notes || '',
            });
        }
    }, [application]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // normalize empty interview_at to null
        if (!form.data.interview_at) {
            form.setData('interview_at', null as any);
        }
        if (isEditMode && application) {
            form.patch(`/applications/${application.id}`, {
                onSuccess: () => {
                    form.reset();
                    onClose();
                    if (onSuccess) onSuccess();
                },
                onError: (errors) => {
                    console.error('Failed to update application:', errors);
                    alert('応募情報の更新に失敗しました。');
                },
            });
        } else {
            form.post('/applications', {
                onSuccess: () => {
                    form.reset();
                    onClose();
                    if (onSuccess) onSuccess();
                },
            });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">
                    {isEditMode ? 'Edit Application' : 'Create Application'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.data.company_name}
                            onChange={(e) =>
                                form.setData('company_name', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            required
                        />
                        {form.errors.company_name && (
                            <p className="mt-1 text-xs text-red-500">
                                {form.errors.company_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <input
                            type="text"
                            value={form.data.role}
                            onChange={(e) =>
                                form.setData('role', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        {form.errors.role && (
                            <p className="mt-1 text-xs text-red-500">
                                {form.errors.role}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.data.status}
                            onChange={(e) =>
                                form.setData('status', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            required
                        >
                            {KANBAN_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        {form.errors.status && (
                            <p className="mt-1 text-xs text-red-500">
                                {form.errors.status}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Interview Date
                        </label>
                        <input
                            type="datetime-local"
                            value={form.data.interview_at}
                            onChange={(e) =>
                                form.setData('interview_at', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        {form.errors.interview_at && (
                            <p className="mt-1 text-xs text-red-500">
                                {form.errors.interview_at}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Notes
                        </label>
                        <textarea
                            value={form.data.notes}
                            onChange={(e) =>
                                form.setData('notes', e.target.value)
                            }
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        {form.errors.notes && (
                            <p className="mt-1 text-xs text-red-500">
                                {form.errors.notes}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {form.processing
                                ? isEditMode
                                    ? 'Updating...'
                                    : 'Creating...'
                                : isEditMode
                                  ? 'Update'
                                  : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

