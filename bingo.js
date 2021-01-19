//テストA

//効果音実行クラス
class soundManager{
    
    constructor(){
        //ドラム効果音のオブジェクト生成
        this.drumMusic = new Audio('./drum.mp3');
        //バンッ効果音のオブジェクト生成
        this.bamMusic = new Audio('./bam.mp3');
        //メディアリソースを読みこむ
        this.drumMusic.load();
        this.bamMusic.load();
    }

    //ドラムの効果音を再生する
    playDrum(){
        //開始時間を設定
        this.drumMusic.currentTime = 0;
        //ループ再生設定
        this.drumMusic.loop = true;
        this.drumMusic.play();
    }

    //ドラム効果音を停止する
    stopDrum(){
        this.drumMusic.pause();
    }

    //バンッ効果音を再生する
    playBum(){
        this.bamMusic.currentTime = 0;
        this.bamMusic.play();
    }
}

//ビンゴ連番配列を生成
const numbers = Array.from({length:75},(v, k) => {
    return ('0' + (k+1)).slice(-2);
});

//スピン中表示用番号
const spinNumbers = Array.from({length:10},(v,k) => k);

//SPIN中のパネル表示用タイマー
let timer;
//プレイ状態フラグ
let isPlayer = false;

//乱数によってセレクトされた数字
let bingNum = 0;

//HTMLから要素を取得
const place10 = document.getElementById('place10');
const place1 = document.getElementById('place1');
const stopBtn = document.getElementById('stopBtn');
const spinBtn = document.getElementById('spinBtn');
const result = document.getElementById('result');

const soundMng = new soundManager();

//ビンゴ番号レンダリング関数
const renderBingo = () => {
    //空のDocumentFragmentを生成
    let fragment = document.createDocumentFragment();
    //divラッパーオブジェクト
    let divWrapper;

    numbers.forEach((val, index) => {
        //15の倍数ごとにdivを生成する
        if( (index % 15) === 0 ){
            //divラッパーオブジェクトに"div"を子要素として追加
            divWrapper = fragment.appendChild(document.createElement("div"));
            //divの class名を追加
            divWrapper.className = "line";
        }
        //divWrapperの子要素に"span"を追加
        //numSpanにdivWrapperを子要素として追加
        let numSpan = divWrapper.appendChild(document.createElement("div"));
        numSpan.className = "bingo";
        numSpan.innerHTML = val;
    });
    result.appendChild(fragment);
}

//ビンゴ番号レンダリング
renderBingo();

//SPINボタン押下後の処理
spinBtn.addEventListener("click", ()=> {
    //すでにSPINしているか または 抽選するビンゴ番号が存在しないか
    if(isPlayer || (numbers.length <= 0)){
        //何も処理せず終了
        return;
    }

    //ドラム効果音再生
    soundMng.playDrum();

    //プレイ状態をスピン中に変更
    isPlayer = true;
    //SPINボタンのクラス名を変更
    spinBtn.className = "btn inactive";
    //STOPボタンのクラス名を変更
    stopBtn.className = "btn";

    //1〜ビンゴ連番配列の長さの範囲で乱数(ビンゴ連番配列のインデックス)を生成
    let index = getRandomIntInclusive();
    //ビンゴ連番配列[インデックス]の値を取得
    let selectNum = numbers[index];

    //パネルをスピン
    runSlot();
})

//スピン中の番号表示関数
const runSlot = () => {
    //パネルに表示するの1桁目の番号を取得
    let num1 = spinNumbers[getRandomIntInclusive(spinNumbers.length)];
    //パネルに表示するの1桁目の番号を取得
    let num10 = spinNumbers[getRandomIntInclusive(spinNumbers.length)];

    //表示
    place1.innerHTML = num1;
    place10.innerHTML = num10;

    //25ms毎にスピン中の番号表示関数を実行するタイマーをセット(再帰処理)
    timer = setTimeout(() => {
        runSlot();
    }, 25);
}

//STOPボタン押下後の処理
stopBtn.addEventListener("click", ()=> {
    //停止中か
    if(!isPlayer){
        //何も処理せず終了
        return;
    }

    //ドラム効果音停止
    soundMng.stopDrum();

    //ビンゴ番号のインデックスを取得
    let index = getRandomIntInclusive(numbers.length);
    //ビンゴ番号を取得
    let bingoNum = numbers[index];
    //取得したビンゴ番号をビンゴ連番配列から削除
    numbers.splice(index, 1);
    //スピンタイマーを停止
    clearTimeout(timer);
    
    //パネルに表示
    place1.innerHTML = bingoNum.substr(1,1);
    place10.innerHTML = bingoNum.substr(0,1);

    //バンッ効果音再生
    soundMng.playBum();

    //bingoクラスを全て取得
    let bingoDiv = document.querySelectorAll(".bingo");

    let bingoNumIdx = (parseInt(bingoNum)-1);

    //プレイ状態を停止に変更
    isPlayer = false;

    //ビンゴ番号のクラス名に"matched"をつける
    bingoDiv[bingoNumIdx].className = 'bingo matched';

    //STOPボタンのクラス名に"inactive"を追加
    stopBtn.className = "btn inactive";

    //まだ引いていないビンゴ番号が存在するか
    if(numbers.length > 0){
        //SPINボタンのクラス名から"inactive"を削除
        spinBtn.className = "btn";
    }
});

//MAX未満乱数生成関数
const getRandomIntInclusive = (max) => {
    //min以上max未満の乱数を生成する
    return Math.floor(Math.random() * max);
}

