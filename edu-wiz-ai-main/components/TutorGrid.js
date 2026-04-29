function TutorGrid({ onTutorSelect }) {
  try {
    const tutors = [
      { name: 'Albert Einstein', subject: 'Physics', urduName: 'آئن سٹائن', emoji: '⚛️', description: 'Master of relativity and quantum mechanics', color: 'from-blue-500 to-cyan-500', image: 'https://app.trickle.so/storage/public/images/usr_16f4355760000001/5333a52b-087e-4f56-b294-b2064103a73a.png?w=203&h=248' },
      { name: 'Al-Khwarizmi', subject: 'Mathematics', urduName: 'الخوارزمی', emoji: '🔢', description: 'Father of Algebra and Algorithms', color: 'from-green-500 to-emerald-500', image: 'https://app.trickle.so/storage/public/images/usr_16f4355760000001/305fee35-2bbd-41a4-81bd-978738dbafea.png?w=187&h=270' },
      { name: 'Marie Curie', subject: 'Chemistry', urduName: 'میری کیوری', emoji: '⚗️', description: 'Pioneer in radioactivity research', color: 'from-purple-500 to-pink-500', image: 'https://app.trickle.so/storage/public/images/usr_16f4355760000001/7e611201-6509-4b9c-b94c-eee6f0c14ba0.png?w=185&h=272' },
      { name: 'Ibn Sina', subject: 'Biology', urduName: 'ابن سینا', emoji: '🧬', description: 'Master physician and philosopher', color: 'from-red-500 to-orange-500', image: 'https://app.trickle.so/storage/public/images/usr_16f4355760000001/a1e4ab5c-2042-4f84-9977-04c3421e8194.png?w=188&h=268' },
      { name: 'Alan Turing', subject: 'Computer Science', urduName: 'ایلن ٹیورنگ', emoji: '💻', description: 'Father of Computer Science', color: 'from-indigo-500 to-blue-500', image: 'https://app.trickle.so/storage/public/images/usr_16f4355760000001/169536d4-73dd-46fb-88eb-9f83d94cdb02.png?w=190&h=266' },
      { name: 'Allama Iqbal', subject: 'Pakistan Studies', urduName: 'علامہ اقبال', emoji: '🇵🇰', description: 'Poet-philosopher of the East', color: 'from-green-600 to-green-400', image: 'https://app.trickle.so/storage/public/images/usr_16f4355760000001/f9e449bc-0217-444d-bdac-accdd032651a.png?w=200&h=200' },
      { name: 'William Shakespeare', subject: 'English', urduName: 'ولیم شیکسپیئر', emoji: '📚', description: 'Greatest writer in English language', color: 'from-yellow-500 to-amber-500', image: 'https://app.trickle.so/storage/public/images/usr_16f4355760000001/6b9003c5-0fc8-4fac-8882-7e736dd54e3a.png?w=275&h=183' },
      { name: 'Mirza Ghalib', subject: 'Urdu', urduName: 'مرزا غالب', emoji: '✍️', description: 'Master of Urdu poetry', color: 'from-rose-500 to-pink-500', image: 'https://app.trickle.so/storage/public/images/usr_16f4355760000001/f78a6265-1914-4b5d-92d5-4766d22692da.png?w=168&h=299' }
    ];

    return (
      <section id="tutors" className="w-full py-12 px-6 bg-[var(--card-bg)]" data-name="tutor-grid" data-file="components/TutorGrid.js">
        <div className="w-full max-w-full mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 px-1">Meet Your AI Tutors</h2>
          <p className="text-base text-gray-400 text-center mb-12 px-2">8 legendary teachers, each with unique personality and teaching style</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {tutors.map((tutor, index) => (
              <TutorCard 
                key={index} 
                tutor={tutor} 
                onSelect={onTutorSelect}
              />
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('TutorGrid component error:', error);
    return null;
  }
}
