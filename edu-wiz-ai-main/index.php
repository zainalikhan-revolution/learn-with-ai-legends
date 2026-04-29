<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Study AI - V5100 GEMINI</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <style>
    html { overflow-y: auto !important; height: auto !important; }
    body { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important; margin: 0 !important; font-family: 'Inter', sans-serif !important; }
    .chat-active { overflow: hidden !important; height: 100vh !important; }
  </style>

  <script>
    // 🛡️ V5100 STABILIZATION: Silence specific production warnings
    const originalWarn = console.warn;
    console.warn = (...args) => {
        if (args[0] && typeof args[0] === 'string') {
            if (args[0].includes('cdn.tailwindcss.com')) return; 
            if (args[0].includes('in-browser Babel transformer')) return;
        }
        originalWarn.apply(console, args);
    };
    console.log("🛡️ Production Warning Silencer Active");
  </script>
</head>
<body>
  <div id="root"></div>
  
  <?php $v = '51_FIX_' . time(); ?>
  <script src="env_config.php?v=<?= $v ?>"></script>
  <script src="config.js?v=<?= $v ?>"></script>
  <script src="youtube-helper-v51.js?v=<?= $v ?>"></script>
  <script src="google-search-helper-v51.js?v=<?= $v ?>"></script>
  <script src="chat-helper-v51.js?v=<?= $v ?>"></script>
  <script src="browser-tts-engine.js?v=<?= $v ?>"></script>
  <script src="ai-agent-v51.js?v=<?= $v ?>"></script>  
  <script type="text/babel" src="components/Hero-v41.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="components/TutorCard-v41.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="components/TutorGrid-v41.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="components/TopicSelector-v41.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="components/VideoCall-v51.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="ChatInterface-v51.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="app-v41.js?v=<?= $v ?>"></script>
</body>
</html>