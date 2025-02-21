import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useLifeTool from "./hook/useLifeTool"; // 재사용 가능한 훅
import "./styles/Tool.css";
import CombinedInput from "./input/CombinedInput";
import ResultBox from "./input/ResultBox";
import ResultTable from "./input/ResultTable"; // ResultTable 컴포넌트 추가
import { fetchLifeEfficiencyData } from "../../services/LostArkApi"; // API 호출 파일
import ToolChart from "./hook/ToolChart"; // 차트 컴포넌트 추가
import GaugeChart from "./hook/GaugeChart"; // 📌 새롭게 추가된 게이지 차트

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
  const [toolChartData, setToolChartData] = useState(null); // 🔹 차트 데이터 상태 추가

   // 추가옵션2 값 동적 계산 로직
  const calculateAdditionalOptions = (specialFrequency) => {
    const 일반보상 = 54;
  
    // 기본 특수 채집물 빈도를 사용자 입력으로 대체
    const 발생빈도 = specialFrequency / 100;
  
    // 기본 보상 계산
    const 기본보상 =
    (일반보상 + 일반보상 * 발생빈도);
    // 추가 보상 계산
    const 추가보상 =
      기본보상 * 0.01;
  
    return {
      일반: { 기본: 기본보상, 증가량: 추가보상 }, // 일반
      고급: { 기본: 기본보상*0.5, 증가량: 추가보상 * 0.5 }, // 고급 (50%)
      희귀: { 기본: 기본보상*0.2, 증가량: 추가보상 * 0.2 }, // 희귀 (20%)
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
      추가옵션평균: {
        일반: 54,
        고급: 27,
        희귀: 10.8,
      },
    }
  );

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const [lumberingData, setLumberingData] = useState(null); // 벌목 데이터 상태

  // 데이터 가져오기 및 초기화
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
              count: 0, // 획득 개수를 0으로 설정
              total_price: 0, // 초기 total_price도 0으로 설정
            })),
            total_gold: 0, // 초기 총합 골드도 0으로 설정
          }
        : null;

      setLumberingData(updatedData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // 데이터 매핑 함수
  const mapResultData = (data) => {
    if (!data) return null;

    return {
      "고대 유물": data.일반 || 0,
      "희귀한 유물": data.고급 || 0,
      "진귀한 유물": data.희귀 || 0,
      "아비도스 유물": data.희귀 || 0, // 희귀 항목을 아비도스 목재에도 매핑
    };
  };

// 📌 테이블 업데이트 핸들러 (선택된 박스 데이터 적용, ToolChart는 항상 도구추가획득량 사용)
const handleResultBoxClick = (mappedData) => {
  if (!mappedData || !lumberingData) return;

  // 선택된 박스 데이터를 기반으로 `lumberingData` 업데이트
  const updatedItems = lumberingData.items.map((item) => {
    const mappedValue = mappedData[item.name]; // 선택된 박스 데이터 적용
    const updatedCount = Math.floor(mappedValue || 0); // 값이 없으면 0 처리
    const updatedTotalPrice = Math.floor(
      (updatedCount * (item.price || 0)) / 100 // 가격 계산
    );

    return {
      ...item,
      count: updatedCount,
      total_price: updatedTotalPrice,
    };
  });

  const updatedTotalGold = updatedItems.reduce(
    (sum, item) => sum + item.total_price,
    0
  );

  // 📌 `lumberingData`는 선택된 박스 데이터로 업데이트 (유지)
  setLumberingData({
    ...lumberingData,
    items: updatedItems,
    total_gold: updatedTotalGold,
  });

  // 📌 ToolChart에는 항상 `도구추가획득량`을 기준으로 데이터 생성
  const toolChartMappedData = mapResultData(결과?.도구추가획득량);
  const toolChartItems = lumberingData.items.map((item) => ({
    name: item.name, // 목재, 부드러운 목재, 튼튼한 목재, 아비도스 목재
    count: Math.floor(toolChartMappedData[item.name] || 0), // 도구추가획득량 기준
    price: item.price, // 개별 가격
    totalPrice: Math.floor(
      (Math.floor(toolChartMappedData[item.name] || 0) * (item.price || 0)) / 100
    ),
  }));

  // 📌 `ToolChart`에 전달할 데이터 저장 (항상 도구추가획득량 기준)
  setToolChartData(toolChartItems);
};

  // 제출 핸들러
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

  // 로컬 스토리지 저장 핸들러
  const handleSaveToLocalStorage = () => {
    if (!lumberingData) return;
  
    // 기존 로컬 스토리지 데이터 가져오기
    const existingData = JSON.parse(localStorage.getItem("userInput")) || {};
  
    // 새로운 고고학 데이터 생성
    const updatedArchaeologyData = lumberingData.items.reduce((acc, item) => {
      acc[`4T 고고학(만생기 기준)-${item.name}`] = item.count;
      return acc;
    }, {});
  
    // 기존 데이터에 새로운 고고학 데이터 병합
    const updatedData = {
      ...existingData, // 기존 데이터 유지
      ...updatedArchaeologyData, // 고고학 데이터 덮어쓰기
    };
  
    // 병합된 데이터를 로컬 스토리지에 저장
    localStorage.setItem("userInput", JSON.stringify(updatedData));
  
    alert(
      "데이터가 저장되었습니다! \n생활 효율 페이지에서 비교 \n쿠키 관리 페이지에서 관리 가능합니다!"
    );
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
      {/* 📌 게이지 차트 추가 */}
      <div className="Gauge-container">
        <h2>도구 성능</h2>
        <GaugeChart toolChartData={toolChartData} />
      </div>      
      {/* 차트 추가 */}
      <div className="chart-container">
        <h2>옵션 분석 결과</h2>
        <ToolChart toolOptions={toolOptions} toolChartData={toolChartData} />
      </div>      
    </div>
  );
};

export default ArchaeologyTool;
