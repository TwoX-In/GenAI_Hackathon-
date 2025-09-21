import React, { useState, useEffect } from 'react';
import { Youtube, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Request } from '@/request/request';

export function YoutubeUrlChecker({ productId, productTitle }) {
    const [youtubeStatus, setYoutubeStatus] = useState({
        exists: false,
        url: '',
        loading: true,
        error: null
    });

    useEffect(() => {
        const checkYoutubeUrl = async () => {
            try {
                setYoutubeStatus(prev => ({ ...prev, loading: true, error: null }));
                
                // Try to fetch YouTube URL for this product
                const response = await Request.get(`/storage/youtube_url/${productId}`);
                
                if (response && response.url) {
                    // Verify the URL is accessible
                    const verificationResponse = await Request.post('/youtube/verify', { url: response.url });
                    
                    setYoutubeStatus({
                        exists: verificationResponse.exists,
                        url: response.url,
                        loading: false,
                        error: null
                    });
                } else {
                    setYoutubeStatus({
                        exists: false,
                        url: '',
                        loading: false,
                        error: null
                    });
                }
            } catch (error) {
                console.error('Error checking YouTube URL:', error);
                setYoutubeStatus({
                    exists: false,
                    url: '',
                    loading: false,
                    error: 'Failed to check YouTube URL'
                });
            }
        };

        if (productId) {
            checkYoutubeUrl();
        }
    }, [productId]);

    const StatusIcon = () => {
        if (youtubeStatus.loading) {
            return <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />;
        }
        
        if (youtubeStatus.error) {
            return <AlertCircle className="w-6 h-6 text-orange-600" />;
        }
        
        return youtubeStatus.exists 
            ? <CheckCircle className="w-6 h-6 text-green-600" />
            : <XCircle className="w-6 h-6 text-red-600" />;
    };

    const getStatusText = () => {
        if (youtubeStatus.loading) return 'CHECKING...';
        if (youtubeStatus.error) return 'ERROR CHECKING';
        return youtubeStatus.exists ? 'YOUTUBE VIDEO AVAILABLE' : 'NO YOUTUBE VIDEO';
    };

    const getStatusColor = () => {
        if (youtubeStatus.loading) return 'bg-blue-300';
        if (youtubeStatus.error) return 'bg-orange-300';
        return youtubeStatus.exists ? 'bg-green-300' : 'bg-red-300';
    };

    return (
        <div className={`${getStatusColor()} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200`}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-black text-white p-2 border-2 border-black">
                    <Youtube className="w-6 h-6" fill="currentColor" />
                </div>
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-wider">
                        YOUTUBE STATUS
                    </h3>
                    <p className="text-sm font-bold opacity-80">
                        Video availability check
                    </p>
                </div>
            </div>

            {/* Status Display */}
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <StatusIcon />
                    <span className="text-lg font-black uppercase tracking-wide">
                        {getStatusText()}
                    </span>
                </div>

                {youtubeStatus.exists && youtubeStatus.url && (
                    <div className="bg-black text-white p-3 border-2 border-black">
                        <p className="font-bold text-sm mb-2">YouTube URL:</p>
                        <a 
                            href={youtubeStatus.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-300 hover:text-yellow-400 underline break-all"
                        >
                            {youtubeStatus.url}
                        </a>
                    </div>
                )}

                {youtubeStatus.error && (
                    <div className="bg-orange-200 border-2 border-black p-3">
                        <p className="font-bold text-sm text-orange-800">
                            {youtubeStatus.error}
                        </p>
                    </div>
                )}

                {!youtubeStatus.exists && !youtubeStatus.loading && !youtubeStatus.error && (
                    <div className="bg-gray-200 border-2 border-black p-3">
                        <p className="font-bold text-sm text-gray-700">
                            No YouTube video has been uploaded for this product yet.
                        </p>
                    </div>
                )}
            </div>

            {/* Action Button */}
            {youtubeStatus.exists && youtubeStatus.url && (
                <div className="flex gap-3">
                    <button
                        onClick={() => window.open(youtubeStatus.url, '_blank')}
                        className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] font-bold text-black px-4 py-2 flex items-center gap-2 transition-all duration-150"
                    >
                        <Youtube className="w-4 h-4" />
                        WATCH ON YOUTUBE
                    </button>
                </div>
            )}
        </div>
    );
}

