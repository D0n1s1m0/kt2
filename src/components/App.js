import React from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';

function App() {
  const technologies = [
    { 
      id: 1, 
      title: 'React Components', 
      description: 'Изучение функциональных и классовых компонентов, работа с props и state', 
      status: 'completed' 
    },
    { 
      id: 2, 
      title: 'JSX Syntax', 
      description: 'Освоение синтаксиса JSX, условный рендеринг, работа со списками', 
      status: 'in-progress' 
    },
    { 
      id: 3, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов, хуки useState и useEffect', 
      status: 'not-started' 
    },
    { 
      id: 4, 
      title: 'React Router', 
      description: 'Навигация между страницами в React приложениях', 
      status: 'not-started' 
    },
    { 
      id: 5, 
      title: 'Context API', 
      description: 'Управление глобальным состоянием приложения', 
      status: 'in-progress' 
    },
    { 
      id: 6, 
      title: 'Custom Hooks', 
      description: 'Создание переиспользуемых пользовательских хуков', 
      status: 'completed' 
    }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h1>Трекер изучения технологий</h1>
          <p className="subtitle">Отслеживайте свой прогресс в освоении современных технологий</p>
        </div>
      </header>

      <main className="App-main">
        <div className="container">
          <ProgressHeader technologies={technologies} />
          
          <section className="technologies-section">
            <h2>Дорожная карта технологий</h2>
            <div className="technologies-grid">
              {technologies.map(tech => (
                <TechnologyCard
                  key={tech.id}
                  title={tech.title}
                  description={tech.description}
                  status={tech.status}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="App-footer">
        <div className="container">
          <p>&copy; 2024 Трекер изучения технологий. Разработано с помощью React</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
