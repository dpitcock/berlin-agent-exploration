'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import VerdictModal from './components/VerdictModal';

type Club = 'Berghain' | 'KitKat' | 'Sisyphus' | null;

interface Verdict {
  verdict: 'ACCEPT' | 'REJECT' | 'ERROR';
  message: string;
  club: string;
  _mock?: boolean;
}

export default function Home() {
  const [selectedClub, setSelectedClub] = useState<Club>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  const [mockFailure, setMockFailure] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const clubs = [
    {
      name: 'Berghain' as Club,
      tagline: 'TECHNO TEMPLE',
      description: 'All black. No smiles. No mercy.',
      logo: '/logos/berghain.svg',
      accentColor: 'from-gray-900 to-black',
      borderColor: 'border-white/20',
      hoverBorderColor: 'hover:border-white/50',
      shadowColor: 'shadow-white/10',
      hoverShadowColor: 'hover:shadow-white/30',
      activeShadowColor: 'active:shadow-white/50',
    },
    {
      name: 'KitKat' as Club,
      tagline: 'FETISH PLAYGROUND',
      description: 'Leather. Latex. Liberation.',
      logo: '/logos/kitkat.svg',
      accentColor: 'from-pink-600 to-purple-600',
      borderColor: 'border-pink-500/20',
      hoverBorderColor: 'hover:border-pink-500/50',
      shadowColor: 'shadow-pink-500/10',
      hoverShadowColor: 'hover:shadow-pink-500/40',
      activeShadowColor: 'active:shadow-pink-500/60',
    },
    {
      name: 'Sisyphus' as Club,
      tagline: 'RAVE UTOPIA',
      description: 'Color. Chaos. Creativity.',
      logo: '/logos/sisyphus.svg',
      accentColor: 'from-cyan-500 to-blue-500',
      borderColor: 'border-cyan-500/20',
      hoverBorderColor: 'hover:border-cyan-500/50',
      shadowColor: 'shadow-cyan-500/10',
      hoverShadowColor: 'hover:shadow-cyan-500/40',
      activeShadowColor: 'active:shadow-cyan-500/60',
    },
  ];

  // Utility to compress image
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 1500;
        const MAX_HEIGHT = 1500;

        // Calculate new dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Fill with white background (fixes transparency issues when converting PNG to JPEG)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          0.8 // 80% quality
        );
      };
      img.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPG, PNG, WEBP)');
        return;
      }

      try {
        // Compress the image
        const compressedFile = await compressImage(file);

        setImageFile(compressedFile);

        // Create preview from compressed file
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImage(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('Failed to process image. Please try again.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedClub) return;

    setIsSubmitting(true);
    setVerdict(null);

    try {
      const formData = new FormData();
      formData.append('club', selectedClub);
      if (imageFile) {
        formData.append('photo', imageFile);
      }
      // Add mock failure flag if in mock mode
      if (mockFailure) {
        formData.append('mockFailure', 'true');
      }

      const response = await fetch('/api/judge', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setVerdict(data);
      if (data._mock) {
        setIsMockMode(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setVerdict({
        verdict: 'ERROR',
        message: 'I quit being a bouncer',
        club: selectedClub,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedClub(null);
    setUploadedImage(null);
    setImageFile(null);
    setVerdict(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Background Effects Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Industrial grid background */}
        <div className="absolute inset-0 industrial-grid opacity-50" />

        {/* Scanlines effect */}
        <div className="absolute inset-0 scanlines" />

        {/* Disco ball ambient lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] disco-ball" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] disco-ball" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block mb-4 sm:mb-6">
            <div className="text-xs sm:text-sm font-mono tracking-widest text-cyan-400 mb-2 sm:mb-3 neon-cyan">
              BERLIN UNDERGROUND
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter mb-3 sm:mb-4 chrome-text font-['Orbitron']">
              CLUB BOUNCER
            </h1>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/50 to-transparent mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 font-light tracking-wide">
              AI-Powered Door Selection System
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 font-mono">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span>SYSTEM ONLINE</span>
            <span className="text-gray-800">|</span>
            <span>POWERED BY n8n + OpenAI</span>
          </div>
        </header>

        {/* Mock Mode Banner */}
        {isMockMode && (
          <div className="mb-8 mx-auto max-w-4xl">
            <div className="bg-yellow-900/30 border-2 border-yellow-500/50 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl">⚠️</span>
                <h3 className="text-xl font-bold text-yellow-400 font-['Orbitron']">DEMO MODE</h3>
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-sm text-yellow-200/80 font-mono mb-4">
                Not connected to n8n. Using randomized responses for testing.
              </p>

              {/* Simulate Failure Checkbox */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <input
                  type="checkbox"
                  id="mockFailure"
                  checked={mockFailure}
                  onChange={(e) => setMockFailure(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-yellow-500/50 bg-yellow-900/50 checked:bg-red-600 cursor-pointer"
                />
                <label htmlFor="mockFailure" className="text-sm font-mono text-yellow-200 cursor-pointer select-none">
                  🚬 Simulate Failure (Bouncer quits)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Club Selection */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center font-['Orbitron'] tracking-tight">
            SELECT YOUR <span className="neon-cyan">DESTINATION</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-[1600px] mx-auto px-4">
            {clubs.map((club) => (
              <button
                key={club.name}
                onClick={() => setSelectedClub(club.name)}
                className={`
                  group relative overflow-hidden
                  rounded-[2rem] p-6 sm:p-8 m-2
                  transition-all duration-300 ease-out
                  transform
                  max-w-[500px] mx-auto w-full
                  aspect-square
                  flex flex-col items-center justify-center
                  border-2
                  bg-[#1a1a1a]
                  ${selectedClub === club.name
                    ? `
                      border-white/30
                      shadow-[0_0_50px_rgba(255,255,255,0.15)]
                      scale-105 -translate-y-1
                    `
                    : `
                      border-white/10
                      shadow-lg
                      hover:border-white/20
                      hover:scale-[1.02]
                      hover:-translate-y-0.5
                      active:border-cyan-500/50
                      active:shadow-[0_0_40px_rgba(0,255,255,0.3)]
                      active:scale-100
                      active:translate-y-0
                    `
                  }
                  ${selectedClub && selectedClub !== club.name ? 'opacity-30 blur-[1px]' : ''}
                `}
              >
                {/* Logo */}
                <div className={`
                  relative mb-4 sm:mb-6 md:mb-8 h-16 sm:h-20 md:h-24 w-full flex items-center justify-center transition-all duration-300
                  group-hover:scale-105 group-active:scale-95
                  ${selectedClub === club.name ? 'neon-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]' : ''}
                  group-active:neon-cyan group-active:drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]
                `}>
                  <Image
                    src={club.logo}
                    alt={`${club.name} logo`}
                    width={200}
                    height={100}
                    className="w-auto h-full object-contain"
                    priority
                  />
                </div>

                {/* Club Name */}
                <h3
                  className={`
                    text-xl sm:text-2xl font-bold mb-2 font-['Orbitron'] tracking-widest uppercase !text-white
                    ${selectedClub === club.name ? 'neon-cyan' : ''}
                    group-active:neon-cyan
                  `}
                  style={{ color: 'white' }}
                >
                  {club.name}
                </h3>

                {/* Tagline */}
                <div
                  className="text-xs sm:text-sm font-mono tracking-[0.2em] mb-3 sm:mb-4 !text-gray-300 group-hover:!text-white transition-colors"
                  style={{ color: '#d1d5db' }}
                >
                  {club.tagline}
                </div>

                {/* Description */}
                <p
                  className="text-xs sm:text-sm leading-relaxed max-w-[85%] text-center font-light !text-gray-400 group-hover:!text-gray-200 transition-colors"
                  style={{ color: '#9ca3af' }}
                >
                  {club.description}
                </p>

                {/* Large Glowing Checkmark */}
                {selectedClub === club.name && (
                  <div className="absolute top-6 right-6 animate-in zoom-in-50 duration-300">
                    <div className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.8)] flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Photo Upload */}
        {selectedClub && (
          <section className="mb-24 sm:mb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center font-['Orbitron'] tracking-tight">
              ADD YOUR <span className="neon-pink">PHOTO</span>
            </h2>

            <div className="max-w-[1600px] mx-auto px-4">
              {/* Image Preview */}
              {uploadedImage && (
                <div className="relative w-full flex flex-col items-center mb-12">
                  <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl">
                    <Image
                      src={uploadedImage}
                      alt="Your outfit"
                      width={800}
                      height={800}
                      className="w-full h-auto object-contain max-h-[600px]"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImage(null);
                      setImageFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      if (cameraInputRef.current) cameraInputRef.current.value = '';
                    }}
                    className="absolute -top-6 -right-6 bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] z-10"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Upload and Camera Buttons */}
              {!uploadedImage && (
                <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-[1600px] mx-auto px-4">
                  {/* Upload from Files Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      group relative overflow-hidden
                      rounded-[2rem] p-6 sm:p-8
                      transition-all duration-300 ease-out
                      transform
                      w-[200px] sm:w-[220px]
                      aspect-square
                      flex flex-col items-center justify-start
                      border-2
                      bg-[#1a1a1a]
                      border-white/10
                      shadow-lg
                      hover:border-white/20
                      hover:scale-[1.02]
                      hover:-translate-y-0.5
                      active:border-cyan-500/50
                      active:shadow-[0_0_40px_rgba(0,255,255,0.3)]
                      active:scale-100
                      active:translate-y-0
                      p-6 sm:p-8
                    `}
                  >
                    {/* File Icon */}
                    <div className="mt-4 sm:mt-6 mb-4 sm:mb-6 h-16 sm:h-20 w-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-active:scale-95 group-active:neon-cyan group-active:drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                      <svg className="w-16 h-16 sm:w-20 sm:h-20 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-6 4h6m-6-8h3" />
                      </svg>
                    </div>

                    {/* Button Text */}
                    <h3 className="text-lg sm:text-xl font-bold mb-2 font-['Orbitron'] tracking-widest uppercase !text-white group-active:neon-cyan" style={{ color: 'white' }}>
                      UPLOAD
                    </h3>

                    <div className="text-xs font-mono tracking-[0.2em] !text-gray-300 group-hover:!text-white transition-colors" style={{ color: '#d1d5db' }}>
                      FROM DEVICE
                    </div>
                  </button>

                  {/* OR Divider */}
                  <div className="flex items-center justify-center px-8 py-6">
                    <span className="text-2xl sm:text-3xl font-bold font-['Orbitron'] text-white/40 tracking-wider">OR</span>
                  </div>

                  {/* Camera Capture Button */}
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className={`
                      group relative overflow-hidden
                      rounded-[2rem] p-6 sm:p-8
                      transition-all duration-300 ease-out
                      transform
                      w-[200px] sm:w-[220px]
                      aspect-square
                      flex flex-col items-center justify-start
                      border-2
                      bg-[#1a1a1a]
                      border-white/10
                      shadow-lg
                      hover:border-white/20
                      hover:scale-[1.02]
                      hover:-translate-y-0.5
                      active:border-cyan-500/50
                      active:shadow-[0_0_40px_rgba(0,255,255,0.3)]
                      active:scale-100
                      active:translate-y-0
                      p-6 sm:p-8
                    `}
                  >
                    {/* Camera Icon */}
                    <div className="mt-4 sm:mt-6 mb-4 sm:mb-6 h-16 sm:h-20 w-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-active:scale-95 group-active:neon-cyan group-active:drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                      <svg className="w-16 h-16 sm:w-20 sm:h-20 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>

                    {/* Button Text */}
                    <h3 className="text-lg sm:text-xl font-bold mb-2 font-['Orbitron'] tracking-widest uppercase !text-white group-active:neon-cyan" style={{ color: 'white' }}>
                      CAMERA
                    </h3>

                    <div className="text-xs font-mono tracking-[0.2em] !text-gray-300 group-hover:!text-white transition-colors" style={{ color: '#d1d5db' }}>
                      TAKE PHOTO
                    </div>
                  </button>
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </section>
        )}

        {/* Submit Button */}
        {selectedClub && (
          <>
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500 mb-16 sm:mb-24 lg:mb-32 pt-16 sm:pt-20 lg:pt-24 px-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                group relative w-full max-w-[500px] py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32
                rounded-[2rem] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black
                transition-all duration-200 font-['Orbitron'] tracking-wider
                uppercase border-2
                ${isSubmitting
                    ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
                    : uploadedImage
                      ? 'bg-[#1a1a1a] text-white border-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:bg-[#252525] hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 hover:shadow-[0_0_80px_rgba(34,211,238,0.6)] active:scale-95 active:shadow-[0_0_100px_rgba(34,211,238,0.8)]'
                      : 'bg-[#1a1a1a] text-gray-600 border-white/5 cursor-not-allowed hover:border-white/10'
                  }
              `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
                    <span className="inline-block w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 sm:border-3 md:border-4 border-black/30 border-t-black rounded-full animate-spin" />
                    ANALYZING...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
                    FACE THE BOUNCER
                    <span className="text-3xl sm:text-4xl md:text-5xl">🚪</span>
                  </span>
                )}
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 sm:mt-20 lg:mt-24 text-center">
          <div className="inline-block">
            <div className="h-px w-64 bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6" />
            <p className="text-xs sm:text-sm text-gray-600 font-mono mb-2">
              BUILT WITH NEXT.JS • n8n • OPENAI VISION
            </p>
            <p className="text-xs text-gray-700 font-mono">
              A SATIRICAL AI AGENT FOR THE AGENT ROAST SHOW
            </p>
            <div className="mt-4 text-xs text-gray-800 font-mono">
              BERLIN UNDERGROUND
            </div>

            <div className="mt-8">
              <a href="/test-images" className="text-xs font-mono text-cyan-900/50 hover:text-cyan-600 transition-colors border-b border-transparent hover:border-cyan-600 pb-0.5">
                Need some images to try? Click here
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* VERDICT MODAL */}
      <VerdictModal
        isOpen={isSubmitting || verdict !== null}
        status={isSubmitting ? 'PENDING' : 'RESULT'}
        verdict={verdict}
        onClose={resetForm}
      />
    </div>
  );
}
