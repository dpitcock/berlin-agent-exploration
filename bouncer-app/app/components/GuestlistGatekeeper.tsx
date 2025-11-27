'use client';

import { useState } from 'react';

interface GuestlistGatekeeperProps {
    onVerify: (code: string) => Promise<boolean>;
}

export default function GuestlistGatekeeper({ onVerify }: GuestlistGatekeeperProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsVerifying(true);

        try {
            const isValid = await onVerify(code);
            if (!isValid) {
                setError('ACCESS DENIED');
            }
        } catch (err) {
            setError('SYSTEM ERROR');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 industrial-grid opacity-30" />

            {/* Animated background elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-900/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-900/10 rounded-full blur-[100px] animate-pulse delay-700" />

            <div
                className="relative z-10 w-full max-w-[1200px] bg-[#111] rounded-[2rem] backdrop-blur-sm overflow-hidden flex flex-col min-h-[50vh] sm:min-h-[60vh]"
                style={{
                    border: '3px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 0 60px rgba(220, 38, 38, 0.4)'
                }}
            >

                {/* Background Effects inside container */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
                    <div className="absolute inset-0 industrial-grid opacity-30" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col p-6 sm:p-10 md:p-16 lg:p-20">

                    {/* Top Section: Icon and Title */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center mb-12">
                        {/* Stop Hand Icon */}
                        <div className="mb-8 p-6 rounded-full bg-red-900/10 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.1)] animate-pulse">
                            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575V12a1.5 1.5 0 003 1.5h6.375a1.5 1.5 0 011.5 1.5v9H6.375a1.5 1.5 0 01-1.5-1.5V7.875a1.575 1.575 0 011.575-1.575v0z" />
                            </svg>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-600 mb-4 font-['Orbitron'] tracking-widest">RESTRICTED ACCESS</h1>
                        <p className="text-gray-500 font-mono text-sm sm:text-base tracking-wider">BERLIN UNDERGROUND SECURITY SYSTEM</p>
                    </div>

                    {/* Bottom Section: Form */}
                    <div className="w-full max-w-2xl mx-auto mt-auto">
                        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10 w-full">
                            <div>
                                <label className="block text-sm sm:text-base font-mono text-red-500/80 mb-4 tracking-widest text-center">Enter guestlist code:</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="w-full bg-black/50 border-2 border-red-900/50 rounded-xl px-6 py-4 sm:py-6 text-white font-mono text-center text-2xl sm:text-3xl tracking-[0.5em] focus:outline-none focus:border-red-500 focus:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all uppercase placeholder-red-900/30"
                                    placeholder="CODE"
                                    autoFocus
                                    disabled={isVerifying}
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm font-mono text-center animate-pulse bg-red-950/30 py-3 rounded-lg border border-red-900/50">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!code || isVerifying}
                                className={`
                  w-full font-bold py-5 sm:py-6 rounded-xl font-['Orbitron'] text-xl tracking-wider transition-all duration-300
                  ${code && !isVerifying
                                        ? 'bg-red-600 text-black shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:bg-red-500 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)]'
                                        : 'bg-red-900/20 border border-red-500/30 text-red-500/50 cursor-not-allowed'
                                    }
                `}
                            >
                                {isVerifying ? 'VERIFYING...' : 'VERIFY IDENTITY'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
