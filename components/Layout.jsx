import Head from "next/head";
import Header from "./Header";

export default function Layout ({ title, children }) {
    return (
        <div className="bg-gray-50 min-h-screen pb-40">
            <Head>
                <title>{title ?? 'NO TITLE'}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <div className="max-w-4xl mx-auto px-5">
                <Header />
                <div className="my-4">
                    { children }
                </div>
            </div>
        </div>
    )
}