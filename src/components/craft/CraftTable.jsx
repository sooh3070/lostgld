import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpandedIndex, toggleItemSelected, updateItemPrice } from '../../store/craftSlice';
import './CraftTable.css';

const CraftTable = () => {
  const dispatch = useDispatch();
  const { craftData, expandedIndex } = useSelector((state) => state.craft);

  const handleExpand = (index) => {
    dispatch(setExpandedIndex(expandedIndex === index ? null : index));
  };

  const handleToggleItemSelected = (entryIndex, itemIndex) => {
    dispatch(toggleItemSelected({ entryIndex, itemIndex }));
  };

  const handlePriceChange = (entryIndex, itemIndex, newPrice) => {
    dispatch(updateItemPrice({ entryIndex, itemIndex, newPrice }));
  };

  return (
    <div className="craft-list">
      {craftData.map((entry, index) => (
        <div key={index} className="craft-list-item">
          <div className="list-header" onClick={() => handleExpand(index)}>
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
                        [2,3,4,5,6].includes(subIndex+1) ? `row-${subIndex+1}` : ''
                      }`}
                      onClick={() => handleToggleItemSelected(index, subIndex)}
                    >
                      <td>
                        <img src={item.icon} alt={item.name} className="table-icon" />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.count}</td>
                      <td>{item.bundleCount}</td>
                      <td>
                        {item.isDerived ? (
                          <span>{item.price}</span>
                        ) : (
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handlePriceChange(index, subIndex, parseInt(e.target.value, 10) || '')
                            }
                            className="price-input"
                            placeholder="0"
                          />
                        )}G
                      </td>
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
