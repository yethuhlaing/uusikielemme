/**
 * Skeleton shown while the Finnish grammar page data is loading.
 * Matches the vocabulary-style layout for consistent UX.
 */
export default function FinnishGrammarLoading() {
    return (
        <div className="min-h-screen w-full text-foreground animate-pulse">
            <div className="fixed inset-0 pointer-events-none z-0 dot-grid" />

            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12 relative z-10">
                {/* TOC skeleton */}
                <aside className="lg:w-64 shrink-0 hidden md:block">
                    <div className="sticky top-24 space-y-1">
                        <div className="h-3 w-24 bg-muted rounded mb-6" />
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-4 bg-muted/70 rounded-lg"
                                style={{ width: `${80 + (i % 3) * 20}%` }}
                            />
                        ))}
                    </div>
                </aside>

                <main className="flex-1 min-w-0 space-y-16">
                    {/* Hero skeleton */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-card p-8 sm:p-10 rounded-3xl shadow-sm border border-border overflow-hidden">
                        <div className="flex-1 w-full space-y-4">
                            <div className="h-10 bg-muted rounded-lg w-3/4 max-w-md" />
                            <div className="h-4 bg-muted/70 rounded w-full max-w-xl" />
                            <div className="h-4 bg-muted/70 rounded w-5/6 max-w-lg" />
                        </div>
                        <div className="hidden md:block w-48 h-48 rounded-full bg-muted/70 shrink-0" />
                    </div>

                    {/* Section + cards skeleton */}
                    {[1, 2].map((section) => (
                        <div key={section} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-muted w-12 h-12" />
                                <div className="h-7 bg-muted rounded w-48" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div
                                        key={i}
                                        className="h-40 bg-card rounded-3xl border border-border p-6"
                                    >
                                        <div className="flex justify-between mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-muted" />
                                            <div className="w-12 h-12 rounded-full bg-muted" />
                                        </div>
                                        <div className="h-5 bg-muted rounded w-4/5 mb-3" />
                                        <div className="h-4 bg-muted/70 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}
