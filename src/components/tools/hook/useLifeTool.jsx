import { useState, useMemo, useCallback } from "react";

const useLifeTool = (initialOptions = {}, 기본값 = {}) => {
  const 기본값초기화 = useMemo(
    () => ({
      일반등급: { 기본: 0, 증가량: 0, ...기본값.일반등급 },
      고급등급: { 기본: 0, 증가량: 0, ...기본값.고급등급 },
      희귀등급: { 기본: 0, 증가량: 0, ...기본값.희귀등급 },
      추가옵션1: { 기본: 0, 증가량: 0, ...기본값.추가옵션1 },
      추가옵션2: {
        일반: { 기본: 0, 증가량: 0, ...기본값.추가옵션2?.일반 },
        고급: { 기본: 0, 증가량: 0, ...기본값.추가옵션2?.고급 },
        희귀: { 기본: 0, 증가량: 0, ...기본값.추가옵션2?.희귀 },
      },
      추가옵션3: { 기본: 0, 증가량: 0, ...기본값.추가옵션3 },
      추가옵션평균: {
        일반: 0,
        고급: 0,
        희귀: 0,
        ...기본값.추가옵션평균,
      },
    }),
    [기본값]
  );

  const [userOptions, setUserOptions] = useState({
    일반등급보상: 0,
    고급등급보상: 0,
    희귀등급보상: 0,
    전체등급보상: 0,
    추가옵션1: 0,
    추가옵션2: 0,
    추가옵션3: 0,
    부적: "없음",
    레벨: 0,
    ...initialOptions,
  });

  const calculateFinalOptions = (options) => {
    const 부적옵션 = {
      유물: 30,
      전설: 22.5,
      영웅: 15,
      희귀: 7.5,
      없음: 0,
    };

    const 레벨옵션계산 = (level) => {
      const base = 8.5;
      const increment = 0.85;
      return level === 0 ? 0 : base + Math.floor(Math.max(level - 30, 0) / 3) * increment;
    };

    return {
      일반:
        options.일반등급보상 +
        options.전체등급보상 +
        부적옵션[options.부적] +
        레벨옵션계산(options.레벨),
      고급:
        options.고급등급보상 +
        options.전체등급보상 +
        부적옵션[options.부적] +
        레벨옵션계산(options.레벨),
      희귀:
        options.희귀등급보상 +
        options.전체등급보상 +
        부적옵션[options.부적] +
        레벨옵션계산(options.레벨),
      추가옵션1: options.추가옵션1,
      추가옵션2: options.추가옵션2,
      추가옵션3: options.추가옵션3,
    };
  };

  const calculateFinalRewards = useCallback(
    (finalOptions) => {
      const 추가옵션1결과 =
        기본값초기화.추가옵션1.기본 +
        기본값초기화.추가옵션1.증가량 * finalOptions.추가옵션1;

      const 추가옵션2결과 = {
        일반:
          (기본값초기화.추가옵션2.일반.기본 +
            기본값초기화.추가옵션2.일반.증가량 * finalOptions.추가옵션2) *
          추가옵션1결과,
        고급:
          (기본값초기화.추가옵션2.고급.기본 +
            기본값초기화.추가옵션2.고급.증가량 * finalOptions.추가옵션2) *
          추가옵션1결과,
        희귀:
          (기본값초기화.추가옵션2.희귀.기본 +
            기본값초기화.추가옵션2.희귀.증가량 * finalOptions.추가옵션2) *
          추가옵션1결과,
      };

      const 추가옵션3결과 =
        기본값초기화.추가옵션3.기본 +
        기본값초기화.추가옵션3.증가량 * finalOptions.추가옵션3;

      const 추가옵션3보상 = {
        일반: 추가옵션3결과 * 기본값초기화.추가옵션평균.일반,
        고급: 추가옵션3결과 * 기본값초기화.추가옵션평균.고급,
        희귀: 추가옵션3결과 * 기본값초기화.추가옵션평균.희귀,
      };

      return {
        일반:
          기본값초기화.일반등급.기본 +
          기본값초기화.일반등급.증가량 * finalOptions.일반 +
          추가옵션2결과.일반 +
          추가옵션3보상.일반,
        고급:
          기본값초기화.고급등급.기본 +
          기본값초기화.고급등급.증가량 * finalOptions.고급 +
          추가옵션2결과.고급 +
          추가옵션3보상.고급,
        희귀:
          기본값초기화.희귀등급.기본 +
          기본값초기화.희귀등급.증가량 * finalOptions.희귀 +
          추가옵션2결과.희귀 +
          추가옵션3보상.희귀,
      };
    },
    [기본값초기화]
  );

  const 기본옵션결과 = useMemo(() => {
    const defaultOptions = calculateFinalOptions({
      일반등급보상: 0,
      고급등급보상: 0,
      희귀등급보상: 0,
      전체등급보상: 0,
      추가옵션1: 0,
      추가옵션2: 0,
      추가옵션3: 0,
      부적: "없음",
      레벨: 0,
    });
    return calculateFinalRewards(defaultOptions);
  }, [calculateFinalRewards]);

  const 도구옵션결과 = useMemo(() => {
    const toolOptions = calculateFinalOptions({
      ...userOptions,
      부적: "없음",
      레벨: 0,
    });
    return calculateFinalRewards(toolOptions);
  }, [userOptions, calculateFinalRewards]);

  const 결과 = useMemo(() => {
    const finalOptions = calculateFinalOptions(userOptions);
    const finalRewards = calculateFinalRewards(finalOptions);

    const 도구추가획득량 = {
      일반: 도구옵션결과.일반 - 기본옵션결과.일반,
      고급: 도구옵션결과.고급 - 기본옵션결과.고급,
      희귀: 도구옵션결과.희귀 - 기본옵션결과.희귀,
    };

    return { 최종획득량: finalRewards, 도구추가획득량 };
  }, [userOptions, calculateFinalRewards, 기본옵션결과, 도구옵션결과]);

  return { 결과, setUserOptions };
};

export default useLifeTool;
