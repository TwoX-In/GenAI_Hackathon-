import React, { useState, useEffect } from 'react';
import { Button } from '@/components/retroui/Button';
import { Request } from '@/request/request';
import { Mail, Send, Users, Plus, Trash2, Check } from 'lucide-react';

const EmailMarketing = ({ emailHtml, uid }) => {
    const [storedEmails, setStoredEmails] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [emailImages, setEmailImages] = useState([]);
    const [processedHtml, setProcessedHtml] = useState('');


    // Fetch stored images when component mounts
    useEffect(() => {
        async function fetchStoredImages() {
            const imagesResponse = await Request.get(`/social_media/get-email-images/${uid}`);
            console.log("IMAGES RESPONSE:", imagesResponse);
            
            setEmailImages(imagesResponse.images || []);            
        }
        fetchStoredImages();
    }, [uid]);

    // Process HTML when emailHtml or emailImages change
    useEffect(() => {
        if (emailHtml) {
            // Extract subject from email HTML if possible
            const subjectMatch = emailHtml.match(/<title>(.*?)<\/title>/);
            if (subjectMatch) {
                setSubject(subjectMatch[1]);
            } else {
                setSubject('New Product Launch - Exclusive Offer!');
            }

            let processed = emailHtml;
            // Replace placeholder images with actual base64 images
            if (emailImages && emailImages.length > 0) {
                emailImages.forEach((imageData, index) => {
                    const placeholder = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGNkIzNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHJvZHVjdCBJbWFnZSB7aSsxfTwvdGV4dD48L3N2Zz4=`;
                    const actualImage = `data:image/jpeg;base64,${imageData}`;
                    processed = processed.replace(placeholder, actualImage);
                });
            }
            setProcessedHtml(processed);
        }
    }, [emailHtml, emailImages]);

    const fetchStoredEmails = async () => {
        try {
            setLoading(true);
            const response = await Request.get('/social_media/email-lists');
            if (response.success) {
                setStoredEmails(response.emails);
            }
        } catch (err) {
            console.error('Failed to fetch emails:', err);
            setError('Failed to load stored emails');
        } finally {
            setLoading(false);
        }
    };

    const addNewEmail = () => {
        if (newEmail.trim() && !storedEmails.includes(newEmail.trim())) {
            const updatedEmails = [...storedEmails, newEmail.trim()];
            setStoredEmails(updatedEmails);
            setNewEmail('');
            // Store in backend
            storeEmailList(updatedEmails);
        }
    };

    const storeEmailList = async (emails) => {
        try {
            await Request.post('/social_media/email-lists', { emails });
        } catch (err) {
            console.error('Failed to store email list:', err);
        }
    };

    const removeEmail = (emailToRemove) => {
        const updatedEmails = storedEmails.filter(email => email !== emailToRemove);
        setStoredEmails(updatedEmails);
        setSelectedEmails(selectedEmails.filter(email => email !== emailToRemove));
        storeEmailList(updatedEmails);
    };

    const toggleEmailSelection = (email) => {
        if (selectedEmails.includes(email)) {
            setSelectedEmails(selectedEmails.filter(e => e !== email));
        } else {
            setSelectedEmails([...selectedEmails, email]);
        }
    };

    const selectAllEmails = () => {
        setSelectedEmails([...storedEmails]);
    };

    const deselectAllEmails = () => {
        setSelectedEmails([]);
    };

    const sendEmail = async () => {
        if (selectedEmails.length === 0) {
            setError('Please select at least one email address');
            return;
        }

        if (!processedHtml) {
            setError('No email content available');
            return;
        }

        try {
            setSending(true);
            setError(null);
            
            const emailRequest = {
                to_emails: selectedEmails,
                subject: subject,
                body: processedHtml,
                is_html: true
            };

            const response = await Request.postByUrl('/social_media/send', emailRequest);
            
            if (response.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error('Failed to send email:', err);
            setError('Failed to send email. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-orange-300 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 transform rotate-1">
            <div className="text-center mb-8">
                <div className="bg-black text-white p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1">
                    <h3 className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                        <Mail className="w-8 h-8" />
                        EMAIL MARKETING
                    </h3>
                </div>
            </div>

            {/* Email List Management */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
                <div className="flex items-center mb-4">
                    <div className="bg-orange-400 text-black p-2 mr-3 border-2 border-black">
                        <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-lg uppercase tracking-wider">EMAIL LISTS</h4>
                </div>

                {/* Add New Email */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter email address..."
                        className="flex-1 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && addNewEmail()}
                    />
                    <Button
                        onClick={addNewEmail}
                        className="bg-green-400 hover:bg-green-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] text-black font-black px-4 py-3 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        ADD
                    </Button>
                </div>

                {/* Email List */}
                <div className="max-h-48 overflow-y-auto border-2 border-black bg-gray-50 p-4">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="w-6 h-6 border-4 border-black rounded-full border-t-transparent animate-spin mx-auto"></div>
                            <p className="font-bold mt-2">Loading emails...</p>
                        </div>
                    ) : storedEmails.length === 0 ? (
                        <p className="text-center text-gray-600 font-bold">No emails stored yet</p>
                    ) : (
                        <div className="space-y-2">
                            {storedEmails.map((email, index) => (
                                <div key={index} className="flex items-center justify-between bg-white border-2 border-black p-2">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmails.includes(email)}
                                            onChange={() => toggleEmailSelection(email)}
                                            className="w-4 h-4 border-2 border-black"
                                        />
                                        <span className="font-bold text-sm">{email}</span>
                                    </div>
                                    <Button
                                        onClick={() => removeEmail(email)}
                                        className="bg-red-400 hover:bg-red-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] text-black font-bold px-2 py-1 text-xs"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Select All/None */}
                {storedEmails.length > 0 && (
                    <div className="flex gap-2 mt-4">
                        <Button
                            onClick={selectAllEmails}
                            className="bg-blue-400 hover:bg-blue-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] text-black font-bold px-3 py-1 text-sm"
                        >
                            SELECT ALL
                        </Button>
                        <Button
                            onClick={deselectAllEmails}
                            className="bg-gray-400 hover:bg-gray-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] text-black font-bold px-3 py-1 text-sm"
                        >
                            SELECT NONE
                        </Button>
                    </div>
                )}
            </div>

            {/* Email Content Preview */}
            {processedHtml && (
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-orange-400 text-black p-2 mr-3 border-2 border-black">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h4 className="font-black text-lg uppercase tracking-wider">EMAIL PREVIEW</h4>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Subject:</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                        />
                    </div>

                    <div className="border-2 border-black bg-gray-50 p-4 max-h-64 overflow-y-auto">
                        <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
                    </div>
                </div>
            )}

            {/* Send Email */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                <div className="text-center">
                    <div className="mb-4">
                        <p className="font-bold text-lg">
                            Selected: <span className="text-orange-600">{selectedEmails.length}</span> recipients
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-400 border-4 border-black p-4 text-white font-bold text-center mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-400 border-4 border-black p-4 text-white font-bold text-center mb-4 flex items-center justify-center gap-2">
                            <Check className="w-5 h-5" />
                            EMAIL SENT SUCCESSFULLY!
                        </div>
                    )}

                    <Button
                        onClick={sendEmail}
                        disabled={sending || selectedEmails.length === 0 || !processedHtml}
                        className={`w-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] text-black font-black text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                            success ? 'bg-green-400' : 'bg-orange-400 hover:bg-orange-500'
                        }`}
                    >
                        {sending ? (
                            <>
                                <div className="w-6 h-6 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
                                SENDING...
                            </>
                        ) : success ? (
                            <>
                                <Check className="w-6 h-6" />
                                EMAIL SENT!
                            </>
                        ) : (
                            <>
                                <Send className="w-6 h-6" />
                                SEND EMAIL
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EmailMarketing;
