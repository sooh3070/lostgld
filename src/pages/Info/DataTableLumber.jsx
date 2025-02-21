import React from "react";
import "./PageInfo.css"; // 동일한 CSS 사용

const DataTable = ({ data }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>분류</th>
          <th>타입</th>
          <th>목재</th>
          <th>부드러운 목재</th>
          <th>튼튼한 목재</th>
          <th>아비도스 목재</th>
          <th>보물 주머니 획득 횟수</th>
          <th>나무차기 횟수</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.category}</td>
            <td>{row.type}</td>
            {row.values.map((value, idx) => (
              <td key={idx}>{value !== null ? value : "-"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
