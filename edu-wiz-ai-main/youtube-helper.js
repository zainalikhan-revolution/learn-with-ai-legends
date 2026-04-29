// ============================================
// YOUTUBE HELPER V51 - URDU VIDEOS
// Prioritizes Urdu/Hindi content
// ============================================

window.searchYouTubeVideos = async function (query) {
    try {
        // V5210: Optimized for animated educational shorts/reels
        const urduQuery = `${query} animated educational short reel #shorts urdu hindi`;

        const response = await fetch('api-v50.php?action=youtube_search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: urduQuery })
        });

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items.map(item => ({
                id: (typeof item.id === 'string') ? item.id : item.id.videoId,
                title: item.snippet.title
            }));
        }

        return [];
    } catch (error) {
        console.error('YouTube search error:', error);
        return [];
    }
};

window.fetchTopicVideo = async function (topic, subject) {
    try {
        // V5210: Targeted query for animated educational shorts
        const query = `${topic} ${subject} animated explanation short reel #shorts urdu hindi`;
        const response = await fetch('api-v50.php?action=youtube_search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            // Priority: Find first valid videoId
            return data.items[0].id.videoId || data.items[0].id;
        }
        return null;
    } catch (e) {
        console.error("fetchTopicVideo error:", e);
        return null;
    }
};

console.log('✅ YouTube Helper V51 (URDU + TOPIC) Ready');
