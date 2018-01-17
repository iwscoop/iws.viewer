/**
 * Created by ojb74 on 2017-02-02.
 */

function Clear(){
    multiPage.clear();
}

function LoadImageUrl(){
    //여러파일 경로 셋팅은 배열로.
    // var url = ['http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_001.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_002.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_003.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_004.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_005.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_006.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_007.jpg']
    // multiPage.loadUrl(url, function(){
    //     console.log('이미지 추가 완료');
    // });


    //http://localhost:63342/IWS_Solution/WebContent/solution/test/images/multi(bw).tif
    var url = prompt("Please enter http url.", "http://");
    multiPage.appendUrl(url, function(){
        console.log('이미지 추가 완료');
    });
};

function AppendContents_http(){
    var ann0 = '{"version":1,"angle":0,"annotation":[{"type":"rect","left":79.76,"top":66.9,"width":560.29,"height":273.53,"stroke":"rgb(255, 0, 0)","strokeWidth":4,"scaleX":1.04,"scaleY":2.13,"angle":0,"opacity":1,"visible":true,"backgroundColor":"rgba(100, 149, 237, 0.56)"},{"type":"text","left":803.31,"top":6.62,"width":498.53,"height":76.81,"stroke":null,"strokeWidth":1,"scaleX":1,"scaleY":1,"angle":0,"opacity":1,"visible":true,"text":"메모를 넣습니다.","fontColor":"rgb(0, 0, 255)","backgroundColor":"rgba(100, 149, 237, 0.34)","fontSize":64,"fontWeight":"normal","fontFamily":"Jeju Gothic","fontStyle":"normal"}],"masking":[]}';
    var ann1 = 'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_002.ann';

    var datas = [];
    datas.push({type:'video', caption:'사고영상1',
        sources: {
            src: 'http://www.iwscoop.co.kr/demo_video/mov_bbb.mp4',
            type: 'video/mp4'
        }
    });
    datas.push({type:'video', caption:'사고영상2',
        sources: {
            src: 'http://www.iwscoop.co.kr/demo_video/01_View_From_A_Blue_Moon_Trailer-HD.mp4',
            type: 'video/mp4'
        },
        poster: 'http://www.iwscoop.co.kr/demo_video/01_View_From_A_Blue_Moon_Trailer-HD.jpg' //포스터 이미지가 있으면 링크시킨다.
    });
    datas.push({type:'video', caption:'사고영상3',
        sources: {
            src: 'http://www.iwscoop.co.kr/demo_video/sintel_640x360_2.28.mp4',
            type: 'video/mp4'
        }
    });
    datas.push({type:'image', caption:'a_001.jpg', text:'1', url:'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_001.jpg', annotation:ann0 });
    datas.push({type:'image', key:'0001', caption:'a_002.jpg', text:'2', url:'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_002.jpg', annotation:ann1 });
    datas.push({type:'image', key:'0002', caption:'b_001.tif', url:'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/b_001.tif', annotation:ann0 });
    datas.push({type:'image', caption:'a_003.jpg', url:'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_003.jpg'});
    multiPage.appendContents(datas, function(){
        console.log('이미지 추가 완료');
    });
}


//프린트 스트링 셋팅.
function printStringSet(){
    for(var i=0; i<multiPage.pageCount(); i++){
        switch(i %4){
            case 0:
                position='right';
                break;
            case 1:
                position='top';
                break;
            case 2:
                position='left';
                break;
            case 3:
                position='bottom';
                break;
        }

        multiPage.setPrintString(i, {position:position, font:'24px Jeju Gothic', fillStyle:'#0000ff', message:'k7d0z6awL_1pfTUSxR1_hWnYlis0R_m0PoZl2xE_SUwy8gPL1_AoFAoFAoF_AoFA'});
    }
}

function printMark(){
    // 가운데 배치하기 위한 CSS
    // margin-left:-128px;margin-top:-128px; 부분의 -128은 이미지 크기의 절반값.
    // opacity 값 조절을 통하여 투명도 설정.
    multiPage.setPrintMark({css:'position:absolute; left:50%;top:50%;margin-left:-128px;margin-top:-128px;opacity:0.5', src:'../../img/iws.viewer.printmark.png'});
}

function AllPrint(){

    //전체 선택
    for(var i=0; i<multiPage.pageCount(); i++){
        multiPage.setSelect(i, true);
    }

    //출력
    multiPage.print();

    //전체 선택해제
    for(var i=0; i<multiPage.pageCount(); i++){
        multiPage.setSelect(i, false);
    }
}

//북마크 설정.
function Bookmark(index){
    var value = multiPage.getBookmark(index);
    multiPage.setBookmark(index, !value);
}

//키정보 얻기.
function getKey(){
    var keys = '';
    for(var i=0; i<multiPage.pageCount(); i++){
        keys += '  index :' + i.toString() +' = '+ multiPage.getKey(i);  + '\r\n';
    }
    alert(keys);
}
//키정보 셋팅.
function setKey(){
    for(var i=0; i<multiPage.pageCount(); i++){
        multiPage.setKey(i, i.toString());
    }
}

//썸네일 하단의 텍스트 얻기
function getCaption(){
    var captions = '';
    for(var i=0; i<multiPage.pageCount(); i++){
        captions += '  index : ' + i.toString() + ' = ' + multiPage.getCaption(i);  + '\r\n';
    }
    alert(captions);
};
//썸네일 하단의 텍스트 셋팅.
function setCaption(){
    for(var i=0; i<multiPage.pageCount(); i++){
        multiPage.setCaption(i, '신청서 : ' + i.toString());
    }
};
//썸네일 하단의 텍스트 삭제.
function clearCaption(){
    for(var i=0; i<multiPage.pageCount(); i++){
        multiPage.setCaption(i, '');
    }
}

//썸네일 하단의 2라인 텍스트 얻기
function getText(){
    var captions = '';
    for(var i=0; i<multiPage.pageCount(); i++){
        captions += '  index : ' + i.toString() + ' = ' + multiPage.getText(i);  + '\r\n';
    }
    alert(captions);
};
//썸네일 하단의 2라인 텍스트 셋팅.
function setText(){
    for(var i=0; i<multiPage.pageCount(); i++){
        multiPage.setText(i, i.toString());
    }
};
//썸네일 하단의 2라인 텍스트 삭제
function clearText(){
    for(var i=0; i<multiPage.pageCount(); i++){
        multiPage.setText(i, '');
    }
}

//주석 및 마스킹 권한 설정.
function setAuthority(name, auth){
    //'annotation', 'unvisible'
    //'annotation', 'readonly'
    //'annotation', 'editable'
    //'masking', 'unvisible'
    //'masking', 'readonly'
    //'masking', 'editable'
    multiPage.setAuthority(name, auth);
}

var multiPage;
$(function() {  //  same this string ==> "$(document).ready(function() {});" 

    $('#fileLoad').on('click touchstart' , function(){
        $(this).val('');
    });


    $('#appendAnnotString').on('click', function(){
        var json = $('#annotString').val();
        multiPage.loadAnnotation(json);
    });

    var element = document.getElementById("multiPage");
    var opt = {
        thumbShow:true,
        fitMode:{name:'auto'},
        useAnnotation:true,
        useMasking:true,        //마스킹 툴바가 화면에 보이게 함.
        useBookMark:true,       //북마크 사용함.
        //useThumbNumber:false,  //썸네일 영역의 우측상단 번호보기
        readOnlyOne : true,     //멀티페이지 일경우 1페이지만 읽는다.

        path:'../'   ,   //iws.viewer.js 파일에 접근가능한 경로를 넣는다.
        //path:'/IWS_Solution/WebContent/solution/iws/viewer',
        //path:'http://localhost:8181/IWS_Solution/WebContent/solution/iws/js',
        reSampleUse:true,
        saveType: 'annotation'       ,   //저장버튼 클릭시 주석 저장.

    };
    multiPage = new iws.multiPage(element, opt);

    multiPage.observe('saveAnnotation', function(data){
        if(data.success){
            alert(data.annotation);
            //saveAs(new Blob([data.annotation], {type: "application/json"}), "download.txt");

            $('#annotString').val(data.annotation);
        } else {
            alert('There are no saved comments.');
        }
    }, false);

    multiPage.observe("mouse:drawRanged", function(rc){
        alert("영역좌표("+rc.left+", "+rc.top+", "+rc.right+", "+rc.bottom+")");
    });

});