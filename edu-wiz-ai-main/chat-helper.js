// ============================================
// CHAT HELPER V51 - 1-2 IMAGES ONLY
// ============================================

window.chatWithTutor = async function (tutor, userMessage, history, settings) {
    const { visualLayout, guidedLearning } = settings;

    const isUrduInput = userMessage.match(/[\u0600-\u06FF]/);
    const langMode = isUrduInput ? "URDU (اردو)" : "ENGLISH";

    const sysInstruction = `You are Professor ${tutor.name}, expert in ${tutor.subject}.
    
MANDATE:
1. Use academic emojis (🧪, ⚛️, 📖, 🔬).
2. Respond in ${langMode}.
3. Provide 3-5 comprehensive paragraphs.
4. Be encouraging and pedagogical.
5. IF requested for a "Deep Dive", provide extremely detailed, advanced technical/academic content.
6. IF requested for "Related Topics", suggest 3 complex areas of study with brief summaries.
7. IF requested for "Practice", provide 2-3 conceptual questions followed by a practical exercise.
8. NEVER include technical JSON tags like @@@ or ::: in your speech text.`;

    try {
        // USE BROWSER API ENGINE (No server needed)
        if (window.BrowserAPIEngine) {
            console.log('🌐 Using Browser API for chat');
            const result = await window.BrowserAPIEngine.chat(userMessage, sysInstruction);

            if (result.success) {
                let final = result.content;

                // Add Metadata (Images/Videos/Explore) - Restoration Fix
                if (visualLayout) {
                    try {
                        const imgs = await window.searchGoogleImages(userMessage);
                        if (imgs && imgs.length > 0) {
                            final += `\n\n@@@IMAGES@@@${JSON.stringify(imgs.slice(0, 2))}@@@`;
                        }
                    } catch (e) { }

                    try {
                        const vids = await window.searchYouTubeVideos(userMessage);
                        if (vids && vids.length > 0) {
                            final += `\n\n@@@VIDEO_SUGGESTIONS@@@${JSON.stringify(vids.slice(0, 2))}@@@`;
                        }
                    } catch (e) { }
                }

                final += `\n\n@@@EXPLORE@@@["Deep Dive", "Related Topics", "Practice"]@@@`;
                return final;
            } else {
                console.error('❌ Browser API Error:', result.error);
                return '📡 Please try again.';
            }
        }

        // FALLBACK: Try server (though it's broken)
        const response = await fetch('api-v50.php?action=chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: userMessage,
                system_instruction: sysInstruction
            })
        });

        const rawResponse = await response.text();
        let data;
        try {
            const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
            data = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
        } catch (e) {
            console.error('❌ Chat Parse Fail. Raw:', rawResponse);
            return '📡 Server busy. Please retry.';
        }

        let final = data.content || '📡 Please retry.';

        // Add ONLY 1-2 large diagrams
        if (visualLayout) {
            try {
                const imgs = await window.searchGoogleImages(userMessage);
                if (imgs && imgs.length > 0) {
                    final += `\n\n@@@IMAGES@@@${JSON.stringify(imgs.slice(0, 2))}@@@`;
                }
            } catch (e) { }

            try {
                const vids = await window.searchYouTubeVideos(userMessage);
                if (vids && vids.length > 0) {
                    final += `\n\n@@@VIDEO_SUGGESTIONS@@@${JSON.stringify(vids.slice(0, 2))}@@@`;
                }
            } catch (e) { }
        }

        final += `\n\n@@@EXPLORE@@@["Deep Dive", "Related Topics", "Practice"]@@@`;

        return final;
    } catch (e) {
        console.error('Chat error:', e);
        throw e;
    }
};

console.log('✅ Chat Helper V51 (GEMINI-STYLE) Ready');
