(() => {
  'use strict';
  const EMAIL = 'rasia@gmail.com';
  const DEFAULT_TOPIC = '소프트웨어 개발 문의';
  const TOPICS = new Set([
    DEFAULT_TOPIC,
    '맞춤형 ERP·업무 관리 시스템 문의',
    'ERP 개발 문의',
    '맞춤형 애플리케이션 개발 문의',
    '셀러케어랩 서비스 문의',
    '문서·데이터 자동화 개발 문의',
  ]);
  const BODY = [
    '안녕하세요. 아래 내용으로 문의드립니다.', '',
    '회사 / 성함: ', '현재 업무와 불편한 점: ',
    '필요한 기능: ', '희망 일정: ', '예상 예산(선택): ',
  ].join('\n');
  const mailLink = document.getElementById('mail-link');
  if (mailLink) {
    // Only known portfolio topics may influence the email subject.
    const requested = new URLSearchParams(location.search).get('project');
    const topic = TOPICS.has(requested) ? requested : DEFAULT_TOPIC;
    mailLink.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`[RO 문의] ${topic}`)}&body=${encodeURIComponent(BODY)}`;
  }
  const copyButton = document.getElementById('copy-email');
  const copyStatus = document.getElementById('copy-status');
  if (copyButton && copyStatus) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(EMAIL);
        copyStatus.textContent = '이메일 주소를 복사했습니다.';
      } catch {
        copyStatus.textContent = `자동 복사를 사용할 수 없습니다. ${EMAIL}을 직접 복사해 주세요.`;
      }
    });
  }
})();
