# iws.viewer

Demo - [http://www.iwscoop.co.kr/solution/demo](http://www.iwscoop.co.kr/solution/demo/iws_viewer.html)

### 특징
    MultiTiff Image file support.
    Jpeg2000 Image file support.
    Thumbnail support.
    Annotation support.
    Zoom, rotation support.
-------------------


### 제공
: **Directory**

        dist/
            Engine/
                    iws.w.loader.js
                    iws.w.split.js
            fonts/
                    JejuGothic-Regular.eot
                    JejuGothic-Regular.ttf
                    JejuGothic-Regular.woff
                    JejuGothic-Regular.woff2
            img/
                    iws.annotation.check.V.png
                    iws.annotation.check.X.png
                    iws.viewer.bookmark_32.png
                    iws.viewer.toolbar.blue.png
            vendor/
                    jquery-2.2.3.js
                    hammer.min.js
                    spectrum.css
                    spectrum.js
                    iws-scrollbar.css
                    iws-scrollbar.js
            iws.viewer_46.js
            iws.viewer.css
-------------------


### 설치
: **Include files**
```
    <script src="./vendor/jquery-2.2.3.js"></script>
    <link href="./vendor/spectrum.css" rel="stylesheet">
    <script src="./vendor/spectrum.js"></script>
    <script src="./vendor/hammer.min.js"></script>
    <link href="./vendor/iws-scrollbar.css" rel="stylesheet">
    <script src="./vendor/ iws-scrollbar.js"></script>

    <link href="./iws.viewer.css" rel="stylesheet">
    <script src="./iws.viewer_46.js"></script>
```
-------------------

### 사용법
: **뷰어 생성 Code**
```
    // html 화면에서 뷰어로 사용할 'div' element 필요.
    var element = document.getElementById("multiPage");

    // 적용할 기본값 설정.(설명은 아래에)
    var opt = {
        path:'./'   ,
        fitMode:{name:'auto'},
    };

    //객체 생성. 뷰어로 사용할 element와 옵션을 셋팅합니다.
    multiPage = new iws.multiPage(element, opt);
```
-------------------

### Options
>**path**
- Type : String
- Default : null

    뷰어에서 engine폴더 및 그외의 폴더의 리소스에 접근할때 기준이 되는 경로이므로 필수로 입력 되야 하는 항목입니다.
    iws.viewer.js파일이 있는 경로를 설정하여 넣어준다.
    즉, html과 iws.viewer.js파일이 같은 폴더에 있는 경우 path:'./'이 된다.  iws.viewer.js파일이 html파일의 하위폴더에
    위치한다면 path:'./하위폴더/' 를 입력한다.
    또는 아래와 같이 설정한다.
    path:'/IWS_Solution/WebContent/solution/iws/js',
    path:'http://localhost:8181/IWS_Solution/WebContent/solution/iws/js',

>**fitMode**
- Type : Object
- Default : 자동 맞춤.


    페이지 맞춤을 설정한다.

    자동 맞춤 : fitMode:{name:'auto'}
    가로 맞춤 : fitMode:{name:'width'}
    세로 맞춤 : fitMode:{name:'height'}
    배율 맞춤 : fitMode:{name:'scale', scale:1.0}  >> scale 항목을 추가하여 셋팅함.

>**useAnnotation**
- Type : Boolean
- Default : false


    주석을 사용할지 설정함. (true or false)

>**useMarking**
- Type : Boolean
- Default : false


    마스킹을 사용할지 설정함.

>**useBookMark**
- Type : Boolean
- Default : false


    북마크를 사용할지 설정함.

>**useBookMarkClick**
- Type : Boolean
- Default : false


    북마크 아이콘을 클릭하여 북마크 설정할지 여부

>**readOnlyOne**
- Type : Boolean
- Default : false

    
    멀티페이지 이미지의 경우 첫 페이지만 읽을지 여부
    

>**reSampleUse**
- Type : Boolean
- Default : true


    화면에 보이는 이미지를 가공하여 보기 좋은 이미지로 재생산 하는 기능을 사용할지 여부 결정.


----------------------------

### Methods
>**clear()**

    화면 초기화.

>**appendFile(filedata)**
- filedata : 이미지 파일 바이너리
    - Type : ArrayBuffer


    FileReader or XMLHttpRequest 등을 통하여 가져온 파이너리 데이터를 파라미터로 받아 이미미지를 추가함.

>**appendUrl(url)**
- url : 이미지를 가져올 Http 호출 경로
    - Type : String


    Http url로 접근이 가능한 이미지를 추가함.

>**appendBase64(src)**
- src : Base64 스트링.  
    - Type : String


    Base64 스트링의 이미지를 추가함.
    예) “data:image/jpeg;base64,/9j/4gxYSUNDX1BST0ZJTEUAA ………”


>**loadAnnotation(annotation, index)**
- annotation : 주석스트링
    - Type : String
- index : 페이지 인덱스
    - type : Number    


    뷰어에 전에 저장한 주석을 셋팅한다.

>**saveAnnotation()**

    뷰어에 그려진 주석을 저장한다.
    함수 호출시 저장된 데이터는 아래의 방법으로 얻을 수 있다.
```
    <!--  이벤트로 주석 데이터 받는 방법   -->
    viewer.observe('saveAnnotation', function(data){
        if(data.success){
            alert(data.annotation);
        } else {
            alert('There are no saved comments.');
        }
    }, false);

    data.annotation이 주석 Json데이터임
```


>**saveImage()**

    현재 보고 있는 이미지를 png포멧의 이미지로 저장함.
```
함수 호출시 발생하는 이벤트의 callback function에서 이미지를 얻을 수 있음.

<!--  이벤트로 이미지 데이터 받는 방법   -->
viewer.observe('saveImage', function(data){
    if(data.success){
       //data.byteArray //-->부분이 이미지 데이터임
    }
}, false);
```

>**zoomIn()**

    이미지를 10% 확대함.

>**zoomOut()**

    이미지를 10% 축소함.

>**rotate(angle)**
- angle : 회전 각도
    - Type : Number (90, 180, 270 중에서 선택)


    주어진 각도만큼 회전함.

>**setFitMode(mode)**
- mode : 페이지 맞춤 설정 값. 아래 참고.
    - Type : object

```
    설정값
    자동 맞춤 : mode = {name:'auto'}
    가로 맞춤 : mode = {name:'width'}
    세로 맞춤 : mode = {name:'height'}
    배율 맞춤 : mode = {name:'scale', scale:1.0}  >> scale 항목을 추가하여 셋팅함.

```
    페이지 맞춤을 설정한다.


>**setTrackMode(mode)**
- mode : 마우스 역할 지정.
    - Type : String ('move', 'range', 'glass' 중에서 선택 )
```
    'move'  : 이미지가 화면보다 크면 마우스로 이미지 이동.
    'range' : 마우스 클릭하여 드레그 한 영역의 좌표를 얻어옴
        - 영역 좌표는 아래의 방식(callback function)처럼 선언하여 얻음.
        viewer.observe("mouse:drawRanged", function(rc){
            alert("영역좌표("+rc.left+", "+rc.top+", "+rc.right+", "+rc.bottom+")");
        });
    'glass' : 마우스 클릭하면 돋보기 화면으로 처리됨.
```

    이미지 이동할지, 영역지정할지, 돋보기보기로 할지 지정.


>**pagePrev()**

    이전 페이지로 이동

>**pageNext()**

    다음 페이지로 이동



>**pageCount()**

    페이지 수를 리턴.



>**crop(rect, callback)**
 - rect : {left: value, top:value, right:value, bottom:value} 처럼 위치 정보가 정의된 객체.
 - callback(String src, bytearray binary){}
    - base64 : crop된 이미지가 base64스트링으로 넘어옴.
    - binary : crop된 이미지가 binary형태로 넘어옴. (String과 Binary 두가지를 같이 제공함.)


    컷팅이미지 얻기


>**setPrintString(index, option)**

    출력될 때 페이지마다 특정 스트링을 같이 출력함.
    
- index : Number, 페이지 인덱스
- option : Object, 메시지 및 출력 옵션을 설정함.
    
    
    예) {position:'bottom', font:'24px Jeju Gothic', fillStyle:'#0000ff', message:'...'}
        position : 출력될 위치로 left, top, right, bottom 4가지가 가능함.
	    font : 출력 폰트.
	    fillStyle : 스트링 색상.
        message : 출력될 스트링.


>**setPrintMark(option)**

    : 출력될 때 공통된 마크를 출력함.
- option : Object , 출력될 마크의 정보.

    
    예) {css:'position:absolute; left:50%;top:50%; margin-left:-128px; margin-top:-128px; opacity:0.5', src:'./img/printmark.png'}
        css : 마크가 위치해야 하는 곳을 설정하는 수식. 예제는 가운데 위치시키는 수식임.
        src : 마크로 사용될 이미지의 위치.


>**getBookMark(index)**

    : 인덱스에 해당된 페이지가 북마크 되어 있는지 확인함.
- index : Number, 북마크 체크할 페이지 인덱스.
- return : Boolean, 북마크 되어있으면 true, 그렇지 않으면 false 반환함.


>**setBookMark(index, value)**
    
    : 인덱스해당 페이지를 북마크 처리 혹은 해제함.
- index : Number, 북마크 설정할 페이지 인덱스
- value : Boolean, 북마크 설정은 true, 해제는 false.


>**getKey(index)**

    : 인덱스에 해당하는 페이지의 키정보를 가져옴.
- index : Number, 키정보를 가져올 페이지 인덱스.
- return : String, 해당 페이지의 키정보를 가져옴.

>**setKey(index, value)**
    
    : 인덱스에 해당하는 페이지의 키값을 변경함.
- index : Number, 페이지 인덱스
- value : String, 셋팅할 키정보

>**getCaption(index)**

    : 인덱스에 해당하는 페이지의 캡션을 바꿈.(캡션 : 썸네일 하단에 출력되는 스트링)
- index : Number, 페이지 인덱스
- return : String, 해당 페이지의 캡션(썸네일 하단의 텍스트)을 가져옴.

>**setCaption(index, value)**

    : 인덱스에 해당하는 페이지의 캡션을 변경함.
- index : Numebr, 페이지 인덱스
- value : String, 셋팅할 캡션 스트링.


>**getText(index)**

    : 인덱스에 해당하는 페이지의 텍스트(캡션 하단라인의 작은 폰트의 텍스트)를 바꿈.
- index : Number, 페이지 인덱스
- return : String, 해당 페이지의 텍스트를 가져옴.

>**setText(index, value)**

    : 인덱스에 해당하는 페이지의 텍스트(캡션 하단라인의 작은 폰트의 텍스트)를 변경함.
- index : Numebr, 페이지 인덱스
- value : String, 셋팅할 텍스트 스트링.


>**setAuthority(name, auth)**

    : 주석, 마크의 접근 권한을 변경함.
    예) .setAuthority(‘annotation’, ‘readonly’);
- name : String, ‘annotation’또는 ‘masking’둘 중 하나로 각각 주석또는 마스킹에 대한 선택. 
- auth : ‘unvisible’, ‘readonly’, ‘editable’ 이 올 수 있음. 
    - unvisible : 보이지 않기.
    - readonly : 보기만 가능.
    - editable : 수정 가능


>**destroy()**

    뷰어 객체를 제거함.


-------------------

### Properties

>**pageIndex**


    현재 포커스가 있는 썸네일의 위치를 반환 또는 위치를 셋팅함. (0 base)



-------------------

### Events

>**Annotation save event**

    툴바의 저장 버튼 클릭 또는 saveAnnotation() 함수를 호출하면 발생함.
    데이터를 얻는 방법은 아래와 같이 callback함수를 설정하여 얻음.
```
    viewer.observe('saveAnnotation', function(data){
        if(data.success){
            alert(data.annotation); //data.annotation이 주석 Json데이터임
        } else {
            alert('There are no saved comments.');
        }
    }, false);
```

>**Image save event**

    saveImage()함수를 호출하면 발생함.
    아래와 같은 선언으로 png 이미지 받음.

```
    viewer.observe('saveImage', function(data){
        if(data.success){
            alert(data.byteArray);  //png image
        }
    }, false);
```

>**Select area event**

    fitMode가 영역지정모드('range')인경우 마우스를 드레그하여 마우스를 업 하는 경우 좌표를 포함한 객체를 리턴함.
    아래와 같은 선언으로 좌표를 받음.
```
    viewer.observe("mouse:drawRanged", function(rc){
        alert("영역좌표("+rc.left+", "+rc.top+", "+rc.right+", "+rc.bottom+")");
    });
```


-------------------


### Button support
- 이미지 처리 버튼
    - 이미지 확대/축소
    - 가로 맞춤/세로 맞춤/자동 맞춤
    - 좌로 회전/우로 회전/180도 회전
    - 이미지 이동
    - 영역 선택
    - 돋보기 사용
    - 이전/다음 페이지 이동
- 주석 처리 버튼
    - 주석 선택
    - 자유선 그리기
    - 라인 그리기
    - 화살표 그리기
    - 사각 그리기
    - 타원 그리기
    - 스템프 넣기
    - 텍스트 넣기

-------------------

### Keyboard support
-   ↑ : 썸네일 창에서 이전 썸네일 선택
-   ↓ : 썸네일 창에서 다음 썸네일 선택
-   Shift + a : 페이지 창에서 모든 주석 선택
-   Del : 선택 주석 삭제


-------------------


### Mouse wheel support
- 이미지 확대/축소


-------------------

### Browser support
- Chrome(latest)
- FireFox(latest)
- Edge(latest)
- Internet Explorer 11+

___________________
### License
    미정.
