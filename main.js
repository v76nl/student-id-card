// 学部 日本語 → 英語 マッピング（中央大学）
const FACULTY_MAP = {
    '法学部': 'Faculty of Law',
    '経済学部': 'Faculty of Economics',
    '商学部': 'Faculty of Commerce',
    '理工学部': 'Faculty of Science and Engineering',
    '文学部': 'Faculty of Letters',
    '総合政策学部': 'Faculty of Policy Studies',
    '国際経営学部': 'Faculty of Global Management',
    '国際情報学部': 'Faculty of Global Informatics',
};

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

// カードフィールドを更新する
function setCardField(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    if (text && text.trim()) {
        el.textContent = text.trim();
        el.classList.remove('is-empty');
    } else {
        el.textContent = '';
        el.classList.add('is-empty');
    }
}

// 日付文字列（YYYY-MM-DD）を「YYYY / MM / DD」形式に変換
function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${y} / ${m} / ${d}`;
}

// フォーム → カード 同期
document.getElementById('input-faculty').addEventListener('change', (e) => {
    const english = FACULTY_MAP[e.target.value] || '';
    setCardField('card-faculty', english);
});

document.getElementById('input-department').addEventListener('input', (e) => {
    setCardField('card-department', e.target.value);
});

document.getElementById('input-student-id').addEventListener('input', (e) => {
    setCardField('card-student-id', e.target.value);
});

document.getElementById('input-name').addEventListener('input', (e) => {
    setCardField('card-name', e.target.value);
});

document.getElementById('input-dob').addEventListener('change', (e) => {
    setCardField('card-dob', formatDate(e.target.value));
});

document.getElementById('input-enrollment').addEventListener('change', (e) => {
    setCardField('card-enrollment', formatDate(e.target.value));
});

document.getElementById('input-valid-until').addEventListener('change', (e) => {
    setCardField('card-valid-until', formatDate(e.target.value));
});

// 画像出力
const exportBtn = document.getElementById('export-btn');

exportBtn.addEventListener('click', async () => {
    const studentId = document.getElementById('input-student-id').value.trim() || 'UNKNOWN';

    exportBtn.disabled = true;
    exportBtn.textContent = 'エクスポート中…';

    // エクスポート中はプレースホルダーを非表示
    document.body.classList.add('exporting');

    try {
        const canvas = await html2canvas(card, {
            scale: 3,
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
        alert('エクスポートに失敗しました。もう一度お試しください。');
    } finally {
        document.body.classList.remove('exporting');
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
