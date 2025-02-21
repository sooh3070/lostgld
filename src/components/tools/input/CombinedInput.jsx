import PropTypes from "prop-types";
import "../styles/ToolInput.css";
import "../styles/ToolTable.css"; // 테이블 스타일

const CombinedInput = ({
  toolOptions,
  setToolOptions,
  amulet,
  setAmulet,
  level,
  setLevel,
  epic,
  setEpic,
  handleSubmit,
}) => {
// 입력 필드 변경 핸들러 (ToolOptions)
const handleOptionChange = (field, value) => {
  setToolOptions({
    ...toolOptions,
    [field]: value === '' ? 0 : parseFloat(value) || 0,
  });
};

  // 적용하기 버튼 클릭 핸들러
  const handleApply = () => {
    handleSubmit({ amulet, level, epic, toolOptions }); // 인자로 객체를 전달
  };

  return (
    <div className="combined-input">
      {/* 도구 옵션 입력 섹션 */}
      <div className="tool-table">
        <div className="tool-table-header">도구 옵션 입력</div>
        {Object.keys(toolOptions).map((field) => (
          <div key={field} className="tool-table-row">
            <div className="tool-table-cell">{field.replace(/_/g, " ")}</div>
            <div className="tool-table-cell">
              <input
                type="number"
                value={toolOptions[field]}
                onChange={(e) => handleOptionChange(field, e.target.value)}
                className="input-field"
                placeholder="0" // 기본 안내문 추가
              />
              &nbsp;%
            </div>
          </div>
        ))}
      </div>

      {/* 부적 및 레벨 입력 섹션 */}
      <div className="vertical-group">
        <div className="input-group">
          <label htmlFor="amulet">부적</label>
          <select
            id="amulet"
            value={amulet}
            onChange={(e) => setAmulet(e.target.value)}
          >
            <option value="없음">없음</option>
            <option value="희귀">희귀</option>
            <option value="영웅">영웅</option>
            <option value="전설">전설</option>
            <option value="유물">유물</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="level">레벨 (30-70)</label>
          <input
            id="level"
            type="number"
            min="30"
            max="70"
            value={level || ''} // level이 0이면 빈 문자열로 표시
            onChange={(e) => setLevel(Number(e.target.value))}
            placeholder="0" // 기본 안내문 추가
          />
        </div>
        <div className="input-group">
          <label htmlFor="epic">미겜 보라 비율 (%)</label>
          <input
            id="epic"
            type="number"
            min="0"
            max="100"
            value={epic === 0 ? '' : epic}
            onChange={(e) => setEpic(Number(e.target.value))}
            placeholder="0" // 기본 안내문 추가
          />
        </div>
        <button className="submit-button" onClick={handleApply}>
          적용하기
        </button>
      </div>
    </div>
  );
};

CombinedInput.propTypes = {
  toolOptions: PropTypes.object.isRequired,
  setToolOptions: PropTypes.func.isRequired,
  amulet: PropTypes.string.isRequired,
  setAmulet: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
  setLevel: PropTypes.func.isRequired,
  epic: PropTypes.number.isRequired,
  setEpic: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default CombinedInput;
