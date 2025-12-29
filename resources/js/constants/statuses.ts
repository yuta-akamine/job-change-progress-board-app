export const KANBAN_STATUSES = [
    'カジュアル面談',
    '応募予定',
    '書類選考',
    '筆記試験',
    '面接（一次〜最終）',
    '内定',
] as const;

export const ARCHIVED_STATUSES = ['辞退/見送り'] as const;

export type Status =
    | (typeof KANBAN_STATUSES)[number]
    | (typeof ARCHIVED_STATUSES)[number]
    | 'その他';

