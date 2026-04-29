// ===========================================
// CHAT INTERFACE V51 - GEMINI STYLE
// Large images with Explore (fullscreen)
// ===========================================

function ChatInterface({ tutor, onBack }) {
    const historyKey = `edu_v51_his_${tutor.id}`;

    const [messages, setMessages] = React.useState(() => {
        try {
            const saved = localStorage.getItem(historyKey);
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [showHistory, setShowHistory] = React.useState(true);
    const [fullscreenImage, setFullscreenImage] = React.useState(null);
    const messagesEndRef = React.useRef(null);

    React.useEffect(() => {
        localStorage.setItem(historyKey, JSON.stringify(messages));
    }, [messages]);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async (overrideText = null) => {
        let finalMsg = typeof overrideText === 'string' ? overrideText : input;
        if (!finalMsg.trim() || isLoading) return;

        // V5146: ENRICH EXPLORE PROMPTS
        if (overrideText === "Deep Dive") {
            finalMsg = "Provide a comprehensive Deep Dive into the topic we just discussed. Be very detailed.";
        } else if (overrideText === "Related Topics") {
            finalMsg = "What are some related topics or advanced concepts I should learn next based on our current discussion?";
        } else if (overrideText === "Practice") {
            finalMsg = "Give me a practice exercise or a small test to verify my understanding of this topic.";
        }

        const userMessage = finalMsg.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setIsLoading(true);

        try {
            const response = await window.chatWithTutor(tutor, userMessage, messages, {
                visualLayout: true,
                guidedLearning: true
            });
            setMessages(prev => [...prev, { role: 'assistant', content: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: '📡 Please retry.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslate = async (index) => {
        const msg = messages[index];
        if (msg.translatedContent) {
            const newMsgs = [...messages];
            delete newMsgs[index].translatedContent;
            setMessages(newMsgs);
            return;
        }

        // V5146: TIGHTER TRANSLATION REGEX
        const textToTranslate = msg.content
            .replace(/@@@IMAGES@@@[\s\S]*?(@@@|$)/g, '')
            .replace(/:::IMAGES:::[\s\S]*?(:::|$)/g, '')
            .replace(/@@@VIDEO_SUGGESTIONS@@@[\s\S]*?(@@@|$)/g, '')
            .replace(/:::VIDEO:::[\s\S]*?(:::|$)/g, '')
            .replace(/@@@EXPLORE@@@[\s\S]*?(@@@|$)/g, '')
            .replace(/:::EXPLORE:::[\s\S]*?(:::|$)/g, '')
            .replace(/@@@[\s\S]*?@@@/g, '')
            .replace(/:::[\s\S]*?:::/g, '')
            .trim();

        if (!textToTranslate) return;

        try {
            // V5138: USE CONFIG.JS (VISHAL ENGINE)
            const isUrdu = textToTranslate.match(/[\u0600-\u06FF]/);
            const target = isUrdu ? 'en' : 'ur';

            let translatedText = '';
            if (window.googleTranslate) {
                translatedText = await window.googleTranslate(textToTranslate, target);
            } else if (window.BrowserAPIEngine && window.BrowserAPIEngine.translate) {
                translatedText = await window.BrowserAPIEngine.translate(textToTranslate, target);
            }

            if (translatedText && translatedText !== textToTranslate) {
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[index].translatedContent = translatedText;
                    return newMsgs;
                });
            }
        } catch (error) {
            console.error('Translation error:', error);
        }
    };

    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) setShowHistory(false);
            else setShowHistory(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // V5147: Mobile Drawer Logic
    const sidebarStyle = isMobile ? {
        position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 20, width: '80%', maxWidth: '300px',
        backgroundColor: '#0f1420', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 25px rgba(0,0,0,0.8)'
    } : {
        width: '280px', flexShrink: 0, backgroundColor: '#0f1420', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column'
    };

    const openFullscreenImage = (img) => {
        if (!img) return;
        if (typeof img === 'string') {
            setFullscreenImage({ primaryUrl: img, fallbackUrl: img, title: '' });
            return;
        }
        setFullscreenImage({
            primaryUrl: img.originalLink || img.link,
            fallbackUrl: img.link || img.originalLink,
            title: img.title || ''
        });
    };

    const fullscreenSrc = typeof fullscreenImage === 'string' ? fullscreenImage : fullscreenImage?.primaryUrl;
    const fullscreenFallback = typeof fullscreenImage === 'string' ? fullscreenImage : fullscreenImage?.fallbackUrl;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000000, background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', display: 'flex', fontFamily: "'Inter', sans-serif", color: '#000' }}>

            {/* FULLSCREEN IMAGE VIEWER */}
            {fullscreenImage && (
                <div onClick={() => setFullscreenImage(null)} style={{ position: 'fixed', inset: 0, zIndex: 3000000, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
                    <img
                        src={fullscreenSrc}
                        style={{ width: '96vw', height: '92vh', objectFit: 'contain', borderRadius: '8px' }}
                        onClick={(e) => e.stopPropagation()}
                        onError={(e) => {
                            if (fullscreenFallback && e.currentTarget.src !== fullscreenFallback) {
                                e.currentTarget.src = fullscreenFallback;
                            }
                        }}
                    />
                    <button onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', fontSize: '2rem', cursor: 'pointer' }}>×</button>
                </div>
            )}

            {/* MESSAGE FOR MOBILE BACKDROP */}
            {isMobile && showHistory && (
                <div onClick={() => setShowHistory(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 19 }} />
            )}

            {/* HISTORY SIDEBAR */}
            {showHistory && (
                <div style={sidebarStyle}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#3b82f6', letterSpacing: '1px' }}>CHAT HISTORY</div>
                        {isMobile && <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.2rem' }}>✕</button>}
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                        {messages.filter(m => m.role === 'user').map((m, i) => (
                            <div key={i} onClick={() => { handleSend(m.content); if (isMobile) setShowHistory(false); }} style={{ padding: '12px', background: '#1e293b', borderRadius: '10px', marginBottom: '8px', fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#334155'} onMouseOut={e => e.currentTarget.style.background = '#1e293b'}>
                                {m.content.substring(0, 60)}...
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setMessages([])} style={{ padding: '15px', background: '#dc262622', border: 'none', color: '#fca5a5', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer' }}>CLEAR ALL</button>
                </div>
            )}

            {/* MAIN CHAT */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* HEADER */}
                <div style={{ height: '60px', padding: '0 20px', backgroundColor: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {!showHistory && <button onClick={() => setShowHistory(true)} style={{ background: '#3b82f6', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>📜 HISTORY</button>}
                        <button onClick={onBack} style={{ background: '#f1f5f9', border: 'none', color: '#1e293b', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>←</button>
                        <div style={{ fontSize: '1.3rem' }}>{tutor.emoji}</div>
                        <div>
                            <div style={{ fontSize: '1rem', fontWeight: '900' }}>{tutor.name}</div>
                        </div>
                    </div>
                    {showHistory && <button onClick={() => setShowHistory(false)} style={{ background: '#f1f5f9', border: 'none', color: '#64748b', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer' }}>HIDE HISTORY</button>}
                </div>

                {/* MESSAGES */}
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px', background: 'transparent' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {messages.map((msg, i) => {
                            let txt = msg.content;
                            let images = [], suggestions = [], explore = [];

                            if (msg.role === 'assistant' || true) {
                                // MIRACLE TAG PARSER (V5126) - VACUUM REGEX
                                const imgM = txt.match(/@@@IMAGES@@@([\s\S]*?)(@@@|$)/) || txt.match(/:::IMAGES:::([\s\S]*?)(:::|$)/);
                                if (imgM) { try { images = JSON.parse(imgM[1]); } catch (e) { } }

                                const sugM = txt.match(/@@@VIDEO_SUGGESTIONS@@@([\s\S]*?)(@@@|$)/) || txt.match(/:::VIDEO:::([\s\S]*?)(:::|$)/);
                                if (sugM) { try { const v = JSON.parse(sugM[1]); suggestions = Array.isArray(v) ? v : [v]; } catch (e) { } }

                                const expM = txt.match(/@@@EXPLORE@@@([\s\S]*?)(@@@|$)/) || txt.match(/:::EXPLORE:::([\s\S]*?)(:::|$)/);
                                if (expM) { try { explore = JSON.parse(expM[1]); } catch (e) { } }

                                // VACUUM CLEANING V5146 (ZERO LEAKAGE)
                                txt = txt.replace(/@@@IMAGES@@@[\s\S]*?(@@@|$)/g, '')
                                    .replace(/:::IMAGES:::[\s\S]*?(:::|$)/g, '')
                                    .replace(/@@@VIDEO_SUGGESTIONS@@@[\s\S]*?(@@@|$)/g, '')
                                    .replace(/:::VIDEO:::[\s\S]*?(:::|$)/g, '')
                                    .replace(/@@@EXPLORE@@@[\s\S]*?(@@@|$)/g, '')
                                    .replace(/:::EXPLORE:::[\s\S]*?(:::|$)/g, '')
                                    // EXTRA NUCLEAR CLEANUP
                                    .replace(/@@@[\s\S]*?(@@@|$)/g, '')
                                    .replace(/:::[\s\S]*?(:::|$)/g, '')
                                    .replace(/\{"link":".*?\}/g, '')
                                    .replace(/\[\{"link.*?"\}\]/g, '')
                                    .trim();
                            }

                            return (
                                <div key={i} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {msg.role === 'user' ? (
                                        <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: '14px 20px', borderRadius: '20px 20px 4px 20px', maxWidth: '80%', fontSize: '1rem', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>{txt}</div>
                                    ) : (
                                        <div style={{ width: '100%' }}>

                                            {/* LARGE IMAGES - GEMINI STYLE (THUMBNAILS) - V5124 SELF HEALING */}
                                            {images.length > 0 && (
                                                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                    {images.map((img, idx) => (
                                                        <div key={idx} id={`img-${idx}`} style={{ background: '#0f1420', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', width: '150px', transition: 'transform 0.2s' }}>
                                                            <div style={{ height: '100px', background: '#000', display: 'flex', alignItems: 'center', justifyItems: 'center', cursor: 'pointer' }} onClick={() => openFullscreenImage(img)}>
                                                                <img
                                                                    src={img.link}
                                                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.parentElement.style.display = 'none'; }}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                            <div style={{ padding: '8px', background: '#131824' }}>
                                                                <button onClick={() => openFullscreenImage(img)} style={{ width: '100%', background: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', color: '#3b82f6', padding: '4px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer' }}>
                                                                    🔍 EXPLORE
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* VIDEOS */}
                                            {suggestions.length > 0 && (
                                                <div style={{ marginBottom: '25px' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '12px' }}>URDU TUTORIALS 🎥</div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                                                        {suggestions.map((vid, idx) => (
                                                            <div key={idx} style={{ background: '#0f1420', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b' }}>
                                                                <iframe src={`https://www.youtube.com/embed/${vid.id}`} width="100%" height="160px" frameBorder="0" allowFullScreen></iframe>
                                                                <div style={{ padding: '10px', fontSize: '0.75rem', color: '#cbd5e1' }}>{vid.title}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* TEXT */}
                                            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', position: 'relative' }}>
                                                <div className="markdown-body" style={{ color: '#1e293b', lineHeight: '1.8', fontSize: '1.05rem', fontWeight: '500' }} dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parse(msg.translatedContent || txt) : (msg.translatedContent || txt) }} />

                                                <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                                                    <button
                                                        onClick={() => handleTranslate(i)}
                                                        style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                    >
                                                        🌐 {msg.translatedContent ? 'SHOW ORIGINAL' : (txt.match(/[\u0600-\u06FF]/) ? 'Translate to English' : 'Translate to Urdu')}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* EXPLORE TOPICS */}
                                            {explore.length > 0 && (
                                                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                    {explore.map((topic, idx) => (
                                                        <button key={idx} onClick={() => handleSend(topic)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#334155'} onMouseOut={e => e.currentTarget.style.background = '#1e293b'}>
                                                            {topic}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {isLoading && <div style={{ color: '#3b82f6', fontSize: '0.9rem', textAlign: 'center', margin: '25px 0', fontWeight: '700' }}>Thinking... 💭</div>}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* INPUT */}
                <div style={{ padding: '25px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderTop: '1px solid #cbd5e1' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', background: '#fff', borderRadius: '16px', padding: '10px 25px', border: '2px solid #3b82f6' }}>
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder={`Ask ${tutor.name}... 🧪`} style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 0', color: '#1e293b', outline: 'none', fontSize: '1.05rem', fontWeight: 'bold' }} />
                        <button onClick={() => handleSend()} disabled={!input.trim() || isLoading} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '2rem', opacity: input.trim() ? 1 : 0.3, cursor: 'pointer' }}>➤</button>
                    </div>
                </div>

            </div>

            <style>{`
        .markdown-body ul { list-style: disc; margin-left: 15px; }
        .markdown-body p { margin-bottom: 12px; }
      `}</style>
            {/* FULLSCREEN IMAGE MODAL */}
            {false && fullscreenImage && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setFullscreenImage(null)}>
                    <button style={{ position: 'absolute', top: '20px', right: '20px', background: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>×</button>
                    <img src={fullscreenSrc} style={{ width: '96vw', height: '92vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}

console.log('✅ ChatInterface V51 (GEMINI STYLE) READY');
