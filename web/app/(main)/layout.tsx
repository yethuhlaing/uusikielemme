export default function MainLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="flex-1 flex flex-col w-full max-w-9xl mx-auto px-6 py-4 sm:px-8 lg:px-12">
            {children}
        </main>
    );
}
