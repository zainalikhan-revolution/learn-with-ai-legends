// ============================================
// HERO.JS - ENHANCED HOMEPAGE COMPONENT
// ✅ Complete features section
// ✅ Beautiful UI matching screenshots
// ✅ Smooth animations
// ============================================

function Hero({ onScrollToTutors }) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return React.createElement(
    'div',
    { className: 'min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative flex flex-col justify-center py-12 sm:py-20 md:py-0' },

    // Animated background
    React.createElement('div', { className: 'absolute inset-0 opacity-10' },
      React.createElement('div', { className: 'hidden sm:block absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse' }),
      React.createElement('div', { className: 'hidden sm:block absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse', style: { animationDelay: '1s' } })
    ),

    // Main content
    React.createElement(
      'div',
      { className: 'relative z-10 container mx-auto px-4 py-6 sm:py-0 w-full' },

      // Badge
      React.createElement(
        'div',
        { className: `text-center mb-6 sm:mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}` },
        React.createElement(
          'div',
          { className: 'inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg' },
          '⚡ Pakistan\'s First AI Video Tutor Platform'
        )
      ),

      // Main heading
      React.createElement(
        'h1',
        { className: `text-center text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 px-2 sm:px-4 leading-tight transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}` },
        React.createElement('span', { className: 'bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent' }, 'Learn with AI Legends')
      ),

      // Subtitle
      React.createElement(
        'p',
        { className: `text-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-3 sm:mb-4 max-w-4xl mx-auto px-3 sm:px-4 leading-relaxed transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}` },
        'Get personalized tutoring from Einstein, Al-Khwarizmi, and 6 other legendary teachers'
      ),

      // Urdu subtitle
      React.createElement(
        'p',
        { className: `text-center text-xs sm:text-sm md:text-base text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto px-3 sm:px-4 leading-relaxed transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`, dir: 'rtl' },
        'آئن سٹالن، الخوارزمی اور 6 دیگر عظیم اساتذہ سے ذاتی تعلیم حاصل کریں'
      ),

      // CTA Buttons
      React.createElement(
        'div',
        { className: `flex flex-col items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-16 px-2 sm:px-4 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}` },

        React.createElement(
          'button',
          {
            onClick: onScrollToTutors,
            className: 'w-full group px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2'
          },
          React.createElement('span', { className: 'text-lg sm:text-2xl' }, '🎥'),
          React.createElement('span', null, 'Learn from AI Live'),
          React.createElement('span', { className: 'text-base sm:text-xl group-hover:translate-x-1 transition-transform hidden sm:inline' }, '→')
        ),

        React.createElement(
          'button',
          {
            onClick: onScrollToTutors,
            className: 'w-full px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2'
          },
          React.createElement('span', { className: 'text-lg sm:text-2xl' }, '💬'),
          React.createElement('span', null, 'Try Text Chat')
        )
      ),

      // Features Section REMOVED as per user request

      // Scroll indicator REMOVED as per user request

    )
  );
}

console.log('✅ Hero.js loaded successfully');

