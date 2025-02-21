import React from 'react';
import { Helmet } from 'react-helmet-async';
import './PageInfo.css'; // 기존 CSS 재활용

const PvePageInfo = () => {
  return (
    <div className="info-page">
      <Helmet>
        <title>PVE 효율 계산기 Info</title>
        <meta name="description" content="PVE 효율 계산기의 계산식과 데이터 수집 방식을 설명하는 페이지입니다." />
        <meta name="keywords" content="PVE 효율, 데이터 계산, LostArk, PVE 콘텐츠" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <h1>PVE 효율 계산기 Info</h1>
      <p>PVE 효율 계산기는 다양한 PVE 콘텐츠에서 얻을 수 있는 자원과 골드를 효율적으로 계산해주는 도구입니다.</p>

      <h2>PVE 효율 계산기란?</h2>
      <p>
        PVE 효율 계산기는 로스트아크 내 다양한 PVE 콘텐츠에서 소모 시간 대비 획득 가능한 자원과 골드를 예측하고 정리해주는 도구입니다.  
        사용자는 이를 통해 어떤 콘텐츠가 효율적인지 쉽게 파악할 수 있습니다.  
        계산된 데이터는 평균값 기반으로 구성되며, 실시간 시세 정보와 연동하여 더욱 정확한 결과를 제공합니다.
      </p>

      <h2>데이터 테이블</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>운명의 파괴석</th>
            <th>운명의 수호석</th>
            <th>운명의 돌파석</th>
            <th>1레벨 보석</th>
            <th>기타</th>
            <th>소요시간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>아비도스 1 작전(휴식 게이지)</td>
            <td>286</td>
            <td>949</td>
            <td>-</td>
            <td>6</td>
            <td>-</td>
            <td>2분 50초</td>
          </tr>
          <tr>
            <td>아비도스 2 작전(휴식 게이지)</td>
            <td>345</td>
            <td>968</td>
            <td>-</td>
            <td>6</td>
            <td>-</td>
            <td>2분 50초</td>
          </tr>
          <tr>
            <td>아비도스 3 작전(휴식 게이지)</td>
            <td>540</td>
            <td>1243</td>
            <td>-</td>
            <td>7</td>
            <td>-</td>
            <td>2분 50초</td>
          </tr>
          <tr>
            <td>아게오로스(휴식 게이지)</td>
            <td>183</td>
            <td>560</td>
            <td>25</td>
            <td>-</td>
            <td>-</td>
            <td>4분 30초</td>
          </tr>
          <tr>
            <td>스콜라키아(휴식 게이지)</td>
            <td>292</td>
            <td>876</td>
            <td>34</td>
            <td>-</td>
            <td>-</td>
            <td>6분</td>
          </tr>
          <tr>
            <td>카오스게이트(1640)</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>1</td>
            <td>용암의 숨결: 2<br />빙하의 숨결: 2<br />운명의 파편 주머니(소): 4</td>
            <td>3분</td>
          </tr>
          <tr>
            <td>카오스게이트(1680)</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>2</td>
            <td>용암의 숨결: 3<br />빙하의 숨결: 3<br />운명의 파편 주머니(중): 3</td>
            <td>3분</td>
          </tr>
        </tbody>
      </table>

      <h2>데이터 수집 방식</h2>
      <p>
        - 데이터는 PVE 콘텐츠를 통해 실제 획득 가능한 아이템 및 소요 시간을 기준으로 수집하였습니다.<br />
        - 다양한 유저들의 데이터를 종합하고 평균값을 기반으로 구성되었습니다.<br />
        - 로스트아크 공식 API와 연동하여 정확한 정보를 제공합니다.
      </p>
    </div>
  );
};

export default PvePageInfo;
