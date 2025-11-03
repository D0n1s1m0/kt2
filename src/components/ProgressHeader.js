import React from 'react';
import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  const totalTechnologies = technologies.length;
  const completedTechnologies = technologies.filter(tech => tech.status === 'completed').length;
  const completionPercentage = totalTechnologies > 0 
    ? Math.round((completedTechnologies / totalTechnologies) * 100) 
    : 0;

  const getProgressLevel = () => {
    if (completionPercentage === 0) return 'Начальный';
    if (completionPercentage < 30) return 'Начинающий';
    if (completionPercentage < 70) return 'Продвинутый';
    return 'Эксперт';
  };

  return (
    <div className="progress-header">
      <div className="progress-header__stats">
        <div className="stat-item">
          <span className="stat-number">{totalTechnologies}</span>
          <span className="stat-label">Всего технологий</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{completedTechnologies}</span>
          <span className="stat-label">Изучено</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{completionPercentage}%</span>
          <span className="stat-label">Прогресс</span>
        </div>
        <div className="stat-item">
          <span className="stat-level">{getProgressLevel()}</span>
          <span className="stat-label">Уровень</span>
        </div>
      </div>
      
      <div className="progress-header__bar">
        <div className="progress-overview">
          <div className="progress-labels">
            <span>Общий прогресс</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-track__fill" 
              style={{ width: `${completionPercentage}%` }}
              aria-label={`Прогресс изучения: ${completionPercentage}%`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;
