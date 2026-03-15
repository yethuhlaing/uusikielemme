export default function MainLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 w-full max-w-8xl mx-auto px-4 py-8 sm:px-6">
                {children}
            </main>
            <footer className="border-t border-border px-4 py-4 sm:px-6 text-center text-muted-foreground text-sm">
                <p>Uusi kielemme – Finnish for Busy People</p>
            </footer>
        </div>
    );
}
