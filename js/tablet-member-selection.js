/**
 * 勤怠システム - タブレットメンバー選択画面ロジック
 */

document.addEventListener('DOMContentLoaded', () => {
    const facilityName = localStorage.getItem('selected_clock_group');
    if (!facilityName) {
        window.location.href = 'tablet-selection.html';
        return;
    }

    // ヘッダーの施設名更新
    const nameEl = document.getElementById('selectedGroupName');
    if (nameEl) nameEl.textContent = facilityName;

    loadMembers(facilityName);
    startClock();
});

/**
 * 時計の開始
 */
function startClock() {
    function update() {
        const now = new Date();
        const dateEl = document.getElementById('tabletDate');
        const timeEl = document.getElementById('tabletTime');

        if (dateEl) {
            const days = ['日', '月', '火', '水', '木', '金', '土'];
            const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日(${days[now.getDay()]})`;
            dateEl.textContent = dateStr;
        }

        if (timeEl) {
            const timeStr = now.toLocaleTimeString('ja-JP', { hour12: false });
            timeEl.textContent = timeStr;
        }
    }

    update();
    setInterval(update, 1000);
}

/**
 * メンバー一覧を読み込み
 * @param {string} facilityName 
 */
function loadMembers(facilityName) {
    const grid = document.getElementById('memberGrid');
    if (!grid) return;

    const members = MockData.getFacilityMembers(facilityName);
    grid.innerHTML = '';

    members.forEach(member => {
        const item = document.createElement('div');
        item.className = 'selection-item';
        item.style.position = 'relative';
        item.onclick = () => selectMember(member);

        const box = document.createElement('div');
        box.className = 'selection-box';
        box.style.marginBottom = '0';
        box.style.aspectRatio = 'auto';
        box.style.padding = '24px 10px';
        box.style.fontSize = '1.8rem';

        // 勤務状態に応じた配色
        if (member.isWorking) {
            box.style.backgroundColor = '#e0e0e0'; // 灰色
        } else {
            box.style.backgroundColor = '#f8c9d9'; // ピンク
        }

        box.textContent = member.name;
        item.appendChild(box);

        if (member.isWorking) {
            const badge = document.createElement('div');
            badge.className = 'working-stamp';
            badge.style.position = 'absolute';
            badge.style.bottom = '10px';
            badge.style.right = '10px';
            badge.style.border = '2px solid #a00';
            badge.style.color = '#a00';
            badge.style.borderRadius = '50%';
            badge.style.width = '50px';
            badge.style.height = '50px';
            badge.style.display = 'flex';
            badge.style.alignItems = 'center';
            badge.style.justifyContent = 'center';
            badge.style.padding = '0';
            badge.style.fontSize = '0.9rem';
            badge.style.fontWeight = 'bold';
            badge.style.backgroundColor = '#fff';
            badge.style.transform = 'rotate(15deg)';
            badge.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.1)';
            badge.style.zIndex = '5';
            badge.textContent = '勤務';
            item.appendChild(badge);
        }

        grid.appendChild(item);
    });
}

/**
 * メンバーを選択して詳細画面に遷移
 * @param {object} member 
 */
function selectMember(member) {
    localStorage.setItem('selected_member', JSON.stringify(member));
    window.location.href = 'tablet-clock.html';
}
