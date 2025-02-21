import React from "react";
import { Helmet } from "react-helmet-async"; // Helmet 추가
import "./PageInfo.css"; // CSS 경로

const LumberingInfo = () => {
  return (
    <div className="info-page">
      {/* Helmet 추가: SEO와 메타 태그 설정 */}
      <Helmet>
        <title>생활 도구 계산기</title>
        <meta
          name="description"
          content="생활 도구 계산기를 통해 도구 옵션, 레벨, 부적에 따른 결과를 확인하세요."
        />
        <meta name="keywords" content="벌목 도구, 계산기, LostArk, 생활 콘텐츠" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <h1>벌목 도구 계산기</h1>
      <p>
        벌목 도구 계산기는 사용자가 입력한 도구 옵션, 레벨, 부적을 바탕으로 결과를 계산하여
        보여줍니다. 아래의 설명을 참고하여 계산기를 활용해 보세요!
      </p>

      <h2>사용 방법</h2>
      <ol>
        <li>도구 옵션, 레벨, 부적을 입력하세요.</li>
        <li>입력을 마친 후, <strong>적용하기</strong> 버튼을 누르세요.</li>
        <li>결과가 <strong>네모 박스</strong>에 표시됩니다.</li>
        <li>
          <strong>결과가 나타난 네모 박스를 클릭</strong>하면, 아래 테이블에 결과에 따른 값이
          전환되어 나타납니다.
        </li>
        <li>
          <strong>획득 개수 저장 버튼을 클릭</strong>하면, 브라우저 쿠키에 정보가 저장되어 <strong>생활 효율</strong>페이지에서
          다른 생활 결과와 비교가능합니다.
        </li>
      </ol>

      <h2>결과 항목 설명</h2>
      <ul>
        <li>
          <strong>예상 도구 획득량:</strong> 도구 효과로 얻은 추가 재료들입니다.
        </li>
        <li>
          <strong>예상 총합 획득량:</strong> 모든 효과를 적용했을 때 예상되는 10,000 생기 기준의 총합입니다.
        </li>
      </ul>

      <h2>기능 소개</h2>
      <p>
        벌목 도구 계산기는 여러 도구의 조합과 옵션을 비교하고, 각 설정에 따른 최적의
        조합을 시뮬레이션할 수 있도록 설계되었습니다. 이를 통해 사용자는 벌목 효과를 최대화하는
        방법을 손쉽게 찾아볼 수 있습니다.
      </p>
    </div>
  );
};

export default LumberingInfo;
