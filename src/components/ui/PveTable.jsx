import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

function PveTable({ mission }) {
  return (
    <div className="efficiency-table">
      <div className="table-header">
        <div className="left-header">{mission.name}</div>
        <div className="right-header">
          시간당 골드: <span>{mission.gold_per_hour.toLocaleString()}</span>
        </div>
      </div>
      <div className="table-row">
        <div className="cell gray-text">아이템</div>
        <div className="cell gray-text">획득 개수</div>
        <div className="cell gray-text">시세</div>
        <div className="cell gray-text">획득 골드</div>
      </div>
      {mission.items.map((item, index) => (
        <div key={index} className="table-row">
          <div className="cell icon-cell">
            {item.icon && <img src={item.icon} alt={item.name} />}
            {item.name}
          </div>
          <div className="cell">{item.count.toLocaleString()}개</div>
          <div className="cell">{item.price.toLocaleString()}골드</div>
          <div className="cell">{item.total_price.toLocaleString()}골드</div>
        </div>
      ))}
      <div className="table-footer">
        <div className="left-footer">
          소요 시간: <span className="highlight-time">{mission.duration}</span>
        </div>
        <div className="right-footer">
          총 획득 골드: <span className="highlight-gold">{mission.total_gold.toLocaleString()}골드</span>
        </div>
      </div>
    </div>
  );
}

PveTable.propTypes = {
  mission: PropTypes.object.isRequired,
};

export default PveTable;
