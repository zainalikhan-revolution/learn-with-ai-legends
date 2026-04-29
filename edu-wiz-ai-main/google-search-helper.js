// ============================================
// GOOGLE SEARCH HELPER V5000 (SERVER)
// Calls api-v50.php for image search
// ============================================

window.searchGoogleImages = async function (query) {
    try {
        const response = await fetch('api-v50.php?action=image_search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items.map(item => ({
                link: item.link,
                title: item.title || 'Diagram'
            }));
        }

        return [];
    } catch (error) {
        console.error('Image search error:', error);
        return [];
    }
};

console.log('✅ Google Search Helper V5000 (SERVER) Ready');
