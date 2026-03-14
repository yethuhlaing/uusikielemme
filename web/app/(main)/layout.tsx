import Link from "next/link";

export default function MainLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="layout">
            <header className="site-header">
                <Link href="/" className="site-title">
                    Uusi kielemme
                </Link>
                <nav className="site-nav">
                    <Link href="/">Home</Link>
                    <Link href="/how-it-works">How it Works</Link>
                    <Link href="/finnish-grammar">Finnish Grammar</Link>
                    <Link href="/finnish-vocabulary">Finnish Vocabulary</Link>
                </nav>
            </header>
            <main className="site-main">{children}</main>
            <footer className="site-footer">
                <p>Uusi kielemme – Finnish for Busy People</p>
            </footer>
        </div>
    );
}
