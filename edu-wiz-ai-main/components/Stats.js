function Stats() {
  try {
    const stats = [
      { icon: 'users', label: 'Active Students', value: '5,000+', emoji: '👥' },
      { icon: 'brain', label: 'AI Tutors', value: '8', emoji: '🧠' },
      { icon: 'book-open', label: 'All Boards Subjects', value: 'All Boards', emoji: '📚' },
      { icon: 'trophy', label: 'Success Rate', value: '95%', emoji: '🏆' }
    ];

    return (
      <section className="py-16 px-4 bg-[var(--card-bg)]" data-name="stats" data-file="components/Stats.js">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-800 rounded-xl hover:transform hover:scale-105 transition-all">
                <div className="text-4xl mb-2">{stat.emoji}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Stats component error:', error);
    return null;
  }
}