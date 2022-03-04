var oBox = document.getElementsByClassName('box')[0];
var aLi = oBox.getElementsByTagName('div'); // 取得oBox下所有的div元素
var rotateDeg = 360 / aLi.length;

var lastX, lastY, nowX, nowY, minusX, minusY;

// CSS設置的初始值
var roX = -15;
var roY = 0;

const url = "https://picsum.photos/120/180/?random=";
const imgURL = [ url+"1", url+"2", url+"3", url+"4", url+"5", url+"6", url+"7", url+"8", url+"9", url+"10"];

window.onload = function(){
    StartAnime();
    loadImg(...imgURL);
}

// 10秒動畫
function StartAnime(){
    TurnFireworksOn();
    anime.timeline({loop: false})
        .add({
            targets: '.ml15 .word',
            scale: [14,1],
            opacity: [0,1],
            easing: "easeOutCirc",
            duration: 800,
            delay: (el, i) => 800 * i
        }).add({
            targets: '.ml15',
            opacity: [1, 0],
            duration: 1000,
            easing: "easeOutExpo",
            delay: 10000
          });
    setTimeout('TurnFireworksOff()', 13000);
    setTimeout('displayPhoto()', 18000);
}

// 啟動煙火特效
function TurnFireworksOn(){
    $('.container').fireworks();
}

// 關掉煙火特效
function TurnFireworksOff(){
    // 並不是馬上關閉煙火，而是有5秒的時間fadeOut (請看 jquery.fireworks.js 的 source code)
    $('.container').fireworks('destroy');

    // 設置setTimeout是為了配合煙火有5秒的fadeOut
    setTimeout(() => {
        // 隱藏區塊(完全消失)
        var elementOld = document.getElementById("word");
        elementOld.style.display = "none";
    }, 5000);
}

// 載入圖片
function loadImg(...urls){
    // 1. 請求資源
    // 2. 更新圖片src
    Promise.all( urls.map( u => fetch(u)) ).then(
        (responses) => {
            let imgs = oBox.getElementsByTagName('img');
            
            for(let i=0; i<responses.length; i++){
                imgs[i].src = responses[i].url;
            }
        }
    );

}

function displayPhoto(){
    // 顯示區塊
    var elementWrap = document.getElementById("wrap");
    elementWrap.style.display = "block";
    // 加了active會觸發CSS特效(透明度慢慢由0變1)
    var elementTitle = document.getElementById("title");
    elementTitle.className += ' active';
    var elementBox = document.getElementById("box");
    elementBox.className += ' active';

    setTimeout('ShowPhoto()', 2000);
}

function ShowPhoto(){
    // 圓圈布局
    for(let i=0; i<aLi.length; i++){

        aLi[i].style.transition='all 0.5s '+((aLi.length-1-i)*0.2)+'s'; // 為每張圖片設置，開始進行轉場效果之前，所要等待的時間
        aLi[i].style.transform = 'rotateY(' + (i*rotateDeg) + 'deg) translateZ(380px)'; // 為每一個div設置旋轉角度
    }

    ControlImg();   // 圖片放大、縮小

   if(!isMobile()){
        setMouse();
    }
    else{
        setTouch();
    }
}

// 拖動
function setMouse(){
    // 按下滑鼠
    document.onmousedown = function(e){
        // 獲取滑鼠拖動的變化值(作為拖動開始的「初始值」)
        lastX = e.clientX;
        lastY = e.clientY;

        this.onmousemove = function(e){
            // 獲取滑鼠拖動的變化值(作為拖動開始的「目標值」)
            nowX = e.clientX;
            nowY = e.clientY;

            // 距離的差值
            minusX = nowX - lastX;
            minusY = nowY - lastY;

            roX -= minusY * 0.2;
            roY += minusX * 0.1;
            oBox.style.transform = 'rotateX(' + roX + 'deg) rotateY(' + roY + 'deg)';

            // 不斷的更新拖動開始的「初始值」(做到連續動畫的拖動)
            lastX = nowX;
            lastY = nowY;
        }

        // 放開滑鼠就無法拖動
        this.onmouseup = function(){
            this.onmousemove = null;
        }

        return false; // 阻止瀏覽器默認事件
    }
}


function setTouch(){
    var move = false;

    $(document).on('touchstart', function(e){
        lastX = e.originalEvent.changedTouches[0].clientX || e.originalEvent.touches[0].clientX;
        lastY = e.originalEvent.changedTouches[0].clientY || e.originalEvent.touches[0].clientY;
        move = true;

    }).on('touchend', function(e){
        move = false;
    }).on('touchmove', function(e){
        if(move){
            nowX = e.originalEvent.changedTouches[0].clientX || e.originalEvent.touches[0].clientX;
            nowY = e.originalEvent.changedTouches[0].clientY || e.originalEvent.touches[0].clientY;

            minusX = nowX - lastX;
            minusY = nowY - lastY;

            roX -= minusY * 0.2;
            roY += minusX * 0.1;
            oBox.style.transform = 'rotateX(' + roX + 'deg) rotateY(' + roY + 'deg)';

            lastX = nowX;
            lastY = nowY;
        }
    });

    return false; // 阻止瀏覽器默認事件
}


/* =============== 圖片放大、縮小 =============== */
/* =============================================*/

function ControlImg(){
    let imgBox = document.querySelector('.box')

    // 在父元素上綁定點擊事件
    imgBox.addEventListener('click', (e) => {
        if (e.target.nodeName === 'IMG') {
            imgZoomInOut(e) // 放大or縮小
        }
    });

    // 點擊其他位置，圖片會恢復原本大小
    document.addEventListener('click', () => {
        let imgs = oBox.getElementsByTagName('img');
        
         for(let i=0; i<imgs.length; i++){
            imgs[i].className = imgs[i].className.replace('active', '');  // 去掉active
        }
    });
}

function imgZoomInOut(e){
    e.stopPropagation();    //防止被document或父元素監聽到

    // 取得實際觸發事件的元素
    let ele = e.target;
    // 檢查圖片的class裡是否有active
    const isExpand = ele.className && (ele.className.indexOf('active') !== -1);

    // 第一次: 圖片放大，第二次: 恢復大小
    if (!isExpand) {
        ele.className += ' active';
    } else{
        ele.className = ele.className.replace('active', '');
    }
}


// 檢查是否為行動裝置
function isMobile() {
    const mobileDevice = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone']
    let isMobileDevice = mobileDevice.some(e => navigator.userAgent.match(e))
    return isMobileDevice
}