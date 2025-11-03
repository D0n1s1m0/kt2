import React from 'react';
import './TechnologyCard.css';

function TechnologyCard({ title, description, status }) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'not-started':
        return '⏳';
      default:
        return '📝';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Изучено';
      case 'in-progress':
        return 'В процессе';
      case 'not-started':
        return 'Не начато';
      default:
        return 'Не определено';
    }
  };

  return (
    <div className={`technology-card technology-card--${status}`}>
      <div className="technology-card__header">
        <h3 className="technology-card__title">{title}</h3>
        <span className="technology-card__status" aria-label={`Статус: ${getStatusText()}`}>
          {getStatusIcon()} {getStatusText()}
        </span>
      </div>
      <div className="technology-card__body">
        <p className="technology-card__description">{description}</p>
      </div>
      <div className="technology-card__footer">
        <div className="technology-card__progress">
          <div className={`progress-bar progress-bar--${status}`}>
            <div 
              className="progress-bar__fill" 
              style={{
                width: status === 'completed' ? '100%' : status === 'in-progress' ? '50%' : '0%'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnologyCard;
