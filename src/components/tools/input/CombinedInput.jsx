import { useState } from "react";
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
  selectedTool,   // ✅ 현재 도구 종류 (예: lumbering, mining, fishing, archaeology)
  toolName,       // ✅ 한국어 도구 이름 (예: 벌목, 채광, 낚시, 고고학)
  onPresetSaved,  // ✅ 프리셋 저장 시 상위에 알림
}) => {
  const [presetName, setPresetName] = useState("");

  // 입력 필드 변경 핸들러 (ToolOptions)
  const handleOptionChange = (field, value) => {
    setToolOptions({
      ...toolOptions,
      [field]: value === "" ? 0 : parseFloat(value) || 0,
    });
  };

  // 적용하기 버튼 클릭 핸들러
  const handleApply = () => {
    handleSubmit({ amulet, level, epic, toolOptions });
  };

  // 프리셋 저장 핸들러
  const handleSavePreset = (name) => {
    if (!name) {
      alert("프리셋 이름을 입력하세요!");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("toolPresets")) || [];
    const newPreset = {
      id: Date.now(),
      toolType: selectedTool, // ✅ 현재 선택된 도구 종류
      name,
      options: toolOptions,
    };

    const updated = [...existing, newPreset];
    localStorage.setItem("toolPresets", JSON.stringify(updated));

    // ✅ 저장 직후 상위 컴포넌트 state 갱신
    if (onPresetSaved) {
      onPresetSaved(updated.filter((p) => p.toolType === selectedTool));
    }

    setPresetName(""); // 입력칸 초기화
  };

  return (
    <div className="combined-input">
      {/* 도구 옵션 입력 섹션 */}
      <div className="tool-table">
        <div className="tool-table-header">
          <span>도구 옵션 입력</span>
          <div className="preset-input">
            <input
              type="text"
              placeholder="프리셋 이름"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value.slice(0, 10))} // ✅ 최대 8자
              maxLength={8} // ✅ 브라우저 입력 제한
              className="preset-input-field"
            />
            <button
              className="preset-save-btn"
              onClick={() => handleSavePreset(presetName)}
            >
              저장
            </button>
          </div>
        </div>

        {Object.keys(toolOptions).map((field) => (
          <div key={field} className="tool-table-row">
            <div className="tool-table-cell">{field.replace(/_/g, " ")}</div>
            <div className="tool-table-cell">
              <input
                type="number"
                value={toolOptions[field]}
                onChange={(e) => handleOptionChange(field, e.target.value)}
                className="input-field"
                placeholder="0"
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
            value={level || ""}
            onChange={(e) => setLevel(Number(e.target.value))}
            placeholder="0"
          />
        </div>
        <div className="input-group">
          <label htmlFor="epic">미겜 보라 비율 (%)</label>
          <input
            id="epic"
            type="number"
            min="0"
            max="100"
            value={epic === 0 ? "" : epic}
            onChange={(e) => setEpic(Number(e.target.value))}
            placeholder="0"
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
  selectedTool: PropTypes.string.isRequired, // ex) "lumbering"
  toolName: PropTypes.string.isRequired,    // ex) "벌목"
  onPresetSaved: PropTypes.func,            // ✅ 새 프리셋 저장 시 호출되는 콜백
};

export default CombinedInput;
