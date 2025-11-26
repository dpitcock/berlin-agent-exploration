'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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

    // Safety check for SSR
    if (typeof window === 'undefined') return null;

    return createPortal(
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(16px)',
                padding: '0.5rem'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '1200px',
                    backgroundColor: '#111',
                    borderRadius: '2rem',
                    border: verdict?.verdict === 'REJECT' ? '3px solid rgba(239, 68, 68, 0.5)' : '3px solid rgba(156, 163, 175, 0.5)',
                    boxShadow: verdict?.verdict === 'REJECT' ? '0 0 60px rgba(239, 68, 68, 0.4)' : '0 0 60px rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden'
                }}
            >
                {/* X Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white/70 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {/* Background Effects */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
                    <div className="absolute inset-0 industrial-grid opacity-30" />
                </div>

                {/* Content Container - with flex column to push button to bottom */}
                <div className="relative z-10 flex flex-col min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[900px]">
                    {/* Main Content Area */}
                    <div className="flex-1 p-6 sm:p-10 md:p-16 lg:p-20 xl:p-28 text-center flex flex-col items-center justify-center">

                        {/* --- PENDING STATE --- */}
                        {status === 'PENDING' && (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20 relative flex justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16">
                                    {/* Judging Eyes SVG - Two eyes */}
                                    <img
                                        src="/judging-eyes.svg"
                                        alt="Judging eye scanning"
                                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64"
                                    />
                                    <img
                                        src="/judging-eyes.svg"
                                        alt="Judging eye scanning"
                                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64"
                                    />
                                </div>

                                <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-['Orbitron'] mb-6 animate-pulse text-cyan-400 drop-shadow-[0_0_30px_rgba(0,255,255,0.8)] px-4">
                                    JUDGING OUTFIT...
                                </h3>
                                <p className="text-2xl sm:text-3xl md:text-4xl text-gray-400 font-mono px-4">
                                    Scanning vibes & aesthetics
                                </p>
                            </div>
                        )}

                        {/* --- RESULT STATE --- */}
                        {status === 'RESULT' && verdict && (
                            <div className="animate-in fade-in zoom-in duration-500 w-full flex flex-col items-center">

                                {/* Icon with animation */}
                                <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-bounce" style={{ animationDuration: '2s', animationIterationCount: '3' }}>
                                    {verdict.verdict === 'ACCEPT' && (
                                        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/10 border-4 sm:border-6 md:border-8 border-green-500 flex items-center justify-center shadow-[0_0_100px_rgba(34,197,94,0.8)] animate-pulse">
                                            <span className="text-[6rem] sm:text-[7rem] md:text-[9rem] lg:text-[10rem] xl:text-[12rem] drop-shadow-[0_0_20px_rgba(34,197,94,1)]">🎫</span>
                                        </div>
                                    )}

                                    {verdict.verdict === 'REJECT' && (
                                        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/10 border-4 sm:border-6 md:border-8 border-red-500 flex items-center justify-center shadow-[0_0_100px_rgba(239,68,68,0.8)] animate-pulse">
                                            <span className="text-[6rem] sm:text-[7rem] md:text-[9rem] lg:text-[10rem] xl:text-[12rem] drop-shadow-[0_0_20px_rgba(239,68,68,1)]">🚫</span>
                                        </div>
                                    )}

                                    {verdict.verdict === 'ERROR' && (
                                        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80 rounded-full bg-gradient-to-br from-gray-500/30 to-gray-600/10 border-4 sm:border-6 md:border-8 border-gray-500 flex items-center justify-center shadow-[0_0_80px_rgba(156,163,175,0.6)]">
                                            <span className="text-[6rem] sm:text-[7rem] md:text-[9rem] lg:text-[10rem] xl:text-[12rem] drop-shadow-[0_0_15px_rgba(156,163,175,0.8)]">🚬</span>
                                        </div>
                                    )}
                                </div>

                                {/* Title with pulsing glow */}
                                <h2 className={`
                    text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 font-['Orbitron'] tracking-tighter animate-pulse px-4
                    ${verdict.verdict === 'ACCEPT' ? 'text-green-400 drop-shadow-[0_0_30px_rgba(34,197,94,0.9)]' : ''}
                    ${verdict.verdict === 'REJECT' ? 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]' : ''}
                    ${verdict.verdict === 'ERROR' ? 'text-gray-400 drop-shadow-[0_0_20px_rgba(156,163,175,0.7)]' : ''}
                  `}>
                                    {verdict.verdict === 'ACCEPT' ? 'ENTRY GRANTED' : ''}
                                    {verdict.verdict === 'REJECT' ? 'REJECTED' : ''}
                                    {verdict.verdict === 'ERROR' ? 'SYSTEM ERROR' : ''}
                                </h2>

                                {/* Club Name Badge with glow */}
                                {verdict.verdict !== 'ERROR' && (
                                    <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                                        <span className={`
                        inline-block px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 lg:py-6 rounded-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest uppercase
                        ${verdict.verdict === 'ACCEPT' ? 'bg-gradient-to-r from-green-900/60 to-green-800/30 text-green-300 shadow-[0_0_40px_rgba(34,197,94,0.6)]' : ''}
                        ${verdict.verdict === 'REJECT' ? 'bg-gradient-to-r from-red-900/60 to-red-800/30 text-red-300 shadow-[0_0_40px_rgba(239,68,68,0.6)]' : ''}
                      `}>
                                            {verdict.club}
                                        </span>
                                    </div>
                                )}

                                {/* Message - enhanced with gradient and better styling */}
                                <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                                    <div className={`
                        rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 border-2 sm:border-3 md:border-4 relative overflow-hidden
                        ${verdict.verdict === 'ACCEPT' ? 'bg-gradient-to-br from-green-950/60 to-black/80 border-green-500/30' : ''}
                        ${verdict.verdict === 'REJECT' ? 'bg-gradient-to-br from-red-950/60 to-black/80 border-red-500/30' : ''}
                        ${verdict.verdict === 'ERROR' ? 'bg-gradient-to-br from-gray-900/60 to-black/80 border-gray-500/30' : ''}
                    `}>
                                        {/* Decorative corner accents */}
                                        <div className={`absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-t-2 border-l-2 sm:border-t-3 sm:border-l-3 md:border-t-4 md:border-l-4 rounded-tl-2xl sm:rounded-tl-3xl
                            ${verdict.verdict === 'ACCEPT' ? 'border-green-400/50' : ''}
                            ${verdict.verdict === 'REJECT' ? 'border-red-400/50' : ''}
                            ${verdict.verdict === 'ERROR' ? 'border-gray-400/50' : ''}
                        `}></div>
                                        <div className={`absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-b-2 border-r-2 sm:border-b-3 sm:border-r-3 md:border-b-4 md:border-r-4 rounded-br-2xl sm:rounded-br-3xl
                            ${verdict.verdict === 'ACCEPT' ? 'border-green-400/50' : ''}
                            ${verdict.verdict === 'REJECT' ? 'border-red-400/50' : ''}
                            ${verdict.verdict === 'ERROR' ? 'border-gray-400/50' : ''}
                        `}></div>

                                        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white font-light leading-relaxed text-center typewriter relative z-10 px-4">
                                            "{verdict.message}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Button Container - at the very bottom */}
                    {status === 'RESULT' && verdict && (
                        <div className="p-4 sm:p-6 md:p-8 border-t border-white/10">
                            <button
                                onClick={onClose}
                                className={`
                      w-full py-8 sm:py-12 md:py-16 lg:py-20 rounded-2xl font-bold text-2xl sm:text-3xl md:text-4xl tracking-wide transition-all duration-200 hover:scale-105 active:scale-95
                      ${verdict.verdict === 'ACCEPT'
                                        ? 'bg-green-600 hover:bg-green-500 text-black shadow-[0_0_40px_rgba(34,197,94,0.5)]'
                                        : verdict.verdict === 'REJECT'
                                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.5)]'
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
        </div>,
        document.body
    );
}
