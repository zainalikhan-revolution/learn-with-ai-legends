// ===========================================
// MINDMAP COMPONENT V5200 (GOOGLE STYLE)
// Interactive, Zoomable, Collapsible Node Graph
// ===========================================

function MindMap({ data, onClose, onNodeClick }) {
    const [transform, setTransform] = React.useState({ x: 0, y: 0, scale: 1 });
    const [dragging, setDragging] = React.useState(false);
    const [lastPos, setLastPos] = React.useState({ x: 0, y: 0 });
    const containerRef = React.useRef(null);
    const [expandedNodes, setExpandedNodes] = React.useState({});

    // Initialize all nodes as expanded by default
    React.useEffect(() => {
        if (data) {
            const allIds = {};
            const traverse = (node) => {
                if (!node) return;
                allIds[node.id] = true;
                if (node.children) node.children.forEach(traverse);
            };
            traverse(data);
            setExpandedNodes(allIds);

            // Auto-center (simple approximation)
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setTransform({ x: clientWidth / 2 - 100, y: clientHeight / 2 - 50, scale: 1 });
            }
        }
    }, [data]);

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

    const toggleNode = (e, nodeId) => {
        e.stopPropagation();
        setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
    };

    // Recursive Node Renderer
    const renderNode = (node, depth = 0) => {
        if (!node) return null;
        const isExpanded = expandedNodes[node.id];
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id} className="flex items-center" style={{ marginLeft: depth * 50 }}>
                {/* NODE ITSELF */}
                <div
                    className={`relative flex items-center transition-all duration-300 ${depth === 0 ? 'mb-8' : 'mb-4'}`}
                    style={{ opacity: 1, transform: `scale(${1 - depth * 0.05})` }}
                >
                    {/* STEM LINE (if not root) */}
                    {depth > 0 && (
                        <div className="absolute -left-12 top-1/2 w-12 h-[2px] bg-blue-500/50" />
                    )}

                    {/* CONTENT BOX */}
                    <div
                        onClick={() => onNodeClick && onNodeClick(node.label)}
                        className={`
                            px-4 py-3 rounded-xl shadow-2xl border cursor-pointer select-none transition-all hover:scale-105 active:scale-95
                            ${depth === 0
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-black border-blue-400'
                                : 'bg-[#1e293b] text-gray-200 border-gray-700 hover:border-blue-500 text-sm font-bold'}
                        `}
                        style={{ minWidth: 150, maxWidth: 300 }}
                    >
                        {node.label}
                    </div>

                    {/* EXPANDER BUTTON */}
                    {hasChildren && (
                        <button
                            onClick={(e) => toggleNode(e, node.id)}
                            className={`
                                ml-[-12px] z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg transition-all border
                                ${isExpanded ? 'bg-red-500/20 text-red-400 border-red-500 rotate-180' : 'bg-green-500/20 text-green-400 border-green-500'}
                                bg-gray-900 translate-x-[50%]
                            `}
                        >
                            {isExpanded ? '<' : '>'}
                        </button>
                    )}
                </div>

                {/* CHILDREN CONTAINER */}
                {hasChildren && isExpanded && (
                    <div className="flex flex-col justify-center border-l-2 border-blue-500/20 ml-8 pl-4 py-2 space-y-2 relative animate-fade-in-up">
                        {node.children.map(child => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[2000000] bg-[#0f1420] flex flex-col font-sans">
            {/* HEADER */}
            <div className="h-16 border-b border-gray-800 bg-[#0f1420]/90 backdrop-blur flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <span className="text-white font-black text-xl tracking-tight">MindMap AI</span>
                    <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 text-[10px] font-bold rounded border border-blue-800 uppercase tracking-widest ml-2">Beta V5200</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-gray-800 p-1 rounded-lg">
                        <button onClick={() => setTransform(t => ({ ...t, scale: t.scale - 0.2 }))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded hover:bg-gray-700 font-bold">-</button>
                        <span className="text-xs font-mono text-gray-500 w-12 text-center">{Math.round(transform.scale * 100)}%</span>
                        <button onClick={() => setTransform(t => ({ ...t, scale: t.scale + 0.2 }))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded hover:bg-gray-700 font-bold">+</button>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all flex items-center justify-center font-bold text-xl"
                    >
                        ×
                    </button>
                </div>
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
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
                    }}
                >
                    <div className="min-w-[1000px] min-h-[1000px] flex items-center justify-center">
                        {data ? renderNode(data) : <div className="text-white animate-pulse">Generating Neural Map...</div>}
                    </div>
                </div>

                {/* CONTROLS OVERLAY */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
                    <button onClick={() => setTransform({ x: containerRef.current.clientWidth / 2 - 100, y: containerRef.current.clientHeight / 2 - 50, scale: 1 })} className="p-3 bg-gray-800 text-white rounded-full shadow-lg border border-gray-700 hover:bg-blue-600 transition-all">
                        🎯
                    </button>
                </div>
            </div>

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

// Make it available globally
window.MindMap = MindMap;
