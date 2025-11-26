'use client';

import { useEffect, useState } from 'react';

interface Verdict {
    verdict: 'ACCEPT' | 'REJECT' | 'ERROR';
    message: string;
    club: string;
}

interface VerdictModalProps {
    isOpen: boolean;
    status: 'PENDING' | 'RESULT';
    verdict: Verdict | null;
    onClose: () => void;
}

export default function VerdictModal({ isOpen, status, verdict, onClose }: VerdictModalProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show) return null;

    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6
        transition-all duration-300
        ${isOpen ? 'opacity-100 backdrop-blur-xl bg-black/80' : 'opacity-0 backdrop-blur-none pointer-events-none'}
      `}
        >
            <div
                className={`
          relative w-full max-w-lg mx-auto
          bg-[#111] border-2 rounded-3xl overflow-hidden shadow-2xl
          modal-content
          ${status === 'PENDING'
                        ? 'border-cyan-500/30 shadow-cyan-500/20'
                        : verdict?.verdict === 'ACCEPT'
                            ? 'border-green-500/50 shadow-green-500/30'
                            : verdict?.verdict === 'REJECT'
                                ? 'border-red-500/50 shadow-red-500/30'
                                : 'border-gray-500/50 shadow-gray-500/30'
                    }
        `}
            >
                {/* Background Effects */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
                    <div className="absolute inset-0 industrial-grid opacity-30" />
                </div>

                <div className="relative z-10 p-8 sm:p-12 text-center min-h-[400px] flex flex-col items-center justify-center">

                    {/* --- PENDING STATE --- */}
                    {status === 'PENDING' && (
                        <div className="animate-in fade-in zoom-in duration-300">
                            <div className="mb-8 relative">
                                {/* Eyes Container */}
                                <div className="flex gap-4 justify-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-cyan-500/50 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                                        <div className="w-6 h-6 rounded-full bg-cyan-400 eye-pupil shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-cyan-500/50 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                                        <div className="w-6 h-6 rounded-full bg-cyan-400 eye-pupil shadow-[0_0_10px_rgba(0,255,255,0.8)]" style={{ animationDelay: '0.1s' }} />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold font-['Orbitron'] mb-2 animate-pulse text-cyan-400">
                                JUDGING OUTFIT...
                            </h3>
                            <p className="text-gray-400 font-mono text-sm">
                                Scanning vibes & aesthetics
                            </p>
                        </div>
                    )}

                    {/* --- RESULT STATE --- */}
                    {status === 'RESULT' && verdict && (
                        <div className="animate-in fade-in zoom-in duration-500 w-full">

                            {/* Icon */}
                            <div className="mb-6 flex justify-center">
                                {verdict.verdict === 'ACCEPT' && (
                                    <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                        <svg className="w-12 h-12 text-green-400 animate-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                )}

                                {verdict.verdict === 'REJECT' && (
                                    <div className="w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                                        <svg className="w-12 h-12 text-red-500 animate-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                        </svg>
                                    </div>
                                )}

                                {verdict.verdict === 'ERROR' && (
                                    <div className="w-24 h-24 rounded-full bg-gray-500/20 border-2 border-gray-500 flex items-center justify-center">
                                        <span className="text-4xl">🚬</span>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <h2 className={`
                text-4xl sm:text-5xl font-black mb-2 font-['Orbitron'] tracking-tighter
                ${verdict.verdict === 'ACCEPT' ? 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]' : ''}
                ${verdict.verdict === 'REJECT' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}
                ${verdict.verdict === 'ERROR' ? 'text-gray-400' : ''}
              `}>
                                {verdict.verdict === 'ACCEPT' ? 'ENTRY GRANTED' : ''}
                                {verdict.verdict === 'REJECT' ? 'REJECTED' : ''}
                                {verdict.verdict === 'ERROR' ? 'SYSTEM ERROR' : ''}
                            </h2>

                            {/* Club Name Badge */}
                            {verdict.verdict !== 'ERROR' && (
                                <div className="mb-6">
                                    <span className={`
                    inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border
                    ${verdict.verdict === 'ACCEPT' ? 'bg-green-900/30 border-green-500/30 text-green-300' : ''}
                    ${verdict.verdict === 'REJECT' ? 'bg-red-900/30 border-red-500/30 text-red-300' : ''}
                  `}>
                                        {verdict.club}
                                    </span>
                                </div>
                            )}

                            {/* Message */}
                            <div className="bg-black/40 rounded-xl p-4 mb-8 border border-white/5">
                                <p className="text-lg text-gray-200 font-light leading-relaxed">
                                    "{verdict.message}"
                                </p>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={onClose}
                                className={`
                  w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                  ${verdict.verdict === 'ACCEPT'
                                        ? 'bg-green-600 hover:bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                                        : verdict.verdict === 'REJECT'
                                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                                    }
                `}
                            >
                                {verdict.verdict === 'ACCEPT' ? 'ENTER CLUB' : 'TRY AGAIN'}
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
