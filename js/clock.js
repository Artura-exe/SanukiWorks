/**
 * 勤怠システム - 打刻・ログイン画面のロジック
 */

// ==========================
// 出勤打刻
// ==========================
function handleClockIn() {
    const employeeId = document.getElementById('employeeId').value;
    const comment = document.getElementById('clockComment').value;
    const clockGroup = document.getElementById('clockGroup').value;

    if (!employeeId) {
        showToast('社員番号を入力してください', 'error');
        return;
    }

    if (CONFIG.USE_MOCK) {
        const result = MockData.clockIn(comment);
        if (result.success) {
            showToast(`出勤を記録しました [${result.time}]`, 'success');
            highlightButton('btnClockIn');
        }
    } else {
        Api.post('/attendance/clockin', {
            employeeId: employeeId,
            comment: comment,
            clockGroup: clockGroup,
            timestamp: new Date().toISOString()
        }).then(result => {
            if (result && result.success) {
                showToast(`出勤を記録しました [${result.time}]`, 'success');
                highlightButton('btnClockIn');
            }
        }).catch(err => {
            showToast('打刻に失敗しました', 'error');
        });
    }
}

// ==========================
// 退勤打刻
// ==========================
function handleClockOut() {
    const employeeId = document.getElementById('employeeId').value;
    const comment = document.getElementById('clockComment').value;
    const clockGroup = document.getElementById('clockGroup').value;

    if (!employeeId) {
        showToast('社員番号を入力してください', 'error');
        return;
    }

    if (CONFIG.USE_MOCK) {
        const result = MockData.clockOut(comment);
        if (result.success) {
            showToast(`退勤を記録しました [${result.time}]`, 'success');
            highlightButton('btnClockOut');
        }
    } else {
        Api.post('/attendance/clockout', {
            employeeId: employeeId,
            comment: comment,
            clockGroup: clockGroup,
            timestamp: new Date().toISOString()
        }).then(result => {
            if (result && result.success) {
                showToast(`退勤を記録しました [${result.time}]`, 'success');
                highlightButton('btnClockOut');
            }
        }).catch(err => {
            showToast('打刻に失敗しました', 'error');
        });
    }
}

// ==========================
// ログイン処理
// ==========================
function handleLogin() {
    const employeeId = document.getElementById('employeeId').value;
    const password = document.getElementById('password').value;

    if (!employeeId) {
        showToast('社員番号を入力してください', 'error');
        return;
    }

    if (!password) {
        showToast('パスワードを入力してください', 'error');
        return;
    }

    if (CONFIG.USE_MOCK) {
        const result = MockData.login(employeeId, password);
        if (result) {
            Auth.setToken(result.token);
            Auth.setUser(result.user);
            showToast('ログインしました', 'success');
            setTimeout(() => {
                Auth.redirectToDashboard();
            }, 800);
        } else {
            showToast('社員番号またはパスワードが正しくありません', 'error');
        }
    } else {
        Api.post('/auth/login', {
            employeeId: employeeId,
            password: password
        }).then(result => {
            if (result && result.token) {
                Auth.setToken(result.token);
                Auth.setUser(result.user);
                showToast('ログインしました', 'success');
                setTimeout(() => {
                    Auth.redirectToDashboard();
                }, 800);
            } else {
                showToast('ログインに失敗しました', 'error');
            }
        }).catch(err => {
            showToast('ログインに失敗しました', 'error');
        });
    }
}

// ==========================
// ボタンハイライト
// ==========================
function highlightButton(btnId) {
    // リセット
    document.getElementById('btnClockIn').style.backgroundColor = '';
    document.getElementById('btnClockOut').style.backgroundColor = '#d5d5d5';

    const btn = document.getElementById(btnId);
    if (btnId === 'btnClockIn') {
        btn.style.backgroundColor = '#f0b0c0';
        btn.style.border = '2px solid #d48a9a';
    } else {
        btn.style.backgroundColor = '#f0b0c0';
        btn.style.border = '2px solid #d48a9a';
        document.getElementById('btnClockIn').style.backgroundColor = '#d5d5d5';
    }
}

// ==========================
// Enterキーでログイン
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    const passwordEl = document.getElementById('password');
    if (passwordEl) {
        passwordEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }

    // タブレット拠点選択画面での選択を反映
    const selectedGroup = localStorage.getItem('selected_clock_group');
    if (selectedGroup) {
        const clockGroupEl = document.getElementById('clockGroup');
        if (clockGroupEl) {
            clockGroupEl.value = selectedGroup;
        }
    }
});
