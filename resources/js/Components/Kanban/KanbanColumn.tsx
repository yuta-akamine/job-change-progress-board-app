import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import type { Application } from '@/types';

interface KanbanColumnProps {
    title: string;
    applications: Application[];
    onEdit?: (application: Application) => void;
}

export default function KanbanColumn({ title, applications, onEdit }: KanbanColumnProps) {
    const [processing, setProcessing] = useState<Map<number, boolean>>(new Map());
    const { setNodeRef: setDroppableRef } = useDroppable({ id: title });

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

            <div ref={setDroppableRef} className="mt-2 space-y-2">
                {applications.length === 0 ? (
                    <p className="text-xs text-gray-400">No applications</p>
                ) : (
                    applications.map((application) => (
                        <DraggableCard
                            key={application.id}
                            application={application}
                            processing={processing}
                            handleDelete={handleDelete}
                            onEdit={onEdit}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

function DraggableCard({
    application,
    processing,
    handleDelete,
    onEdit,
}: {
    application: Application;
    processing: Map<number, boolean>;
    handleDelete: (applicationId: number) => void;
    onEdit?: (application: Application) => void;
}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `app-${application.id}`,
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    const createdAtLabel = application.created_at
        ? new Date(application.created_at).toLocaleDateString()
        : '—';

    return (
        <article
            ref={setNodeRef}
            style={style}
            className="rounded-lg border border-gray-200 bg-gray-50 p-3"
        >
            <div
                {...listeners}
                {...attributes}
                className="text-sm font-semibold text-gray-800 cursor-move"
            >
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
            <div className="mt-2 flex justify-end gap-2">
                {onEdit && (
                    <button
                        onClick={() => onEdit(application)}
                        disabled={processing.get(application.id) ?? false}
                        className="rounded border border-blue-300 bg-white px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                    >
                        編集
                    </button>
                )}
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
}
