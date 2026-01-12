import { useState } from 'react';

export const useFusionCalculator = () => {
  const [conversionSteps, setConversionSteps] = useState([]);
  const [fusionCount, setFusionCount] = useState(0);
  const [remainingMaterials, setRemainingMaterials] = useState({});

  // targetType이 추가된 파라미터 구조
  const calculateFusionMaterials = (initialMaterials) => {

    // 1. 제작 목표에 따른 레시피 설정 (targetType: 'abydos' | 'superior_abydos')
    const targetType = initialMaterials.targetType || 'abydos';

    const RECIPES = {
      abydos: { normal: 86, highGrade: 45, abyss: 33 },          // 일반 아비도스
      superior_abydos: { normal: 112, highGrade: 59, abyss: 43 } // 상급 아비도스
    };

    const currentRecipe = RECIPES[targetType] || RECIPES['abydos'];

    const conversionRates = {
      toFusion: currentRecipe, // 선택된 레시피 적용
      toPowder: { normal: 100, highGrade: 50 },
      toAbyss: 100,
      rareToNormal: { rare: 5, normal: 50 },
    };

    // 2. 가루 변환 기준점 계산 (동적 Threshold)
    // 설명: (가루로 바꿀 재료 100개) + (융화재료 1회 제작분) 이상이 있어야 가루로 바꾼다는 논리
    const thresholdNormal = conversionRates.toPowder.normal + conversionRates.toFusion.normal;     // 예: 일반(186), 상급(212)
    const thresholdHighGrade = conversionRates.toPowder.highGrade + conversionRates.toFusion.highGrade; // 예: 일반(95), 상급(109)

    let { normal, highGrade, abyss, rare } = initialMaterials;
    let powder = 0;
    let fusionCount = 0;
    let conversionSteps = [];

    // 통계용 변수
    let totalPowderGenerated = 0;
    let totalNormalUsed = 0;
    let totalHighGradeUsed = 0;
    let totalAbyssGained = 0;
    let totalRareUsed = 0;
    let convertedNormal = 0;

    // --- [로직 시작] ---

    // 1. 희귀 재료 → 일반 재료 변환 (비율 1:10) - *게임 내 교환 비율 확인 필요(보통 가루로 안바꾸고 교환하면 효율 낮음)*
    // 작성해주신 기존 로직 유지 (희귀 5개 -> 일반 50개)
    if (rare > 0) {
      totalRareUsed = Math.floor(rare / conversionRates.rareToNormal.rare) * 5;
      convertedNormal = totalRareUsed * 10; // 결과적으로 희귀 1개당 일반 10개

      rare %= conversionRates.rareToNormal.rare;
      normal += convertedNormal;
    }

    // 2. 초기 제작 (가루 변환 전, 있는 재료로 최대한 만들기)
    let initialMinFusion = Math.min(
      Math.floor(normal / conversionRates.toFusion.normal),
      Math.floor(highGrade / conversionRates.toFusion.highGrade),
      Math.floor(abyss / conversionRates.toFusion.abyss)
    );

    if (initialMinFusion > 0) {
      fusionCount += initialMinFusion;
      normal -= initialMinFusion * conversionRates.toFusion.normal;
      highGrade -= initialMinFusion * conversionRates.toFusion.highGrade;
      abyss -= initialMinFusion * conversionRates.toFusion.abyss;

      conversionSteps.push({
        step: "Initial Fusion",
        count: initialMinFusion,
      });
    }

    // 3. 추가 제작 루프 (가루 교환 포함)
    while (true) {
      // 생활의 가루 생성 가능 여부 판단 (동적 기준점 사용)
      if (normal >= thresholdNormal || highGrade >= thresholdHighGrade) {

        const powderGenerated = 80; // 생활 가루 고정 생성량

        // 일반 재료가 충분하고, 일반 재료 효율이 더 좋거나 같을 때
        // (단순화된 비교 로직: 현재 수량이 기준점 이상인 쪽을 우선 소모하되, 둘 다 많으면 비율 계산)
        if (normal >= thresholdNormal && (normal / conversionRates.toPowder.normal) >= (highGrade / conversionRates.toPowder.highGrade)) {
          const normalUsed = conversionRates.toPowder.normal;
          normal -= normalUsed;
          powder += powderGenerated;
          totalPowderGenerated += powderGenerated;
          totalNormalUsed += normalUsed;

        } else if (highGrade >= thresholdHighGrade) {
          const highGradeUsed = conversionRates.toPowder.highGrade;
          highGrade -= highGradeUsed;
          powder += powderGenerated;
          totalPowderGenerated += powderGenerated;
          totalHighGradeUsed += highGradeUsed;
        }
      }

      // 아비도스 재료 변환 (가루 -> 아비도스 재료)
      if (powder >= 100) { // 100 이상일 때만 교환
        const powderUsed = Math.floor(powder / conversionRates.toAbyss) * 100;
        const abyssGained = (powderUsed / 100) * 10; // 100가루당 10개
        abyss += abyssGained;
        totalAbyssGained += abyssGained;
        powder -= powderUsed;
      }

      // 추가 융화 재료 제작
      const minFusion = Math.min(
        Math.floor(normal / conversionRates.toFusion.normal),
        Math.floor(highGrade / conversionRates.toFusion.highGrade),
        Math.floor(abyss / conversionRates.toFusion.abyss)
      );

      if (minFusion >= 1) {
        fusionCount += minFusion;
        normal -= minFusion * conversionRates.toFusion.normal;
        highGrade -= minFusion * conversionRates.toFusion.highGrade;
        abyss -= minFusion * conversionRates.toFusion.abyss;

      } else {
        // 종료 조건: 더 이상 제작도 안 되고, 가루 생성도 불가능한 경우
        if (normal < thresholdNormal && highGrade < thresholdHighGrade) {
          break;
        }
        // 제작은 안 되지만 가루 생성은 가능한 경우(아비도스 재료가 부족한 상황 등)는 루프를 다시 돕니다.
        // 무한 루프 방지를 위해, 재료가 변하지 않으면 break 하는 안전장치가 있으면 좋지만,
        // 위 로직상 가루 생성이 되면 반드시 재료가 줄어들므로 수렴합니다.
      }
    }

    // 요약 결과 추가
    conversionSteps.push({
      step: "Summary",
      totalNormalUsed,
      totalHighGradeUsed,
      totalPowderGenerated,
      totalAbyssGained,
      totalRareUsed,
      convertedNormal,
    });

    // 결과 상태 업데이트
    setFusionCount(fusionCount);
    setRemainingMaterials({ normal, highGrade, abyss, rare });
    setConversionSteps(conversionSteps);

    return { fusionCount, remaining: { normal, highGrade, abyss, rare }, conversionSteps };
  };

  return { calculateFusionMaterials, conversionSteps, fusionCount, remainingMaterials };
};