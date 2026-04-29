<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Study Card - AI Video Tutor Platform</title>

  <!-- Favicon -->
  <link rel="icon" type="image/png"
    href="https://res.cloudinary.com/dtcuwjd2q/image/upload/v1736245911/estudy-card-logo_favicon.png">

  <!-- React & React DOM -->
  <script src="https://resource.trickle.so/vendor_lib/unpkg/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://resource.trickle.so/vendor_lib/unpkg/react-dom@18/umd/react-dom.production.min.js"
    crossorigin></script>
  <script src="https://resource.trickle.so/vendor_lib/unpkg/@babel/standalone/babel.min.js"></script>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts (Urdu + English support) -->
  <link
    href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
    rel="stylesheet">

  <style>
    body {
      margin: 0;
      padding: 0;
      background: #1a1a1a;
      color: white;
      font-family: 'Noto Sans', 'Noto Nastaliq Urdu', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .urdu {
      font-family: 'Noto Nastaliq Urdu', serif;
    }

    #loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.5s ease-out;
    }

    @keyframes pulse {

      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.7;
      }
    }
  </style>
</head>

<body>

  <!-- Loading Screen -->
  <div id="loading">
    <div style="text-align: center;">
      <div style="font-size: 48px; margin-bottom: 16px; animation: pulse 2s ease-in-out infinite;">Loading</div>
      <div style="color: white; font-size: 20px; font-weight: bold;">Loading E-Study Card...</div>
      <div style="color: #888; font-size: 14px; margin-top: 8px;">Initializing AI tutors</div>
    </div>
  </div>

  <!-- Main App Root -->
  <div id="root"></div>

  <!-- ============================================ -->
  <!-- SCRIPTS - CORRECT LOAD ORDER (CRITICAL!)    -->
  <!-- ============================================ -->

  <!-- 1. Environment & Config (must be first) -->
  <script src="./public/env.js"></script>
  <script src="./config.js"></script>
  <script src="./elevenlabs-config.js"></script>
  <script src="./chat-helper.js"></script>

  <!-- 2. AI Agents -->
  <script type="text/babel" src="./ai-agent.js?v=3"></script>

  <!-- 3. Components - IN THIS EXACT ORDER -->
  <script type="text/babel" src="components/Hero.js"></script>
  <script type="text/babel" src="components/ChatInterface.js"></script>

  <!-- TOPIC SELECTOR MUST LOAD BEFORE VideoCall & app.js -->
  <script type="text/babel" src="components/TopicSelector.js"></script>

  <!-- VideoCall (uses TopicSelector) -->
  <script type="text/babel" src="components/VideoCall.js"></script>

  <!-- Main App - MUST BE ABSOLUTELY LAST -->
  <script type="text/babel" src="app.js"></script>

  <!-- Hide Loading Screen -->
  <script>
    function hideLoadingScreen() {
      const loading = document.getElementById('loading');
      if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => { loading.style.display = 'none'; }, 500);
      }
    }
    window.addEventListener('load', () => setTimeout(hideLoadingScreen, 500));
    setTimeout(hideLoadingScreen, 4000); // fallback
    console.log('E-Study Card - Ready!');
  </script>

</body>

</html>