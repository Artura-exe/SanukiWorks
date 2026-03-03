/**
 * 勤怠システム - タブレット個人打刻画面ロジック
 */

document.addEventListener('DOMContentLoaded', () => {
    const facilityName = localStorage.getItem('selected_clock_group');
    const memberData = localStorage.getItem('selected_member');

    if (!facilityName || !memberData) {
        window.location.href = 'tablet-selection.html';
        return;
    }

    const member = JSON.parse(memberData);

    // 画面表示更新
    const groupEl = document.getElementById('displayGroupName');
    if (groupEl) groupEl.textContent = facilityName;

    const idEl = document.getElementById('displayMemberId');
    if (idEl) idEl.textContent = member.id;

    const nameEl = document.getElementById('displayMemberName');
    if (nameEl) nameEl.textContent = member.name;

    updateButtons(member.isWorking);
});

/**
 * ボタンの有効/無効表示を更新
 * @param {boolean} isWorking 
 */
function updateButtons(isWorking) {
    const btnIn = document.getElementById('btnClockIn');
    const btnOut = document.getElementById('btnClockOut');
    const card = document.getElementById('memberCard');
    const badge = document.getElementById('workingBadge');

    if (isWorking) {
        // 勤務中の場合
        btnIn.disabled = true;
        btnOut.disabled = false;
        btnIn.style.opacity = '0.3';
        btnOut.style.opacity = '1';
        btnIn.style.backgroundColor = '#e0e0e0';
        btnOut.style.backgroundColor = '#f8c9d9';

        // カードをグレーに変更し、勤務マークを表示
        if (card) card.style.backgroundColor = '#e0e0e0';
        if (badge) badge.style.display = 'flex';
    } else {
        // 勤務外の場合
        btnIn.disabled = false;
        btnOut.disabled = true;
        btnIn.style.opacity = '1';
        btnOut.style.opacity = '0.3';
        btnIn.style.backgroundColor = '#f8c9d9';
        btnOut.style.backgroundColor = '#e0e0e0';

        // カードをピンクに変更し、勤務マークを非表示
        if (card) card.style.backgroundColor = '#f8c9d9';
        if (badge) badge.style.display = 'none';
    }
}

/**
 * タブレット出勤打刻
 */
function handleTabletClockIn() {
    const member = JSON.parse(localStorage.getItem('selected_member'));
    const comment = document.getElementById('clockComment').value;

    if (CONFIG.USE_MOCK) {
        const result = MockData.clockIn(comment);
        if (result.success) {
            showToast(`${member.name}さんの出勤を記録しました`, 'success');
            // モックデータの状態を更新（実際はサーバー側で行う）
            member.isWorking = true;
            localStorage.setItem('selected_member', JSON.stringify(member));
            updateButtons(true);
            setTimeout(() => {
                window.location.href = 'tablet-member-selection.html';
            }, 1500);
        }
    }
}

/**
 * タブレット退勤打刻
 */
function handleTabletClockOut() {
    const member = JSON.parse(localStorage.getItem('selected_member'));
    const comment = document.getElementById('clockComment').value;

    if (CONFIG.USE_MOCK) {
        const result = MockData.clockOut(comment);
        if (result.success) {
            showToast(`${member.name}さんの退勤を記録しました`, 'success');
            member.isWorking = false;
            localStorage.setItem('selected_member', JSON.stringify(member));
            updateButtons(false);
            setTimeout(() => {
                window.location.href = 'tablet-member-selection.html';
            }, 1500);
        }
    }
}
