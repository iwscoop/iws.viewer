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
    multiPage.appendUrl(url);

    /**
     * 여러파일 로드하여 보여주려면 배열로 처리한다.
     */
    // var url = ['http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_001.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_002.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_003.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_004.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_005.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_006.jpg',
    //     'http://192.168.0.11:8888/IWS_Solution/WebContent/solution/iws/viewer/a_007.jpg']
    // multiPage.appendUrl(url, function(){
    //     console.log('이미지 추가 완료');
    // });
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
            //multiPage.loadFile(reader.result);
            //이미지를 기존 이미지에 추가합니다.
            multiPage.appendFile(reader.result);
        };
        reader.readAsArrayBuffer(file);
    });

    
    // Make new viewer instance. 
    var element = document.getElementById("multiPage");
    var opt = {
        fitMode:{name:'auto'}   ,   //이미지 화면 맞춤.
        saveType: 'image'       ,   //저장버튼 클릭시 이미지 저장.
        path:'../../'                   //iws.viewer.viewer 파일이 어디에 있는지 알려줘야 함. (html에서의 상대경로를 넣어도 됨.)
    };
    multiPage = new iws.multiPage(element, opt);

    // 파일이름 잘라오기.
    function getFileName(pageIndex) {
        var filename = 'download.png';
        var url = multiPage.getUrl(pageIndex);
        var lastpos = url.lastIndexOf('/');
        if (lastpos != -1) {
            filename = url.substr(lastpos + 1, url.length - (lastpos + 1));
        }
        return filename;
    }

    // 이미지 저장 버튼 클릭때 발생하는 이벤트.
    multiPage.observe('saveImage', function(data){
        /*
        // 로컬에 포커스 이미지파일 저장.
        if(data.success){
            var filename = getFileName(multiPage.pageIndex);
            saveAs(new Blob([data.byteArray], {type: "image/binary"}), filename);
        }
        */

        // 로컬에 선택된 이미지 파일 저장.
        multiPage.pageSaveArray(function(imagearray){
            for(var i=0; i<imagearray.length; i++){
                var img = imagearray[i];    //array {index, url, imageArray}
                saveAs(new Blob([img.imageArray], {type: "image/binary"}), getFileName(img.index));
            }
        });

    }, false);

    //'전체 선택' 체크 박스 클릭 이벤트
    multiPage.observe("selectAll", function(checked){
        console.log('All checkbox1 = ' + checked);
    });

    //'전체 선택' 체크 박스 클릭 이벤트
    var btnSelectAll = element.querySelector('.selectall');
    btnSelectAll.addEventListener('click', function(){
        console.log('All checkbox2 = ' + this.checked );
    });

});