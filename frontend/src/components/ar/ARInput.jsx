import React, { useState, useEffect } from 'react';
import { Button } from '../retroui/Button';
import { Input } from '../retroui/Input';
import { Eye, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ARInput = () => {
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const urlUid = searchParams.get('uid');
        if (urlUid) {
            // Ensure we have a string value, not an object
            const uidString = String(urlUid).trim();
            setUid(uidString);
        }
    }, [searchParams]);

    const handleARExperience = async () => {
        // Ensure we have a valid string UID
        let uidString;
        if (typeof uid === 'object' && uid !== null) {
            // If it's an object, try to extract a meaningful value
            uidString = uid.toString().trim();
        } else {
            uidString = String(uid).trim();
        }
        
        console.log("ARInput - uid we have is", uidString, "type:", typeof uidString, "original:", uid);
        
        if (!uidString || uidString === 'undefined' || uidString === 'null' || uidString === '[object Object]') {
            setError('Please enter a valid UID');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Navigate to 3D experience page with UID
            navigate(`/ar-experience?uid=${uidString}`);
        } catch (err) {
            setError('Failed to start 3D experience');
            console.error('3D Input Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Input
                type="number"
                placeholder="UID"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="w-24"
                onKeyPress={(e) => e.key === 'Enter' && handleARExperience()}
            />
            <Button
                onClick={() => handleARExperience()}
                disabled={loading || !uid.trim()}
                size="sm"
                variant="outline"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Eye className="w-4 h-4" />
                )}
            </Button>
            {error && (
                <span className="text-red-500 text-xs">{error}</span>
            )}
        </div>
    );
};

export default ARInput;
