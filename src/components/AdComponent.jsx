import React, { useEffect, useRef } from 'react';

const AdComponent = ({ className, adClient, adSlot, adType = "horizontal", style }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Google AdSense 로드 중 에러:', e.message);
      }
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={style || { display: 'block' }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adType === "horizontal" ? "horizontal" : "vertical"} // 광고 형식 설정
      data-full-width-responsive= "true"
      data-loading-strategy="lazy" // ⭐️ Lazy Loading 추가
    />
  );
};

export default AdComponent;
