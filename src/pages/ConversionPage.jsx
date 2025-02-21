import React, { useEffect, useState } from 'react';
import { useFusionCalculator } from '../hooks/useFusionCalculator';
import { fetchLifeEfficiencyData } from '../services/LostArkApi';
import '../styles/ConversionPage.css';

function ConversionPage() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [activityData, setActivityData] = useState([]);
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(true);
  const [fusionResult, setFusionResult] = useState(null);

  const { calculateFusionMaterials } = useFusionCalculator();

  const powderIcon = 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_10_40.png';
  const fusionIcon = 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_86.png';

  const activityMapping = {
    '4T 식물채집(만생기 기준)': {
      normal: '들꽃',
      highGrade: '수줍은 들꽃',
      abyss: '아비도스 들꽃',
      rare: null, 
    },
    '4T 벌목(만생기 기준)': {
      normal: '목재',
      highGrade: '부드러운 목재',
      abyss: '아비도스 목재',
      rare: '튼튼한 목재',
    },
    '4T 채광(만생기 기준)': {
      normal: '철광석',
      highGrade: '묵직한 철광석',
      abyss: '아비도스 철광석',
      rare: '단단한 철광석',
    },
    '4T 수렵(만생기 기준)': {
      normal: '두툼한 생고기',
      highGrade: '다듬은 생고기',
      abyss: '아비도스 두툼한 생고기',
      rare: null, 
    },
    '4T 낚시(만생기 기준)': {
      normal: '생선',
      highGrade: '붉은 살 생선',
      abyss: '아비도스 태양 잉어',
      rare: null, 
    },
    '4T 고고학(만생기 기준)': {
      normal: '고대 유물',
      highGrade: '희귀한 유물',
      abyss: '아비도스 유물',
      rare: null, 
    },
  };

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        const data = await fetchLifeEfficiencyData();
        setActivityData(data || []);
      } catch (error) {
        console.error('생활 활동 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };
    loadActivityData();
  }, []);

  const handleActivityChange = (e) => {
    const activity = e.target.value;
    setSelectedActivity(activity);

    const selectedData = activityData.find((data) => data.name.includes(activity)) || {};
    const initialMaterials = {};
    selectedData.items?.forEach((item) => {
      initialMaterials[item.name] = {
        count: 0,
        price: item.price,
        icon: item.icon,
        bundleCount: item.bundle_count,
      };
    });

    setMaterials(initialMaterials);
  };

  const handleMaterialChange = (e, materialName) => {
    const value = parseInt(e.target.value, 10) || 0;
    setMaterials((prev) => ({
      ...prev,
      [materialName]: { ...prev[materialName], count: value },
    }));
  };

  const handleCalculate = () => {
    const result = calculateFusionMaterials({
      normal: materials[activityMapping[selectedActivity]?.normal]?.count || 0,
      highGrade: materials[activityMapping[selectedActivity]?.highGrade]?.count || 0,
      abyss: materials[activityMapping[selectedActivity]?.abyss]?.count || 0,
      rare: materials[activityMapping[selectedActivity]?.rare]?.count || 0,
    });
    setFusionResult(result);
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="conversion-page">
      <h1 className="conversion-title">생활 가루 계산기</h1>
      <h5>※ 교환가격: 아비도스 재료로 교환시 가격
      </h5>

      <div className="activity-selection">
        <label>생활 활동: </label>
        <select onChange={handleActivityChange} value={selectedActivity}>
            <option value="">활동을 선택하세요</option>
            {Object.keys(activityMapping).map((activityName) => {
            // 간단한 표시 이름 정의
            const displayName = {
                '4T 채광(만생기 기준)': '채광',
                '4T 벌목(만생기 기준)': '벌목',
                '4T 식물채집(만생기 기준)': '식물 채집',
                '4T 수렵(만생기 기준)': '수렵',
                '4T 낚시(만생기 기준)': '낚시',
                '4T 고고학(만생기 기준)': '고고학',
            }[activityName] || activityName; // 매핑에 없으면 원래 이름 사용

            return (
                <option key={activityName} value={activityName}>
                {displayName}
                </option>
            );
            })}
        </select>
        </div>

      {selectedActivity && (
        <div className="material-input">
          <h3>재료 입력</h3>
          {materials &&
            Object.entries(materials).map(([key, { count, price, icon, bundleCount }]) => {
              // 현재 선택된 활동에서 abyss 등급 재료의 이름과 시세 가져오기
              const abyssMaterialName = activityMapping[selectedActivity]?.abyss || "";
              const abyssPrice = abyssMaterialName ? (materials[abyssMaterialName]?.price || 0) : 0; // Abyss 재료 가격 가져오기

              // 환산 가격 계산 (normal: abyssPrice / 12.5, highGrade: abyssPrice / 6.25)
              let exchangePrice = '-'; // 기본값
              if (key === activityMapping[selectedActivity]?.normal) {
                exchangePrice = abyssPrice > 0 ? (abyssPrice / 12.5).toFixed(2) : '-';
              } else if (key === activityMapping[selectedActivity]?.highGrade) {
                exchangePrice = abyssPrice > 0 ? (abyssPrice / 6.25).toFixed(2) : '-';
              }

              return (
                <div className="material-row" key={key}>
                  <img src={icon} alt={key} className="material-icon" />
                  <label>
                    <input
                      type="number"
                      value={count === 0 ? "" : count}
                      placeholder="0"
                      onChange={(e) => handleMaterialChange(e, key)}
                    />
                  </label>
                  <span>가격: {Math.floor(((count / bundleCount) * price || 0).toFixed(2))}G&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  {exchangePrice !== '-' && <span> 교환가격: {Math.floor(((count / bundleCount) * exchangePrice || 0).toFixed(2))}G</span>}
                </div>
              );
            })}
        </div>
      )}

      <div className="calculate-button-container">
        <button className="calculate-button" onClick={handleCalculate}>
          계산하기
        </button>
      </div>

      {fusionResult && (
        <div className="conversion-result-container">
          <div className="conversion-result">
            <h3>최종 결과</h3>
            <p>
              <img src={fusionIcon} alt="fusion" className="fusion-icon" />
              (x10) 융화 재료 제작 횟수: {fusionResult.fusionCount}
            </p>
            <div className="remaining-materials">
              <h4>남은 재료</h4>
              {Object.entries(fusionResult.remaining)
                .filter(([key, value]) => value !== 0) // 0이 아닌 값만 필터링
                .map(([key, value]) => (
                    <div key={key}>
                    <img
                        src={
                        key === 'normal'
                            ? materials[activityMapping[selectedActivity]?.normal]?.icon
                            : key === 'highGrade'
                            ? materials[activityMapping[selectedActivity]?.highGrade]?.icon
                            : key === 'abyss'
                            ? materials[activityMapping[selectedActivity]?.abyss]?.icon
                            : key === 'rare'
                            ? materials[activityMapping[selectedActivity]?.rare]?.icon
                            : powderIcon
                        }
                        alt={key}
                        className="material-icon"
                    />
                    <span>
                        : {value}개
                    </span>
                    </div>
                ))}
            </div>
          </div>

          <div className="conversion-steps">
            <h3>생활의 가루 교환</h3>
            {fusionResult.conversionSteps
              .filter((step) => step.step === 'Summary')
              .map((summary, index) => (
                <div key={index} className="conversion-summary">

                    {summary.totalRareUsed !== 0 && (
                    <div className="conversion-step">
                        <img
                        src={materials[activityMapping[selectedActivity]?.rare]?.icon || ''}
                        alt="rare"
                        className="material-icon"
                        />
                        <span>{summary.totalRareUsed}</span>
                        <span>→</span>
                        <img
                        src={materials[activityMapping[selectedActivity]?.normal]?.icon || ''}
                        alt="normal"
                        className="material-icon"
                        />
                        <span>{summary.convertedNormal}</span>
                        <span className="strong">&nbsp; {summary.totalRareUsed / 5}번 교환</span>
                    </div>
                    )}
                  <div className="conversion-step">
                    <img
                      src={materials[activityMapping[selectedActivity]?.normal]?.icon || ''}
                      alt="Normal"
                      className="material-icon"
                    />
                    <span>{summary.totalNormalUsed}</span>
                    <span>→</span>
                    <img src={powderIcon} alt="Powder" className="material-icon" />
                    <span>{summary.totalNormalUsed * 0.8}</span>
                    <span className='strong'> &nbsp; {summary.totalNormalUsed/100}번 교환 </span>
                  </div>
                  <div className="conversion-step">
                    <img
                      src={materials[activityMapping[selectedActivity]?.highGrade]?.icon || ''}
                      alt="HighGrade"
                      className="material-icon"
                    />
                    <span>{summary.totalHighGradeUsed}</span>
                    <span>→</span>
                    <img src={powderIcon} alt="Powder" className="material-icon" />
                    <span>{summary.totalHighGradeUsed * 1.6}</span>
                    <span className='strong'> &nbsp; {summary.totalHighGradeUsed/50}번 교환 </span>
                  </div>
                  <div className="conversion-step">
                    <img src={powderIcon} alt="Powder" className="material-icon" />
                    <span>{summary.totalPowderGenerated}</span>
                    <span>→</span>
                    <img
                      src={materials[activityMapping[selectedActivity]?.abyss]?.icon || ''}
                      alt="abyss"
                      className="material-icon"
                    />
                    <span>{summary.totalAbyssGained}</span>
                    <span className='strong'> &nbsp; {summary.totalAbyssGained/10}번 교환 </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConversionPage;
