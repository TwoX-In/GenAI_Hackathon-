import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../retroui/Button';
import { Text } from '../retroui/Text';
import { Card } from '../retroui/Card';
import { 
    RotateCcw, 
    ZoomIn, 
    ZoomOut, 
    RotateCw, 
    Maximize, 
    Minimize,
    Play,
    Pause,
    RefreshCw
} from 'lucide-react';

const ThreeDViewer = ({ images = [] }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
    const [scale, setScale] = useState(1);
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const viewerRef = useRef(null);
    const animationRef = useRef(null);

    // Auto-rotation effect
    useEffect(() => {
        if (isAutoRotating && isPlaying) {
            const animate = () => {
                setRotation(prev => ({
                    ...prev,
                    y: prev.y + 0.5
                }));
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isAutoRotating, isPlaying]);

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (images.length <= 1) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextImage();
                    break;
                case 'Escape':
                    if (isFullscreen) {
                        document.exitFullscreen();
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [images.length, isFullscreen, nextImage, prevImage]);

    // Handle mouse/touch interactions
    const handleMouseDown = (e) => {
        const startX = e.clientX;
        const startY = e.clientY;
        const startRotation = { ...rotation };

        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            setRotation({
                x: startRotation.x + deltaY * 0.5,
                y: startRotation.y + deltaX * 0.5,
                z: startRotation.z
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale(prev => Math.max(0.1, Math.min(3, prev * delta)));
    };

    const resetView = () => {
        setRotation({ x: 0, y: 0, z: 0 });
        setScale(1);
    };

    const toggleAutoRotate = () => {
        setIsAutoRotating(!isAutoRotating);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await viewerRef.current?.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
            setIsFullscreen(false);
        }
    };

    const currentImage = images[currentImageIndex];

    if (!images || images.length === 0) {
        return (
            <Card className="p-8 text-center">
                <Text className="text-gray-500">No images available for 3D viewing</Text>
            </Card>
        );
    }

    if (!currentImage) {
        return (
            <Card className="p-8 text-center">
                <Text className="text-gray-500">Loading image...</Text>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Control Panel - Top */}
            <div className="flex flex-wrap gap-2 justify-center">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={resetView}
                    title="Reset View"
                >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                </Button>
                
                <Button
                    size="sm"
                    variant="outline"
                    onClick={toggleAutoRotate}
                    title="Toggle Auto Rotate"
                    className={isAutoRotating ? 'bg-blue-100' : ''}
                >
                    <RotateCw className="w-4 h-4 mr-1" />
                    Auto
                </Button>
                
                <Button
                    size="sm"
                    variant="outline"
                    onClick={togglePlay}
                    title="Play/Pause"
                    className={isPlaying ? 'bg-green-100' : ''}
                >
                    {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {isPlaying ? 'Pause' : 'Play'}
                </Button>
                
                <Button
                    size="sm"
                    variant="outline"
                    onClick={toggleFullscreen}
                    title="Fullscreen"
                >
                    {isFullscreen ? <Minimize className="w-4 h-4 mr-1" /> : <Maximize className="w-4 h-4 mr-1" />}
                    {isFullscreen ? 'Exit' : 'Fullscreen'}
                </Button>
            </div>

            {/* 3D Viewer Container */}
            <div
                ref={viewerRef}
                className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-300 ${
                    isFullscreen ? 'fixed inset-0 z-50 w-full h-full' : 'w-full h-96'
                }`}
                onWheel={handleWheel}
                style={{ perspective: '1000px' }}
            >
                {/* Multiple Images Indicator */}
                {images.length > 1 && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
                        {currentImageIndex + 1} of {images.length}
                    </div>
                )}
                {/* 3D Scene */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) scale(${scale})`,
                        transition: isAutoRotating ? 'none' : 'transform 0.1s ease-out'
                    }}
                    onMouseDown={handleMouseDown}
                >
                    {/* 3D Image Plane */}
                    <div
                        className="relative w-64 h-64 cursor-grab active:cursor-grabbing"
                        style={{
                            transform: 'translateZ(0px)',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <img
                            src={`data:image/jpeg;base64,${currentImage.image}`}
                            alt={`3D View ${currentImage.tag}`}
                            className="w-full h-full object-cover rounded-lg shadow-2xl"
                            style={{
                                transform: 'translateZ(20px)',
                                backfaceVisibility: 'hidden'
                            }}
                        />
                        
                        {/* 3D Shadow */}
                        <div
                            className="absolute inset-0 bg-black opacity-20 rounded-lg"
                            style={{
                                transform: 'translateZ(-10px) translateY(10px)',
                                filter: 'blur(10px)'
                            }}
                        />
                    </div>
                </div>

                {/* 3D Environment Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full" style={{
                            backgroundImage: `
                                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '20px 20px'
                        }} />
                    </div>
                </div>
            </div>

            {/* Control Panel - Bottom */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
                {/* Zoom Controls */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setScale(prev => Math.min(3, prev * 1.2))}
                        title="Zoom In"
                    >
                        <ZoomIn className="w-4 h-4 mr-1" />
                        Zoom In
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setScale(prev => Math.max(0.1, prev * 0.8))}
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-4 h-4 mr-1" />
                        Zoom Out
                    </Button>
                </div>

                {/* Image Navigation */}
                {images.length > 1 && (
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={prevImage}
                            title="Previous Image (←)"
                        >
                            ←
                        </Button>
                        
                        <Text className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                            {currentImageIndex + 1} / {images.length}
                        </Text>
                        
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={nextImage}
                            title="Next Image (→)"
                        >
                            →
                        </Button>
                    </div>
                )}

                {/* Status Info */}
                <div className="text-xs text-gray-600">
                    <div>Rotation: X:{rotation.x.toFixed(0)}° Y:{rotation.y.toFixed(0)}°</div>
                    <div>Scale: {(scale * 100).toFixed(0)}%</div>
                    <div>Auto: {isAutoRotating ? 'ON' : 'OFF'}</div>
                </div>
            </div>

            {/* Instructions */}
            <Card className="p-3 bg-gray-50 border border-gray-200">
                <Text className="text-sm font-medium mb-2">3D Controls</Text>
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
                    <div>• Drag to rotate</div>
                    <div>• Scroll to zoom</div>
                    <div>• Click controls for options</div>
                    <div>• Arrow keys to navigate images</div>
                    {images.length > 1 && (
                        <>
                            <div>• ← → to change images</div>
                            <div>• ESC to exit fullscreen</div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ThreeDViewer;