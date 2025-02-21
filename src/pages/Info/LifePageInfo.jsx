import React from 'react';
import { Helmet } from 'react-helmet-async';
import './PageInfo.css';

const LifePageInfo = () => {
  return (
    <div className="info-page">
      <Helmet>
        <title>생활 효율 계산기 Info</title>
        <meta name="description" content="생활 효율 계산기의 계산식과 데이터 수집 방식을 설명하는 페이지입니다." />
        <meta name="keywords" content="생활 효율, 데이터 계산, LostArk, 생활 콘텐츠" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <h1>생활 효율 계산기 Info</h1>
      <p>이 페이지는 '생활 효율 계산기'를 설명하는 페이지입니다.</p>

      <h2>생활 효율 계산기란?</h2>
      <p>
        생활 효율 계산기는 <strong>10,000 생명의 기운</strong>을 사용했을 때 얻을 수 있는 예상 골드를 계산해주는 계산기입니다. <br />  
        누적된 여러 데이터의 평균값을 활용하여, 10,000 생명의 기운을 사용했을 때 얻을 수 있는 아이템 개수를 예측합니다.   <br />
        계산된 아이템 개수 정보를 바탕으로 <strong>로스트아크 홈페이지</strong>로부터 API 요청을 통해 <br /> 실시간 아이템 시세 정보를 가져와  
        현재 얻을 수 있는 골드량을 빠르고 정확하게 계산해줍니다. <br />
        <br />  <strong>현재 같은 옵션에 도구를 사용한다면 획득 가능한 아이템이 같은 값으로 수렴한다는 사실을 알게 되어서 데이터 테이블을 통일했습니다.</strong><br />
      </p>

      <h2>사용된 계산식</h2>
      <ul>
        <li><strong>획득 골드</strong>: 아이템당 획득하는 골드 <br />획득 개수 × 시세 ÷ 판매 단위</li>
        <li><strong>획득 골드(테이블 하단)</strong>: 도약의 정수를 사용하지 않고, 10,000 생명의 기운을 사용했을 때 획득하는 골드 <br />아이템 획득 골드 합산</li>
        <li><strong>도약 골드</strong>: 도약의 정수를 사용하고, 10,000 생명의 기운을 사용했을 때 획득하는 골드 <br />도약 X 골드 - 도약의 정수 가격</li>
        <li><strong>도약의 정수 가격</strong> <br />100크리스탈 가격 ÷ 3 (화폐 거래소 기준)</li>
        <li><strong>시간당 골드</strong>: 한 시간 동안 도약의 정수를 사용하고 시행했을 때 획득 가능한 골드 <br />도약 사용 골드 ÷ 소모 시간 × 60</li>
      </ul>

      <h2>데이터 테이블</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>분류</th>
            <th>코드</th>
            <th>아이템 수량</th>
            <th>시간(도약의 정수 사용)</th>
            <th>시간(도약의 정수 미사용)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>식물채집</td>
            <td>90200</td>
            <td>
              들꽃: 2787<br />
              수줍은 들꽃: 1206<br />
              화사한 들꽃: 268<br />
              아비도스 들꽃: 291
            </td>
            <td>11분 30초</td>
            <td>23분</td>
          </tr>
          <tr>
            <td>벌목</td>
            <td>90300</td>
            <td>
              목재: 2889<br />
              부드러운 목재: 1151<br />
              튼튼한 목재: 282<br />
              아비도스 목재: 300
            </td>
            <td>4분 30초</td>
            <td>9분</td>
          </tr>
          <tr>
            <td>채광</td>
            <td>90400</td>
            <td>
              철광석: 2551<br />
              묵직한 철광석: 991<br />
              단단한 철광석: 248<br />
              아비도스 철광석: 312
            </td>
            <td>11분</td>
            <td>22분</td>
          </tr>
          <tr>
            <td>수렵</td>
            <td>90500</td>
            <td>
              두툼한 생고기: 2830<br />
              다듬은 생고기: 1211<br />
              진귀한 가죽: 271<br />
              아비도스 두툼한 생고기: 252
            </td>
            <td>13분</td>
            <td>26분</td>
          </tr>
          <tr>
            <td>낚시</td>
            <td>90600</td>
            <td>
              생선: 1999<br />
              붉은 살 생선: 1117<br />
              아비도스 태양 잉어: 325
            </td>
            <td>23분</td>
            <td>46분</td>
          </tr>
          <tr>
            <td>고고학</td>
            <td>90700</td>
            <td>
              고대 유물: 2688<br />
              희귀한 유물: 1252<br />
              진귀한 유물: 316<br />
              아비도스 유물: 388
            </td>
            <td>8분</td>
            <td>16분</td>
          </tr>
        </tbody>
      </table>

      <h2>데이터 수집 방식</h2>
      <p>
        - 10,000 생명의 기운을 도약의 정수를 사용한 상태에서 수집하였습니다.<br />
        - 여러 옵션 유물 도구를 사용하여 수집한 후 평균값을 계산하였습니다.
      </p>
    </div>
  );
};

export default LifePageInfo;
