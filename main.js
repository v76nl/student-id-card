// 全 contenteditable フィールドにプレースホルダー制御を適用
const editableFields = document.querySelectorAll('.editable');

// カードのスケーリング処理
const CARD_WIDTH = 680;
const cardWrapper = document.getElementById('card-scaling-wrapper');
const card = document.getElementById('id-card');

function scaleCard() {
    const scale = cardWrapper.clientWidth / CARD_WIDTH;
    card.style.transform = `scale(${scale})`;
}

scaleCard();
window.addEventListener('resize', scaleCard);

editableFields.forEach((field) => {
  updateEmptyState(field);

  field.addEventListener('input', () => updateEmptyState(field));
  field.addEventListener('blur', () => updateEmptyState(field));
  field.addEventListener('focus', () => {
    // フォーカス中は is-empty を外してCSSのbeforeを消す
    field.classList.remove('is-empty');
  });
  field.addEventListener('keydown', (e) => {
    // 改行を禁止
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });
  field.addEventListener('paste', (e) => {
    // プレーンテキストのみ貼り付け
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain').replace(/\n/g, ' ');
    document.execCommand('insertText', false, text);
  });
});

function updateEmptyState(field) {
  const isEmpty = field.innerText.trim() === '';
  field.classList.toggle('is-empty', isEmpty);
}

// 画像出力
const exportBtn = document.getElementById('export-btn');

exportBtn.addEventListener('click', async () => {
  const card = document.getElementById('id-card');
  const studentIdEl = document.getElementById('student-id');
  const studentId = studentIdEl.innerText.trim() || 'UNKNOWN';

  // ボタンを一時無効化
  exportBtn.disabled = true;
  exportBtn.textContent = 'Exporting…';

  try {
    // 出力時に editable のフォーカスアウトラインを消す
    editableFields.forEach((f) => f.blur());

    const canvas = await html2canvas(card, {
      scale: 3,          // 高解像度
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const timestamp = formatTimestamp(new Date());
    const filename = `${sanitize(studentId)}_${timestamp}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Export failed:', err);
    alert('Export failed. Please try again.');
  } finally {
    exportBtn.disabled = false;
    exportBtn.innerHTML = `
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      画像をダウンロード
    `;
  }
});

// YYYYMMDD_HHmmss 形式のタイムスタンプ生成
function formatTimestamp(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const Y = date.getFullYear();
  const M = pad(date.getMonth() + 1);
  const D = pad(date.getDate());
  const h = pad(date.getHours());
  const m = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${Y}${M}${D}_${h}${m}${s}`;
}

// ファイル名に使用できない文字を除去
function sanitize(str) {
  return str.replace(/[^\w\-]/g, '_');
}
