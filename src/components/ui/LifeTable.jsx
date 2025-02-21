import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

function LifeTable({ activity, handleInputChange, editing }) {
  return (
    <div className="efficiency-table">
      <div className="table-header">
        <div className="left-header">{activity.name}</div>
        <div className="right-header">
          시간당 골드: <span>{activity.gold_per_hour.toLocaleString()}</span>
        </div>
      </div>
      <div className="table-row">
        <div className="cell gray-text">아이템</div>
        <div className="cell gray-text">획득 개수</div>
        <div className="cell gray-text">시세</div>
        <div className="cell gray-text">획득 골드</div>
      </div>
      {activity.items.map((item) => (
        <div
          key={item.name}
          className={`table-row ${item.isHighlighted ? 'highlight-input' : ''}`}
        >
          <div className="cell icon-cell">
            <img src={item.icon} alt={item.name} />
            {item.name}
          </div>
          <div className="cell">
            {editing ? (
              <input
                type="number"
                className="input-field"
                value={item.count}
                onChange={(e) =>
                  handleInputChange(activity.name, item.name, e.target.value)
                }
              />
            ) : (
              `${item.count.toLocaleString()}개`
            )}
          </div>
          <div className="cell">{item.price.toLocaleString()}골드</div>
          <div className="cell">{item.total_price.toLocaleString()}골드</div>
        </div>
      ))}
      <div className="table-footer">
        <div className="left-footer">
          도약 <span className="highlight-time">{activity.time_withleaf}</span>{' '}
          {activity.total_gold_withleaf.toLocaleString()}골드
        </div>
        <div className="right-footer">
          소요시간: <span className="highlight-time">{activity.time} 	&nbsp;</span>
          획득 골드:{' '} <span className="highlight-gold">{activity.total_gold.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

LifeTable.propTypes = {
  activity: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
};

export default LifeTable;
