"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { gsap } from 'gsap';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ResponsiveSlider = ({ sliderId = 'home-main' }: { sliderId?: string }) => {
    const [sliderData, setSliderData] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });
    const containerRef = useRef<HTMLElement>(null);
    const [swiperInstance, setSwiperInstance] = useState<any>(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/admin/slider.json?t=${Date.now()}`);
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setSliderData(data);
            } catch (e) {
                console.error("Slider Load Error", e);
            }
        };
        fetchData();

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sliderId]);

    // Trigger animation re-run when view mode changes (Mobile/Desktop switch re-renders DOM)
    useEffect(() => {
        if (swiperInstance) {
            // Small timeout to ensure DOM is repainted
            setTimeout(() => animateSlide(swiperInstance), 50);
        }
    }, [isMobile, swiperInstance]);

    const sliderSettings = sliderData?.settings || {};
    const slides = sliderData?.slides || [];
    const baseWidth = isMobile ? 360 : 1920;
    const baseHeight = isMobile
        ? (sliderSettings.canvasHeightMobile || 600)
        : (sliderSettings.canvasHeightDesktop || 800);

    // Robust Resize Logic
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const w = entry.contentRect.width;
                if (w > 0) {
                    const scale = w / baseWidth;
                    const h = baseHeight * scale;
                    setDimensions({ width: w, height: h, scale });
                }
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [baseWidth, baseHeight]);

    // Animation Logic
    const animateSlide = (swiper: any) => {
        if (!swiper || !swiper.slides) return;
        const activeSlide = swiper.slides[swiper.activeIndex];
        // Swiper loop can create duplicates, ensure we target the current active one correct

        if (!activeSlide) return;

        const prevSlide = swiper.slides[swiper.previousIndex];

        if (prevSlide && prevSlide !== activeSlide) {
            gsap.set(prevSlide.querySelectorAll('.slider-layer'), { opacity: 0, clearProps: "transform,opacity,visibility,scale" });
        }

        const layers = activeSlide.querySelectorAll('.slider-layer');
        layers.forEach((el: HTMLElement) => {
            const animType = el.dataset.animation;
            const customDelay = parseFloat(el.dataset.delay || '');
            const delay = !isNaN(customDelay) ? customDelay : 0.2 + (parseFloat(el.dataset.index || '0') * 0.1);
            const targetOpacity = parseFloat(el.dataset.targetOpacity || '1') || 1;

            // FORCE VISIBILITY - bypassing GSAP animation for now to solve 'invisible layers'
            gsap.killTweensOf(el);
            gsap.set(el, { opacity: targetOpacity, visibility: 'visible', clearProps: "transform" });
        });
    };

    if (!sliderData) return <div className="w-full bg-black/20 animate-pulse" style={{ height: '600px' }}></div>;

    const currentScale = dimensions.scale || 1;
    const containerHeight = dimensions.height || baseHeight;
    const delayTime = sliderSettings.delay || 5000;

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden bg-black"
            style={{
                height: '100vh',
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)', // Break out of any parent container
                marginRight: 'calc(-50vw + 50%)',
                maxWidth: '100vw'
            }}
        >
            <Swiper
                onSwiper={setSwiperInstance}
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                speed={1000}
                autoplay={{ delay: delayTime, disableOnInteraction: false }}
                loop={true}
                pagination={{ clickable: true }}
                onSlideChangeTransitionStart={animateSlide}
                onInit={animateSlide}
                className="h-full w-full"
                style={{ height: '100%', width: '100%' }}
            >
                {slides.map((slide: any) => (
                    <SwiperSlide key={slide.id} className="relative overflow-hidden w-full h-full">
                        {isMobile ? (
                            /* --- MOBILE STRATEGY: Decoupled Background and Layers --- */
                            <>
                                {/* 1. Pure Background (Covers Screen, No Distortion) */}
                                {slide.backgroundSrc && (
                                    slide.backgroundSrc.match(/\.(mp4|webm)(\?.*)?$/i) ? (
                                        <video
                                            src={slide.backgroundSrc}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={slide.backgroundSrc}
                                            alt=""
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )
                                )}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.3)'
                                }}></div>

                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        pointerEvents: 'none',
                                        transformOrigin: 'top left',
                                        zIndex: 20,
                                        ...(() => {
                                            let vw = typeof window !== 'undefined' ? window.innerWidth : 360;
                                            let scale = vw / baseWidth;
                                            return {
                                                width: baseWidth,
                                                height: baseHeight,
                                                transform: `scale(${scale})`
                                            };
                                        })()
                                    }}
                                >
                                    {slide.layers.map((layer: any, idx: number) => {
                                        // Robust Fallback: Use mobile config if available, otherwise desktop, otherwise empty
                                        const rawConfig = layer.mobile || layer.desktop || {};
                                        // Force visible if 'visible' property is missing
                                        const isVisible = rawConfig.visible !== false;

                                        // Create a safe config object
                                        const config = {
                                            ...rawConfig,
                                            opacity: rawConfig.opacity !== undefined ? rawConfig.opacity : 1,
                                            top: rawConfig.top || 0,
                                            left: rawConfig.left || 0,
                                            width: rawConfig.width || 'auto',
                                            height: rawConfig.height || 'auto',
                                            fontSize: rawConfig.fontSize || 14,
                                            color: rawConfig.color || '#fff'
                                        };

                                        if (!isVisible) return null;
                                        return (
                                            <div
                                                key={`${layer.id}-${idx}`}
                                                className="slider-layer"
                                                data-animation={layer.animation}
                                                data-index={idx}
                                                data-target-opacity={config.opacity !== undefined ? config.opacity : 1}
                                                data-delay={layer.animationDelay}
                                                style={{
                                                    position: 'absolute',
                                                    left: config.left + 'px',
                                                    top: config.top + 'px',
                                                    width: typeof config.width === 'number' ? config.width + 'px' : config.width,
                                                    height: typeof config.height === 'number' ? config.height + 'px' : config.height,
                                                    zIndex: layer.zIndex,
                                                    opacity: config.opacity !== undefined ? config.opacity : 1,
                                                    fontSize: layer.type === 'text' ? config.fontSize + 'px' : undefined,
                                                    color: layer.style?.backgroundClip === 'text' ? 'transparent' : config.color,
                                                    backgroundImage: layer.style?.gradient !== 'none' ? layer.style?.gradient : undefined,
                                                    WebkitBackgroundClip: layer.style?.backgroundClip === 'text' ? 'text' : undefined,
                                                    backgroundClip: layer.style?.backgroundClip === 'text' ? 'text' : undefined,
                                                    pointerEvents: 'auto',
                                                    ...layer.style
                                                }}
                                            >
                                                {layer.type === 'image' ? (
                                                    <img
                                                        src={layer.src}
                                                        alt=""
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                ) : (
                                                    <div dangerouslySetInnerHTML={{ __html: layer.content }} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            /* --- DESKTOP STRATEGY: Unified Force Fit (Preserved) --- */
                            (() => {
                                // Parse User Position (e.g. "20% 50%" or "center center")
                                const posString = slide.backgroundPosition || '50% 50%';
                                let posX = 50;
                                let posY = 50;

                                if (posString.includes('center')) {
                                    const parts = posString.split(' ');
                                    if (parts[0] === 'center') posX = 50;
                                    if (parts[0] === 'top') posY = 0;
                                    if (parts[0] === 'bottom') posY = 100;
                                    if (parts[0] === 'left') posX = 0;
                                    if (parts[0] === 'right') posX = 100;

                                    if (parts[1] === 'center') posY = 50; // common case 'center center'
                                } else {
                                    const parts = posString.replace(/%/g, '').split(' ');
                                    posX = parseFloat(parts[0]) || 50;
                                    posY = parseFloat(parts[1]) || 50;
                                }

                                return (
                                    <div
                                        className="absolute pointer-events-none"
                                        style={{
                                            ...(() => {
                                                let vw = 1920; let vh = 800;
                                                if (typeof window !== 'undefined') { vw = dimensions.width || window.innerWidth; vh = dimensions.height || window.innerHeight; }
                                                const scale = vw / baseWidth;
                                                return {
                                                    transform: `scale(${scale})`,
                                                    width: baseWidth,
                                                    height: baseHeight,
                                                    transformOrigin: 'top left',
                                                    transition: 'transform 0.1s ease-out'
                                                };
                                            })()
                                        }}
                                    >
                                        {/* 1. Background Media (Image or Video) */}
                                        {(() => {
                                            const src = slide.backgroundSrc;
                                            if (!src) return null;

                                            const isVideo = src.match(/\.(mp4|webm)(\?.*)?$/i);

                                            if (isVideo) {
                                                return (
                                                    <video
                                                        src={src}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="absolute inset-0 w-full h-full"
                                                        style={{ objectFit: 'contain', background: 'black' }}
                                                    />
                                                );
                                            }

                                            return (
                                                <img
                                                    src={src}
                                                    alt=""
                                                    className="absolute inset-0 w-full h-full"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            );
                                        })()}

                                        {/* 2. Overlays */}
                                        <div className="absolute inset-0 bg-black/30"></div>

                                        {/* 3. Layers Folder */}
                                        <div className="absolute inset-0">
                                            {slide.layers.map((layer: any, idx: number) => {
                                                const config = layer.desktop;
                                                if (!config || !config.visible) return null;

                                                const style: React.CSSProperties = {
                                                    position: 'absolute',
                                                    left: config.left + 'px',
                                                    top: config.top + 'px',
                                                    width: typeof config.width === 'number' ? config.width + 'px' : config.width,
                                                    height: typeof config.height === 'number' ? config.height + 'px' : config.height,
                                                    zIndex: layer.zIndex,
                                                    opacity: 0,
                                                    fontSize: layer.type === 'text' ? config.fontSize + 'px' : undefined,
                                                    color: layer.style?.backgroundClip === 'text' ? 'transparent' : config.color,
                                                    backgroundImage: layer.style?.gradient !== 'none' ? layer.style?.gradient : undefined,
                                                    WebkitBackgroundClip: layer.style?.backgroundClip === 'text' ? 'text' : undefined,
                                                    backgroundClip: layer.style?.backgroundClip === 'text' ? 'text' : undefined,
                                                    pointerEvents: 'auto',
                                                    ...layer.style
                                                };

                                                return (
                                                    <div
                                                        key={`${layer.id}-${idx}`}
                                                        className="slider-layer absolute"
                                                        data-animation={layer.animation}
                                                        data-index={idx}
                                                        data-target-opacity={config.opacity !== undefined ? config.opacity : 1}
                                                        data-delay={layer.animationDelay}
                                                        style={style}
                                                    >
                                                        {layer.type === 'image' ? (
                                                            <img src={layer.src} alt="" className="w-full h-full object-contain" />
                                                        ) : (
                                                            <div dangerouslySetInnerHTML={{ __html: layer.content }} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </section >
    );
};

export default ResponsiveSlider;
