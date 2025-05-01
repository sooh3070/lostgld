import axios from 'axios';

// 백엔드 서버 URL 설정 (개발/프로덕션 환경에 맞게 변경)
const BACKEND_API_URL = 'https://api.lostgld.com'; // 개발: http://localhost:8000, 프로덕션: https://api.lostgld.com

/**
 * /data-pve 엔드포인트에서 PVE 효율 데이터 가져오기
 * @returns {Promise<Array>} PVE 효율 데이터
 */
export const fetchPveEfficiencyData = async () => {
  try {
    const response = await axios.get(`${BACKEND_API_URL}/data-pve`);
    console.log('Fetched PVE efficiency data from backend:', response.data);
    return response.data?.data || [];
  } catch (error) {
    console.error('PVE 효율 데이터를 가져오는 중 오류 발생:', error);
    return [];
  }
};

/**
 * /data-life 엔드포인트에서 생활 효율 데이터 가져오기
 * @returns {Promise<Array>} 생활 효율 데이터
 */
export const fetchLifeEfficiencyData = async () => {
  try {
    const response = await axios.get(`${BACKEND_API_URL}/data-life`);
    console.log('Fetched life efficiency data from backend:', response.data);
    return response.data?.data || [];
  } catch (error) {
    console.error('생활 효율 데이터를 가져오는 중 오류 발생:', error);
    return [];
  }
};

/**
 * /craft 엔드포인트에서 제작 데이터 가져오기
 * @returns {Promise<Array>} 제작 데이터
 */
export const fetchCraftData = async () => {
  try {
    const response = await axios.get(`${BACKEND_API_URL}/craft`);
    console.log('Fetched craft data from backend:', response.data);
    return response.data?.data || [];
  } catch (error) {
    console.error('제작 데이터를 가져오는 중 오류 발생:', error);
    return [];
  }
};

/**
 * /event-toadbox 엔드포인트에서 골두꺼비 기댓값 계산용 데이터 가져오기
 * @returns {Promise<Object>} 골두꺼비 이벤트 상자 데이터
 */
export const fetchToadboxData = async () => {
  try {
    const response = await axios.get(`${BACKEND_API_URL}/event-toadbox`);
    console.log('Fetched toadbox data from backend:', response.data);
    return response.data || {};
  } catch (error) {
    console.error('골두꺼비 데이터를 가져오는 중 오류 발생:', error);
    return {};
  }
};
