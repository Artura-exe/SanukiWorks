/**
 * タブレット拠点選択画面のロジック
 */

/**
 * 拠点を選択してログイン画面に戻る
 * @param {string} groupName 
 */
function selectGroup(groupName) {
    // 選択されたグループを保存（localStorage または sessionStorage）
    // ログイン画面の「打刻グループ」フィールドに反映させるために localStorage を使用
    localStorage.setItem('selected_clock_group', groupName);

    // タブレットモードをONにする
    localStorage.setItem('tablet_mode', 'true');

    // 拠点メンバー選択画面に遷移
    window.location.href = 'tablet-member-selection.html';
}
/**
 * PCモードに切り替えてログイン画面に戻る
 */
function switchToPcModeSelection() {
    localStorage.setItem('tablet_mode', 'false');
    window.location.href = 'index.html';
}
