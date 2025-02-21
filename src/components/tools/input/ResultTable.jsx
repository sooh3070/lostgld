import React from "react";
import PropTypes from "prop-types";
import "../../ui/Table.css";

function ResultTable({ activity }) {
  // 총 획득 골드 계산
  const totalGold = activity.items.reduce(
    (sum, item) => sum + (Number(item.total_price) || 0),
    0
  );

  return (
    <div className="efficiency-table">
      <div className="tool-table-header">
        <div className="left-header">{activity.name}</div>
      </div>
      <div className="table-row">
        <div className="cell gray-text">아이템</div>
        <div className="cell gray-text">획득 개수</div>
        <div className="cell gray-text">시세</div>
        <div className="cell gray-text">획득 골드</div>
      </div>
      {activity.items.map((item) => (
        <div
          key={item.name} // `name`이 고유하다면 사용, 그렇지 않으면 `id`를 사용
          className={`table-row ${item.isHighlighted ? "highlight-input" : ""}`}
        >
          <div className="cell icon-cell">
            <img src={item.icon} alt={item.name} />
            {item.name}
          </div>
          <div className="cell">{(item.count || 0).toLocaleString()}개</div>
          <div className="cell">{(item.price || 0).toLocaleString()}골드</div>
          <div className="cell">{(item.total_price || 0).toLocaleString()}골드</div>
        </div>
      ))}
      <div className="table-footer">
        <div className="left-footer"></div>
        <div className="right-footer">
          총 획득 골드: <span>{totalGold.toLocaleString()}골드</span>
        </div>
      </div>
    </div>
  );
}

ResultTable.propTypes = {
  activity: PropTypes.shape({
    name: PropTypes.string.isRequired, // 작업 이름
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired, // 아이템 이름
        count: PropTypes.number, // 획득 개수
        icon: PropTypes.string, // 아이템 아이콘 URL
        price: PropTypes.number, // 시세
        total_price: PropTypes.number, // 총 가격
      })
    ).isRequired,
  }).isRequired,
};

export default ResultTable;
