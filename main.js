// 学部 日本語 → 英語 マッピング
const FACULTY_MAP = {
    '法学部': {
        en: 'Faculty of Law',
        departments: {
            '法律学科': 'Department of Law',
            '政治学科': 'Department of Political Science',
            '国際企業関係法学科': 'Department of International Law and Business'
        }
    },
    '経済学部': {
        en: 'Faculty of Economics',
        departments: {
            '経済学科': 'Department of Economics',
            '経済情報システム学科': 'Department of Economic Systems and Information Analysis',
            '国際経済学科': 'Department of International Economics',
            '公共・環境経済学科': 'Department of Public and Environmental Economics'
        }
    },
    '商学部': {
        en: 'Faculty of Commerce',
        departments: {
            '経営学科': 'Department of Business Administration',
            '会計学科': 'Department of Accounting',
            '国際マーケティング学科': 'Department of Marketing and International Trade',
            '金融学科': 'Department of Banking and Corporate Finance'
        }
    },
    '理工学部 (25年度以前入学者)': {
        en: 'Faculty of Science and Engineering',
        departments: {
            '数学科': 'Department of Mathematics',
            '物理学科': 'Department of Physics',
            '都市環境学科': 'Department of Civil and Environmental Engineering',
            '精密機械工学科': 'Department of Precision Mechanics',
            '電気電子情報通信工学科': 'Department of Electrical, Electronic, and Communication Engineering',
            '応用化学科': 'Department of Applied Chemistry',
            'ビジネスデータサイエンス学科': 'Department of Data Science for Business Innovation',
            '情報工学科': 'Department of Information and System Engineering',
            '生命科学科': 'Department of Biological Sciences',
            '人間総合理工学科': 'Department of Integrated Sciences and Engineering for Sustainable Societies'
        }
    },
    '基幹理工学部 (26年度以後入学者)': {
        en: 'Faculty of Fundamental Science and Engineering',
        departments: {
            '数学科': 'Department of Mathematics',
            '物理学科': 'Department of Physics',
            '応用化学科': 'Department of Applied Chemistry',
            '生命科学科': 'Department of Biological Sciences'
        }
    },
    '社会理工学部 (26年度以後入学者)': {
        en: 'Faculty of Science, Engineering and Society',
        departments: {
            '都市環境学科': 'Department of Civil and Environmental Engineering',
            'ビジネスデータサイエンス学科': 'Department of Data Science for Business Innovation',
            '人間総合理工学科': 'Department of Integrated Sciences and Engineering for Sustainable Societies'
        }
    },
    '先進理工学部': {
        en: 'Faculty of Advanced Science and Engineering',
        departments: {
            '精密機械工学科': 'Department of Precision Mechanics',
            '電気電子情報通信工学科': 'Department of Electrical, Electronic, and Communication Engineering',
            '情報工学科': 'Department of Information and System Engineering'
        }
    },
    '文学部': {
        en: 'Faculty of Letters',
        departments: {
            '人文社会学科': 'Department of Humanities and Social Sciences'
        }
    },
    '総合政策学部': {
        en: 'Faculty of Policy Studies',
        departments: {
            '政策科学科': 'Department of Policy Sciences',
            '国際政策文化学科': 'Department of Cross-Cultural Studies'
        }
    },
    '国際経営学部': {
        en: 'Faculty of Global Management',
        departments: {
            '国際経営学科': 'Department of Global Management'
        }
    },
    '国際情報学部': {
        en: 'Faculty of Global Informatics',
        departments: {
            '国際情報学科': 'Department of Global Informatics'
        }
    }
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
