(() => {
  'use strict';
  const url = 'https://roon.kr/card.html';
  const button = document.getElementById('share-card');
  const status = document.getElementById('share-status');
  if (!button || !status) return;
  button.hidden = false;
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = '';
    try {
      if (navigator.share) {
        await navigator.share({title: '김정현 · RO', text: '알오(RO) 대표 김정현의 모바일 명함입니다.', url});
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        status.textContent = '명함 링크를 복사했습니다. 원하는 곳에 붙여넣어 주세요.';
      } else {
        status.textContent = `명함 주소: ${url}`;
      }
    } catch (error) {
      if (error.name !== 'AbortError') status.textContent = `명함 주소를 복사해 주세요: ${url}`;
    } finally {
      button.disabled = false;
    }
  });
})();
