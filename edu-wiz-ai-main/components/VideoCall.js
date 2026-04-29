// ============================================
// MINDMAP NODE COMPONENT (V5300: FULLSCREEN FIX)
// ============================================
const MindMapNode = ({ node, depth = 0, expandedNodes, onToggle, onNodeClick, onImageFullscreen }) => {
  if (!node) return null;
  const isExpanded = expandedNodes[node.id];
  const hasChildren = node.children && node.children.length > 0;
  const [imageUrl, setImageUrl] = React.useState(null);
  const [originalImageUrl, setOriginalImageUrl] = React.useState(null); // V5215: High-res for fullscreen
  const [imageLoading, setImageLoading] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // V5220: FIXED IMAGE LOADING (race condition bug fixed)
  React.useEffect(() => {
    if (node.showImage && window.searchGoogleImages && !imageUrl && !imageLoading) {
      setImageLoading(true);
      const rootTopic = window.__mindMapRootTopic || '';
      const searchQuery = node.imageQuery || `${rootTopic} ${node.label} educational diagram illustration`.trim();
      console.log(`🖼️ V5220 Image Search: "${searchQuery}"`);
      window.searchGoogleImages(searchQuery)
        .then(images => {
          if (images && images.length > 0) {
            console.log(`✅ Image loaded for: ${node.label}`);
            setImageUrl(images[0].link);
            setOriginalImageUrl(images[0].originalLink || images[0].link);
            setImageError(false);
            setImageLoading(false);
            return 'FOUND'; // V5220: Signal to skip fallback chain
          } else {
            console.log(`⚠️ No results, trying fallback for: ${node.label}`);
            return window.searchGoogleImages(`${node.label} science diagram labeled`);
          }
        })
        .then(result => {
          if (result === 'FOUND') return; // V5220: Primary succeeded, skip fallback
          const fallbackImages = result;
          if (fallbackImages && fallbackImages.length > 0) {
            console.log(`✅ Fallback image loaded for: ${node.label}`);
            setImageUrl(fallbackImages[0].link);
            setOriginalImageUrl(fallbackImages[0].originalLink || fallbackImages[0].link);
            setImageError(false);
          } else {
            console.log(`❌ No images found at all for: ${node.label}`);
            setImageError(true);
          }
        })
        .catch((err) => {
          console.error(`❌ Image load error for: ${node.label}`, err);
          setImageError(true);
        })
        .finally(() => setImageLoading(false));
    }
  }, [node.showImage, node.label, imageUrl, imageLoading]);

  return (
    <div className="flex items-center">
      {/* NODE BOX */}
      <div className="relative flex items-center">
        {/* CONTENT BOX - LARGER + MORE VIBRANT */}
        <div
          onClick={() => onNodeClick && onNodeClick(node.label)}
          className={`
            px-5 py-4 rounded-xl shadow-2xl border-2 cursor-pointer select-none transition-all hover:scale-105 active:scale-95
            ${depth === 0
              ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white text-xl font-black border-blue-300 shadow-blue-500/60 min-w-[220px]'
              : node.isExplanation
                ? 'bg-gradient-to-br from-teal-500/40 to-emerald-500/40 text-teal-50 border-teal-300/80 max-w-[650px] text-sm shadow-teal-500/40 leading-relaxed'
                : 'bg-gradient-to-br from-indigo-800/70 to-purple-800/70 text-white border-indigo-300/70 hover:border-indigo-200 font-bold text-base shadow-indigo-500/40 min-w-[140px]'}
          `}
        >
          {/* TEXT LABEL */}
          <div className={node.isExplanation ? "font-normal" : "font-bold"}>
            {node.label}
          </div>

          {/* DYNAMIC IMAGE WITH EXPLORE BUTTON - ALWAYS SHOWS IF showImage=true */}
          {node.showImage && (
            <div className="relative w-full mt-3">
              {imageLoading && (
                <div className="w-full h-36 bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-xl border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                    <div className="text-white text-xs font-medium">Loading image...</div>
                  </div>
                </div>
              )}
              {imageError && !imageLoading && (
                <div className="w-full h-28 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl border-2 border-gray-500/50 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-3xl mb-1">📷</div>
                    <div className="text-gray-300 text-xs font-medium">Visual Diagram</div>
                    <div className="text-gray-400 text-xs mt-0.5">(Image unavailable)</div>
                  </div>
                </div>
              )}
              {imageUrl && !imageLoading && !imageError && (
                <>
                  <img
                    src={imageUrl}
                    alt={node.label}
                    className="w-full h-36 object-cover rounded-xl border-2 border-white/40 cursor-pointer transition-all hover:border-blue-300 hover:shadow-xl"
                    onClick={(e) => { e.stopPropagation(); onImageFullscreen && onImageFullscreen(originalImageUrl || imageUrl, imageUrl, node.label); }}
                    onError={() => {
                      // V5215: If thumbnail fails, try original link before giving up
                      if (originalImageUrl && imageUrl !== originalImageUrl) {
                        console.log(`🔄 Thumbnail failed, trying original for: ${node.label}`);
                        setImageUrl(originalImageUrl);
                      } else {
                        console.error(`❌ Image completely failed for: ${node.label}`);
                        setImageError(true);
                      }
                    }}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); onImageFullscreen && onImageFullscreen(originalImageUrl || imageUrl, imageUrl, node.label); }}
                    className="absolute bottom-3 right-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full shadow-2xl transition-all hover:scale-110 border-2 border-white/30"
                  >
                    🔍 Explore
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* EXPANSION DOT - LARGER & MORE OBVIOUS */}
        {hasChildren && (
          <div
            onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
            className="ml-4 w-7 h-7 rounded-full bg-indigo-600/50 border-3 border-indigo-200 cursor-pointer hover:bg-indigo-500 hover:border-white hover:scale-110 transition-all flex items-center justify-center shadow-xl"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <span className="text-white text-sm font-black">{isExpanded ? '−' : '+'}</span>
          </div>
        )}
      </div>

      {/* CHILDREN CONTAINER - HORIZONTAL WITH ULTRA-VISIBLE CURVES */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col ml-10 animate-fade-in-up relative" style={{ gap: '1.5rem' }}>
          {/* MAIN VERTICAL LINE CONNECTING ALL SIBLINGS */}
          {node.children.length > 1 && (
            <svg
              width="4"
              className="absolute z-0"
              style={{
                left: '-40px',
                top: '1.5rem',
                height: `calc(100% - 1.5rem)`,
                filter: 'drop-shadow(0 0 3px rgba(139, 92, 246, 0.6))'
              }}
            >
              <line
                x1="2"
                y1="0"
                x2="2"
                y2="100%"
                stroke="#a78bfa"
                strokeWidth="3"
                opacity="0.7"
                strokeLinecap="round"
              />
            </svg>
          )}

          {node.children.map((child, index) => (
            <div key={child.id} className="relative flex items-center">
              {/* ULTRA-VISIBLE CURVED CONNECTION - GLOWING */}
              <svg
                width="40"
                height="30"
                className="absolute z-10"
                style={{
                  left: '-40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))'
                }}
              >
                <path
                  d="M 0,15 C 15,15 25,15 40,15"
                  stroke="#a78bfa"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.95"
                />
              </svg>

              <MindMapNode
                node={child}
                depth={depth + 1}
                expandedNodes={expandedNodes}
                onToggle={onToggle}
                onNodeClick={onNodeClick}
                onImageFullscreen={onImageFullscreen}
              />
            </div>
          ))}
        </div>
      )}

      {/* V5300: Fullscreen modal moved to MindMap parent (outside transform) */}
    </div>
  );
};

// ============================================
// MINDMAP COMPONENT V5203 (Updated)
// ============================================
function MindMap({ data, onClose, onNodeClick }) {
  const [transform, setTransform] = React.useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = React.useState(false);
  const [lastPos, setLastPos] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef(null);
  const [expandedNodes, setExpandedNodes] = React.useState({});

  // V5300: FULLSCREEN IMAGE STATE (lifted from MindMapNode to avoid transform issues)
  const [fullscreenImg, setFullscreenImg] = React.useState(null);

  const handleImageFullscreen = (primaryUrl, fallbackUrl, label) => {
    setFullscreenImg({ primaryUrl, fallbackUrl, label });
  };

  // Initialize all nodes as expanded by default
  React.useEffect(() => {
    if (data) {
      collapseAll(); // ✅ V5202: Start Collapsed (Step-by-Step)
      // Auto-center (center of viewport)
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setTransform({ x: clientWidth / 2, y: clientHeight / 2, scale: 1 });
      }
    }
  }, [data]);

  const expandAll = () => {
    if (!data) return;
    const allIds = {};
    const traverse = (node) => {
      if (!node) return;
      allIds[node.id] = true;
      if (node.children) node.children.forEach(traverse);
    };
    traverse(data);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    if (!data) return;
    // Keep only root expanded
    setExpandedNodes({ [data.id]: true });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.2, transform.scale * (1 + scaleAmount)), 4);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      setLastPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setDragging(false);

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  return (
    <div className="fixed inset-0 z-[2000000] bg-[#0f1420] flex flex-col font-sans">
      {/* HEADER */}
      <div className="h-16 border-b border-gray-800 bg-[#0f1420]/90 backdrop-blur flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <span className="text-white font-black text-2xl tracking-tight">MindMap AI</span>
        </div>

        {/* TOP CONTROLS */}
        <div className="flex items-center gap-4">
          {/* GLOBAL CONTROLS */}
          <div className="hidden md:flex items-center gap-2 bg-gray-800 p-1 rounded-xl border border-gray-700">
            <button onClick={expandAll} className="px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-all flex items-center gap-1">
              <span>📖</span> Expand All
            </button>
            <div className="w-[1px] h-4 bg-gray-600"></div>
            <button onClick={collapseAll} className="px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-all flex items-center gap-1">
              <span>📕</span> Collapse All
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
            <button onClick={() => setTransform(t => ({ ...t, scale: Math.max(0.2, t.scale - 0.2) }))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded hover:bg-gray-700 font-bold text-lg">-</button>
            <span className="text-xs font-mono text-gray-300 w-12 text-center font-bold">{Math.round(transform.scale * 100)}%</span>
            <button onClick={() => setTransform(t => ({ ...t, scale: Math.min(4, t.scale + 0.2) }))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded hover:bg-gray-700 font-bold text-lg">+</button>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all flex items-center justify-center font-bold text-xl ml-4"
          >
            ×
          </button>
        </div>
      </div>

      {/* MOBILE CONTROLS (Visible only on small screens) */}
      <div className="md:hidden absolute top-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <button onClick={expandAll} className="px-3 py-1 bg-gray-800/80 backdrop-blur text-white text-xs font-bold rounded-full border border-gray-600 shadow-lg">Expand All</button>
        <button onClick={collapseAll} className="px-3 py-1 bg-gray-800/80 backdrop-blur text-white text-xs font-bold rounded-full border border-gray-600 shadow-lg">Collapse</button>
      </div>

      {/* CANVAS */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing relative bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-fixed"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="absolute transition-transform duration-75 ease-out origin-center"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) translate(-50%, -50%)`,
            transformOrigin: '0 0'
          }}
        >
          <div className="flex items-center justify-center w-max p-40">
            {data ? (
              <MindMapNode
                node={data}
                expandedNodes={expandedNodes}
                onToggle={toggleNode}
                onNodeClick={onNodeClick}
                onImageFullscreen={handleImageFullscreen}
              />
            ) : <div className="text-white animate-pulse text-xl font-bold">Generating Powerful Neural Map...</div>}
          </div>
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-10">
          {/* Zoom Controls Buttons for Mouse Users */}
          <button onClick={() => setTransform(t => ({ ...t, scale: Math.min(4, t.scale + 0.2) }))} className="w-12 h-12 bg-gray-800 text-white rounded-full shadow-xl border-2 border-gray-700 hover:border-blue-500 hover:bg-gray-700 transition-all font-bold text-2xl flex items-center justify-center">
            +
          </button>
          <button onClick={() => setTransform(t => ({ ...t, scale: Math.max(0.2, t.scale - 0.2) }))} className="w-12 h-12 bg-gray-800 text-white rounded-full shadow-xl border-2 border-gray-700 hover:border-blue-500 hover:bg-gray-700 transition-all font-bold text-2xl flex items-center justify-center">
            -
          </button>
          <button onClick={() => setTransform({ x: containerRef.current.clientWidth / 2, y: containerRef.current.clientHeight / 2, scale: 1 })} className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-xl border-2 border-blue-400 hover:bg-blue-500 transition-all font-bold text-xl flex items-center justify-center mt-2">
            🎯
          </button>
        </div>
      </div>

      {/* V5300: FULLSCREEN IMAGE MODAL - Rendered OUTSIDE the transform container */}
      {fullscreenImg && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center backdrop-blur-sm"
          style={{ zIndex: 9999999, padding: '20px' }}
          onClick={() => setFullscreenImg(null)}
        >
          <div className="relative" style={{ width: '96vw', height: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={fullscreenImg.primaryUrl}
              alt={fullscreenImg.label}
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 25px 80px rgba(0,0,0,0.8)', border: '4px solid rgba(255,255,255,0.2)' }}
              onError={(e) => {
                if (fullscreenImg.fallbackUrl && e.target.src !== fullscreenImg.fallbackUrl) {
                  e.target.src = fullscreenImg.fallbackUrl;
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setFullscreenImg(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', width: '50px', height: '50px', background: '#ef4444', border: '3px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '50%', fontSize: '1.8rem', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', transition: 'all 0.2s' }}
            >
              ×
            </button>
            <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '10px 24px', borderRadius: '30px', color: '#fff', fontSize: '0.95rem', fontWeight: '700', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap', maxWidth: '80vw', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {fullscreenImg.label}
            </div>
          </div>
        </div>
      )}

      <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
    </div>
  );
}

// ============================================
// MAIN VIDEO CALL COMPONENT
// ============================================
function VideoCall({ tutor = {}, topicContext: initialTopicContext = null, onBack = () => { } }) {
  // DEFAULT TUTOR
  const defaultTutor = {
    name: 'Mr. Teacher',
    subject: 'Mathematics',
    emoji: '🎓',
    color: 'from-blue-500 to-purple-500',
    introVideo: null,
    image: null,
    subjectGreeting: 'Welcome! Ready to learn?',
    personality: 'friendly and encouraging',
    ...tutor
  };

  // ✅ V15/V22: RELAXED SELF-HEALING MIC GUARD
  // If AI is not speaking but 'isProcessing' is stuck, clear it after 15 seconds.
  // This allows for slower API responses on mobile without the UI "giving up".
  React.useEffect(() => {
    let checkInterval = setInterval(() => {
      if (!isSpeaking && isProcessingRef.current) {
        console.warn("🛡️ V22 Guard: isProcessing stuck! Self-healing triggered...");
        isProcessingRef.current = false;
        setIsAnalyzing(false);
      }
    }, 15000);
    return () => clearInterval(checkInterval);
  }, [isSpeaking]);

  // STORAGE KEYS
  const videoSessionsKey = `videoSessions_${defaultTutor.name.replace(/\s+/g, '_')}`;
  const topicStorageKey = `topicContext_${defaultTutor.subject.replace(/\s+/g, '_')}`;

  // STATE
  const [sessions, setSessions] = React.useState(() => {
    try {
      const saved = localStorage.getItem(videoSessionsKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [currentSessionId, setCurrentSessionId] = React.useState(null);
  const [showMobileHistory, setShowMobileHistory] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [homework, setHomework] = React.useState(null);
  const [studentInput, setStudentInput] = React.useState('');
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [stream, setStream] = React.useState(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [recognition, setRecognition] = React.useState(null);
  const [liveMode, setLiveMode] = React.useState(false);
  const [visionEnabled, setVisionEnabled] = React.useState(false);
  const [showIntroVideo, setShowIntroVideo] = React.useState(true);
  const [introPlayed, setIntroPlayed] = React.useState(false);
  const [hasExplainedTopic, setHasExplainedTopic] = React.useState(false);
  const [showTopicSelector, setShowTopicSelector] = React.useState(false);
  const [sttLanguage, setSttLanguage] = React.useState('en-US');
  const [playbackRate, setPlaybackRate] = React.useState(1.0);
  const [typingMessage, setTypingMessage] = React.useState(''); // ✅ V3 Typing Effect
  const [micStalled, setMicStalled] = React.useState(false); // ✅ V11: Safari Recovery State
  const [videoError, setVideoError] = React.useState(false); // ✅ V27: Video Fallback State
  const [lastSpokenText, setLastSpokenText] = React.useState(''); // ✅ V38: For Resume Feature
  const [activeTopicVideoId, setActiveTopicVideoId] = React.useState(null); // ✅ V71/V72: Topic Reel
  const [fullscreenImage, setFullscreenImage] = React.useState(null); // ✅ V5139: Fullscreen State

  const sttLanguageRef = React.useRef('en-US'); // ✅ V7 Ref for instant sync

  const [topicContext, setTopicContext] = React.useState(initialTopicContext);

  // V5200: MINDMAP STATE 🧠
  const [showMindMap, setShowMindMap] = React.useState(false);
  const [showMindMapSelector, setShowMindMapSelector] = React.useState(false); // ✅ V5201: Selector State
  const [mindMapData, setMindMapData] = React.useState(null);
  const [isMindMapLoading, setIsMindMapLoading] = React.useState(false);

  // V5200: OPEN MINDMAP HANDLER (UPDATED V5202: ROBUST LOCAL GENERATION + IMAGES)
  const handleMindMapOpen = async (selectedTopic = null, selectedSubject = null) => {
    setIsMindMapLoading(true);
    try {
      // Use selected topic/subject passed from selector, or fallback to current context
      const currentTopic = selectedTopic || topicContext?.topic?.name || "Science";
      const currentSubject = selectedSubject || defaultTutor.subject || "General Science";
      console.log(`🧠 Generating MindMap for: ${currentTopic} (${currentSubject})`);

      // 1. DEFINE GENERATOR PROMPT
      // V5210: ENHANCED PROMPT — AI generates imageQuery for PERFECT topic-relevant images
      const prompt = `Generate a hierarchical JSON mindmap in ENGLISH for "${currentTopic}" (${currentSubject}).

CRITICAL STRUCTURE RULES:
1. Root node = Main topic (short label, 2-4 words)
2. Level 1 children = Key subtopics (short labels: "Immunodeficiency", "Hypersensitivities", etc.)
3. Level 2 children = EITHER:
   - Short category labels ("Causes", "Types", "Examples")
   - ONE-SENTENCE detailed explanations (mark with "isExplanation": true)
4. Keep topic labels SHORT (2-5 words max)
5. Explanation nodes must be COMPLETE SENTENCES in English explaining the concept

**6. IMAGES ARE MANDATORY**: For AT LEAST 5-6 visually interesting nodes, add BOTH:
   - "showImage": true
   - "imageQuery": "<PERFECT Google Image search term, 3-8 words, specific to THIS exact subtopic>"
   The imageQuery MUST be a specific, descriptive search term that will find a RELEVANT educational diagram/illustration.
   DO NOT use generic terms. Each imageQuery must be UNIQUE and SPECIFIC to the node's actual content.
   Examples:
   - For "Photosynthesis" → imageQuery: "photosynthesis process diagram labeled"
   - For "Light Reactions" → imageQuery: "light dependent reactions thylakoid diagram"
   - For "Types of Bonds" → imageQuery: "ionic covalent bond comparison diagram"
   - For "Cell Division" → imageQuery: "mitosis stages diagram labeled biology"

EXAMPLE STRUCTURE:
{
  "id": "root",
  "label": "Immune System Dysfunctions",
  "children": [
    {
      "id": "c1",
      "label": "Immunodeficiency",
      "showImage": true,
      "imageQuery": "immunodeficiency types primary secondary diagram",
      "children": [
        { "id": "c1-exp", "label": "When the immune system's response fails, is too weak, or is delayed.", "isExplanation": true },
        { "id": "c1-c", "label": "Causes", "showImage": true, "imageQuery": "immunodeficiency causes HIV AIDS diagram", "children": [] },
        { "id": "c1-t", "label": "Types", "showImage": true, "imageQuery": "primary vs secondary immunodeficiency chart", "children": [] }
      ]
    },
    {
      "id": "c2",
      "label": "Hypersensitivities",
      "showImage": true,
      "imageQuery": "hypersensitivity types I II III IV diagram",
      "children": [
        { "id": "c2-exp", "label": "Inappropriate immune responses to harmless foreign substances or the body's own cells.", "isExplanation": true }
      ]
    }
  ]
}

OUTPUT JSON ONLY. No markdown, no extra text.`;

      // 2. CALL AI (Robust Fallback Chain)
      let jsonStr = "{}";
      if (window.BrowserAPIEngine?.chat) {
        const res = await window.BrowserAPIEngine.chat(prompt);
        jsonStr = res.success ? res.content : "{}";
      } else if (window.CONFIG?.API?.chat) {
        const res = await window.CONFIG.API.chat(prompt);
        jsonStr = res.success ? res.content : "{}";
      } else {
        throw new Error("AI Engine not available");
      }

      // 3. PARSE & CLEAN JSON
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      let data = JSON.parse(jsonStr);

      // 4. V5210: Store root topic globally so child nodes can prepend it for better image searches
      window.__mindMapRootTopic = data.label || currentTopic || '';
      console.log(`🧠 V5210: Root topic set to "${window.__mindMapRootTopic}" for image context`);
      setMindMapData(data);
      setShowMindMap(true);

    } catch (e) {
      console.error("MindMap Gen Error:", e);
      // Fallback Mock Data with Explanations
      setMindMapData({
        id: "root", label: "MindMap Error",
        children: [
          {
            id: "e1", label: "We couldn't generate the map.",
            children: [{ id: "e1-1", label: "Please check your internet connection or try a different topic.", isExplanation: true }]
          },
          { id: "e2", label: "Try Refreshing", children: [] }
        ]
      });
      setShowMindMap(true);
    } finally {
      setIsMindMapLoading(false);
    }
  };

  // REFS
  const introVideoRef = React.useRef(null);
  const desktopVideoRef = React.useRef(null);
  const mobileVideoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const transcriptRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const currentUtteranceRef = React.useRef(null);
  const conversationHistoryRef = React.useRef([]);
  const isProcessingRef = React.useRef(false);
  const liveModeRef = React.useRef(false);
  const visionEnabledRef = React.useRef(false);
  const isPausedRef = React.useRef(false); // ✅ V61: Fixes ReferenceError
  const silenceTimeout = React.useRef(null);
  const isMounted = React.useRef(true);
  const recognitionRef = React.useRef(null); // ✅ V13: DEFINITIVE REF FOR MIC CONTROL
  const micStartingRef = React.useRef(false); // ✅ V14: GUARD FOR DOUBLE START SPAM
  const currentResponseIdRef = React.useRef(0); // ✅ TRACK LATEST RESPONSE
  const typingIntervalRef = React.useRef(null); // ✅ V54: Track typing loop for global kill
  const youtubeRef = React.useRef(null); // ✅ V79: For Play/Pause Sync

  // ✅ V79: YouTube Playback Controller
  const sendYTCommand = (command) => {
    if (youtubeRef.current && youtubeRef.current.contentWindow) {
      youtubeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
    }
  };

  // ✅ V79: Sync YouTube with Voice
  React.useEffect(() => {
    if (activeTopicVideoId) {
      if (isSpeaking && !isPaused) {
        sendYTCommand('playVideo');
      } else {
        sendYTCommand('pauseVideo');
      }
    }
  }, [isSpeaking, isPaused, activeTopicVideoId]);

  // ✅ V7 SYNC REF
  React.useEffect(() => {
    sttLanguageRef.current = sttLanguage;
  }, [sttLanguage]);

  // LIFECYCLE
  React.useEffect(() => {
    isMounted.current = true;
    if (defaultTutor.introVideo) {
      setShowIntroVideo(true);
      setIsRecording(true);
    } else {
      setShowIntroVideo(false);
      setIntroPlayed(true);
    }
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, []);

  // Initialize first session if none exist
  // Initialize first session if none exist
  React.useEffect(() => {
    // ✅ V35: ALWAYS Start Fresh Session on Mount (Student Request)
    // "when i ma leave the my tutor and then open it so i want my rectly chat but in history you should start pleased new okay"
    // ✅ V35: ALWAYS Start Fresh Session on Mount (Student Request)
    // "when i ma leave the my tutor and then open it so i want my rectly chat but in history you should start pleased new okay"
    handleNewConversation(true);

    handleNewConversation(true);

    return () => {
      if (window.stopAllVoices) window.stopAllVoices(); // ✅ V77: Silent cleanup
    };
  }, []); // Run once on mount

  // Sync with LocalStorage
  React.useEffect(() => {
    localStorage.setItem(videoSessionsKey, JSON.stringify(sessions));
  }, [sessions, videoSessionsKey]);

  // ✅ V5135: YouTube Search Trigger FOR TOPIC VIDEOS
  React.useEffect(() => {
    if (topicContext && topicContext.topic && topicContext.topic.name) {
      // Use config.js YouTube search directly
      if (window.searchYouTubeVideos) {
        // V5210: Prioritize animated educational shorts/reels instead of long tutorials
        const query = `${topicContext.topic.name} ${defaultTutor.subject} animated explanation #shorts urdu hindi`;
        window.searchYouTubeVideos(query, 1)
          .then(videos => {
            if (videos && videos.length > 0) {
              console.log('🎬 Topic Video Found:', videos[0].id);
              setActiveTopicVideoId(videos[0].id);
            }
          })
          .catch(err => console.error('YouTube search error:', err));
      } else {
        console.error('searchYouTubeVideos not available');
      }
    } else {
      setActiveTopicVideoId(null);
    }
  }, [topicContext?.topic?.name]);

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (transcriptRef.current) {
      setTimeout(() => {
        transcriptRef.current.scrollTo({
          top: transcriptRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [currentSessionId, sessions]);

  // GREETING
  const getSubjectGreeting = () => {
    return defaultTutor.subjectGreeting || `Welcome! I'm ${defaultTutor.name}. Let's explore ${defaultTutor.subject} together!`;
  };

  // TRANSCRIPT
  const addToTranscript = (role, message, imageUrl = null) => {
    if (!currentSessionId) return;
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        // Auto-title session if it's the first user message
        let newTitle = s.title;
        if (role === 'user' && (s.title.startsWith('Session ') || s.title === 'New Chat')) {
          newTitle = message.slice(0, 30) + (message.length > 30 ? '...' : '');
        }

        return {
          ...s,
          title: newTitle,
          transcript: [...s.transcript, {
            role,
            message,
            imageUrl, // ✅ V14: Topic Related Images
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
        };
      }
      return s;
    }));
  };

  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this session?")) return;

    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (currentSessionId === id) {
        if (filtered.length > 0) {
          setCurrentSessionId(filtered[0].id);
        } else {
          setCurrentSessionId(null);
        }
      }
      return filtered;
    });
  };

  const handleNewConversation = (silent = false) => {
    if (window.unlockAudioContext) window.unlockAudioContext(); // ✅ V16: Poke audio context on user gesture
    if (!silent && !window.confirm("Start a new conversation? Previous history will be saved.")) return;

    if (window.stopElevenLabs) window.stopElevenLabs();

    const newSession = {
      id: Date.now(),
      title: `Session ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: new Date().toLocaleString(),
      transcript: []
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    conversationHistoryRef.current = [];

    // Trigger greeting
    if (!silent || introPlayed) {
      setTimeout(() => {
        const greeting = getSubjectGreeting();
        addToTranscript('assistant', greeting);
        conversationHistoryRef.current = [{ role: 'assistant', content: greeting }];
        if (window.speakWithElevenLabs && window.CONFIG?.voice?.elevenlabs?.enabled) {
          window.speakWithElevenLabs(greeting, defaultTutor.name, () => setIsSpeaking(true), () => setIsSpeaking(false), getVoiceForTutor(), playbackRate);
        } else {
          speakText(greeting);
        }
      }, 500);
    }
  };

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0] || { transcript: [] };
  const transcript = currentSession.transcript;

  React.useEffect(() => {
    liveModeRef.current = liveMode;
  }, [liveMode]);

  React.useEffect(() => {
    visionEnabledRef.current = visionEnabled;
  }, [visionEnabled]);

  // LIVE VISION LOOP
  React.useEffect(() => {
    let interval;
    if (liveMode && isCameraActive && !isAnalyzing && !isSpeaking) {
      interval = setInterval(() => {
        console.log("🔴 Live Vision: Auto-capturing...");
        captureAndAnalyze("What do you see now? Be brief.");
      }, 10000); // Every 10 seconds
    }
    return () => clearInterval(interval);
  }, [liveMode, isCameraActive, isAnalyzing, isSpeaking]);

  // AUTO-TOPIC EXPLANATION
  React.useEffect(() => {
    if (topicContext && !hasExplainedTopic && !showIntroVideo && introPlayed) {
      setTimeout(() => {
        setHasExplainedTopic(true);
        addToTranscript('system', `📚 Starting lesson: ${topicContext.topic.name}`);
        addToTranscript('system', `📖 ${topicContext.book.name} - ${topicContext.unit.name}`);

        const naturalPrompt = `Explain ${topicContext.topic.name} from ${topicContext.unit.name} for Class ${topicContext.class} students in simple terms with examples.`;
        handleAIResponse(naturalPrompt, true);
      }, 2000);
    }
  }, [topicContext, showIntroVideo, introPlayed, hasExplainedTopic]);

  // CLEANUP
  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (recognition) {
      try { recognition.abort(); } catch (e) { }
    }
    window.speechSynthesis?.cancel();
    if (window.currentElevenLabsAudio) {
      try {
        window.currentElevenLabsAudio.pause();
        window.currentElevenLabsAudio.currentTime = 0;
        window.currentElevenLabsAudio = null;
      } catch (e) { }
    }
    if (silenceTimeout.current) {
      clearTimeout(silenceTimeout.current);
    }
  };


  // INTRO VIDEO END
  const handleIntroVideoEnd = () => {
    setShowIntroVideo(false);
    setIntroPlayed(true);

    // ALWAYS show greeting in transcript after intro ends
    const greeting = getSubjectGreeting();

    // Skip if already in transcript to avoid duplicates on re-renders
    const alreadyGreeted = transcript.some(t => t.message === greeting);

    if (!alreadyGreeted) {
      setTimeout(() => {
        addToTranscript('assistant', greeting);
        conversationHistoryRef.current = [{
          role: 'assistant',
          content: greeting
        }];

        if (window.speakWithElevenLabs && window.CONFIG?.voice?.elevenlabs?.enabled) {
          window.speakWithElevenLabs(greeting, defaultTutor.name, () => setIsSpeaking(true), () => setIsSpeaking(false), getVoiceForTutor(), playbackRate);
        } else {
          setTimeout(() => speakText(greeting), 500);
        }
      }, 500);

      // Mark as connected in system log too
      addToTranscript('system', `🎓 Session with ${defaultTutor.name} started`);
    }
  };

  // GET PROPER VOICE FOR TUTOR - Real ElevenLabs Voices (Different for each tutor)
  const getVoiceForTutor = () => {
    // V11: Hardcoded map removed to avoid sync issues. 
    // Einstein and others now use the global TUTOR_VOICES config in elevenlabs-config.js
    if (window.getElevenLabsVoiceId) {
      return window.getElevenLabsVoiceId(defaultTutor.name);
    }
    return 'pNInz6obpgDQGcFmaJgB'; // Default Adam
  };

  // SPEECH FUNCTION - ✅ V5133: USES CONFIG.JS BROWSER API
  const speakText = async (text, forcedRate = null, forcedLanguage = null) => {
    const rateToUse = forcedRate || playbackRate;
    setLastSpokenText(text);

    try {
      setIsSpeaking(true);
      setIsPaused(false);

      // USE CONFIG.JS GLOBAL FUNCTION
      if (window.speakText) {
        await window.speakText(text, defaultTutor.name,
          () => {
            setIsSpeaking(true);
            setIsPaused(false);
          },
          () => {
            setIsSpeaking(false);
            isProcessingRef.current = false;
            setIsAnalyzing(false);
            window.currentAudio = null;
            if (liveModeRef.current) {
              const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
              if (!isSafari) {
                setTimeout(() => { if (!isSpeaking) startListening(true); }, 800);
              } else {
                addToTranscript('system', 'Tap "Voice" to reply (Safari Strict Mode)');
              }
            }
          },
          null,
          rateToUse
        );
      } else {
        // Fallback to browser TTS if config.js not loaded
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rateToUse;
        if (forcedLanguage === 'ur' || /[\u0600-\u06FF]/.test(text)) {
          utterance.lang = 'ur-PK';
        } else {
          utterance.lang = 'en-US';
        }
        utterance.onend = () => {
          setIsSpeaking(false);
          isProcessingRef.current = false;
          setIsAnalyzing(false);
        };
        window.speechSynthesis.speak(utterance);
      }
    }
    catch (e) {
      console.error("speakText error:", e);
      setIsSpeaking(false);
      isProcessingRef.current = false;
      setIsAnalyzing(false);
    }
  };

  // PAUSE/RESUME/STOP - ✅ FIXED FOR NEW AUDIO SYSTEM
  const pauseSpeech = () => {
    if (window.currentAudio) {
      window.currentAudio.pause();
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const resumeSpeech = () => {
    if (window.currentAudio) {
      window.currentAudio.play();
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    setIsPaused(false);
    isPausedRef.current = false;
  };

  // STOP SPEECH (Global Kill Switch)
  const stopSpeech = () => {
    // 1. Kill Audio playback
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
      window.currentAudio = null;
    }

    // 2. Kill Browser TTS
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // 3. Reset State
    setIsSpeaking(false);
    setIsPaused(false);
    isProcessingRef.current = false;

    // 4. Kill Mic
    stopListening();
    setIsPaused(false);
    isPausedRef.current = false;
  };

  // CALL CONTROLS
  const handleEndCall = () => {
    setIsRecording(false);
    setLiveMode(false);
    setVisionEnabled(false);
    liveModeRef.current = false;
    visionEnabledRef.current = false;
    stopListening();
    stopCamera();

    stopSpeech(); // Use the unified stopSpeech function

    addToTranscript('system', 'Call ended');
  };

  // BACK BUTTON
  const handleBackClick = () => {
    try {
      stopSpeech(); // Use the unified stopSpeech function

      // Force kill typing just in case
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }

      setIsListening(false);
      setIsSpeaking(false);
      setIsPaused(false);
      setLiveMode(false);
      setVisionEnabled(false);
      setIsCameraActive(false);
      setIsRecording(false);
      cleanup();
    } catch (e) {
      console.error("Back cleanup error:", e);
    }

    // Force navigation even if cleanup fails
    onBack();
  };

  // CAMERA FUNCTIONS
  const startCamera = async () => {
    // ✅ UNLOCK AUDIO FOR SAFARI/IPHONE
    if (window.unlockAudioContext) window.unlockAudioContext();

    try {
      console.log('🎥 Requesting camera permission...');

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: 16 / 9
        },
        audio: false
      });

      setStream(mediaStream);

      const attachStream = (videoEl) => {
        if (!videoEl) return;
        videoEl.srcObject = mediaStream;
        videoEl.muted = true;
        videoEl.playsInline = true;

        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.warn('⚠️ Autoplay blocked, waiting for user gesture');
          });
        }
      };

      attachStream(desktopVideoRef.current);
      attachStream(mobileVideoRef.current);

      setIsCameraActive(true);
      addToTranscript('system', '✅ Camera started');
      console.log('✅ Camera started successfully');

    } catch (err) {
      console.error("❌ Camera Error:", err);

      if (err.name === 'NotAllowedError') {
        addToTranscript('system', '❌ Camera Access Denied. Please check settings.');
      } else if (err.name === 'NotFoundError') {
        addToTranscript('system', '❌ No camera found.');
      } else {
        addToTranscript('system', '❌ Camera error: ' + err.message);
      }

      addToTranscript('system', '❌ Camera error');
    }
  };


  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (desktopVideoRef.current) {
      desktopVideoRef.current.srcObject = null;
    }

    if (mobileVideoRef.current) {
      mobileVideoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
    addToTranscript('system', 'Camera stopped');
  };


  // TOPIC SELECTOR
  const handleTopicSelected = (context) => {
    setTopicContext(context);
    setShowTopicSelector(false);
    setHasExplainedTopic(false);
    addToTranscript('system', `Topic changed to: ${context.topic.name} `);
  };


  // SEND MESSAGE
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (window.unlockAudioContext) window.unlockAudioContext(); // ✅ V8 Recovery
    if (!studentInput.trim() || isAnalyzing) return;
    const message = studentInput;
    setStudentInput('');
    addToTranscript('user', message);
    await handleAIResponse(message);
  };

  // VOICE RECOGNITION - AUTO-DETECT LANGUAGE (Urdu & English)
  const startListening = (isAuto = false) => {
    if (window.unlockAudioContext) window.unlockAudioContext();
    if (isListening || recognitionRef.current || micStartingRef.current) return; // ✅ V14: Added micStartingRef guard

    micStartingRef.current = true;
    performStartListening(isAuto);
  };

  const performStartListening = async (isAuto = false) => {
    try {
      // ✅ V37: Safari Fix - Removed explicit getUserMedia check here.
      // SpeechRecognition handles its own permissions. Calling getUserMedia redundantly 
      // can cause "Access Denied" on Safari if the stream isn't handled perfectly.
      // We trust SpeechRecognition to prompt if needed.

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("❌ Speech recognition not supported.");
        addToTranscript('system', '❌ Speech recognition not supported');
        micStartingRef.current = false;
        return;
      }
      const recognitionInstance = new SpeechRecognition();
      recognitionRef.current = recognitionInstance; // ✅ Store in Ref for definitive cleanup

      // Use the selected language for recognition
      const currentLang = sttLanguageRef.current; // ✅ V7: Use Ref to avoid state lag
      recognitionInstance.lang = currentLang;
      recognitionInstance.interimResults = true;
      recognitionInstance.maxAlternatives = 1;
      recognitionInstance.continuous = true;

      let silenceTimer = null;
      let finalTranscript = '';

      recognitionInstance.onstart = () => {
        micStartingRef.current = false; // ✅ V14: Unlock after start
        setMicStalled(false); // ✅ V16: Direct feedback - mic is alive!
        const langName = currentLang === 'ur-PK' ? 'اردو' : 'English';
        console.log(`🎤 Listening in ${currentLang}... (V10 Silent Heartbeat)`);
        setIsListening(true);
        // ✅ V10: TRANSCRIPT GUARD - Only show if user initiated
        if (!isAuto) {
          addToTranscript('system', `🎤 Listening(${langName})...`);
        }
      };

      recognitionInstance.onresult = (event) => {
        // ✅ V12: BUFFER GUARD
        // If AI is currently speaking, we discard results to prevent echo/bloat.
        if (isProcessingRef.current) {
          finalTranscript = '';
          if (silenceTimer) clearTimeout(silenceTimer);
          return;
        }

        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript || interimTranscript) {
          // Clear existing timer
          if (silenceTimer) clearTimeout(silenceTimer);

          // Set new timer - Snappier V15 (1.5s EN / 2.5s UR)
          const silenceDelay = currentLang === 'ur-PK' ? 2500 : 1500;
          silenceTimer = setTimeout(() => {
            const fullText = (finalTranscript + interimTranscript).trim();
            if (fullText && !isProcessingRef.current) {
              console.log(`🛑 Silence detected(${currentLang}).Sending to AI: `, fullText);

              if (silenceTimer) clearTimeout(silenceTimer);
              if (window.stopElevenLabs) window.stopElevenLabs();

              // Reset local accumulation so next results are fresh
              finalTranscript = '';

              // ✅ V13: AUTO-STOP LOGIC
              // If we are NOT in live mode, stop the mic after sending the command.
              if (!liveModeRef.current) {
                console.log("🛑 Non-Live Mode: Auto-stopping mic after command.");
                stopListening();
              }

              addToTranscript('user', fullText);
              handleAIResponse(fullText, false, currentLang);
            }
          }, silenceDelay);
        }
      };

      recognitionInstance.onerror = (event) => {
        micStartingRef.current = false; // ✅ V17/V18: Life-support: Reset on error
        console.error("🎤 Speech recognition error:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          console.error("❌ Mic Access Denied. Disabling Live Mode.");
          setLiveMode(false);
          // ✅ V39: SILENT FAILURE (Safari Friendly)
          // We do NOT show an alert here because Safari often throws false positives.
          // We just log it and let the user tap again if needed.
          addToTranscript('system', '❌ Mic Access Denied. Please tap Voice to try again.');
        } else if (event.error === 'no-speech') {
          // Normal on long silences
        } else {
          addToTranscript('system', '⚠️ Listening error: ' + event.error);
        }
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        micStartingRef.current = false; // ✅ V17: Life-support: Reset on end
        setIsListening(false);
        recognitionRef.current = null; // ✅ Clean Ref

        // ✅ V11: Safari Loop Guard - Only show recovery button if unexpectedly stopped
        if (liveModeRef.current && !isProcessingRef.current) {
          console.log("🔄 Live Mode: Mic ended unexpectedly. Showing recovery button...");
          // We don't auto-restart here to avoid the "Death Loop" Safari blocks.
          // Instead, we mark it as stalled so we can show the UI button.
          if (/iPhone|iPad|iPod|Safari/i.test(navigator.userAgent)) {
            setMicStalled(true);
          } else {
            // Deskop Chrome/Edge can usually auto-restart safely
            setTimeout(() => startListening(true), 100);
          }
        }
      };

      recognitionInstance.start();
      setRecognition(recognitionInstance);
    } catch (error) {
      console.error("❌ Error starting speech recognition:", error);
      micStartingRef.current = false;
      setIsListening(false);
      setRecognition(null);

      // ✅ V59: GRACEFUL SAFARI ERROR HANDLING
      if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
        addToTranscript('system', '⚠️ Mic Access Blocked. Please Tap "Voice" Manually.');
      } else {
        addToTranscript('system', '❌ Microphone error - Check permissions');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null; // Prevent onend firing state changes
        recognitionRef.current.stop();
      } catch (e) { }
      recognitionRef.current = null;
    }
    if (recognition) {
      try { recognition.stop(); } catch (e) { }
      setRecognition(null);
    }
    micStartingRef.current = false; // ✅ V37: Ensure start lock is released
    setIsListening(false);
  };

  const handleLanguageChange = (newLang) => {
    if (newLang === sttLanguage) return; // ✅ V13: Guard against redundant switches

    if (window.unlockAudioContext) window.unlockAudioContext();
    setSttLanguage(newLang);
    sttLanguageRef.current = newLang; // ✅ V7: Immediate sync for the restart loop
    addToTranscript('system', `🌍 Language switched to: ${newLang === 'ur-PK' ? 'اردو (Urdu)' : 'English'} `);

    // ✅ V58: NUCLEAR SAFARI RESET
    // Safari completely rejects mic access if you swap languages while Live Mode is hot.
    // We must KILL Live Mode and force the user to manually restart.
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isListening || liveModeRef.current) {
      stopListening();

      if (isSafari) {
        // FORCE OFF LIVE MODE
        setLiveMode(false);
        liveModeRef.current = false;
        addToTranscript('system', '⚠️ Safari Safety: Live Mode Disabled. Tap "Voice" to restart in ' + (newLang === 'ur-PK' ? 'Urdu' : 'English'));
      } else {
        // Desktop can usually handle it, but let's be safe
        setTimeout(() => {
          addToTranscript('system', 'Language changed. Tap "Voice" to speak.');
        }, 500);
      }
    }
  };

  const toggleLiveMode = () => {
    if (window.unlockAudioContext) window.unlockAudioContext();
    const newMode = !liveMode;
    setLiveMode(newMode);
    liveModeRef.current = newMode;

    if (newMode) {
      addToTranscript('system', '🔴 Live Mode ON - I am listening...');
      startListening();
    } else {
      addToTranscript('system', '⚪ Live Mode OFF');
      stopListening();
    }
  };

  // AI RESPONSE HANDLER - Bilingual Support
  const handleAIResponse = async (text, isAuto = false, userLanguage = null) => {
    if (!text || isProcessingRef.current) return; // ✅ ATOMIC V2 GUARD

    // ✅ GENERATE NEW RESPONSE ID
    const myResponseId = ++currentResponseIdRef.current;

    // Aggressive cleanup before starting new AI response
    if (window.stopElevenLabs) window.stopElevenLabs();
    isProcessingRef.current = true;

    // AUTO-DETECT LANGUAGE if not provided
    let detectedLang = userLanguage;
    if (!detectedLang) {
      const urduRegex = /[\u0600-\u06FF]/g; // Urdu/Arabic Unicode
      detectedLang = urduRegex.test(text) ? 'ur-PK' : 'en-US';
    }

    console.log(`🌍 Language Detected: ${detectedLang === 'ur-PK' ? 'اردو (Urdu)' : 'English'} `);

    // SMART VISION TRIGGER
    const urduVisionKeywords = ['دیکھو', 'دیکھ', 'یہ کیا', 'کیا ہے', 'کیمرہ', 'دیکھ سکتے', 'دکھا'];
    const englishVisionKeywords = ['see', 'look', 'what is this', 'show', 'camera', 'view', 'watch', 'read', 'visualize'];
    const visionKeywords = [...urduVisionKeywords, ...englishVisionKeywords];

    const lowerText = text.toLowerCase();
    const isVisionRequest = visionKeywords.some(keyword => lowerText.includes(keyword));

    if (isVisionRequest && isCameraActive && (desktopVideoRef.current || mobileVideoRef.current)) {
      console.log('👁️ Vision Keyword detected! Triggering captureAndAnalyze...');
      const videoEl = desktopVideoRef.current || mobileVideoRef.current;
      await captureAndAnalyze(text, detectedLang, videoEl);
      return;
    }

    setIsAnalyzing(true);
    isProcessingRef.current = true;

    try {
      const systemPrompt = `You are ${defaultTutor.name}, a world - class expert in ${defaultTutor.subject}.
You are currently holding a LIVE Video Session with a student.

### YOUR RESPONSE STYLE(CRITICAL):
- ** CHATGPT - STYLE CLARITY:** Provide clear, well - structured answers.Start with a direct answer, then elaborate.
- ** PERFECT FORMATTING:**
  • Use ** bold ** for key terms and concepts
  • Use numbered lists(1., 2., 3.) for steps or sequential information
  • Use bullet points(•) for related items
  • Add blank lines between paragraphs for readability
  • Use emojis strategically(🧪, ⚛️, 🔢, 📖, 🔬) to enhance understanding

    - ** RESPONSE STRUCTURE:**
      1. ** Direct Answer First:** Start with a concise definition or answer(2 - 3 sentences)
  2. ** Detailed Explanation:** Break down the concept into clear steps or components
  3. ** Real - World Connection:** Provide a practical example or analogy
  4. ** Engaging Question:** End with a thought - provoking question to encourage learning

    - ** LENGTH GUIDELINES:**
  • Simple questions: 150 - 250 words(concise but complete)
  • Complex topics: 300 - 400 words(comprehensive with examples)
  • Always prioritize CLARITY over length

    - ** CRITICAL LANGUAGE RULE:**
  - Student language/style: ${window.BrowserAPIEngine?.detectLanguageStyle?.(text) || (detectedLang === 'ur-PK' ? 'URDU SCRIPT' : 'ENGLISH')}
  • Student's Language: ${detectedLang === 'ur - PK' ? 'اردو(URDU)' : 'ENGLISH'}
  • ** YOU MUST RESPOND IN THE EXACT SAME LANGUAGE THE STUDENT USED **
  • If student writes in Urdu / Hindi → You respond ONLY in Urdu script(اردو)
  • If student writes in English → You respond ONLY in English
  • ** NEVER explain which language you're using or why**
  • ** NEVER say "you asked in Hindi but I'll respond in English" **
  • ** JUST RESPOND IN THE SAME LANGUAGE - NO EXCEPTIONS **

    Examples:
  - Student: "Namaste, kaise ho?" → You: "Main theek hoon, shukriya! 🧪..."
    - Student: "Hello, how are you?" → You: "I'm doing great, thanks! 🧪..."
      - Student: "السلام علیکم" → You: "وعلیکم السلام! میں بہت اچھا ہوں..."

        - ** PROFESSIONAL TONE:** Be encouraging, clear, and authoritative.Avoid unnecessary filler words.

Current Topic: ${topicContext?.topic?.name || 'General'}
Student Class: ${topicContext?.grade || 'N/A'} `;

      let aiResponse = '';

      // V5133: USE CONFIG.JS BROWSER API ENGINE
      if (window.BrowserAPIEngine && window.BrowserAPIEngine.chat) {
        try {
          const result = await window.BrowserAPIEngine.chat(text, systemPrompt);
          aiResponse = result.content || 'Please retry.';
        } catch (error) {
          console.error("Browser API Error:", error);
          const urduResponses = [
            "یہ بہت اچھا سوال ہے! مجھے یہ موضوع مرحلہ وار سمجھانے دیں۔",
            "بہترین مشاہدہ! یہ موضوع ہم نے پہلے سیکھا ہے۔",
            "میں خوش ہوں کہ آپ نے یہ سوال پوچھا! یہ بہت اہم ہے۔"
          ];
          const englishResponses = [
            "That's a great question! Let me explain that concept step by step.",
            "Excellent observation! This topic builds on what we learned earlier.",
            "I'm glad you asked! This is an important fundamental concept."
          ];
          const responses = detectedLang === 'ur-PK' ? urduResponses : englishResponses;
          aiResponse = responses[Math.floor(Math.random() * responses.length)];
        }
      } else {
        console.error("BrowserAPIEngine not found!");
        const urduResponses = [
          "یہ بہت اچھا سوال ہے! مجھے یہ موضوع مرحلہ وار سمجھانے دیں۔",
          "بہترین مشاہدہ! یہ موضوع ہم نے پہلے سیکھا ہے۔"
        ];
        const englishResponses = [
          "That's a great question! Let me explain that concept step by step.",
          "Excellent observation! This topic builds on what we learned earlier."
        ];
        const responses = detectedLang === 'ur-PK' ? urduResponses : englishResponses;
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
      }

      // ✅ START TYPING EFFECT & SPEAKING SIMULTANEOUSLY
      if (myResponseId === currentResponseIdRef.current) {
        // 1. Start Speaking via Unified Bridge
        speakText(aiResponse);

        // 2. Simulated Typing Effect (ChatGPT Style)
        let currentText = "";
        const words = aiResponse.split(" ");
        let wordIndex = 0;

        // 3. FINAL TRANSCRIPT UPDATE WITH TOPIC IMAGE (Optional)
        const topicName = topicContext?.topic?.name;
        let topicImageUrl = null;

        // V5139: GET REAL TOPIC IMAGE VIA GOOGLE SEARCH
        if (topicName && !visionEnabled) {
          try {
            const topicImages = await window.searchGoogleImages(topicName);
            if (topicImages && topicImages.length > 0) {
              topicImageUrl = topicImages[0].link;
            } else {
              topicImageUrl = `https://picsum.photos/seed/${encodeURIComponent(topicName)}/600/400`;
            }
          } catch (e) {
            console.warn("Topic image search failed:", e);
            topicImageUrl = `https://picsum.photos/seed/${encodeURIComponent(topicName)}/600/400`;
          }
        }

        // Clear any existing interval via GLOBAL ref
        if (window.globalTypingInterval) clearInterval(window.globalTypingInterval);

        window.globalTypingInterval = setInterval(() => {
          // 1. KILL SWITCH: If Stop button pressed (isProcessing false)
          // ✅ V62: COMMIT TEXT ON STOP (Don't just vanish)
          if (!isProcessingRef.current && myResponseId === currentResponseIdRef.current) {
            clearInterval(window.globalTypingInterval);
            // Commit the FULL text to transcript so it doesn't vanish
            addToTranscript('assistant', aiResponse, topicImageUrl);
            setLastSpokenText(aiResponse); // Ensure Resume works
            setTypingMessage(''); // Clear typing view
            return;
          }

          // 2. PAUSE FREEZE: If Paused, do nothing this tick
          if (isPausedRef.current) return;

          if (wordIndex < words.length && myResponseId === currentResponseIdRef.current) {
            currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
            setTypingMessage(currentText);
            wordIndex++;

            // FORCE SCROLL
            if (transcriptRef.current) {
              const el = transcriptRef.current;
              el.scrollTop = el.scrollHeight;
            }
          } else {
            clearInterval(window.globalTypingInterval);
            if (myResponseId === currentResponseIdRef.current) {
              setTypingMessage(''); // Clear typing line
              // Add final message to transcript...
              addToTranscript('assistant', aiResponse, topicImageUrl);
              setTypingMessage('');
            }
          }
        }, 120); // Adjust typing speed as needed
      } else {
        console.log(`🔇 Skipping old response: ${myResponseId}`);
        isProcessingRef.current = false;
      }

    } catch (error) {
      console.error("AI Error:", error);
      addToTranscript('system', 'Error getting response. Please try again.');
      setIsAnalyzing(false);
      isProcessingRef.current = false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // VISION ANALYSIS - ✅ V52: FIXED TO USE API-V50.PHP (GEMINI VISION)
  const captureAndAnalyze = async (customPrompt = null, userLanguage = null, videoRefArg = null) => {
    const video = [videoRefArg, desktopVideoRef.current, mobileVideoRef.current]
      .filter(Boolean)
      .find(v => v.readyState >= 2 && v.videoWidth > 0 && v.videoHeight > 0)
      || videoRefArg || desktopVideoRef.current || mobileVideoRef.current;
    if (!video || !canvasRef.current) {
      console.warn("📹 Video or Canvas ref missing for vision analysis");
      return;
    }

    // Detect language from prompt if not provided
    let detectedLang = userLanguage;
    if (!detectedLang && customPrompt) {
      const urduRegex = /[\u0600-\u06FF]/g;
      detectedLang = urduRegex.test(customPrompt) ? 'ur-PK' : 'en-US';
    }
    detectedLang = detectedLang || 'en-US';

    setIsAnalyzing(true);
    addToTranscript('system', detectedLang === 'ur-PK' ? '📸 میں دیکھ رہا ہوں...' : '📸 Looking through the camera...');

    try {
      const canvas = canvasRef.current;
      if (!video.videoWidth || !video.videoHeight) {
        await new Promise(resolve => setTimeout(resolve, 450));
      }

      if (!video.videoWidth || !video.videoHeight) {
        addToTranscript('system', detectedLang === 'ur-PK' ? 'کیمرہ ابھی تیار ہو رہا ہے، دوبارہ کوشش کریں۔' : 'Camera is still starting. Please try again in a moment.');
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL('image/jpeg');

      let analysis = '';

      // V5133: USE CONFIG.JS BROWSER API ENGINE FOR VISION
      try {
        const studentVisionPrompt = customPrompt || 'What do you see in the camera?';
        const languageStyle = window.BrowserAPIEngine?.detectLanguageStyle?.(studentVisionPrompt) || (detectedLang === 'ur-PK' ? 'Urdu script' : 'English');
        const prompt = `You are ${defaultTutor.name} looking through the student's camera.
Never mention Google Cloud Vision, Cloud Vision, OCR, labels, detections, metadata, backend analysis, or any API/tool name.
Speak naturally as if you personally see the camera.
Answer only in this language/style: ${languageStyle}.
If the student uses Roman Urdu/Hinglish, reply in Roman Urdu/Hinglish. If Urdu script, reply in Urdu script. If English, reply in English.
Student request: ${studentVisionPrompt}`;

        if (window.BrowserAPIEngine && window.BrowserAPIEngine.chat) {
          const result = await window.BrowserAPIEngine.chat(prompt, '', base64Image);
          analysis = result.content || 'I can see the image!';
        } else {
          analysis = detectedLang === 'ur-PK'
            ? "مجھے دیکھنے میں مسئلہ ہو رہا ہے۔"
            : "I'm having trouble with vision.";
        }

      } catch (error) {
        console.error("Vision Error:", error);
        analysis = detectedLang === 'ur-PK'
          ? "مجھے وہ صاف نہیں دیکھ رہا۔ براہ کرم دوبارہ کوشش کریں۔"
          : "I'm having trouble seeing that clearly. Could you try showing it again?";
      }

      addToTranscript('assistant', analysis);
      speakText(analysis);

    } catch (error) {
      console.error("Vision Error:", error);
      addToTranscript('system', detectedLang === 'ur-PK' ? 'تصویر کا تجزیہ کرنے میں خرابی' : 'Error analyzing image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // HOMEWORK UPLOAD
  const handleHomeworkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    e.target.value = ''; // Allow re-uploading the same file

    // ASK USER FOR INSTRUCTIONS IMMEDIATELY (To avoid browser blocking)
    const userInstruction = window.prompt("What should I do with this image?", "Solve this problem");
    if (userInstruction === null) return; // User cancelled
    const finalPrompt = userInstruction ? userInstruction : "Help me with this image";

    setIsAnalyzing(true);
    addToTranscript('system', '🧠 Analyzing image with AI...');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];
        // Prompt is already captured above


        let analysis = '';

        // Try to use window.visionAgent if available
        if (window.visionAgent && window.visionAgent.analyzeImage) {
          try {
            const uploadLanguageStyle = window.BrowserAPIEngine?.detectLanguageStyle?.(finalPrompt) || 'English';
            const prompt = `You are ${defaultTutor.name}. 
            USER INSTRUCTION: "${finalPrompt}"
            
            Analyze the image with absolute accuracy. 
            Explain EVERY detail related to the user's instruction.
            If it's a math problem, solve it step-by-step with perfect logic.
            If it's text, read it flawlessly and explain its meaning.
            Do not miss any small detail. Respond with world-class depth and detail. 
            Never mention Google Cloud Vision, Cloud Vision, OCR, labels, detections, metadata, backend analysis, or any API/tool name.
            Answer only in this language/style: ${uploadLanguageStyle}.`;

            let visionResult = await window.visionAgent.analyzeImage(base64Image, prompt);

            // SMART INTERPRETATION LOGIC (Copied from captureAndAnalyze)
            if (visionResult.includes('Image contents:') || visionResult.includes('I can see:')) {
              console.log('🤖 Raw Vision Tags detected in Upload. Asking Text Agent to interpret...');

              const interpretationPrompt = `[System: The vision system detected these raw objects/tags in the uploaded file: "${visionResult}". 
              
              USER INSTRUCTION: "${finalPrompt}"
              
              YOUR TASK: Follow the USER INSTRUCTION based on the detected tags/text.
              
              CRITICAL INSTRUCTION:
              - Do NOT say "Based on the detected tags" or "it appears that".
              - Speak naturally as if you are looking at the file directly.
              - If they asked to solve a problem, just SOLVE IT directly.
              - If it's an image with no text, describe what you see naturally.
              
              User's Context: "Homework/Image Upload"
              ]`;

              analysis = await window.aiAgent.generateText(interpretationPrompt);
            } else {
              analysis = visionResult;
            }

          } catch (error) {
            console.error("Vision Agent Error:", error);
            analysis = "I see your image! It looks like a math problem. Let me help you solve it step by step.";
          }
        } else {
          analysis = "I see your image! It looks like a math problem. Let me help you solve it step by step.";
        }

        addToTranscript('assistant', analysis);
        speakText(analysis);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload Error:", error);
      addToTranscript('system', 'Error processing upload.');
      setIsAnalyzing(false);
    }
  };

  // RENDER
  return (
    <div className='fixed inset-0 bg-gray-900 overflow-hidden flex flex-col'>
      {/* TOPIC SELECTOR MODAL (Global Check) */}
      {showTopicSelector && window.SimpleTopicSelector && (
        <window.SimpleTopicSelector
          tutor={defaultTutor}
          onTopicSelected={handleTopicSelected}
          onClose={() => setShowTopicSelector(false)}
          initialSelection={topicContext ? {
            board: topicContext.board?.name || topicContext.board || '',
            class: topicContext.class || '',
            unit: topicContext.unit?.name || topicContext.unit || '',
            topic: topicContext.topic?.name || topicContext.topic || ''
          } : {}}
        />
      )}

      {/* NEW POLISHED HEADER */}
      <div className='flex items-center justify-between px-2 sm:px-6 py-2 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 shadow-xl shrink-0 z-50 sticky top-0 flex-wrap gap-2'>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleBackClick}
            className='p-2 sm:px-4 sm:py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl flex items-center gap-2 transition-all border border-gray-700 font-bold text-xs sm:text-base shadow-lg'
          >
            <span className="text-lg">←</span>
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex flex-col ml-1 sm:ml-4 overflow-hidden max-w-[150px] sm:max-w-none">
            <span className="text-white font-black truncate text-sm sm:text-xl leading-tight uppercase tracking-tight">{defaultTutor.name}</span>
            <span className="text-blue-400 text-[9px] sm:text-xs font-black uppercase tracking-[0.2em]">{defaultTutor.subject} Master</span>
          </div>
        </div>

        {/* TOPIC DISPLAY - Center/Right mobile */}
        {topicContext ? (
          <div className='flex items-center gap-2 bg-gray-800/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-700 max-w-[120px] sm:max-w-xs overflow-hidden flex-shrink-0'>
            <span className='text-base sm:text-lg flex-shrink-0'>📚</span>
            <div className='text-[10px] sm:text-sm truncate'>
              <span className='font-bold text-white'>{topicContext.topic?.name || topicContext.topic}</span>
            </div>
            <button
              onClick={() => setShowTopicSelector(true)}
              className='ml-auto text-[8px] sm:text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded transition-all shrink-0'
            >
              Change
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowTopicSelector(true)}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-full font-bold transition-all shadow-lg animate-pulse text-xs sm:text-base'
          >
            <span>📚</span>
            <span className="hidden sm:inline">Select Topic</span>
          </button>
        )}

        <button
          onClick={() => setShowMobileHistory(true)}
          className='p-2 sm:px-4 sm:py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl flex items-center gap-2 lg:hidden border border-gray-700 font-bold transition-all shadow-lg'
        >
          <span>📜</span>
        </button>

        {/* V5200: MINDMAP BUTTON 🧠 */}
        <button
          onClick={() => setShowMindMapSelector(true)} // ✅ V5201: Open Selector First
          disabled={isMindMapLoading}
          className={`
          flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-bold transition-all shadow-lg border border-gray-700
          ${isMindMapLoading ? 'bg-gray-800 text-gray-400 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'}
        `}
        >
          <span className={isMindMapLoading ? 'animate-spin' : ''}>{isMindMapLoading ? '⏳' : '🧠'}</span>
          <span className="hidden sm:inline">MindMap</span>
        </button>

        <div className='flex items-center gap-2 bg-gray-800 p-1 rounded-lg border border-gray-700'>
          <span className="text-[9px] text-gray-400 px-1 uppercase font-bold hidden sm:inline">Speed</span>
          {[0.8, 1.0, 1.25, 1.5, 2.0].map(rate => (
            <button
              key={rate}
              onClick={() => {
                setPlaybackRate(rate);
                window.currentElevenLabsRate = rate;
                if (window.setElevenLabsSpeed) window.setElevenLabsSpeed(rate);

                // ✅ V67: INSTANT NATURAL SPEED (Auto-Restart + Fixed Stale State)
                if (isSpeaking && lastSpokenText) {
                  stopSpeech();
                  setTimeout(() => {
                    if (window.speakWithElevenLabs && window.CONFIG?.voice?.elevenlabs?.enabled) {
                      window.speakWithElevenLabs(lastSpokenText, defaultTutor.name, () => setIsSpeaking(true), () => setIsSpeaking(false), getVoiceForTutor(), rate);
                    } else {
                      speakText(lastSpokenText, rate);
                    }
                  }, 400);
                }
              }}
              className={`px-1 sm:px-2 py-1 text-[9px] sm:text-[10px] rounded font-bold transition-all ${playbackRate === rate ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >{rate === 0.8 ? 'Slow' : rate + 'x'}</button>
          ))}
        </div>
      </div>

      {/* MINDMAP OVERLAY - V5200 */}
      {
        showMindMap && (
          <MindMap
            data={mindMapData}
            onClose={() => setShowMindMap(false)}
            onNodeClick={(label) => {
              // User requested NO chat response on click.
              // We could add logic here later if needed (e.g. speak label only)
              console.log("Clicked node:", label);
            }}
          />
        )
      }

      {/* V5201: MINDMAP TOPIC SELECTOR MODAL */}
      {showMindMapSelector && window.SimpleTopicSelector && (
        <window.SimpleTopicSelector
          tutor={defaultTutor}
          onTopicSelected={(t) => {
            setShowMindMapSelector(false);
            console.log("🧠 MindMap Topic Selected:", t);
            // Construct strings for the generator
            const topicName = t.topic?.name || t.topic || "";
            const subjectName = defaultTutor.subject || "";
            // Trigger MindMap Generation
            handleMindMapOpen(topicName, subjectName);
          }}
          onClose={() => setShowMindMapSelector(false)}
          initialSelection={topicContext ? {
            board: topicContext.board?.name || topicContext.board || '',
            class: topicContext.class || '',
            unit: topicContext.unit?.name || topicContext.unit || '',
            topic: topicContext.topic?.name || topicContext.topic || ''
          } : {}}
        />
      )}

      {/* BADGE REMOVED AS PER USER REQUEST */}


      {/* MAIN CONTENT - RESPONSIVE LAYOUT */}
      <div className='flex-1 flex flex-col lg:flex-row overflow-hidden relative bg-black' style={{ minHeight: 0 }}>

        {/* COLUMN 1: V5215 — WHATSAPP-STYLE VIDEO CALL LAYOUT */}
        {/* YouTube Reel fills the frame, Avatar floats as PiP overlay */}
        <div className='w-full lg:w-[30%] h-64 sm:h-80 lg:h-auto relative border-b lg:border-b-0 lg:border-r border-gray-800 shrink-0 overflow-hidden'>

          {/* MAIN FRAME: YouTube Reel OR Avatar (fills entire column) */}
          <div className='relative w-full h-full'>

            {/* YOUTUBE REEL — FILLS THE ENTIRE FRAME */}
            {(activeTopicVideoId && topicContext && activeTopicVideoId.length === 11) && (
              <div className='absolute inset-0 bg-gradient-to-b from-gray-900 to-black'>
                <iframe
                  ref={youtubeRef}
                  src={`https://www.youtube.com/embed/${activeTopicVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${activeTopicVideoId}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`}
                  className="w-full h-full border-0 pointer-events-none"
                  style={{ objectFit: 'cover' }}
                  allow="autoplay; encrypted-media"
                />
                <div className="absolute inset-0 bg-transparent z-10"></div>
                {(!isSpeaking || isPaused) && (
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] text-white/80 z-20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                    Paused for Study
                  </div>
                )}
              </div>
            )}

            {/* AI TUTOR AVATAR — WhatsApp PiP when YouTube is active, FULL when not */}
            <div className={`${
              (activeTopicVideoId && topicContext && activeTopicVideoId.length === 11)
                ? 'absolute top-3 right-3 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-3 border-white/40 shadow-2xl z-30 overflow-hidden bg-gray-900'
                : 'relative w-full h-full'
            } transition-all duration-500`}>
              {showIntroVideo && defaultTutor.introVideo && !videoError ? (
                <video
                  ref={introVideoRef}
                  src={defaultTutor.introVideo}
                  autoPlay
                  playsInline
                  onEnded={handleIntroVideoEnd}
                  onError={(e) => {
                    console.error("📹 Intro Video Failed:", e);
                    setVideoError(true);
                    handleIntroVideoEnd();
                  }}
                  className='w-full h-full object-cover'
                />
              ) : typeof AvatarEngine !== 'undefined' ? (
                <AvatarEngine
                  tutor={defaultTutor}
                  isSpeaking={isSpeaking && !isPaused}
                  isListening={isListening}
                />
              ) : defaultTutor.image ? (
                <img src={defaultTutor.image} alt={defaultTutor.name} className={`w-full h-full object-cover transition-all duration-500 ${isSpeaking && !isPaused ? 'scale-105' : 'scale-100'}`} />
              ) : (
                <div className={`flex items-center justify-center h-full text-4xl sm:text-8xl ${isSpeaking && !isPaused ? 'animate-bounce' : ''}`}>{defaultTutor.emoji}</div>
              )}

              {/* PiP speaking indicator ring */}
              {(activeTopicVideoId && topicContext && activeTopicVideoId.length === 11) && isSpeaking && !isPaused && (
                <div className="absolute inset-0 rounded-2xl border-3 border-green-400 animate-pulse z-40 pointer-events-none"></div>
              )}
            </div>

            {/* Loading Spinner for Intro Video */}
            {showIntroVideo && !videoError && !(activeTopicVideoId && topicContext) && (
              <div className="absolute inset-0 flex items-center justify-center -z-10 bg-gray-900">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>


        {/* COLUMN 2: CONVERSATION (MIDDLE - PRIMARY ON MOBILE) */}
        <div className='flex-1 flex flex-col bg-gray-900/50 relative lg:border-r border-gray-800' style={{ minHeight: 0 }}>
          <div className='p-2 sm:p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur shrink-0 flex items-center justify-between'>
            <h3 className='text-white font-bold flex items-center gap-2 text-xs sm:text-base'>
              <span>💬</span> <span className="hidden sm:inline">Conversation</span>
            </h3>
          </div>

          <div className='flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4' ref={transcriptRef}>
            {/* TRANSCRIPT MESSAGES */}
            {transcript.map((item, index) => (
              <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${item.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : item.role === 'system' ? 'bg-gray-800/50 text-gray-400 text-xs text-center border border-gray-700/50 italic' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none shadow-lg'}`}>
                  {/* ✅ TEXT CONTENT (Swaps on Translation) */}
                  <p className={`text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${item.translatedContent ? 'text-green-300 font-medium' : ''}`}>
                    {item.translatedContent || item.message}
                  </p>

                  {/* ✅ V14: TOPIC RELATED IMAGE */}
                  {item.imageUrl && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-gray-700 shadow-inner group relative">
                      <img
                        src={item.imageUrl}
                        alt="Topic Resource"
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => setFullscreenImage(item.imageUrl)}
                        onLoad={() => {
                          if (transcriptRef.current) {
                            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
                          }
                        }}
                      />
                      {/* ✅ V5139: EXPLORE BUTTON */}
                      <div className="p-2 border-t border-gray-700 bg-gray-900/50 flex justify-end">
                        <button
                          onClick={() => setFullscreenImage(item.imageUrl)}
                          className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-400 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          🔍 EXPLORE
                        </button>
                      </div>
                    </div>
                  )}

                  {item.role !== 'system' && (
                    <div className="flex items-center justify-between mt-1 gap-2">
                      <span className='text-[10px] opacity-40 text-right'>{item.time}</span>
                      <div className="flex gap-2">
                        {/* ✅ DYNAMIC TRANSLATE BUTTON */}
                        <button
                          onClick={async () => {
                            // 1. STOP ANY CURRENT SPEECH IMMEDIATELY
                            if (window.stopElevenLabs) window.stopElevenLabs();
                            stopSpeech();

                            if (item.translatedContent) {
                              // TOGGLE OFF: Go back to Original
                              setSessions(prev => prev.map(s => {
                                if (s.id === currentSessionId) {
                                  const newTrans = [...s.transcript];
                                  delete newTrans[index].translatedContent;
                                  return { ...s, transcript: newTrans };
                                }
                                return s;
                              }));
                            } else {                                    // 2. DETECT LANGUAGE & TRANSLATE
                              const isUrdu = item.message.match(/[\u0600-\u06FF]/);
                              const target = isUrdu ? 'en' : 'ur'; // Swap logic

                              try {
                                // V5134: USE CONFIG.JS TRANSLATION
                                let translatedText = '';
                                if (window.googleTranslate) {
                                  translatedText = await window.googleTranslate(item.message, target);
                                } else if (window.BrowserAPIEngine && window.BrowserAPIEngine.translate) {
                                  translatedText = await window.BrowserAPIEngine.translate(item.message, target);
                                } else {
                                  console.error('Translation not available');
                                  return;
                                }

                                if (translatedText && translatedText !== item.message) {
                                  setSessions(prev => prev.map(s => {
                                    if (s.id === currentSessionId) {
                                      const newTrans = [...s.transcript];
                                      newTrans[index].translatedContent = translatedText;
                                      return { ...s, transcript: newTrans };
                                    }
                                    return s;
                                  }));

                                  // ✅ 3. AUTO-SPEAK NEW LANGUAGE WITH FORCED HINT
                                  const langToSpeak = (target === 'ur') ? 'ur' : 'en';
                                  setTimeout(() => {
                                    speakText(translatedText, null, langToSpeak);
                                  }, 500);
                                } else {
                                  console.warn("⚠️ Translation failed or returned same text.");
                                }
                              } catch (e) {
                                console.error("Translation error", e);
                                addToTranscript('system', '⚠️ Translation failed');
                              }
                            }
                          }}
                          className="text-[10px] bg-green-600/20 hover:bg-green-600/50 text-green-300 px-2 py-0.5 rounded transition-all flex items-center gap-1"
                        >
                          🌐 {item.translatedContent ? 'Show Original' : (item.message.match(/[\u0600-\u06FF]/) ? 'Translate to English' : 'Translate to Urdu')}
                        </button>

                        {/* ✅ SPEAK BUTTON */}
                        {item.role === 'assistant' && (
                          <button
                            onClick={() => {
                              if (window.stopElevenLabs) window.stopElevenLabs();
                              // Speak Translated if available, otherwise original
                              const textToSpeak = item.translatedContent || item.message;
                              // Detect language of what we are about to speak
                              const isUrduText = /[\u0600-\u06FF]/.test(textToSpeak);
                              const forceLang = isUrduText ? 'ur' : 'en';

                              speakText(textToSpeak, null, forceLang);
                            }}
                            className="text-[10px] bg-blue-600/20 hover:bg-blue-600/50 text-blue-300 px-2 py-0.5 rounded transition-all flex items-center gap-1"
                          >
                            <span>🔊</span> Speak
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* TYPING EFFECT MESSAGE */}
            {typingMessage && (
              <div className='flex justify-start'>
                <div className='max-w-[85%] p-3 rounded-2xl shadow-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none animate-pulse'>
                  <p className='text-xs sm:text-sm whitespace-pre-wrap leading-relaxed'>
                    {typingMessage}<span className='inline-block w-2 h-4 bg-blue-500 ml-1 animate-blink'></span>
                  </p>
                </div>
              </div>
            )}

            {/* ✅ V11: SAFARI RECOVERY BUTTON */}
            {micStalled && liveMode && (
              <div className="flex justify-center my-6 sticky bottom-4 z-50">
                <button
                  onClick={() => {
                    setMicStalled(false);
                    startListening();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-black shadow-2xl border-4 border-white/20 flex items-center gap-3 transform hover:scale-105 transition-all animate-bounce"
                >
                  <span className="text-xl">🎤</span> Tap to Resume Hearing
                </button>
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className='p-2 sm:p-4 bg-gray-800 border-t border-gray-700 shrink-0 z-10'>
            <div className='flex gap-1 sm:gap-2'>
              <input
                type='text'
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder='Type...'
                disabled={isListening || isSpeaking}
                className='flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-base text-white focus:outline-none focus:border-blue-500'
              />
              <button onClick={handleSendMessage} disabled={!studentInput.trim()} className='bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all shadow-lg text-xs sm:text-base'>
                Send
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN 3: CAMERA & CONTROLS (RIGHT ON DESKTOP, HIDDEN ON MOBILE) */}
        <div className='hidden lg:flex lg:w-80 xl:w-96 bg-gray-800 flex-col shrink-0 border-l border-gray-700'>
          {/* CAMERA */}
          <div className='relative w-full aspect-video bg-black border-b border-gray-700 flex-shrink-0'>
            <video
              ref={desktopVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
            />
            {!isCameraActive && (
              <div className='absolute inset-0 flex flex-col items-center justify-center text-gray-500'>
                <span className='text-5xl mb-2'>📷</span>
                <span className='text-sm font-bold'>Camera Off</span>
              </div>
            )}
            <div className='absolute bottom-4 right-4'>
              {!isCameraActive ? (
                <button onClick={startCamera} className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2'>
                  <span>▶️</span> Start
                </button>
              ) : (
                <button onClick={stopCamera} className='bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2'>
                  <span>⏹️</span> Stop
                </button>
              )}
            </div>
          </div>

          {/* CONTROLS LIST */}
          <div className='flex-1 p-4 space-y-3 overflow-y-auto'>
            <div className='bg-gray-700/50 p-3 rounded-xl'>
              <div className="flex items-center justify-between mb-2">
                <h4 className='text-gray-400 text-xs font-bold uppercase'>Voice</h4>
                <div className="flex bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => {
                      if (window.unlockAudioContext) window.unlockAudioContext(); // ✅ V8
                      handleLanguageChange('en-US');
                    }}
                    className={`px-3 py-1 rounded-l-lg text-xs font-bold transition-all ${sttLanguage === 'en-US' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => {
                      if (window.unlockAudioContext) window.unlockAudioContext(); // ✅ V8
                      handleLanguageChange('ur-PK');
                    }}
                    className={`px-3 py-1 rounded-r-lg text-xs font-bold transition-all ${sttLanguage === 'ur-PK' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    اردو
                  </button>
                </div>
              </div>

              {/* VOICE TOGGLE - V8 Direct Gesture Trigger */}
              <button
                onClick={() => {
                  if (window.unlockAudioContext) window.unlockAudioContext(); // ✅ V8
                  if (isListening) stopListening();
                  else startListening();
                }}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${isListening ? 'bg-red-600 animate-pulse' : 'bg-green-600 hover:bg-green-700'} text-white shadow-lg transition-all`}>
                {isListening ? <span>🛑 Stop</span> : <span>🎤 Voice</span>}
              </button>
            </div>

            <div className='bg-gray-700/50 p-3 rounded-xl'>
              <h4 className='text-gray-400 text-xs font-bold uppercase mb-2'>Image</h4>
              <button onClick={() => fileInputRef.current?.click()} className='w-full py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg'>
                <span>📁</span> Upload
              </button>
            </div>

            <div className='bg-gray-700/50 p-3 rounded-xl'>
              <h4 className='text-gray-400 text-xs font-bold uppercase mb-2'>Mode</h4>
              <button onClick={toggleLiveMode} className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${liveMode ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                <span>{liveMode ? '🟢' : '⚪'}</span> Live
              </button>
            </div>

            {/* CONVERSATION HISTORY */}
            <div className='bg-gray-700/50 p-3 rounded-xl'>
              <h4 className='text-gray-400 text-xs font-bold uppercase mb-2'>Recent Chats</h4>
              <div className='space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar'>
                {sessions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setCurrentSessionId(s.id)}
                    className={`p-2 rounded-lg cursor-pointer transition-all border group relative ${currentSessionId === s.id ? 'bg-blue-600/30 border-blue-500 shadow-inner' : 'bg-gray-800 border-gray-700 hover:bg-gray-750'}`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='text-[10px] sm:text-xs font-bold text-white truncate pr-6'>{s.title}</div>
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="absolute right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Chat"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className='text-[8px] sm:text-[9px] text-gray-500'>{s.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS BAR - MOBILE ONLY (Camera & Controls) */}
      <div className='lg:hidden bg-gray-900/90 backdrop-blur-md border-t border-gray-700 p-3 sm:p-4 flex justify-center gap-2 shrink-0 flex-wrap'>
        {/* CAMERA SECTION - MOBILE */}
        <div className='w-full flex gap-2'>
          <div className='w-16 h-16 bg-black relative rounded-lg border border-gray-700 flex-shrink-0'>
            <video
              ref={mobileVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover rounded-lg ${isCameraActive ? 'block' : 'hidden'}`}
            />
            {!isCameraActive && (
              <div className='absolute inset-0 flex items-center justify-center text-gray-500 rounded-lg'>
                <span className='text-2xl'>📷</span>
              </div>
            )}
          </div>

          <div className='flex-1 flex flex-col gap-2'>
            {!isCameraActive ? (
              <button onClick={startCamera} className='bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs font-bold shadow-lg flex items-center justify-center gap-1 transition-all'>
                <span>▶️</span> Start Camera
              </button>
            ) : (
              <button onClick={stopCamera} className='bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs font-bold shadow-lg flex items-center justify-center gap-1 transition-all'>
                <span>⏹️</span> Stop Camera
              </button>
            )}

            <div className='flex gap-2'>
              <div className="flex bg-gray-800 rounded-lg p-1 shrink-0">
                <button
                  onClick={() => handleLanguageChange('en-US')}
                  className={`px-3 py-1 text-xs rounded transition-all transform hover:scale-105 font-bold ${sttLanguage === 'en-US' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >EN</button>
                <button
                  onClick={() => handleLanguageChange('ur-PK')}
                  className={`px-3 py-1 text-xs rounded transition-all transform hover:scale-105 font-bold ${sttLanguage === 'ur-PK' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >اردو</button>
              </div>

              <button onClick={isListening ? stopListening : startListening} className={`flex-1 py-2.5 sm:py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${isListening ? 'bg-red-600 animate-pulse' : 'bg-green-600 hover:bg-green-700'} text-white shadow-lg`}>
                {isListening ? <span>🛑</span> : <span>🎤</span>}
              </button>

              <button onClick={() => fileInputRef.current?.click()} className='flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 sm:py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-lg transition-all'>
                <span>📁</span>
              </button>

              <button onClick={toggleLiveMode} className={`flex-1 py-2.5 sm:py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${liveMode ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                <span>{liveMode ? '🟢' : '⚪'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS BAR - NOW VISIBLE ON ALL SCREENS */}
      <div className='flex bg-gray-900/90 backdrop-blur-md border-t border-gray-700 p-2 sm:p-3 justify-center gap-2 sm:gap-4 shrink-0 flex-wrap'>
        {isSpeaking && (
          <div className='flex items-center gap-2 mr-2 sm:mr-4 border-r border-gray-700 pr-2 sm:pr-4'>
            {!isPaused ? (
              <button onClick={pauseSpeech} className='w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black rounded-full shadow-lg transition-all transform hover:scale-105'>
                <span className='text-base sm:text-xl'>⏸</span>
              </button>
            ) : (
              <button onClick={resumeSpeech} className='w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all transform hover:scale-105 animate-pulse'>
                <span className='text-base sm:text-xl'>▶</span>
              </button>
            )}
            <button onClick={stopSpeech} className='w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all transform hover:scale-105'>
              <span className='text-base sm:text-xl'>⏹</span>
            </button>
          </div>
        )}

        {/* ✅ V38: GLOBAL RESUME BUTTON (User Request: "resume it just liked") */}
        {!isSpeaking && lastSpokenText && (
          <button
            onClick={() => {
              if (window.speakWithElevenLabs && window.CONFIG?.voice?.elevenlabs?.enabled) {
                window.speakWithElevenLabs(lastSpokenText, defaultTutor.name, () => setIsSpeaking(true), () => setIsSpeaking(false), getVoiceForTutor(), playbackRate);
              } else {
                speakText(lastSpokenText);
              }
            }}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-in fade-in zoom-in duration-300'
          >
            <span>🔄</span> Replay
          </button>
        )}

        <button
          onClick={() => {
            if (window.unlockAudioContext) window.unlockAudioContext(); // ✅ V8
            toggleLiveMode();
          }}
          className={`px-4 sm:px-6 py-2 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 text-[10px] sm:text-base ${liveMode ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          <span>{liveMode ? '🟢' : '⚪'}</span>
          <span>Live Mode</span>
        </button>
      </div>

      <input ref={fileInputRef} type='file' accept='image/*' onChange={handleHomeworkUpload} className='hidden' />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* MOBILE HISTORY OVERLAY */}
      {
        showMobileHistory && (
          <div className="fixed inset-0 z-[1000] lg:hidden">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileHistory(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/90 sticky top-0 z-10">
                <h3 className="text-white font-black uppercase tracking-wider">Chat History</h3>
                <button onClick={() => setShowMobileHistory(false)} className="text-gray-400 hover:text-white p-2">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {sessions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => { setCurrentSessionId(s.id); setShowMobileHistory(false); }}
                    className={`p-4 rounded-2xl border transition-all relative group ${currentSessionId === s.id ? 'bg-blue-600/20 border-blue-500' : 'bg-gray-800/50 border-gray-700'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs font-bold text-white truncate pr-6">{s.title}</div>
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="text-gray-500 hover:text-red-500 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-[10px] text-gray-500">{s.timestamp}</div>
                  </div>
                ))}
                {sessions.length === 0 && <div className="text-center text-gray-600 italic py-10">No history found.</div>}
              </div>
              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={() => { handleNewConversation(); setShowMobileHistory(false); }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest"
                >
                  + New Conversation
                </button>
              </div>
            </div>
          </div>
        )
      }
      {/* ✅ V5139: FULLSCREEN IMAGE VIEWER */}
      {
        fullscreenImage && (
          <div
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setFullscreenImage(null)}
          >
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
              <img
                src={fullscreenImage}
                alt="Fullscreen view"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }}
                className="absolute top-0 right-0 sm:-top-10 sm:-right-10 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
}; // ✅ V51: Restored missing brace


// ============================================
// MAKE COMPONENTS GLOBALLY AVAILABLE
// ============================================
// window.SimpleTopicSelector = SimpleTopicSelector; // Removed: Global component handled externally
window.VideoCall = VideoCall;

console.log('✅ VideoCall.js - FULLY LOADED');
