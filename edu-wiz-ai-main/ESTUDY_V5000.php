<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Study AI - V5000</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    html { overflow-y: auto !important; height: auto !important; }
    body { background-color: #020617 !important; margin: 0 !important; font-family: 'Inter', sans-serif !important; }
    .chat-active { overflow: hidden !important; height: 100vh !important; }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <?php $v = time(); ?>
  <script src="config.js?v=<?= $v ?>"></script>
  <script src="youtube-helper-v50.js?v=<?= $v ?>"></script>
  <script src="google-search-helper-v50.js?v=<?= $v ?>"></script>
  <script src="chat-helper-v50.js?v=<?= $v ?>"></script>
  <script src="ai-agent-v50.js?v=<?= $v ?>"></script>
  
  <script type="text/babel" src="components/Hero-v41.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="components/TutorCard-v41.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="components/TutorGrid-v41.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="components/TopicSelector-v41.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="components/VideoCall-v50.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="ChatInterface-v50.js?v=<?= $v ?>"></script>
  <script type="text/babel" src="app-v41.js?v=<?= $v ?>"></script>
</body>
</html>
