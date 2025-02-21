import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const ToolChart = ({ toolOptions }) => {
  const chartRef = useRef(null); // 차트 DOM 요소를 참조
  const [isVisible, setIsVisible] = useState(false); // 렌더링 활성화 여부

  // 최대값 정의
  const maxOptions = {
    보물주머니등장확률: 100,
    나무차기보상획득률: 50,
    나무차기기회획득확률: 50,
    전체등급재료획득률: 16.7,
    희귀등급재료획득률: 50,
    고급등급재료획득률: 50,
    일반등급재료획득률: 50,
    미니게임보상획득률: 50,
    미니게임기회획득확률: 50,
    보물상자등장확률: 100,
    풀스윙기회획득확률: 50,
    풀스윙보상획득률: 50,
    골든핑거보상획득확률: 9.8
  };

  // 데이터를 차트에 맞게 변환
  const chartData = Object.keys(toolOptions)
    .filter((key) => toolOptions[key] !== null && toolOptions[key] !== 0)
    .map((key) => ({
      name: key.replace(/_/g, " "), // 옵션 이름
      최댓값: maxOptions[key] || 0, // 최대값
      현재값: toolOptions[key] || 0, // 현재값
    }));

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
            // 화면에 보이면 500ms 후 렌더링 활성화
            setTimeout(() => setIsVisible(true), 200);
          observer.disconnect(); // 한 번 트리거되면 다시 감지하지 않음
        }
      },
      { threshold: 0.2 } // 20%가 화면에 보이면 트리거
    );

    if (chartRef.current) observer.observe(chartRef.current);

    return () => observer.disconnect(); // 클린업
  }, []);

  return (
    <div className="tool-chart" ref={chartRef}>
      <h3>도구 옵션 분석 (최댓값 & 현재값)</h3>
      {/* 화면에 보일 때만 차트를 렌더링 */}
      {isVisible && (
        <BarChart
          width={900}
          height={300}
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* 최대값을 투명한 배경으로 표시 */}
          <Bar dataKey="최댓값" fill="#82ca9d" stackId="stack" animationDuration={1500} />
          {/* 현재값을 그 위에 덮어 표시 */}
          <Bar dataKey="현재값" fill="rgba(136, 132, 216, 0.2)" animationDuration={1500} />
        </BarChart>
      )}
    </div>
  );
};

ToolChart.propTypes = {
  toolOptions: PropTypes.object.isRequired,
};

export default ToolChart;
