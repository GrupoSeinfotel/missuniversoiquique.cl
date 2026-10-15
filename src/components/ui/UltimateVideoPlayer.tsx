"use client";

import { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaExpand, FaSpinner, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface UltimateVideoPlayerProps {
    src: string;
    poster?: string;
    className?: string;
}

export default function UltimateVideoPlayer({ src, poster }: UltimateVideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [progress, setProgress] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    const handleProgress = () => {
        if (!videoRef.current) return;
        const duration = videoRef.current.duration;
        if (duration > 0) {
            setProgress((videoRef.current.currentTime / duration) * 100);
            if (videoRef.current.buffered.length > 0) {
                const end = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
                setBuffered((end / duration) * 100);
            }
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const clickedValue = (x / rect.width) * videoRef.current.duration;
        videoRef.current.currentTime = clickedValue;
    };

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, []);

    function formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    return (
        <div 
            ref={containerRef}
            style={{ 
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Preloader */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(0,0,0,0.4)",
                            backdropFilter: "blur(4px)"
                        }}
                    >
                        <FaSpinner style={{ color: "white", fontSize: "40px" }} className="animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>

            <video
                ref={videoRef}
                src={src}
                poster={poster}
                loop
                playsInline
                preload="auto"
                onClick={togglePlay}
                onTimeUpdate={handleProgress}
                onProgress={handleProgress}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onPlaying={() => { setIsPlaying(true); setIsLoading(false); }}
                onPause={() => setIsPlaying(false)}
                style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "contain", 
                    cursor: "pointer" 
                }}
            />

            {/* Custom Controls Overlay */}
            <AnimatePresence>
                {showControls && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 10,
                            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "20px"
                        }}
                    >
                        {/* Top Bar */}
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "white",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    transition: "transform 0.2s"
                                }}
                            >
                                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>
                        </div>

                        {/* Center Play Button */}
                        <div 
                            onClick={togglePlay}
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer"
                            }}
                        >
                            {!isPlaying && (
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        background: "rgba(255,255,255,0.2)",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backdropFilter: "blur(5px)"
                                    }}
                                >
                                    <FaPlay style={{ color: "white", fontSize: "24px", marginLeft: "4px" }} />
                                </motion.div>
                            )}
                        </div>

                        {/* Bottom Bar: Progress & Controls */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div 
                                style={{
                                    width: "100%",
                                    height: "4px",
                                    background: "rgba(255,255,255,0.2)",
                                    borderRadius: "2px",
                                    cursor: "pointer",
                                    position: "relative"
                                }}
                                onClick={handleSeek}
                            >
                                <div 
                                    style={{
                                        height: "100%",
                                        background: "var(--accent-pink)",
                                        borderRadius: "2px",
                                        width: `${progress}%`,
                                        position: "relative"
                                    }}
                                />
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                    style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}
                                >
                                    {isPlaying ? <FaPause /> : <FaPlay />}
                                </button>
                                
                                <div style={{ fontSize: "10px", color: "white", fontWeight: "bold", opacity: 0.8 }}>
                                    {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(videoRef.current?.duration || 0)}
                                </div>

                                <button 
                                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                                    style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}
                                >
                                    <FaExpand />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Play Overlay (Visible when paused and no controls) */}
            {!isPlaying && !showControls && (
                <div 
                    onClick={togglePlay}
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        background: "rgba(0,0,0,0.2)"
                    }}
                >
                    <div style={{
                        width: "50px",
                        height: "50px",
                        background: "var(--accent-pink)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 20px rgba(0,0,0,0.4)"
                    }}>
                        <FaPlay style={{ color: "white", fontSize: "20px", marginLeft: "3px" }} />
                    </div>
                </div>
            )}
        </div>
    );
}
