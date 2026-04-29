// ============================================
// SIMPLE TOPIC SELECTOR - USER BOOK VERSION
// Books are taken directly from logged-in user
// Subject -> Book -> Units -> Topics
// ============================================

function SimpleTopicSelector({ tutor, onTopicSelected, onClose }) {

  // ================= STATE =================
  const [unitNumber, setUnitNumber] = React.useState('');
  const [topicId, setTopicId] = React.useState('');

  const [units, setUnits] = React.useState([]);
  const [topics, setTopics] = React.useState([]);

  const [selectedBookId, setSelectedBookId] = React.useState(null);
  const [selectedBookName, setSelectedBookName] = React.useState(null);

  // ✅ V76: RESTORED ORIGINAL API BASE
  const API_BASE = '/AITutor';

  // ================= BOOK NAME (UI) =================
  const subjectBookName = {
    'Physics': 'Physics',
    'Mathematics': 'Mathematics',
    'Math': 'Mathematics',
    'Chemistry': 'Chemistry',
    'Biology': 'Biology',
    'Computer Science': 'Computer Science',
    'Pakistan Studies': 'Pakistan Studies',
    'English': 'English',
    'Urdu': 'Urdu'
  }[tutor.subject] || tutor.subject;

  const bookNameToShow = selectedBookName || subjectBookName;

  // ================= LOAD UNITS (NO BOARD / CLASS) =================
  React.useEffect(() => {
    if (!tutor.subject) return;

    setUnits([]);
    setTopics([]);
    setUnitNumber('');
    setTopicId('');
    setSelectedBookId(null);

    fetch(
      API_BASE +
      '/units?subject=' + encodeURIComponent(tutor.subject)
    )
      .then(res => res.json())
      .then(data => {
        setSelectedBookId(data.bookid || null);
        setSelectedBookName(data.bookname || null);
        setUnits(Array.isArray(data.units) ? data.units : []);
      })
      .catch(err => {
        console.error('Units load error:', err);
        setUnits([]);
        setSelectedBookId(null);
      });

  }, [tutor.subject]);

  // ================= LOAD TOPICS =================
  React.useEffect(() => {
    if (!selectedBookId || !unitNumber) {
      setTopics([]);
      setTopicId('');
      return;
    }

    fetch(
      API_BASE +
      '/topics?bookid=' + encodeURIComponent(selectedBookId) +
      '&unit_number=' + encodeURIComponent(unitNumber)
    )
      .then(res => res.json())
      .then(data => {
        setTopics(Array.isArray(data) ? data : []);
        if (!data.find(t => String(t.srno) === String(topicId))) {
          setTopicId('');
        }
      })
      .catch(err => {
        console.error('Topics load error:', err);
        setTopics([]);
        setTopicId('');
      });

  }, [selectedBookId, unitNumber]);

  // ================= START LESSON =================
  const selectedUnit = units.find(u => String(u.unit_number) === String(unitNumber));
  const selectedTopic = topics.find(t => String(t.srno) === String(topicId));

  const handleStart = () => {
    if (!unitNumber || !topicId || !selectedBookId) {
      alert('Please select unit and topic');
      return;
    }

    if (!selectedUnit || !selectedTopic) {
      alert('Selection error. Please try again.');
      return;
    }

    // ✅ V78: Language-Aware Prompting
    const isUrdu = tutor.subject === 'Urdu';
    const languageInstruction = isUrdu
      ? `Explain ONLY in Urdu script (نستعلیق). Use rich Urdu vocabulary.`
      : `Explain in simple Urdu-English mix with examples and step-by-step clarity.`;

    onTopicSelected({
      book: {
        id: selectedBookId,
        name: bookNameToShow
      },
      unit: {
        number: selectedUnit.unit_number,
        name: selectedUnit.unit_name
      },
      topic: {
        id: selectedTopic.srno,
        name: selectedTopic.topic_name
      },
      initialPrompt: `You are ${tutor.name}, an expert ${tutor.subject} teacher. Explain "${selectedTopic.topic_name}" from Unit ${selectedUnit.unit_number}: ${selectedUnit.unit_name}. Use ${bookNameToShow} as main reference. ${languageInstruction}`
    });

    onClose();
  };

  // ================= UI =================
  return React.createElement(
    'div',
    {
      className: 'fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4',
      onClick: onClose
    },
    React.createElement(
      'div',
      {
        className: 'bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-2xl w-full border-4 border-purple-600 shadow-2xl',
        onClick: e => e.stopPropagation()
      },

      // Header
      React.createElement(
        'div',
        { className: 'flex justify-between items-center mb-8' },
        React.createElement('h2', { className: 'text-4xl font-bold text-white' }, '📚 Select Topic'),
        React.createElement(
          'button',
          {
            onClick: onClose,
            className: 'text-5xl text-gray-400 hover:text-white transition-all'
          },
          '×'
        )
      ),

      // Form
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-8' },

        // Unit
        React.createElement(
          'div',
          null,
          React.createElement('label', { className: 'block text-sm font-bold text-gray-300 mb-2' }, 'Chapter / Unit'),
          React.createElement(
            'select',
            {
              value: unitNumber,
              onChange: e => {
                setUnitNumber(e.target.value);
                setTopicId('');
              },
              disabled: !units.length,
              className: 'w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white text-lg'
            },
            React.createElement('option', { value: '' }, units.length ? 'Select Unit' : 'No units available'),
            units.map(u =>
              React.createElement(
                'option',
                { key: u.unit_number, value: u.unit_number },
                'Unit ' + u.unit_number + ': ' + u.unit_name
              )
            )
          )
        ),

        // Topic
        React.createElement(
          'div',
          null,
          React.createElement('label', { className: 'block text-sm font-bold text-gray-300 mb-2' }, 'Topic'),
          React.createElement(
            'select',
            {
              value: topicId,
              onChange: e => setTopicId(e.target.value),
              disabled: !topics.length,
              className: 'w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white text-lg'
            },
            React.createElement('option', { value: '' }, topics.length ? 'Select Topic' : 'Select Unit first'),
            topics.map(t =>
              React.createElement(
                'option',
                { key: t.srno, value: t.srno },
                t.topic_name
              )
            )
          )
        )
      ),

      // Book Info
      React.createElement(
        'div',
        { className: 'bg-blue-900/30 border border-blue-500 rounded-xl p-4 mb-6' },
        React.createElement('p', { className: 'text-blue-300 text-sm mb-1' }, '📖 Book (Auto-selected by Subject)'),
        React.createElement('p', { className: 'text-white font-bold text-lg' }, bookNameToShow)
      ),

      // Buttons
      React.createElement(
        'div',
        { className: 'flex justify-end gap-4' },
        React.createElement(
          'button',
          {
            onClick: onClose,
            className: 'px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-lg'
          },
          'Cancel'
        ),
        React.createElement(
          'button',
          {
            onClick: handleStart,
            className: 'px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-xl'
          },
          '▶ Start Lesson'
        )
      )
    )
  );
}

console.log('✅ SimpleTopicSelector - USER BOOK VERSION LOADED!');
