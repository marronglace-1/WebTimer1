// S------*HTMLからIDの取得*------
const submit = document.getElementById("submit");
const period = document.getElementById("period");
const aggregatePeriod = document.getElementById("aggregatePeriod");
const totalTitle = document.getElementById("totalTitle");
const selectList = document.getElementById("content");
const aggregateTotalTime = document.getElementById("aggregateTotalTime");
const aggregateTime = document.getElementById("aggregateTime");
// E------*HTMLからIDの取得*------

// S------*全体で利用する変数の定義*------
let selectPeriod = 1;
let selectContent = 0;
let minutes = {list1: [], list2: [], list3: []};
let labels = [];
let allMinuteData = 0;
let contentLabel1;
let contentLabel2;
let contentLabel3;
// E------*全体で利用する変数の定義*------

// S------*イベントの設定*------
window.onload = function () {  
    weekGraph();
    minuteDataCalc();
    weekMinuteDataCalc();
    allPeriodMinuteDataCalc();
};
submit.addEventListener("click", ()=> {
    selectPeriod = period.value;
    const index = selectList.value;
    selectContent = selectList[index].textContent;
    myChart.destroy();
    if (selectPeriod == 1) {
        return;
    } else if(selectPeriod == 7) {
        graphArrayDataInit();
        weekGraph();
        weekMinuteDataCalc();
        allPeriodMinuteDataCalc();
        totalTitle.textContent = `トータル(${selectContent})`;
        aggregatePeriod.textContent = " 1 週間"
    } else if(selectPeriod == 30){
        graphArrayDataInit();
        monthGraph();
        monthMinuteDataCalc();
        allPeriodMinuteDataCalc();
        totalTitle.textContent = `トータル(${selectContent})`;
        aggregatePeriod.textContent = " 1 ヵ月間"
    }
})
// E------*イベントの設定*------

function graphArrayDataInit() {     //配列とラベルの値の初期化（グラフの再描画の際、値を再計算して代入する必要があるため）
    minutes = {list1: [], list2: [], list3: []};
    labels = [];
}

// S------*全期間集計にかかわる処理*------
function allPeriodMinuteDataCalc () {       //全期間分のデータを集計する処理、選択されたcontent毎の集計も行う
    allMinuteData = 0;
    if (selectList.value == 0 || selectList.value == 1) { 
        gon.list_id1.forEach(data => {
            allMinuteData += data.minutes;
        });
    };
    if ((selectList.value == 0 || selectList.value == 2)) {
        gon.list_id2.forEach(data => {
            allMinuteData += data.minutes;
        });
    };
    if (selectList.value == 0 || selectList.value == 3) {
        gon.list_id3.forEach(data => {
            allMinuteData += data.minutes;
        });
    }; 
    const h = Math.floor(allMinuteData / 60);
    const m = allMinuteData % 60;
    aggregateTotalTime.textContent = `${h}時間${m}分`;
}
// E------*全期間集計にかかわる処理*------

// S------*一週間、一ヵ月間毎の集計にかかわる処理*------
function totalDataCalc (selectLV, lv, dateCount, minutesL) {    //受け取った引数を元に、配列に学習した時間を集計する処理（LVはListValueの略。）
    let maxindex = minutesL.length;
    if (selectLV == lv || selectLV == 0) {
        for (let i = dateCount; i > 0; i--) {
            const index = maxindex - i;
            allMinuteData += minutesL[index];
        };
    };
}

function minuteDataCalc() {         //一週間、一か月間の集計データを表示するための処理
    const h = Math.floor(allMinuteData / 60);
    const m = allMinuteData % 60;
    aggregateTime.textContent = `${h}時間${m}分`;
}

function weekMinuteDataCalc() {     //一週間分のデータ集計処理のまとめ
    allMinuteData = 0;
    totalDataCalc(selectList.value, 1, 7, minutes.list1);
    totalDataCalc(selectList.value, 2, 7, minutes.list2);
    totalDataCalc(selectList.value, 3, 7, minutes.list3);
    minuteDataCalc();
}

function monthMinuteDataCalc() {    //一ヵ月分のデータ集計処理のまとめ
    allMinuteData = 0;
    totalDataCalc(selectList.value, 1, 30, minutes.list1);
    totalDataCalc(selectList.value, 2, 30, minutes.list2);
    totalDataCalc(selectList.value, 3, 30, minutes.list3);
    minuteDataCalc();
}
// E------*一週間、一ヵ月間毎の集計にかかわる処理*------

// S------*グラフに関わる処理*------
function graphLabelsInit (dateCount) {      //グラフに使うラベルとminutesデータの挿入処理
    for (let i = 0; i < dateCount; i++) {
        const nowDate = new Date();
        nowDate.setDate(nowDate.getDate() - i);
        labels.unshift(`${nowDate.getMonth()+1}/${nowDate.getDate()}`);
    };
    Object.keys(minutes).forEach(minute => {    
        for (let i = 0; i < dateCount; i++) {
            minutes[minute].push(0);
        } 
    }); 
}

function graphDatesOrderInit(datePeriod, timer, minute) {       //当日の日付から、過去一定期間の日付を取得し、取得した日付に一致したMinutesデータを保存する処理。
    let mListIndex = datePeriod;    //minutesのListのIndex番号。
    for  (let i = 0; i < 30; i++) {
        const nowDate = new Date();
        nowDate.setDate(nowDate.getDate() - i);
        const year = nowDate.getFullYear();
        const month = nowDate.getMonth()+1;
        const date = nowDate.getDate();
        const confirmDate = `${year}-${month.toString().padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
        const a = timer.filter(list => {
            return list.date === confirmDate;
        });                 //日付に合致した値をオブジェクトを取り出す。
        for (let d = 0; d < a.length; d++) {
            minute[mListIndex] += a[d].minutes;
        };                  //日付に合致したオブジェクトから分数を取り出して、MinutesのList配列に保存する
        mListIndex--;
    }
}

function setContentLabels() {       //CONTENTの情報が保存されていない場合は、CONTENTの値を。未保存の場合はラベルに未設定という値をいれてグラフを表示させる処理。
    if (gon.list_content1) {
        contentLabel1 = gon.list_content1.list_content;
    } else {
        contentLabel1 = "未設定";
    };
    if (gon.list_content2) {
        contentLabel2 = gon.list_content2.list_content;
    } else {
        contentLabel2 = "未設定";
    };
    if (gon.list_content3) {
        contentLabel3 = gon.list_content3.list_content;
    } else {
        contentLabel3 = "未設定";
    };
}

function judgeOnContent(dateCount) {     //選択したContentによって出力する値を変更するための処理
    if (selectList.value == 0 || selectList.value == 1) {
        graphDatesOrderInit(dateCount, gon.list_id1, minutes.list1);    
    };
    if (selectList.value == 0 || selectList.value == 2) {
        graphDatesOrderInit(dateCount, gon.list_id2, minutes.list2);
    };
    if (selectList.value == 0 || selectList.value == 3) {
        graphDatesOrderInit(dateCount, gon.list_id3, minutes.list3);
    };   
}

function weekGraph() {      //過去一週間分のグラフ
    graphLabelsInit(7);     
    judgeOnContent(6);    
    setContentLabels();
    const contentLabels = selectList.children;
    const ctx = document.getElementById("myBarChart");
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: labels,
        datasets: [
            {
            label: contentLabel1,
            data: minutes.list1,
            backgroundColor: "rgba(219,39,91,0.5)"
            },{
            label: contentLabel2,
            data: minutes.list2,
            backgroundColor: "rgba(130,201,169,0.5)"
            },{
            label: contentLabel3,
            data: minutes.list3,
            backgroundColor: "rgba(255,183,76,0.5)"
            }
        ]
        },
        options: {
        title: {
            display: true,
            text: '過去一週間分の学習データ'
        },
        scales: {
            yAxes: [{
                stacked: true,
            ticks: {
                suggestedMax: 240,
                suggestedMin: 0,
                stepSize: 60,
                callback: function(value, index, values){
                return  value/60 +  '時間'
                }
            }
            }],
            xAxes: [{
                stacked: true,
            }]
        },
        }
    });
}

function monthGraph() {     //過去一ヵ月分のグラフ
    graphLabelsInit(30);
    judgeOnContent(29);
    setContentLabels();
    const contentLabels = selectList.children;
    const ctx = document.getElementById("myBarChart");
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: labels,
        datasets: [
            {
            label: contentLabel1,
            data: minutes.list1,
            backgroundColor: "rgba(219,39,91,0.5)"
            },{
            label: contentLabel2,
            data: minutes.list2,
            backgroundColor: "rgba(130,201,169,0.5)"
            },{
            label: contentLabel3,
            data: minutes.list3,
            backgroundColor: "rgba(255,183,76,0.5)"
            }
        ]
        },
        options: {
        title: {
            display: true,
            text: '過去一か月分の学習データ'
        },
        scales: {
            yAxes: [{
                stacked: true,
            ticks: {
                suggestedMax: 240,
                suggestedMin: 0,
                stepSize: 60,
                callback: function(value, index, values){
                return  value/60 +  '時間'
                }
            }
            }],
            xAxes: [{
                stacked: true,
            }]
        },
        }
    });
}
// E------**------

