import React from 'react';
import './DynamicButtonGroup.css';

const DynamicButtonGroup = ({ buttons }) => {
  return (
    <div className="button-group">
      {buttons.map((button, index) => (
        <button
          key={index}
          className={button.className || 'default-button'}
          onClick={button.onClick}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default DynamicButtonGroup;
