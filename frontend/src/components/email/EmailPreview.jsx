import React, { useState } from 'react';
import { Mail, Eye, Code, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/retroui/Button';

// Add CSS for email preview styling
const emailPreviewStyles = `
    .email-preview-container * {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    .email-preview-container img {
        height: auto !important;
        width: auto !important;
        max-width: 100% !important;
        display: block !important;
    }
    .email-preview-container table {
        width: 100% !important;
        max-width: 100% !important;
    }
    .email-preview-container {
        font-size: 14px !important;
        line-height: 1.4 !important;
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = emailPreviewStyles;
    document.head.appendChild(styleSheet);
}

const EmailPreview = ({ emailHtml, uid, images = [] }) => {
    const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'code'
    const [copied, setCopied] = useState(false);
    const [processedHtml, setProcessedHtml] = useState('');

    console.log("EmailPreview received emailHtml:", emailHtml?.substring(0, 100) + "...");
    console.log("EmailPreview received uid:", uid);
    console.log("EmailPreview received images:", images.length);

    // Process HTML to replace placeholder images with actual images
    React.useEffect(() => {
        if (emailHtml && images.length > 0) {
            let processed = emailHtml;
            // Replace placeholder images with actual base64 images
            images.forEach((imageData, index) => {
                const placeholder = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGNkIzNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHJvZHVjdCBJbWFnZSB7aSsxfTwvdGV4dD48L3N2Zz4=`;
                const actualImage = `data:image/jpeg;base64,${imageData}`;
                processed = processed.replace(placeholder, actualImage);
            });
            setProcessedHtml(processed);
        } else {
            setProcessedHtml(emailHtml);
        }
    }, [emailHtml, images]);

    // Safety check for emailHtml
    if (!emailHtml) {
        return (
            <div className="bg-red-300 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 transform rotate-1">
                <div className="text-center">
                    <h3 className="text-2xl font-black uppercase tracking-wider text-black">
                        NO EMAIL CONTENT FOUND
                    </h3>
                    <p className="text-lg font-bold mt-4 text-black">
                        The email HTML content is missing or invalid.
                    </p>
                </div>
            </div>
        );
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(processedHtml);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const downloadHtml = () => {
        const blob = new Blob([processedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `email_${uid}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const openInNewTab = () => {
        const newWindow = window.open();
        newWindow.document.write(processedHtml);
        newWindow.document.close();
    };

    return (
        <div className="bg-green-300 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 transform rotate-1 max-h-[70vh] overflow-y-auto">
            <div className="text-center mb-8">
                <div className="bg-black text-white p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] inline-block transform -rotate-1">
                    <h3 className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                        <Mail className="w-8 h-8" />
                        EMAIL PREVIEW
                    </h3>
                </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-center mb-6">
                <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 flex">
                    <button
                        onClick={() => setViewMode('preview')}
                        className={`px-6 py-3 font-black text-sm uppercase tracking-wide flex items-center gap-2 transition-all ${
                            viewMode === 'preview'
                                ? 'bg-green-400 text-black'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                    >
                        <Eye className="w-4 h-4" />
                        PREVIEW
                    </button>
                    <button
                        onClick={() => setViewMode('code')}
                        className={`px-6 py-3 font-black text-sm uppercase tracking-wide flex items-center gap-2 transition-all ${
                            viewMode === 'code'
                                ? 'bg-green-400 text-black'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                    >
                        <Code className="w-4 h-4" />
                        HTML CODE
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 max-h-[400px] overflow-y-auto">
                {viewMode === 'preview' ? (
                    <div className="p-4">
                        <div className="bg-gray-100 border-2 border-black p-4 mb-4">
                            <p className="text-sm font-bold text-gray-600 mb-2">EMAIL PREVIEW</p>
                            <div className="bg-white border border-gray-300 p-4 rounded overflow-x-auto max-h-[300px] overflow-y-auto">
                                {processedHtml ? (
                                    <div 
                                        className="email-preview-container"
                                        dangerouslySetInnerHTML={{ __html: processedHtml }}
                                        style={{
                                            maxHeight: '600px',
                                            overflow: 'auto',
                                            width: '100%',
                                            minHeight: '400px',
                                            minWidth: '320px'
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[200px] text-gray-500">
                                        <div className="text-center">
                                            <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
                                            <p className="font-bold">Loading email preview...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="bg-gray-900 text-green-400 p-4 rounded border-2 border-black font-mono text-sm overflow-auto max-h-[300px]">
                            {processedHtml ? (
                                <pre className="whitespace-pre-wrap">{processedHtml}</pre>
                            ) : (
                                <div className="flex items-center justify-center h-[200px] text-green-600">
                                    <div className="text-center">
                                        <div className="w-8 h-8 border-4 border-green-400 rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
                                        <p className="font-bold">Loading HTML code...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
                <Button
                    onClick={openInNewTab}
                    className="bg-blue-400 hover:bg-blue-500 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] text-black font-black text-lg px-6 py-3 flex items-center gap-3"
                >
                    <ExternalLink className="w-5 h-5" />
                    OPEN IN NEW TAB
                </Button>

                <Button
                    onClick={downloadHtml}
                    className="bg-green-400 hover:bg-green-500 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] text-black font-black text-lg px-6 py-3 flex items-center gap-3"
                >
                    <Download className="w-5 h-5" />
                    DOWNLOAD HTML
                </Button>
                
                <Button
                    onClick={copyToClipboard}
                    className={`border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] text-black font-black text-lg px-6 py-3 flex items-center gap-3 ${
                        copied ? 'bg-yellow-300' : 'bg-white hover:bg-gray-100'
                    }`}
                >
                    {copied ? (
                        <>
                            <Check className="w-5 h-5" />
                            COPIED!
                        </>
                    ) : (
                        <>
                            <Copy className="w-5 h-5" />
                            COPY HTML
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default EmailPreview;
