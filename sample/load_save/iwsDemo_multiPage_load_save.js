/**
 * Created by ojb74 on 2017-02-02.
 */

// Clean up
function Clear(){
    multiPage.clear();
}

//Load local image file.
function LoadImage(){
     //클릭했을 때 발생하는 동작을 멈추는 방법
    $('#fileLoad').click();
};

//Load http image url.
function LoadImageUrl(){

    //http://localhost:63342/IWS_Solution/WebContent/solution/test/images/multi(bw).tif
    var url = prompt("Please enter http url.", "http://");
    multiPage.loadUrl(url);
    //multiPage.appendUrl(url);
};

//Load annotation string
function LoadAnnotation(){
    $('#fileLoadAnnotation').click();
};

var multiPage;
$(function() {

    //Load local image file.
    $('#fileLoad').on ('change', function(e){
        var file = this.files[0];

        var reader = new FileReader();
        reader.onload = function() {
            multiPage.loadFile(reader.result);
            //multiPage.appendFile(reader.result);
        };
        reader.readAsArrayBuffer(file);
    });

    //Load annotation string
    $('#fileLoadAnnotation').on ('change', function(e){
        var file = this.files[0];

        var reader = new FileReader();
        reader.onload = function() {
            multiPage.loadAnnotation(reader.result);
        };
        reader.readAsText(file);

    });

    
    // Make new viewer instance. 
    var element = document.getElementById("multiPage");
    var opt = {
        fitMode:{name:'auto'}
        , useAnnotation:true,
        path:'./'
    };
    multiPage = new iws.multiPage(element, opt);

    
    // Save button event called by viewer.
    multiPage.observe('saveAnnotation', function(data){
        if(data.success){
            alert(data.annotation);
        }
    }, false);

});