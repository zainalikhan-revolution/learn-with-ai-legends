function Features() {
  try {
    const features = [
      {
        icon: 'video',
        title: 'Live Video Calls',
        description: 'Face-to-face learning with realistic AI avatars that explain concepts visually',
        color: 'text-blue-400'
      },
      {
        icon: 'globe',
        title: 'Bilingual Support',
        description: 'Learn in Urdu, English, or mix both - just like real Pakistani classrooms',
        color: 'text-green-400'
      },
      {
        icon: 'trending-up',
        title: 'Personalized Learning',
        description: 'AI tracks your progress and adapts to your learning style and pace',
        color: 'text-purple-400'
      }
    ];

    return (
      <section id="features" className="py-20 px-4" data-name="features" data-file="components/Features.js">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Why Students Love E-Study Card</h2>
          <p className="text-gray-400 text-center mb-12">Learn from the world's greatest minds, available 24/7</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="tutor-card text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center ${feature.color}`}>
                  <div className={`icon-${feature.icon} text-3xl`}></div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Features component error:', error);
    return null;
  }
}