
//query（查詢 Selector（選擇器，就像 CSS 選擇器）All（全部）
// //把符合這個 class 名字的『所有』東西一次抓回來，裝成清單」
const numBoxes = document.querySelectorAll('.num-box'); //數字方塊
const slots = document.querySelectorAll('.target-slot'); //目標格子

//get（取得）+ Element（元素/標籤）+ By Id（根據 ID）
//去網頁上抓出某一個特定 ID 的東西
const pool = document.getElementById('numbersPool');//
const checkBtn = document.getElementById('checkBtn');
const resetBtn = document.getElementById('resetBtn');
const resultMsg = document.getElementById('resultMsg');

//const 是固定不能換
//let：宣告一個「之後可以被改變內容」的變數（箱子）。
//null：一開始沒有任何東西
let draggedItem = null; //dragged（被拖曳的）+ Item（物品/項目

// 1. 拖曳開始與結束
numBoxes.forEach(function (box) {                //forEach（對每一個）+ function（函式/功能）
    box.addEventListener('dragstart', function () {   //addEventListener（監聽事件）+ dragstart（拖曳開始）
        draggedItem = box;
        setTimeout(function () {        //微小延遲
            box.classList.add('dragging');  //幫這個方塊加上名為 dragging 的 class
        }, 0);
    });

    box.addEventListener('dragend', function () {
        box.classList.remove('dragging');
        draggedItem = null;
    });
});


// 2. 目標格監聽放置
slots.forEach(function (slot) {
    slot.addEventListener('dragover', function (e) { //dragover東西飄到格子正上方時
        //網頁瀏覽器預設是「禁止把任何東西丟到普通標籤上」的！
        // 如果不寫這行強制取消預設限制，後面的 drop（放下）功能會完全失效，滑鼠放開時東西會直接彈回原位。
        e.preventDefault(); //阻止預設行為，讓 drop 事件可以觸發
        slot.classList.add('hovered');
    });

    slot.addEventListener('dragleave', function () { //dragleave 東西移開、離開格子時
        slot.classList.remove('hovered');
    });

    slot.addEventListener('drop', function (e) { //drop 放下東西時
        e.preventDefault();
        slot.classList.remove('hovered');
        if (draggedItem) {
            // 如果格子裡原本有數字，把它退回池子
            const oldBox = slot.querySelector('.num-box');
            if (oldBox) {
                pool.appendChild(oldBox);
            }
            slot.appendChild(draggedItem); //把拖曳的數字方塊放進格子裡，appendChild 移動元素
        }
    });

    // 點擊格子可將裡面的數字送回上方池子
    slot.addEventListener('click', function () {
        const box = slot.querySelector('.num-box');
        if (box) {
            pool.appendChild(box);
            slot.classList.remove('correct', 'wrong');
        }
    });
});


// 3. 驗證按鈕
checkBtn.addEventListener('click', function () {
    localStorage.setItem('seventeenGamePlayed', 'true'); // 記錄遊戲已經玩過
    let allFilled = true; //布林值（開關），假設每格都有填滿
    let correctCount = 0;//計算答對題數

    slots.forEach(function (slot) {
        //先把上次檢查留下來的紅綠標籤清乾淨
        slot.classList.remove('correct', 'wrong');

        //檢查格子裡是否有數字方塊
        const childBox = slot.querySelector('.num-box');
        if (!childBox) {
            allFilled = false;
            return;
        }
        //確認答案
        const userVal = childBox.getAttribute('data-val'); //使用者答案
        const trueAns = slot.getAttribute('data-ans'); //正確答案
        if (userVal === trueAns) {
            slot.classList.add('correct');
            correctCount++;
        } else {
            slot.classList.add('wrong');
        }
    });

    const resDiv = document.getElementById('resultMsg');
    if (!allFilled) {
        resDiv.innerText = '調皮，還沒填完！';
        resDiv.style.color = '#e65100';
    } else if (correctCount === 13) {
        resDiv.innerText = '根本是克拉了吧，猜這麼準！';
        resDiv.style.color = '#2e7d32';
    } else {
        resDiv.innerText = '答對了 ' + correctCount + ' / 13 位，紅色代表填錯了，再試試看！';
        resDiv.style.color = '#c62828';
    }
});

// 4. 重置按鈕
resetBtn.addEventListener('click', function () {
    slots.forEach(function (slot) {
        slot.classList.remove('correct', 'wrong');
        const childBox = slot.querySelector('.num-box');
        if (childBox) {
            pool.appendChild(childBox); // 把所有數字抓回池子
        }
    });
    resultMsg.innerText = '';
});
