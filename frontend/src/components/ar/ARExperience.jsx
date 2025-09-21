import React, { useState, useEffect } from 'react';
import { Button } from '../retroui/Button';
import { Text } from '../retroui/Text';
import { Card } from '../retroui/Card';
import { Input } from '../retroui/Input';
import { Loader2, Eye, Box, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Request } from '@/request/request';
import ThreeDViewer from '../3d/ThreeDViewer';

const ARExperience = () => {
    const [uid, setUid] = useState('');
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [config3d, setConfig3d] = useState(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const urlUid = searchParams.get('uid');
        if (urlUid) {
            // Ensure we have a string value, not an object
            const uidString = String(urlUid).trim();
            setUid(uidString);
            // Automatically create 3D experience if UID is provided in URL
            setTimeout(() => {
                handleCreate3DExperience(uidString);
            }, 100);
        }
    }, [searchParams]);

    const handleCreate3DExperience = async (providedUid = null) => {
        // Use provided UID or current state UID
        const targetUid = providedUid || uid;
        
        // Ensure we have a valid string UID
        const uidString = String(targetUid).trim();
        
        console.log("uid we have is", uidString, "type:", typeof uidString, "original:", targetUid);
        
        if (!uidString || uidString === 'undefined' || uidString === 'null' || uidString === '[object Object]') {
            setError('Please enter a valid UID');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await Request.postByUrl(`/ar/experience/${uidString}`);
            console.log('3D Experience Response:', data);

            if (data.status === 'success') {
                const experienceData = data.experience || data.ar_experience;
                console.log('Experience Data:', experienceData);
                
                if (experienceData) {
                    setExperience(experienceData);
                    setConfig3d(experienceData['3d_config'] || null);
                } else {
                    setError('No experience data received');
                }
            } else {
                setError(data.message || 'Failed to create 3D experience');
            }
        } catch (err) {
            setError('Failed to connect to 3D service');
            console.error('3D Experience Error:', err);
        } finally {
            setLoading(false);
        }
    };


    const render3DImage = (imageData, index) => {
        return (
            <div key={index} className="relative group">
                <img
                    src={`data:image/jpeg;base64,${imageData.image}`}
                    alt={`3D Image ${imageData.tag}`}
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/90 hover:bg-white"
                        >
                            <Box className="w-4 h-4 mr-2" />
                            View in 3D
                        </Button>
                    </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                    <Text>Tag: {imageData.tag}</Text>
                    <Text className="text-xs">
                        Position: X:{imageData['3d_metadata']?.position?.x || 0} Y:{imageData['3d_metadata']?.position?.y || 0}
                    </Text>
                </div>
            </div>
        );
    };

    const render3DControls = () => {
        if (!config3d || !experience) return null;

        return (
            <Card className="p-4 mb-4">
                <Text className="text-lg font-semibold mb-3">3D Controls</Text>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Text className="text-sm font-medium mb-2">Camera Settings</Text>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Text className="text-sm">FOV</Text>
                                <Text className="text-sm text-gray-600">
                                    {config3d.camera?.fov || 75}°
                                </Text>
                            </div>
                            <div className="flex items-center justify-between">
                                <Text className="text-sm">Position</Text>
                                <Text className="text-sm text-gray-600">
                                    Z: {config3d.camera?.position?.z || 5}
                                </Text>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Text className="text-sm font-medium mb-2">Rendering Settings</Text>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Text className="text-sm">Shadows</Text>
                                <Text className="text-sm text-gray-600">
                                    {config3d.rendering?.shadows ? 'On' : 'Off'}
                                </Text>
                            </div>
                            <div className="flex items-center justify-between">
                                <Text className="text-sm">Auto Rotate</Text>
                                <Text className="text-sm text-gray-600">
                                    {config3d.controls?.auto_rotate ? 'On' : 'Off'}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <Text className="text-3xl font-bold mb-2">3D Experience</Text>
                <Text className="text-gray-600 mb-6">
                    Create immersive 3D experiences from your product images
                </Text>
                
                <Card className="p-6 mb-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Text className="text-sm font-medium mb-2">Enter Product UID</Text>
                            <Input
                                type="number"
                                placeholder="Enter UID (e.g., 12345)"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Button
                            onClick={() => handleCreate3DExperience()}
                            disabled={loading || !uid.trim()}
                            className="px-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                            <Box className="w-4 h-4 mr-2" />
                            Create 3D
                                </>
                            )}
                        </Button>
                    </div>
                </Card>

                {error && (
                    <Card className="p-4 mb-6 border-red-200 bg-red-50">
                        <Text className="text-red-600">{error}</Text>
                    </Card>
                )}

                {experience && experience.images && (
                    <div className="space-y-6">
                        {render3DControls()}
                        
                        {/* 3D Viewer */}
                        <Card className="p-6 relative z-10">
                            <Text className="text-xl font-semibold mb-4">
                                3D Viewer ({experience.images?.length || 0} images)
                            </Text>
                            
                            <div className="mb-4 relative">
                                <ThreeDViewer 
                                    images={experience.images || []} 
                                />
                            </div>
                        </Card>
                        
                        {/* Image Gallery */}
                        <Card className="p-6">
                            <Text className="text-xl font-semibold mb-4">
                                Image Gallery
                            </Text>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {experience.images?.map((imageData, index) => 
                                    render3DImage(imageData, index)
                                )}
                            </div>
                        </Card>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ARExperience;
