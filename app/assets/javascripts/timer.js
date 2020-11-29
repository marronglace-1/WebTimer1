'use strict' 

{
    // S------*HTMLからIDの取得*------
    const timer = document.getElementById("timer");
    const start = document.getElementById("start");
    const stop = document.getElementById("stop");
    const reset = document.getElementById("reset");
    const selectTime = document.getElementById("selectTime");
    const submit = document.getElementById("submit");
    const selectList = document.getElementById("selectList");
    const listOption = document.getElementById("listOption");
    // E------*HTMLからIDの取得*------
    
    // S------*全体で利用する変数の定義*------
    let startTime;          //Startボタンを押した時間
    let timeoutId;          //settimeoutのデータを保持
    let countId = false;    //計測が終わっているかの判断用
    let elapsedTime = 0;　  //経過時間
    let setTime;            //指定した時間（分）
    let countSecond = 0;    //指定した時間（分）を秒数へ変換して代入する
    let listsCount = 0;     //Content(学習内容)の個数を保持するための変数
    let selectContent = 0;  //現在選択している学習項目の値を保持する変数
    const audioPlayer = audiojs.createAll();    //オーディオプレイヤーの初期化（作成）
    const audio = audioPlayer[0];               //オーディオプレイヤーの情報をaudioに代入
    const audioPlay = function () {             //オーディオプレイヤーの再生処理を変数に代入
        audio.currentTime = 0;
        audio.play();
    };
    // E------*全体で利用する変数の定義*------

    // S------*イベントの設定*------
    start.addEventListener("click", startTimer);    
    stop.addEventListener("click", stopTimer);      
    reset.addEventListener("click", resetTimer);    
    submit.addEventListener("click", addToList);    
    window.onload = function() {    
        listsCount = selectList.childElementCount;      
        setButtonStateReset();
        labelsInit();
        if (gon.timer_list_id1) {
            graphInit(gon.timer_list_id1, minutes.list1);
            graphInit(gon.timer_list_id2, minutes.list2);
            graphInit(gon.timer_list_id3, minutes.list3);
        }
        dateGraph();
    };

    function judgeButtonState() {   //MINUTESとCONTENTが選択されてから、スタートボタンが押せるようにするための処理
        if (parseInt(selectList.value) !== 0 && parseInt(selectTime.value) !== 0) {
            setButtonStateInitialize();
        } else if (parseInt(selectList.value) === 0 || parseInt(selectTime.value) === 0) {
            setButtonStateReset();
        };
    }

    selectTime.onchange = function() {      //Minutesを選択したときの処理
        setTime = selectTime.value;
        timer.textContent = `${setTime}:00`;
        countId = false;
        judgeButtonState();
    };

    selectList.onchange = function() {      //Contentを選択したときの処理
        selectContent = selectList.value;
        judgeButtonState();
    };
    // E------*イベントの設定*------

    // S------*処理*------
    function vlaueInitialize() {
        clearTimeout(timeoutId);
        timer.textContent = "00:00";
        setButtonStateInitialize();
        elapsedTime = 0;
        setTime =0;
        countId = false;
        setButtonStateInitialize();
    }

    function addDisabled () {   //セレクトボックスが選択不可になる処理
        selectTime.setAttribute("disabled","disabled");
        selectList.setAttribute("disabled","disabled");
    }

    function removeDisabled () {    //セレクトボックスが選択可能になる処理
        selectTime.removeAttribute("disabled");
        selectList.removeAttribute("disabled");
    }

    function countDown () {     //秒数のカウント処理
        const d = new Date(countSecond - (Date.now() - (startTime - elapsedTime)));
        const m = d.getMinutes().toString().padStart(2, "0");
        const s = d.getSeconds().toString().padStart(2, "0");
        if (d > 0) {
            timeoutId = setTimeout(countDown, 100);
            timer.textContent = `${m}:${s}`;
        }　else if (d <= 0) {
            const nowHour = new Date().getHours();
            App.timer.timer_set(selectContent, setTime, nowHour);
            vlaueInitialize();
            myChart.destroy();
            dateGraph();
            setTimeout(audioPlay, 0);
            setTimeout(audioPlay, 1200);
            setTimeout(audioPlay, 2400);
            removeDisabled();
        };
    }

    function startTimer() {     //Startボタンを押したときの処理
        if (start.classList.contains("inactive") === true ) {
            return;
        } else { 
        if (countId === false) {
            setTime = selectTime.value;
            countSecond = setTime * 60000;
        }
        startTime = Date.now();
        countId = true;
        setButtonStateRunning();
        countDown();
        addDisabled();
        }
    }
    function stopTimer () {     //Stopボタンを押したときの処理
        if (stop.classList.contains("inactive") === true) {
           return; 
        } else {
        clearTimeout(timeoutId);
        elapsedTime += Date.now() - startTime;
        setButtonStateStopped(); 
        removeDisabled();
        }
    }
    function resetTimer () {        //Resetボタンを押したときの処理
        if (reset.classList.contains("inactive") === true) {
            return;
        } else {
            vlaueInitialize();
            removeDisabled ();
        }
    }

    function judgeOnTheListContent (newOption) {       //Contentに表示される値（Listモデルに保存される情報）を現状に合わせて登録するための処理。（Contentの削除後、トラブルにならないために必須。）
        const listsArray = selectList.children;        //現在Contentに入っている値のValueを配列に代入し、1～3の数字のうち、現状Valueにない値をNewOptionのValueに代入する。
        let listsValueArray = [];
        for (let i = 0; i < listsArray.length; i++) {
            listsValueArray[i] = parseInt(listsArray[i].value);
        }
        if (listsValueArray.includes(1)) {
            if (listsValueArray.includes(2)) {
                if (listsValueArray.includes(3)) {
                    return;
                } else {
                    newOption.value = 3;
                };
            } else {
                newOption.value = 2;
            };
        } else {
            newOption.value = 1;
        };
    }
    
    function addToList() {      // 保存ボタンを押したときの処理
        if (listOption.value.trim() === "") {
            return;
        }
        if (listsCount >= 4) {
            return;
        }
        const newOption = document.createElement("option");
        judgeOnTheListContent(newOption); 
        newOption.text = listOption.value;
        selectList.appendChild(newOption);
        listsCount++;
        listOption.value = "";
        const contentName = `content${newOption.value}`;
        App.timer.list_set(newOption.value, newOption.text, contentName);
    }

    function setButtonStateInitialize () {      //startボタンのみ押せるようにする処理（見た目の部分）
        start.classList.remove("inactive");
        stop.classList.add("inactive");
        reset.classList.add("inactive");
    }
    function setButtonStateRunning () {         //STOPボタンのみ有効可する処理（見た目の部分）
        start.classList.add("inactive");
        stop.classList.remove("inactive");
        reset.classList.add("inactive");
    }
    function setButtonStateStopped () {         //STOPボタンのみ無効可する処理（見た目の部分）
        start.classList.remove("inactive");
        stop.classList.add("inactive");
        reset.classList.remove("inactive");
    }
    function setButtonStateReset () {           //すべてのボタンを無効可する処理（見た目の部分）
        start.classList.add("inactive");
        stop.classList.add("inactive");
        reset.classList.add("inactive");
    }
    // E------*処理*------

    // S------*グラフでのみ利用する変数*------
    const minutes = {list1: [], list2: [], list3: []};
    const labels = [];
    let contentLabel1;      //ラベルの設定
    let contentLabel2;     
    let contentLabel3;      
    Object.keys(minutes).forEach(minute => {    
        for (let i = 0; i < 24; i++) {
            minutes[minute].push(0);
        } 
    });   
    // E------*グラフでのみ利用する変数*------

    // S------*グラフの処理*------
    function labelsInit () {        // 0時～23時までの時間データをlabelsに配列で出力する処理
        for (let i = 0; i < 24; i++) {     
            labels.push(i + "時");
        }  
    }

    function graphInit(timer, minute) {     //グラフで扱うデータを1時間ごとに集計して、グラフに反映させるための処理。
        for (let i = 0; i < 24; i++) {
            const a = timer.filter(list => {
                return list.hours == i;
            });
            for (let b = 0; b < a.length; b++) {
                minute[i] += a[b].minutes;
            };
        };
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

    function dateGraph() {      //グラフの描画に関わる処理。
        if (parseInt(selectList.value) == 1) {  //グラフで扱う新しいデータを疑似的に反映するための処理
            const nowHour = new Date().getHours();
            minutes.list1[nowHour] += parseInt(selectTime.value);
        } else if (parseInt(selectList.value) == 2) {
            const nowHour = new Date().getHours();
            minutes.list2[nowHour] += parseInt(selectTime.value);
        } else if (parseInt(selectList.value) == 3) {
            const nowHour = new Date().getHours();
            minutes.list3[nowHour] += parseInt(selectTime.value);
        };      
        setContentLabels();
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
                text: '1日の学習分布'
            },
            scales: {
                yAxes: [{
                    stacked: true,
                ticks: {
                    suggestedMax: 60,
                    suggestedMin: 0,
                    stepSize: 10,
                    callback: function(value, index, values){
                    return  value +  '分'
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
    // E------*グラフの処理*------
}