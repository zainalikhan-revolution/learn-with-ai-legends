function Header({ onBack }) {
  try {
    const handleLogoClick = () => {
      if (onBack) {
        onBack();
      } else {
        window.location.href = 'index.html';
      }
    };

    return (
      <header className="bg-[var(--dark-bg)] border-b border-gray-800 py-4 sticky top-0 z-50" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="text-white hover:text-[var(--primary-color)] transition-colors">
                <div className="icon-arrow-left text-2xl"></div>
              </button>
            )}
            <button onClick={handleLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="https://app.trickle.so/storage/public/images/usr_16f4355760000001/7f883f4d-cfef-40b1-83c5-99293424d9b0.png?w=185&h=48" 
                alt="E-Study Card Logo" 
                className="h-10 w-auto"
              />
            </button>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-gray-300 hover:text-[var(--primary-color)] transition-colors">Home</a>
            <a href="#tutors" className="text-gray-300 hover:text-[var(--primary-color)] transition-colors">AI Tutors</a>
            <a href="#features" className="text-gray-300 hover:text-[var(--primary-color)] transition-colors">Features</a>
          </nav>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
