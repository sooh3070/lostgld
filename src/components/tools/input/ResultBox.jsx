import React from "react";
import PropTypes from "prop-types";

const ResultBox = ({ 
  title = "Default Title", 
  data = null, 
  onClick = null 
}) => (
  <div
    className="result-box"
    onClick={onClick}
    role="button"
    tabIndex="0"
    style={{
      cursor: onClick ? "pointer" : "default", // 클릭 가능 여부에 따라 커서 변경
    }}
  >
    <h2>{title}</h2>
    <div className="additional-results">
      {data ? (
        <ul className="result-list">
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              {key}: {value.toLocaleString()}개
            </li>
          ))}
        </ul>
      ) : (
        <p>결과를 확인하려면 값을 입력하세요.</p>
      )}
    </div>
  </div>
);

ResultBox.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
  onClick: PropTypes.func, // 클릭 핸들러 추가
};

export default ResultBox;
