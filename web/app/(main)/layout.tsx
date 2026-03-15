export default function MainLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="min-h-screen  flex-1 w-full max-w-9xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
            {children}
        </main>
    );
}
