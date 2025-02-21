import React, { useState } from 'react';
import './CraftTable.css';

const CraftTable = ({ data, onToggleItemSelected }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="craft-list">
      {data.map((entry, index) => (
        <div key={index} className="craft-list-item">
          <div className="list-header" onClick={() => toggleExpand(index)}>
            <img src={entry.header.icon} alt={entry.header.name} className="list-icon" />
            <span className="list-name">{entry.header.name}</span>
            <span className="list-price">가격: {entry.header.price.toLocaleString()}G</span>
            <span className="list-price1">개당 시세: {entry.header.price1.toLocaleString()}G</span>
            <span className="list-cost">제작 비용: {entry.header.craftingCost.toLocaleString()}G</span>
            <span className="list-profit">판매 차익: {entry.header.profit.toLocaleString()}G</span>
          </div>
          {expandedIndex === index && (
            <div className="detail-table">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>이름</th>
                    <th>필요 개수</th>
                    <th>판매 단위</th>
                    <th>시세</th>
                    <th>합계</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.items.map((item, subIndex) => (
                    <tr
                      key={subIndex}
                      className={`detail-row ${item.isSelected ? 'selected' : ''} ${
[2, 3, 4, 5, 6].includes(subIndex + 1) ? `row-${subIndex + 1}` : ''
                      }`}
                      onClick={() => onToggleItemSelected(index, subIndex)}
                    >
                      <td>
                        <img src={item.icon} alt={item.icon} className="table-icon" />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.count}</td>
                      <td>{item.bundleCount}</td>
                      <td>{item.price.toLocaleString()}G</td>
                      <td>{item.total.toLocaleString()}G</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2">제작 수수료: {entry.footer.craftingFee}</td>
                    <td colSpan="2">재료 합산: {entry.footer.materialSum}</td>
                    <td colSpan="2">제작 비용: {entry.footer.craftingCost}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CraftTable;
