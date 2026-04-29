function TutorCard({ tutor, onSelect }) {
  try {
    return (
      <div className="tutor-card group h-full flex flex-col" data-name="tutor-card" data-file="components/TutorCard.js">
        <div className={`w-full h-32 sm:h-40 lg:h-48 bg-gradient-to-br ${tutor.color} rounded-lg mb-4 overflow-hidden transform group-hover:scale-105 transition-transform relative flex-shrink-0`}>
          {tutor.image ? (
            <img src={tutor.image} alt={tutor.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl sm:text-6xl lg:text-8xl">
              {tutor.emoji}
            </div>
          )}
        </div>
        
        <div className="mb-2 flex-shrink-0">
          <span className="text-sm font-semibold text-[var(--primary-color)]">{tutor.emoji} {tutor.subject}</span>
        </div>
        
        <h3 className="text-lg font-bold mb-1">{tutor.name}</h3>
        <p className="text-sm text-gray-400 mb-3">{tutor.urduName}</p>
        <p className="text-sm text-gray-500 mb-4 flex-grow">{tutor.description}</p>
        
        <div className="flex gap-2 flex-shrink-0">
          <button 
            onClick={() => onSelect(tutor, 'chat')}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            💬 Chat
          </button>
          <button 
            onClick={() => onSelect(tutor, 'video')}
            className="flex-1 px-4 py-2 bg-[var(--primary-color)] hover:opacity-90 rounded-lg text-sm font-semibold transition-opacity flex items-center justify-center gap-2"
          >
            🎥 Video
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('TutorCard component error:', error);
    return null;
  }
}
