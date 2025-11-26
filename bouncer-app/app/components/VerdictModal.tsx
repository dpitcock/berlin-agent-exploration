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
                padding: '2rem'
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
                    className="absolute top-6 right-6 z-10 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                >
                    <svg className="w-8 h-8 text-white/70 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {/* Background Effects */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
                    <div className="absolute inset-0 industrial-grid opacity-30" />
                </div>

                {/* Content Container - with flex column to push button to bottom */}
                <div className="relative z-10 flex flex-col min-h-[900px]">
                    {/* Main Content Area */}
                    <div className="flex-1 p-20 sm:p-24 lg:p-28 text-center flex flex-col items-center justify-center">

                        {/* --- PENDING STATE --- */}
                        {status === 'PENDING' && (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <div className="mb-20 relative flex justify-center">
                                    {/* Judging Eyes GIF */}
                                    <img
                                        src="/judging-eyes.gif"
                                        alt="Judging eyes scanning"
                                        className="w-[600px] h-auto rounded-3xl shadow-[0_0_80px_rgba(0,255,255,0.6)]"
                                    />
                                </div>

                                <h3 className="text-7xl sm:text-8xl lg:text-9xl font-bold font-['Orbitron'] mb-6 animate-pulse text-cyan-400 drop-shadow-[0_0_30px_rgba(0,255,255,0.8)]">
                                    JUDGING OUTFIT...
                                </h3>
                                <p className="text-4xl sm:text-5xl text-gray-400 font-mono">
                                    Scanning vibes & aesthetics
                                </p>
                            </div>
                        )}

                        {/* --- RESULT STATE --- */}
                        {status === 'RESULT' && verdict && (
                            <div className="animate-in fade-in zoom-in duration-500 w-full flex flex-col items-center">

                                {/* Icon with animation */}
                                <div className="mb-16 animate-bounce" style={{ animationDuration: '2s', animationIterationCount: '3' }}>
                                    {verdict.verdict === 'ACCEPT' && (
                                        <div className="w-80 h-80 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/10 border-8 border-green-500 flex items-center justify-center shadow-[0_0_100px_rgba(34,197,94,0.8)] animate-pulse">
                                            <span className="text-[12rem] drop-shadow-[0_0_20px_rgba(34,197,94,1)]">🎟️</span>
                                        </div>
                                    )}

                                    {verdict.verdict === 'REJECT' && (
                                        <div className="w-80 h-80 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/10 border-8 border-red-500 flex items-center justify-center shadow-[0_0_100px_rgba(239,68,68,0.8)] animate-pulse">
                                            <span className="text-[12rem] drop-shadow-[0_0_20px_rgba(239,68,68,1)]">🚫</span>
                                        </div>
                                    )}

                                    {verdict.verdict === 'ERROR' && (
                                        <div className="w-80 h-80 rounded-full bg-gradient-to-br from-gray-500/30 to-gray-600/10 border-8 border-gray-500 flex items-center justify-center shadow-[0_0_80px_rgba(156,163,175,0.6)]">
                                            <span className="text-[12rem] drop-shadow-[0_0_15px_rgba(156,163,175,0.8)]">🚬</span>
                                        </div>
                                    )}
                                </div>

                                {/* Title with pulsing glow */}
                                <h2 className={`
                    text-7xl sm:text-8xl lg:text-9xl font-black mb-8 font-['Orbitron'] tracking-tighter animate-pulse
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
                                    <div className="mb-12">
                                        <span className={`
                        inline-block px-12 py-6 rounded-full text-7xl sm:text-8xl font-bold tracking-widest uppercase
                        ${verdict.verdict === 'ACCEPT' ? 'bg-gradient-to-r from-green-900/60 to-green-800/30 text-green-300 shadow-[0_0_40px_rgba(34,197,94,0.6)]' : ''}
                        ${verdict.verdict === 'REJECT' ? 'bg-gradient-to-r from-red-900/60 to-red-800/30 text-red-300 shadow-[0_0_40px_rgba(239,68,68,0.6)]' : ''}
                      `}>
                                            {verdict.club}
                                        </span>
                                    </div>
                                )}

                                {/* Message - enhanced with gradient and better styling */}
                                <div className="w-full px-12 sm:px-16 lg:px-24">
                                    <div className={`
                        rounded-3xl p-14 border-4 relative overflow-hidden
                        ${verdict.verdict === 'ACCEPT' ? 'bg-gradient-to-br from-green-950/60 to-black/80 border-green-500/30' : ''}
                        ${verdict.verdict === 'REJECT' ? 'bg-gradient-to-br from-red-950/60 to-black/80 border-red-500/30' : ''}
                        ${verdict.verdict === 'ERROR' ? 'bg-gradient-to-br from-gray-900/60 to-black/80 border-gray-500/30' : ''}
                    `}>
                                        {/* Decorative corner accents */}
                                        <div className={`absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 rounded-tl-3xl
                            ${verdict.verdict === 'ACCEPT' ? 'border-green-400/50' : ''}
                            ${verdict.verdict === 'REJECT' ? 'border-red-400/50' : ''}
                            ${verdict.verdict === 'ERROR' ? 'border-gray-400/50' : ''}
                        `}></div>
                                        <div className={`absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 rounded-br-3xl
                            ${verdict.verdict === 'ACCEPT' ? 'border-green-400/50' : ''}
                            ${verdict.verdict === 'REJECT' ? 'border-red-400/50' : ''}
                            ${verdict.verdict === 'ERROR' ? 'border-gray-400/50' : ''}
                        `}></div>

                                        <p className="text-6xl sm:text-7xl lg:text-8xl text-white font-light leading-relaxed text-center typewriter relative z-10">
                                            "{verdict.message}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Button Container - at the very bottom */}
                    {status === 'RESULT' && verdict && (
                        <div className="p-8 border-t border-white/10">
                            <button
                                onClick={onClose}
                                className={`
                      w-full py-48 rounded-2xl font-bold text-4xl tracking-wide transition-all duration-200 hover:scale-105 active:scale-95
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
