// src/LearnMorePage.js
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShapesBackground from './ShapesBackground';
import './LearnMorePage.css';

// Placeholder images
const BLOCKLY_IMAGE_URL = 'https://pngimg.com/uploads/google/google_PNG19630.png';
const PYTHON_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg';

// Feature images
const FEATURE_IMAGE_1 = 'https://devby.io/storage/images/54/69/83/54/derived/3e73bb566e8e55ce70cd6ccd824960de.jpg';
const FEATURE_IMAGE_2 = 'https://jooinn.com/images/kids-using-laptops-5.jpg';

// --- Milestones Data ---
const MILESTONE_DATA = [
  {
    key: 'Python Pioneer',
    icon: '🔑',
    title: 'Python Pioneer',
    achievement: 'Successfully run your very first Python program.',
    color: '#98FB98',
  },
  {
    key: 'Loop Listener',
    icon: '🔁',
    title: 'Loop Listener',
    achievement: 'Completed a program using complex loops (FOR or WHILE).',
    color: '#E6E6FA',
  },
  {
    key: 'Web Weaver',
    icon: '🌐',
    title: 'Web Weaver',
    achievement: 'Integrated an external API using the custom HTTP Request block.',
    color: '#FF7F50',
  },
  {
    key: 'Logic Master',
    icon: '🧪',
    title: 'Logic Master',
    achievement: 'Solved a FizzBuzz-level challenge using conditional logic (IF/ELIF).',
    color: '#87CEEB',
  },
];

const MilestonesBar = ({ delay }) => (
  <div className="milestones-bar scroll-animated" style={{ animationDelay: `${delay}s` }}>
    <h2>Your Coding Milestones</h2>
    <p className="subtitle">
      Track your path from visual beginner to certified Python developer.
    </p>
    <div className="milestones-grid">
      {MILESTONE_DATA.map((m, index) => (
        <div
          key={m.title}
          className="milestone-card"
          style={{
            '--milestone-color': m.color,
            animationDelay: `${delay + 0.15 + index * 0.1}s`,
          }}
        >
          <div className="milestone-icon">{m.icon}</div>
          <h3>{m.title}</h3>
          <p>{m.achievement}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- Difficulty Toggle ---
const FIZZBUZZ_PYTHON = `# Python View (Expert)
def fizzbuzz(n):
    """Prints FizzBuzz up to n."""
    for i in range(1, n + 1):
        if i % 15 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)
`;

const FIZZBUZZ_BLOCKS_MOCK_LINES = [
  "[ Loop from 1 to 100 ]",
  "[ IF (i % 15 == 0) ]",
  "    [ PRINT \"FizzBuzz\" ]",
  "[ ELIF (i % 3 == 0) ]",
  "    [ PRINT \"Fizz\" ]",
  "[ ELIF (i % 5 == 0) ]",
  "    [ PRINT \"Buzz\" ]",
  "[ ELSE ]",
  "    [ PRINT i ]",
];

const DifficultyToggleSection = ({ delay }) => {
  const [viewMode, setViewMode] = useState('blocks');

  const renderBlockMock = () => {
    return FIZZBUZZ_BLOCKS_MOCK_LINES.map((line, index) => {
      const baseIndent = line.startsWith('    [') ? 1 : 0;
      const indentationStyle = { marginLeft: `${baseIndent * 20}px` };
      const displayContent = line.replace(/^\[\s*|\s*\]$/g, '').trim();

      if (line.trim().startsWith('#')) {
        return (
          <span
            key={index}
            style={{ display: 'block', color: 'gray', margin: '5px 0' }}
          >
            {line}
          </span>
        );
      }

      return (
        <span key={index} className="block-line" style={indentationStyle}>
          {displayContent}
        </span>
      );
    });
  };

  return (
    <section
      className="difficulty-toggle-section scroll-animated"
      style={{ animationDelay: `${delay}s` }}
    >
      <h2>Visualizing Complexity</h2>
      <p className="subtitle">
        The same FizzBuzz logic shown in two ways: simple blocks or raw Python.
      </p>

      <div className="toggle-switch">
        <button
          className={`toggle-btn ${viewMode === 'blocks' ? 'active' : ''}`}
          onClick={() => setViewMode('blocks')}
        >
          Block View (Beginner)
        </button>
        <button
          className={`toggle-btn ${viewMode === 'python' ? 'active' : ''}`}
          onClick={() => setViewMode('python')}
        >
          Python View (Expert)
        </button>
      </div>

      <pre
        className={`code-display ${viewMode === 'blocks' ? 'block-view-active' : ''}`}
      >
        {viewMode === 'blocks' ? renderBlockMock() : FIZZBUZZ_PYTHON}
      </pre>
    </section>
  );
};

// --- FAQ Section ---
const FAQ_DATA = [
  {
    q: 'What programming language does Codeblocking generate?',
    a: 'Codeblocking exclusively generates *pure, standard Python code*.',
  },
  {
    q: 'Is the visual editor customizable?',
    a: 'Yes! You can define your own custom blocks and categories to extend functionality.',
  },
  {
    q: 'How is my code executed safely?',
    a: 'Your code runs in a sandboxed environment, ensuring security and isolation.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No, Codeblocking is entirely web-based and works in any modern browser.',
  },
];

const FAQItem = ({ question, answer, delay }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="faq-item scroll-animated"
      style={{ animationDelay: `${delay}s` }}
    >
      <button
        className={`faq-question ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        className={`faq-answer-panel ${isOpen ? 'open' : ''}`}
        dangerouslySetInnerHTML={{ __html: `<p>${answer}</p>` }}
      />
    </div>
  );
};

// --- Stepper ---
const STEP_DATA = [
  { num: 1, title: 'Create Account', description: 'Start your journey by creating a free account.' },
  { num: 2, title: 'Build Visually', description: 'Drag and drop blocks to assemble your logic.' },
  { num: 3, title: 'View Python Code', description: 'Watch Python code generate instantly.' },
  { num: 4, title: 'Run Securely', description: 'Execute code safely in a sandboxed environment.' },
];

const StepBar = ({ data }) => (
  <div className="step-bar">
    {data.map((step, index) => (
      <div
        key={step.num}
        className="step-item scroll-animated"
        style={{ animationDelay: `${0.2 + index * 0.15}s` }}
      >
        <div className="step-number-wrapper">
          <div className="step-number">{step.num}</div>
        </div>
        <h3>{step.title}</h3>
        <p>{step.description}</p>
        {index < data.length - 1 && <div className="step-connector"></div>}
      </div>
    ))}
  </div>
);

// --- Scroll Hooks ---
const useScrollAnimation = (ref) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = ref.current.querySelectorAll('.scroll-animated');
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [ref]);
};

const useScrollProgress = (ref) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = ref.current;
      if (container) {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
      }
    };

    const container = ref.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return progress;
};

// --- Main Component ---
const LearnMorePage = () => {
  const contentRef = useRef(null);
  const navigate = useNavigate();
  useScrollAnimation(contentRef);
  const scrollProgress = useScrollProgress(contentRef);

  const handleBackClick = () => navigate(-1);

  const newSection1 = {
    title: 'The Learning Journey: Blocks to Code',
    image: FEATURE_IMAGE_1,
    content:
      'Codeblocking guides users through a structured learning process. Start with drag-and-drop blocks to grasp foundational concepts like loops, conditionals, and variables. As you gain confidence, view the generated Python code side-by-side, creating a seamless transition from visual to textual programming.',
    list: [
      'Visual Mode: Focus purely on logic, eliminating syntax errors.',
      'Code Translation: See Python equivalent instantly.',
      'Interactive Debugging: Step through blocks and code.',
    ],
  };

  const newSection2 = {
    title: 'Community and Continuous Improvement',
    image: FEATURE_IMAGE_2,
    content:
      'Our platform is constantly updated based on community feedback and the latest Python standards. Join our forum, share your custom blocks, and explore challenges created by other users.',
    list: [
      'Challenge Leaderboards: Compete with others on coding challenges.',
      'Open Source Contribution: Contribute to Blockly definitions.',
      'Resource Hub: Access tutorials and documentation.',
    ],
  };

  return (
    <div className="learn-more-container landing-page" ref={contentRef}>
      <div className="scroll-progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <ShapesBackground />

      <button className="back-button" onClick={handleBackClick}>
        &larr;
      </button>

      <div className="learn-more-content scroll-animated">
        <header className="header">
          <h1>Codeblocking: Visual Coding for Future Engineers</h1>
          <p className="subtitle">
            <strong>Bridging the gap between visual programming and real-world Python.</strong>
          </p>
        </header>

        <StepBar data={STEP_DATA} />
        <DifficultyToggleSection delay={0.4} />
        <MilestonesBar delay={0.5} />

        <section className="info-section scroll-animated" style={{ animationDelay: '0.6s' }}>
          <div className="text-content">
            <h2>What is Google Blockly?</h2>
            <p>
              Blockly is a client-side JavaScript library that creates visual
              programming editors. It allows users to combine code blocks like
              puzzle pieces to generate syntax-correct code in many languages.
            </p>
            <ul>
              <li><strong>Visual First:</strong> Simplifies complex logic into stackable blocks.</li>
              <li><strong>Syntax Guarantee:</strong> Blocks connect only if grammatically correct.</li>
              <li><strong>Extensible:</strong> Customizable with new blocks and tools.</li>
            </ul>
          </div>
          <div className="image-container">
            <img src={BLOCKLY_IMAGE_URL} alt="Google Blockly Logo" />
          </div>
        </section>

        <section className="info-section reverse-flex scroll-animated" style={{ animationDelay: '0.7s' }}>
          <div className="image-container">
            <img src={PYTHON_IMAGE_URL} alt="Python Logo" />
          </div>
          <div className="text-content">
            <h2>Our Core Innovation</h2>
            <p>
              Unlike standard Blockly projects that execute JavaScript,
              Codeblocking generates <strong>pure Python code</strong> and runs
              it securely on a serverless platform.
            </p>
            <div className="feature-grid">
              <div className="feature-card">
                <h3>Real-World Code</h3>
                <p>
                  Students learn Python syntax and logic that applies directly to
                  real-world development.
                </p>
              </div>
              <div className="feature-card">
                <h3>Security & Scalability</h3>
                <p>
                  Code runs in a sandboxed environment, ensuring safety and
                  scalability.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="info-section scroll-animated" style={{ animationDelay: '0.8s' }}>
          <div className="text-content">
            <h2>{newSection1.title}</h2>
            <p>{newSection1.content}</p>
            <ul>
              {newSection1.list.map((item, index) => {
                const [bold, rest] = item.split(': ');
                return (
                  <li key={index}>
                    <strong>{bold}:</strong> {rest}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="image-container">
            <img src={newSection1.image} alt="Learning Journey" />
          </div>
        </section>

        <section className="info-section reverse-flex scroll-animated" style={{ animationDelay: '0.9s' }}>
          <div className="image-container">
            <img src={newSection2.image} alt="Community" />
          </div>
          <div className="text-content">
            <h2>{newSection2.title}</h2>
            <p>{newSection2.content}</p>
            <ul>
              {newSection2.list.map((item, index) => {
                const [bold, rest] = item.split(': ');
                return (
                  <li key={index}>
                    <strong>{bold}:</strong> {rest}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="faq-section">
          <h2
            className="scroll-animated"
            style={{ animationDelay: '1.0s', textAlign: 'center', marginBottom: '30px' }}
          >
            Frequently Asked Questions
          </h2>
          <div className="faq-list">
            {FAQ_DATA.map((item, index) => (
              <FAQItem
                key={index}
                question={item.q}
                answer={item.a}
                delay={1.1 + index * 0.1}
              />
            ))}
          </div>
        </section>

        <footer className="footer scroll-animated" style={{ animationDelay: '1.2s' }}>
          <p>Ready to start visual programming?</p>
          <Link to="/signup" className="btn btn-primary">
            Start Coding Now
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default LearnMorePage;
