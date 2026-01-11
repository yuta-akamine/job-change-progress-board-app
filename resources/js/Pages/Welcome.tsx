import { Head, Link } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Auth {
    user: User | null;
}

interface Props {
    auth: Auth;
}

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <header className="flex items-center justify-between py-6">
                        <h1 className="text-xl font-semibold text-gray-900">
                            就活ステータス管理ボード
                        </h1>
                        <nav className="flex gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    ダッシュボードへ
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        ログイン
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        新規登録
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="py-12 sm:py-16 lg:py-20">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                                就職・転職活動の応募状況を
                                <br className="hidden sm:block" />
                                カンバン形式で一目管理
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                応募企業の選考状況をカンバン形式で可視化し、進捗を一目で把握できます。
                            </p>

                            <div className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-3">
                                <div className="rounded-lg bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        応募情報の登録
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        企業名、職種、面接日、メモなどを登録して管理できます。
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        カンバン表示
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        ステータスごとにカンバン形式で表示され、進捗状況が一目瞭然です。
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        ドラッグ＆ドロップ
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        カードをドラッグして列を移動するだけで、ステータスを更新できます。
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
                                    >
                                        ダッシュボードへ
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                        <Link
                                            href={route('register')}
                                            className="inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
                                        >
                                            新規登録
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-block rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            ログイン
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

