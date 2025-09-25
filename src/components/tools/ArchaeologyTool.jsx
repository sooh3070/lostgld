import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useLifeTool from "./hook/useLifeTool"; // 재사용 가능한 훅
import "./styles/Tool.css";
import CombinedInput from "./input/CombinedInput";
import ResultBox from "./input/ResultBox";
import ResultTable from "./input/ResultTable"; // ResultTable 컴포넌트 추가
import { fetchLifeEfficiencyData } from "../../services/LostArkApi"; // API 호출 파일
import ToolChart from "./hook/ToolChart";
import GaugeChart from "./hook/GaugeChart";

const ArchaeologyTool = () => {
  const [toolOptions, setToolOptions] = useState({
    보물상자등장확률: null,
    미니게임보상획득률: null,
    미니게임기회획득확률: null,
    전체등급재료획득률: null,
    희귀등급재료획득률: null,
    고급등급재료획득률: null,
    일반등급재료획득률: null,
  });

  const [amulet, setAmulet] = useState("유물");
  const [level, setLevel] = useState(70);
  const [epic, setEpic] = useState(15);
  const [toolChartData, setToolChartData] = useState(null);

  // ✅ 프리셋 관리
  const [presets, setPresets] = useState([]);

  // 추가옵션2 계산
  const calculateAdditionalOptions = (specialFrequency) => {
    const 일반보상 = 54;
    const 발생빈도 = specialFrequency / 100;
    const 기본보상 = 일반보상 + 일반보상 * 발생빈도;
    const 추가보상 = 기본보상 * 0.01;

    return {
      일반: { 기본: 기본보상, 증가량: 추가보상 },
      고급: { 기본: 기본보상 * 0.5, 증가량: 추가보상 * 0.5 },
      희귀: { 기본: 기본보상 * 0.2, 증가량: 추가보상 * 0.2 },
    };
  };

  const { 결과, setUserOptions } = useLifeTool(
    {},
    {
      일반등급: { 기본: 1080, 증가량: 10.8 },
      고급등급: { 기본: 540, 증가량: 5.4 },
      희귀등급: { 기본: 108, 증가량: 1.08 },
      추가옵션1: { 기본: 5, 증가량: 0.05 },
      추가옵션2: calculateAdditionalOptions(epic),
      추가옵션3: { 기본: 4.3, 증가량: 0.043 },
      추가옵션평균: { 일반: 54, 고급: 27, 희귀: 10.8 },
    }
  );

  const [isLoading, setIsLoading] = useState(true);
  const [lumberingData, setLumberingData] = useState(null);

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchLifeEfficiencyData();
      const filteredData = data.find(
        (activity) => activity.name === "4T 고고학(만생기 기준)"
      );

      const updatedData = filteredData
        ? {
            ...filteredData,
            items: filteredData.items.map((item) => ({
              ...item,
              count: 0,
              total_price: 0,
            })),
            total_gold: 0,
          }
        : null;

      setLumberingData(updatedData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // ✅ 프리셋 로드
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("toolPresets")) || [];
    const filtered = stored.filter((p) => p.toolType === "archaeology");
    setPresets(filtered);
  }, []);

  // ✅ 프리셋 적용
  const handleLoadPreset = (preset) => {
    setToolOptions(preset.options);
  };

  // ✅ 프리셋 삭제
  const handleDeletePreset = (id) => {
    const stored = JSON.parse(localStorage.getItem("toolPresets")) || [];
    const updated = stored.filter((p) => p.id !== id);
    localStorage.setItem("toolPresets", JSON.stringify(updated));
    setPresets(updated.filter((p) => p.toolType === "archaeology"));
  };

  // 데이터 매핑
  const mapResultData = (data) => {
    if (!data) return null;
    return {
      "고대 유물": data.일반 || 0,
      "희귀한 유물": data.고급 || 0,
      "진귀한 유물": data.희귀 || 0,
      "아비도스 유물": data.희귀 || 0,
    };
  };

  // 결과 박스 클릭
  const handleResultBoxClick = (mappedData) => {
    if (!mappedData || !lumberingData) return;

    const updatedItems = lumberingData.items.map((item) => {
      const mappedValue = mappedData[item.name];
      const updatedCount = Math.floor(mappedValue || 0);
      const updatedTotalPrice = Math.floor(
        (updatedCount * (item.price || 0)) / 100
      );
      return { ...item, count: updatedCount, total_price: updatedTotalPrice };
    });

    const updatedTotalGold = updatedItems.reduce(
      (sum, item) => sum + item.total_price,
      0
    );

    setLumberingData({
      ...lumberingData,
      items: updatedItems,
      total_gold: updatedTotalGold,
    });

    const toolChartMappedData = mapResultData(결과?.도구추가획득량);
    const toolChartItems = lumberingData.items.map((item) => ({
      name: item.name,
      count: Math.floor(toolChartMappedData[item.name] || 0),
      price: item.price,
      totalPrice: Math.floor(
        (Math.floor(toolChartMappedData[item.name] || 0) * (item.price || 0)) /
          100
      ),
    }));

    setToolChartData(toolChartItems);
  };

  // 제출
  const handleSubmit = () => {
    setUserOptions({
      일반등급보상: toolOptions.일반등급재료획득률,
      고급등급보상: toolOptions.고급등급재료획득률,
      희귀등급보상: toolOptions.희귀등급재료획득률,
      전체등급보상: toolOptions.전체등급재료획득률,
      추가옵션1: toolOptions.미니게임기회획득확률,
      추가옵션2: toolOptions.미니게임보상획득률,
      추가옵션3: toolOptions.보물상자등장확률,
      부적: amulet,
      레벨: level,
    });
  };

  // 로컬 스토리지 저장
  const handleSaveToLocalStorage = () => {
    if (!lumberingData) return;
    const existingData = JSON.parse(localStorage.getItem("userInput")) || {};
    const updatedArchaeologyData = lumberingData.items.reduce((acc, item) => {
      acc[`4T 고고학(만생기 기준)-${item.name}`] = item.count;
      return acc;
    }, {});
    const updatedData = { ...existingData, ...updatedArchaeologyData };
    localStorage.setItem("userInput", JSON.stringify(updatedData));
    alert("데이터가 저장되었습니다!");
  };

  return (
    <div className="LifeTool">
      <header>
        <h1>
          고고학 도구 계산기{" "}
          <Link to="/life-tool/lumber/info" className="info-icon">
            &#9432;
          </Link>
        </h1>

        {/* ✅ 프리셋 카드형 + 가로 스크롤 */}
        {presets.length > 0 ? (
          <div className="preset-list">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="preset-card"
                onClick={() => handleLoadPreset(preset)}
              >
                <span className="preset-name">{preset.name}</span>
                <button
                  className="preset-btn preset-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePreset(preset.id);
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-presets">저장된 프리셋이 없습니다.</p>
        )}
      </header>

      <div className="flex-container">
        <CombinedInput
          toolOptions={toolOptions}
          setToolOptions={setToolOptions}
          amulet={amulet}
          setAmulet={setAmulet}
          level={level}
          setLevel={setLevel}
          epic={epic}
          setEpic={setEpic}
          handleSubmit={handleSubmit}
          selectedTool="archaeology"
          toolName="고고학"
          // ✅ 저장 시 즉시 반영
          onPresetSaved={(updated) => setPresets(updated)}
        />
      </div>

      <div className="result-container">
        <ResultBox
          title="예상 도구 추가 획득량"
          data={mapResultData(결과?.도구추가획득량)}
          onClick={() => handleResultBoxClick(mapResultData(결과?.도구추가획득량))}
        />
        <ResultBox
          title="예상 총합 획득량"
          data={mapResultData(결과?.최종획득량)}
          onClick={() => handleResultBoxClick(mapResultData(결과?.최종획득량))}
        />
      </div>

      <div className="efficiency-data">
        <h2 className="text-h2">
          효율 계산 <span className="subtext">(획득량 박스 선택시 전환)</span>
        </h2>
        {isLoading ? (
          <p>로딩 중...</p>
        ) : lumberingData ? (
          <>
            <ResultTable activity={lumberingData} />
            <button className="apply-button" onClick={handleSaveToLocalStorage}>
              획득 개수 저장
            </button>
          </>
        ) : (
          <p>데이터가 없습니다.</p>
        )}
      </div>

      <div className="Gauge-container">
        <h2>도구 성능</h2>
        <GaugeChart toolChartData={toolChartData} />
      </div>

      <div className="chart-container">
        <h2>옵션 분석 결과</h2>
        <ToolChart toolOptions={toolOptions} toolChartData={toolChartData} />
      </div>
    </div>
  );
};

export default ArchaeologyTool;
