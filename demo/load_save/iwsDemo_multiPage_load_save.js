/**
 * Created by ojb74 on 2017-02-02.
 */

// Clean up
function Clear(){
    multiPage.clear();
}

//Load local image file.
function LoadImage(){
    document.getElementById("fileLoad").value = "";
     //클릭했을 때 발생하는 동작을 멈추는 방법
    $('#fileLoad').click();
};

//Load http image url.
function LoadImageUrl(){

    //http://localhost:8080/IWS_Solution/WebContent/solution/test/images/multi(bw).tif
    var url = prompt("Please enter http url.", "http://");
    multiPage.loadUrl(url);
    //multiPage.appendUrl(url);
};

function SaveImage(){
    multiPage.saveImage();
}

var multiPage;
$(function() {

    //Load local image file.
    $('#fileLoad').on ('change', function(e){
        var file = this.files[0];

        var reader = new FileReader();
        reader.onload = function() {
            //이미지를 새롭게 로딩 합니다.
            multiPage.loadFile(reader.result);
            //이미지를 기존 이미지에 추가합니다.
            //multiPage.appendFile(reader.result);
        };
        reader.readAsArrayBuffer(file);
    });

    
    // Make new viewer instance. 
    var element = document.getElementById("multiPage");
    var opt = {
        fitMode:{name:'auto'}   ,   //이미지 화면 맞춤.
        saveType: 'image'       ,   //저장버튼 클릭시 이미지 저장.
        useAnnotation:false     ,   //주석 사용 여부
        path:'../../'                   //iws.viewer.js 파일이 어디에 있는지 알려줘야 함. (html에서의 상대경로를 넣어도 됨.)
    };
    multiPage = new iws.multiPage(element, opt);

    
    // 이미지 저장.
    multiPage.observe('saveImage', function(data){
        if(data.success){
            saveAs(new Blob([data.byteArray], {type: "image/binary"}), "download.png");
        }
    }, false);

});