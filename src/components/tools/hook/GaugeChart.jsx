import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "../styles/GaugeChart.css"; // 스타일 분리

const GaugeChart = ({ toolChartData }) => {
  const chartRef = useRef(null); // 차트 DOM 요소를 참조
  const [isVisible, setIsVisible] = useState(false); // 렌더링 활성화 여부
  const [currentPercentage, setCurrentPercentage] = useState(0); // 애니메이션 상태

  // 최대값 계산
  const referenceData = [
    { name: "목재", count: 752 },
    { name: "부드러운 목재", count: 376 },
    { name: "튼튼한 목재", count: 168 },
    { name: "아비도스 목재", count: 168 },

    { name: "고대 유물", count: 800 },
    { name: "희귀한 유물", count: 400 },
    { name: "진귀한 유물", count: 196 },
    { name: "아비도스 유물", count: 196 },

    { name: "철광석", count: 752 },
    { name: "묵직한 철광석", count: 376 },
    { name: "단단한 철광석", count: 168 },
    { name: "아비도스 철광석", count: 168 },

    { name: "두툼한 생고기", count: 757 },
    { name: "다듬은 생고기", count: 378 },
    { name: "진귀한 가죽", count: 169 },
    { name: "아비도스 두툼한 생고기", count: 169 },

    { name: "들꽃", count: 701 },
    { name: "수줍은 들꽃", count: 350 },
    { name: "화사한 들꽃", count: 157 },
    { name: "아비도스 들꽃", count: 157 },

    { name: "생선", count: 757 },
    { name: "붉은 살 생선", count: 378 },
    { name: "아비도스 태양 잉어", count: 169 }
  ];

  const maxTotalPrice = referenceData.reduce((sum, refItem) => {
    const matchedItem = toolChartData?.find((item) => item.name === refItem.name);
    const price = matchedItem?.price || 0;
    return sum + (refItem.count * price) / 100;
  }, 0);

  const receivedTotalPrice = toolChartData
    ? toolChartData.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    : 0;

  const percentage = maxTotalPrice ? (receivedTotalPrice / maxTotalPrice) * 100 : 0;

  // Intersection Observer를 사용하여 화면에 보이는지 확인
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // 화면에 보이면 200ms 후 렌더링 활성화
          setTimeout(() => setIsVisible(true), 200);
          observer.disconnect(); // 한 번 감지되면 관찰 중단
        }
      },
      { threshold: 0.2 } // 20%가 화면에 보이면 트리거
    );

    if (chartRef.current) observer.observe(chartRef.current);

    return () => observer.disconnect(); // 클린업
  }, []);

  // 애니메이션 설정
  useEffect(() => {
    if (isVisible) {
      setCurrentPercentage(0); // 애니메이션 초기화
      let animationFrame;
      const animate = () => {
        setCurrentPercentage((prev) => {
          if (prev < percentage) {
            animationFrame = requestAnimationFrame(animate);
            return Math.min(prev + 1, percentage); // 점진적으로 증가
          }
          return prev;
        });
      };
      animate();
      return () => cancelAnimationFrame(animationFrame); // 정리
    }
  }, [isVisible, percentage, toolChartData]); // 종속성 추가

  // 선의 총 길이 계산
  const totalLength = Math.PI * 2 * 45; // 반지름 45 기준

  // 상태 메시지 결정
  const getStatusMessage = () => {
    if (currentPercentage <= 20) return "민지 사망";
    if (currentPercentage <= 35) return "보통";
    if (currentPercentage <= 50) return "쓸만해요";
    if (currentPercentage <= 65) return "좋아요";
    if (currentPercentage <= 75) return "준종결";
    return "민지칼리버!";
  };

  // 막대 색상 결정
  const getBarColor = () => {
    if (currentPercentage <= 20) return "#f43545"; // 빨간색
    if (currentPercentage <= 35) return "#ff8901"; // 주황
    if (currentPercentage <= 50) return "#ffd85c"; // 노랑
    if (currentPercentage <= 65) return "#82ca9d"; // 초록
    if (currentPercentage <= 75) return "rgba(136, 132, 216)"; // 파랑
    return "#00418d"; // 남색 
  };

  return (
    <div className="gauge-chart-container" ref={chartRef}>
      {isVisible && ( // 화면에 보일 때만 렌더링
        <div className="gauge-chart">
          <svg width="200" height="110" viewBox="0 0 200 110">
            {/* 배경 아크 */}
            <path
              d="M 10 100 A 90 90 0 0 1 190 100"
              className="gauge-path-background"
            />
            {/* 값에 따른 아크 */}
            <path
              d="M 10 100 A 90 90 0 0 1 190 100"
              className="gauge-path-foreground"
              style={{
                stroke: getBarColor(), // 동적 색상 설정
                strokeDasharray: totalLength, // 선의 총 길이
                strokeDashoffset:
                  totalLength - (totalLength * currentPercentage) / 100, // 애니메이션 효과
              }}
            />
            {/* 중앙 텍스트 */}
            <text x="100" y="70" className="gauge-percentage">
              {Math.round(currentPercentage)}%
            </text>
            {/* 상태 메시지 */}
            <text x="100" y="95" className="gauge-status">
              {getStatusMessage()}
            </text>
          </svg>
        </div>
      )}
      <p className="gauge-chart-info">
        현재: {receivedTotalPrice.toLocaleString()} G / 최대:{" "}
        {maxTotalPrice.toLocaleString()} G
      </p>
    </div>
  );
};

GaugeChart.propTypes = {
  toolChartData: PropTypes.array,
};

export default GaugeChart;
