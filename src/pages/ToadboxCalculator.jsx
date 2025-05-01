import { useEffect, useState } from "react";
import { fetchToadboxData } from '../services/LostArkApi';
import "../styles/toadbox.css"; // 예: /src/styles/toadbox.css
import AdComponent from '../components/AdComponent';



export default function ToadboxCalculator() {
  const [data, setData] = useState(null);
  const [excluded, setExcluded] = useState({});
  const [applyFee, setApplyFee] = useState(false);
  const [manualPrices, setManualPrices] = useState({
    "야금술 : 업화 [15-18]": "",
    "재봉술 : 업화 [15-18]": ""
  });
  

  useEffect(() => {
    fetchToadboxData().then((res) => {
      setData(res);
    });
  }, []);

  const handleManualPriceChange = (itemName, value) => {
    setManualPrices((prev) => ({
      ...prev,
      [itemName]: Number(value) || 0
    }));
  };
  

  const handleToggle = (boxKey, itemName) => {
    setExcluded((prev) => {
      const key = `${boxKey}::${itemName}`;
      const updated = { ...prev };
      if (updated[key]) {
        delete updated[key];
      } else {
        updated[key] = true;
      }
      return updated;
    });
  };

  const calculateEV = (items, boxKey) => {
    let ev = items.reduce((sum, item) => {
      const key = `${boxKey}::${item.name}`;
      if (excluded[key]) return sum;
      const rawPrice = item.price > 0 ? item.price : manualPrices[item.name] || 0;
      const unitPrice = rawPrice / item.bundle_count;
      return sum + unitPrice * item.count * item.probability;
    }, 0);
    return Math.floor(applyFee ? ev * 0.95 : ev);
  };
  

  if (!data) return <div className="loading-container">데이터 불러오는 중...</div>;

  const boxes = data.boxes;
  const prices = {
    engraving_box: 20000,
    reagent_box_1: 400,
    reagent_box_2: 800,
  };

  return (
    <div>
      <div className="top-ad-container">
        <AdComponent
          className="horizontal-ad"
          adClient="ca-pub-4349329556962059"
          adSlot="8783003456"
          adType="horizontal"
        />
      </div>
    
      <div className="page-container">
        <h1 className="page-title">골두꺼비 기댓값 계산기 (1분 갱신)</h1>
        <p className="page-subtitle">
          ※ 재련 상자는 원하지 않는 항목을 제외할 수 있어요. <br/>
          <span className="red">
          ※ 재련 랜덤 상자 2  | 야금술 : 업화 [15 - 18] 재봉술 : 업화 [15 - 18] 누락됨 <br/>
          &nbsp; ㄴ 직접 추가 가능 (인게임 거래소 참고)
          </span>
        </p>


        <label style={{ fontSize: '14px', marginBottom: '20px', display: 'inline-block' }}>
          <input type="checkbox" checked={applyFee} onChange={() => setApplyFee(!applyFee)} style={{ marginRight: '6px' }} />
          거래소 수수료 5% 적용 &nbsp; ( 최종 적용 | 세세한 계산 X ) <br />
        </label>

        {Object.entries(boxes).map(([key, box]) => {
          if (key === "reagent_box_2") {
            const manualItemNames = ["야금술 : 업화 [15-18]", "재봉술 : 업화 [15-18]"];
            const alreadyAdded = box.items.some(item => manualItemNames.includes(item.name));
            
            if (!alreadyAdded) {
              const manualItems = [
                {
                  name: "야금술 : 업화 [15-18]",
                  icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_218.png",
                  price: manualPrices["야금술 : 업화 [15-18]"],
                  bundle_count: 1,
                  count: 1,
                  probability: 0.005682
                },
                {
                  name: "재봉술 : 업화 [15-18]",
                  icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_219.png",
                  price: manualPrices["재봉술 : 업화 [15-18]"],
                  bundle_count: 1,
                  count: 1,
                  probability: 0.028409
                }
              ];
              box.items = [...box.items, ...manualItems];
            }
          }
          const ev = calculateEV(box.items, key);
          const price = prices[key];
          const efficiency = price ? Math.round(((ev - price) / price) * 100) : 0;

          const isEngraving = key === "engraving_box";
          const boxTitle = isEngraving
            ? "유물 각인서 랜덤 주머니"
            : key === "reagent_box_1"
            ? "재련 랜덤 상자 I"
            : "재련 랜덤 상자 II";

          return (
            <div key={key} style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "bold" }}> {boxTitle}</h2>
              <p style={{ marginBottom: "10px" }}>
                기댓값: <b>{ev.toLocaleString()}</b> G / 가격: {price.toLocaleString()} G / 효율: <b>{efficiency > 0 ? `+${efficiency}%` : `${efficiency}%`}</b>
              </p>
              <div className={`item-list ${isEngraving ? 'engraving-hidden' : ''}`}>
                {box.items.map((item) => {
                  const isChecked = !excluded[`${key}::${item.name}`];
                  const showCheckbox = box.type === "reagents";

                  return (
                    <div key={item.name} className="item-card">
                      {showCheckbox && (
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggle(key, item.name)}
                          /> 포함
                        </label>
                      )}
                      <img src={item.icon} alt={item.name} className="item-icon" />
                      <span className="item-name">
                      {item.name}
                      <br />
                      <span style={{ fontSize: '12px', color: '#888' }}>
                        {item.price > 0 ? (
                          <>
                            {Math.floor((item.price / item.bundle_count) * item.count).toLocaleString()} G <br />
                            {(item.probability * 100).toFixed(2)}%
                          </>
                        ) : (
                          <>
                            <input
                              type="number"
                              value={manualPrices[item.name]}
                              onChange={(e) => handleManualPriceChange(item.name, e.target.value)}
                              placeholder="0G"
                              className="manual-input"
                            />
                            <br />
                            {(item.probability * 100).toFixed(2)}%
                          </>
                        )}
                      </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      <br/>
      <AdComponent
        className="horizontal-ad"
        adClient="ca-pub-4349329556962059"
        adSlot="5655624736"
        adType="horizontal"
      />
      </div>
    </div>
  );
}
