import { useState } from 'react';

export const useFusionCalculator = () => {
  const [conversionSteps, setConversionSteps] = useState([]);
  const [fusionCount, setFusionCount] = useState(0);
  const [remainingMaterials, setRemainingMaterials] = useState({});

  const calculateFusionMaterials = (initialMaterials) => {
    const conversionRates = {
      toFusion: { normal: 86, highGrade: 45, abyss: 33 },
      toPowder: { normal: 100, highGrade: 50 },
      toAbyss: 100,
      rareToNormal: { rare: 5, normal: 50 },
    };

    let { normal, highGrade, abyss, rare } = initialMaterials;
    let powder = 0;
    let fusionCount = 0;
    let conversionSteps = [];
    let totalPowderGenerated = 0; // 누적된 생활의 가루 생성량
    let totalNormalUsed = 0; // 누적된 일반 재료 사용량
    let totalHighGradeUsed = 0; // 누적된 고급 재료 사용량
    let totalAbyssGained = 0; // 누적된 아비도스 재료 생성량
    let totalRareUsed = 0;
    let convertedNormal = 0;

    // 1. 희귀 재료 → 일반 재료 변환
    if (rare > 0) {
      totalRareUsed = Math.floor(rare / conversionRates.rareToNormal.rare) * 5;
      convertedNormal = totalRareUsed * 10;

      rare %= conversionRates.rareToNormal.rare; // 희귀 재료 남은 양
      normal += convertedNormal;

    }

    // 2. 초기 제작
    let initialMinFusion = Math.min(
      Math.floor(normal / conversionRates.toFusion.normal),
      Math.floor(highGrade / conversionRates.toFusion.highGrade),
      Math.floor(abyss / conversionRates.toFusion.abyss)
    );

    fusionCount += initialMinFusion;
    normal -= initialMinFusion * conversionRates.toFusion.normal;
    highGrade -= initialMinFusion * conversionRates.toFusion.highGrade;
    abyss -= initialMinFusion * conversionRates.toFusion.abyss;

    conversionSteps.push({
      step: "Initial Fusion",
      count: initialMinFusion,
    });

    // 3. 추가 제작   
    while (true) {
      // 생활의 가루 생성 가능 여부 판단
      if (normal >= 186 || highGrade >= 95) {

        // 생활의 가루 생성
        const powderGenerated = 80; // 생활 가루 고정 생성량
        if (normal >= 186 && normal / conversionRates.toPowder.normal >= highGrade / conversionRates.toPowder.highGrade) {
          const normalUsed = conversionRates.toPowder.normal; // 한 번만 변환
          normal -= normalUsed;
          powder += powderGenerated;
          totalPowderGenerated += powderGenerated;
  
          totalNormalUsed += normalUsed;

        } else if (highGrade >= 95) {
          const highGradeUsed = conversionRates.toPowder.highGrade; // 한 번만 변환
          highGrade -= highGradeUsed;
          powder += powderGenerated;
          totalPowderGenerated += powderGenerated;
  
          totalHighGradeUsed += highGradeUsed;
        }
      }

      // 아비도스 재료 변환
      if (powder > 100)
      {
        const powderUsed = Math.floor( powder / conversionRates.toAbyss) * 100;
        const abyssGained = powderUsed / 10;
        abyss += abyssGained;
        totalAbyssGained += abyssGained;
        powder -= powderUsed;
      }

      // 추가 융합 재료 제작
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

      } else if (normal < 187 && highGrade < 96) {
        // 종료 조건: 생활의 가루 생성도 불가능
        break;
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

    // 결과 저장
    setFusionCount(fusionCount);
    setRemainingMaterials({ normal, highGrade, abyss, rare });
    setConversionSteps(conversionSteps);

    return { fusionCount, remaining: { normal, highGrade, abyss, rare }, conversionSteps };
  };

  return { calculateFusionMaterials, conversionSteps, fusionCount, remainingMaterials };
};
