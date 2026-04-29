// ============================================
// AVATAR ENGINE V12.0 — HEYGEN VIDEO INTEGRATION
// Smoothly plays the ultimate 40-second HeyGen Video
// Synchronizes playback perfectly so it acts like a 
// realistic Avatar Engine. Restores flawless layout!
// ============================================

function AvatarEngine({ tutor, isSpeaking, isListening, className = '' }) {
    const videoRef = React.useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
    
    const isSpeakingRef = React.useRef(false);
    const isListeningRef = React.useRef(false);

    React.useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
    React.useEffect(() => { isListeningRef.current = isListening; }, [isListening]);

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let frameId;
        
        const syncHeyGenAvatar = () => {
            frameId = requestAnimationFrame(syncHeyGenAvatar);
            
            let mouth = isSpeakingRef.current ? 0.5 : 0;
            if (window.LipSyncEngine) {
                mouth = window.LipSyncEngine.getMouthOpenness();
            }

            if (isSpeakingRef.current) {
                // When actively speaking, play the HeyGen video at full speed
                if (video.paused) video.play().catch(() => {});
                
                if (mouth < 0.05) {
                    video.playbackRate = 0.5; 
                } else {
                    video.playbackRate = 1.0; 
                }
            } else {
                // When completely stopped, strictly pause the video so it doesn't move irrelevantly.
                if (!video.paused) {
                    video.pause();
                }
            }

            // Loop logic to prevent jumping / black frames
            // Soft loop: before it hits the very end, jump to a safe point in the middle
            if (video.duration && video.currentTime >= video.duration - 0.5) {
                video.currentTime = 0.5; 
            }
        };

        syncHeyGenAvatar();
        return () => cancelAnimationFrame(frameId);
    }, []);

    // We use the same introVideo link, which you will replace with the 40s HeyGen video link in app.js
    const videoSource = tutor?.introVideo;

    return (
        <div className={className} style={{
            width: '100%', height: '100%',
            position: 'relative', overflow: 'hidden',
            borderRadius: '12px',
            backgroundColor: '#050505',
        }}>

            {videoSource ? (
                <video 
                    ref={videoRef}
                    src={videoSource}
                    muted={true}
                    playsInline
                    loop
                    onCanPlay={() => setIsVideoLoaded(true)}
                    style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        filter: 'contrast(1.05) brightness(1.02)', // Cinematic lighting adjustments
                        opacity: isVideoLoaded ? 1 : 0,
                        transition: 'opacity 0.8s ease, transform 0.3s ease-out',
                        transform: isSpeaking ? 'scale(1.02)' : 'scale(1.0)' // Subtle punch-in camera effect when talking
                    }}
                />
            ) : (
                <img 
                    src={tutor?.image} 
                    alt={tutor?.name}
                    onError={(e) => {
                        e.target.style.display = 'none'; // Hide broken image
                        if (e.target.nextElementSibling) {
                            e.target.nextElementSibling.style.display = 'flex'; // Show emoji fallback if we add one below
                        }
                    }}
                    style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        filter: 'contrast(1.1) brightness(0.95)'
                    }} 
                />
            )}

            {/* CINEMATIC FRAME VIGNETTE */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.6) 100%)',
                pointerEvents: 'none'
            }}/>


            <style>{`
                @keyframes statusPulseV12 { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            `}</style>
        </div>
    );
}

console.log('✅ AvatarEngine V12 loaded — Flawless HeyGen Video Support');
