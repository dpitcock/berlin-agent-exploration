import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export default function TestImages() {
    // Get images from the public/test-images directory
    const imagesDirectory = path.join(process.cwd(), 'public/test-images');
    let imageFiles: string[] = [];

    try {
        imageFiles = fs.readdirSync(imagesDirectory).filter(file =>
            /\.(png|jpg|jpeg|webp)$/i.test(file)
        );
    } catch (error) {
        console.error('Error reading test images directory:', error);
        // Fallback if directory reading fails (e.g. in some build environments)
        imageFiles = [
            'carnival-festival-goer.png',
            'female-anime.png',
            'fetish-unicorn.png',
            'goth-full-clothed-guy.png',
            'group-at-club-portrait-only.png',
            'party-racoon.png',
            'random-landscape.png'
        ];
    }

    return (
        <div className="min-h-screen bg-black relative text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 industrial-grid opacity-30" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
                <header className="text-center mb-16">
                    <Link href="/" className="inline-block mb-8 text-cyan-400 hover:text-cyan-300 transition-colors font-mono tracking-widest text-sm">
                        ← BACK TO BOUNCER
                    </Link>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 font-['Orbitron']">
                        TEST <span className="neon-pink">SUBJECTS</span>
                    </h1>
                    <p className="text-gray-400 font-mono max-w-2xl mx-auto">
                        Need a photo to test the bouncer? Use these AI-generated test subjects.
                        <br />
                        <span className="text-xs text-gray-600 mt-2 block">
                            (All images below were generated via AI and do not represent real people)
                        </span>
                    </p>
                </header>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    {imageFiles.map((image, index) => (
                        <div
                            key={image}
                            className="group relative bg-[#111] border-2 border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]"
                        >
                            <div className="aspect-square relative overflow-hidden">
                                <Image
                                    src={`/test-images/${image}`}
                                    alt={`Test image ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Download Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <a
                                        href={`/test-images/${image}`}
                                        download
                                        className="bg-cyan-500 text-black font-bold py-3 px-6 rounded-full font-['Orbitron'] hover:bg-cyan-400 transform hover:scale-105 transition-all"
                                    >
                                        DOWNLOAD
                                    </a>
                                </div>
                            </div>
                            <div className="p-4 border-t border-white/10 bg-[#1a1a1a]">
                                <p className="text-xs font-mono text-gray-400 truncate">
                                    {image}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
