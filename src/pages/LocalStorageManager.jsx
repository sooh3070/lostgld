import React, { useState, useEffect } from "react";
import "../styles/LocalStorageManager.css";
import AdComponent from '../components/AdComponent'; // 광고 컴포넌트 추가

const LocalStorageManager = () => {
  const [localStorageData, setLocalStorageData] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("userInput");
    // 로컬 스토리지 데이터를 줄바꿈(\n)으로 변환
    const formattedData = storedData ? storedData.replace(/,/g, "\n") : "";
    setLocalStorageData(formattedData);
  }, []);

  const handleClearStorage = () => {
    localStorage.removeItem("userInput");
    setLocalStorageData("");
  };

  const handleEditValue = (newValue) => {
    // 줄바꿈을 ,로 변환하여 저장
    const formattedData = newValue.replace(/\n/g, ",");
    localStorage.setItem("userInput", formattedData);
    setLocalStorageData(newValue); // 줄바꿈 형태로 상태 저장
  };

  return (
    <div>
    {/* 상단 광고 영역 */}
    <div className="top-ad-container">
      <AdComponent
         className="horizontal-ad"
         adClient="ca-pub-4349329556962059"
          adSlot="8783003456"
          adType="horizontal"  
       />
    </div>

    <div className="page-container">
      <h1 className="page-title">로컬 스토리지 관리</h1>
      <h5>컨테이너 안에 텍스트를 복사, 붙여넣기 | 쿠키가 사라졌을 때 대처할 수 있어요</h5>
      <table className="local-storage-manager-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>userInput</td>
            <td>
              <textarea
                value={localStorageData}
                onChange={(e) => handleEditValue(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="local-storage-manager-actions">
        <button className="clear-button" onClick={handleClearStorage}>
          초기화
        </button>
      </div>
    </div>
  </div>
  );
};

export default LocalStorageManager;
