/**
 * Created by Jiaochi on 2016/12/20.
 */
'use strict';
// 房屋今日数据分析图组
angular.module('app.qx')
    .directive('qxDetail3d', function (lazyScript,apiService) {
        return {
            restrict: 'A',
             scope:{
                 buildingId:'='
            },
            link: function (scope, element, attrs) {
                lazyScript.register('build/vendor.graphs.js').then(function () {
                    var parame={};
                    var scene, camera, renderer, controls, stats;
                    var keyboard = new THREEx.KeyboardState();
                    var clock = new THREE.Clock();

// custom global variables
                    var cube;
                    /*
                    * MY add args
                    */


  apiService.go('QIANXUN.cumulativeShift',{buildingId:scope.buildingId})
  .then(function(resp){
    console.log("查询房屋累计偏移数据>>>:", resp)
    scope.cumulativeShift = [];
    for(var i=0;i<4;i++){
        var item = {
            h:0,
            x:0,
            y:0
        };
        if(resp.data&&resp.data[i]){
            item.h = resp.data[i].h;
            item.x = resp.data[i].x;
            item.y = resp.data[i].y;
        }
        scope.cumulativeShift[i] = item; 
    }
    
    console.log("偏移数据>>>:", scope.cumulativeShift)
    init({});
    animate();
  })
  .catch(function(err){
    console.log("error>>",err);
  });

  $(element).resize(function(event) {

    alert("有问题");
    debugger
      /* Act on the event */
      // console.log(event,$(element).width(),$(element).height())
      $(element).empty();
       // init();
       test();
       init({});
       animate();
  });
/*
* 模型测试版
*/

function test(){
    alert("ok");
}


    // buildingXNumber : null,
    // buildingYNumber : null, 

    // animate : null,

    function init(building){
        console.log("________________");
        var buildingXNumber = building.buildingXNumber || "2";
        var buildingYNumber = building.buildingYNumber || "6";


        var buildingX = building.buildingX || 100;
        var buildingY = building.buildingY || 80;
        var buildingZ = building.buildingZ || 100;
        var haveRoof = building.haveRoof || "1";
        //scene
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x555555, 500, 10000);

        //camera
        camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight, 0.1, 20000);
        camera.position.set(-50,250,1400);
        camera.lookAt(scene.position);
        scene.add(camera);
        //renderer
        console.log(camera.position.x+"/"+camera.position.y+"/"+camera.position.z);
        renderer = new THREE.WebGLRenderer({
            canvas:document.getElementById('ThreeJS'),
            antialias:true
        });
        renderer.setSize(window.innerWidth,window.innerHeight);

        //axes
        var axes = new THREE.AxisHelper( 20000 );
        scene.add(axes);

        //light
        var light = new THREE.PointLight(0xdfebf0, 1.25);
        light.position.set(0, 200, 50);
        light.position.multiplyScalar(5);
        light.castShadow = true;
        scene.add(light);

        // var ambientLight = new THREE.AmbientLight({ color: 0x0c0c0c });
        // scene.add(ambientLight);
        // var hemiLight = new THREE.HemisphereLight(0xaaaaaa, 0xFFFFFF,1.2);
        // hemiLight.position.set(0,1500,0);
        // scene.add(hemiLight);
        //plane
        var groundTexture = new THREE.TextureLoader().load( "./image/back_2.jpg" );
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 25, 25 );
        groundTexture.anisotropy = 16;

        var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );
        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
        mesh.position.y = -buildingY*buildingYNumber/2;
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add( mesh );

        console.log(mesh);
        //cube 大楼 一层
        function createCube(buildingXNumber,buildingYNumber){

            var buildingXNumber = parseInt(buildingXNumber);
            var buildingYNumber = parseInt(buildingYNumber);
            console.log("buildingXNumber:"+buildingXNumber);
            for (var a = 0; a < buildingXNumber+buildingXNumber/2; a++) {
                 console.log("a"+a);
                // if ( (a+1)%2 ==1){
                //     console.log("余数"+a);
                // }
                for (var i = 0; i < buildingYNumber; i++) {
                    // console.log("i"+i);
                    var geometry = new THREE.CubeGeometry( buildingX, buildingY, buildingZ, 1, 1, 1  );
                     var material1 = new THREE.MeshBasicMaterial( { 
                     map: new THREE.TextureLoader().load("./image/qiang_0.jpg"),transparent:true, opacity:0.8 } );
                    var material2 = new THREE.MeshBasicMaterial( { 
                    map: new THREE.TextureLoader().load("./image/zm_2.png"),transparent:true, opacity:0.8 } );
                    var material3 = new THREE.MeshBasicMaterial( { 
                    map: new THREE.TextureLoader().load("./image/bm_11.png"),transparent:true, opacity:0.8 } );
                    var material4 = new THREE.MeshBasicMaterial({ transparent:true, opacity:0.8, color: 0xe9e9e9  });
                    var materials = [material4,material4,material4,material3,material2,material2];
                    var material = new THREE.MultiMaterial( materials );
                    cubeM = new THREE.Mesh( geometry, material );
                    cubeM.position.set(buildingX*a + buildingX/2 - buildingX*(buildingXNumber*1.5)/2,buildingY*(i+1)-buildingY/2 -buildingY*buildingYNumber/2,buildingZ/2);
                    scene.add( cubeM );             

                }
            }
        }
        //添加楼道层
        function addCorridor(buildingXNumber,buildingYNumber){
            var buildingXNumber = parseInt(buildingXNumber);
            var buildingYNumber = parseInt(buildingYNumber);
            for (var i = 0; i < buildingXNumber+buildingXNumber/2; i++) {
                if( (i+1)%3 == 0){
                    console.log('单元'+i);
                    for (var a = 0; a < buildingYNumber; a++) {
                        console.log(a);
                        if (a == 0) {
                            //楼道一层
                            var geometry = new THREE.CubeGeometry( buildingX, buildingY, buildingZ+32, 1, 1, 1  );
                             var material1 = new THREE.MeshBasicMaterial( { 
                             map: new THREE.TextureLoader().load("./image/qiang_0.jpg"),transparent:true, opacity:0.8 } );
                            var material2 = new THREE.MeshBasicMaterial( { 
                            map: new THREE.TextureLoader().load("./image/door_1.png"),transparent:true, opacity:0.8 } );
                            var material3 = new THREE.MeshBasicMaterial( { 
                            map: new THREE.TextureLoader().load("./image/yangtai_20.png"),transparent:true, opacity:0.8 } );
                            var material4 = new THREE.MeshBasicMaterial({ transparent:true, opacity:0.8, color: 0xd9d9d9  });
                            var materials = [material4,material4,material4,material4,material2,material3];
                            var material = new THREE.MultiMaterial( materials );
                            cubeM = new THREE.Mesh( geometry, material );
                            cubeM.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2,parseInt(buildingZ/2) -14);
                            scene.add( cubeM );  
                            //楼道一层 顶部突出
                            var loadTexture = new THREE.TextureLoader().load('./image/far_left.png');
                            var geometry = new THREE.CubeGeometry( 80,5,50 );
                            var material = new THREE.MeshBasicMaterial( { 
                                color: 0xbbbbbb,
                                map:loadTexture,
                                wireframe: false });
                            cube = new THREE.Mesh( geometry, material );
                            cube.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2+37.5,buildingZ + 20);
                            scene.add(cube);
                        } else{
                            //循环向上输出 楼道层
                            var geometry = new THREE.CubeGeometry( buildingX, buildingY, buildingZ + 32, 1, 1, 1  );
                             var material1 = new THREE.MeshBasicMaterial( { 
                             map: new THREE.TextureLoader().load("./image/qiang_0.jpg"),transparent:true, opacity:0.8 } );
                            var material2 = new THREE.MeshBasicMaterial( { 
                            map: new THREE.TextureLoader().load("./image/louti_2.png"), transparent:true, opacity:0.4 } );
                            var material3 = new THREE.MeshBasicMaterial( { 
                            map: new THREE.TextureLoader().load("./image/yangtai_20.png"),transparent:true, opacity:0.8 } );
                            var material4 = new THREE.MeshBasicMaterial({ transparent:true, opacity:0.6, color: 0xd9d9d9 });
                             var materials = [material4,material4,material4,material4,material2,material3];
                            var material = new THREE.MultiMaterial( materials );
                            cubeM = new THREE.Mesh( geometry, material );
                            cubeM.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2,parseInt(buildingZ/2)-14);
                            scene.add( cubeM );
                            //楼道

                            //阳台-far
                            var geometry = new THREE.CubeGeometry( 70,40,5 );
                            var loadTexture = new THREE.TextureLoader().load("./image/far_left.png");
                            var material = new THREE.MeshBasicMaterial( { 
                                color:0xd9d9d9,transparent:true,opacity:0.8,
                                map: loadTexture
                                 });
                            cube = new THREE.Mesh( geometry, material );
                            scene.add(cube);
                            cube.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2 ,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2 -20,buildingZ+40);
                            var geometry = new THREE.CubeGeometry( 35,75,5 );
                            var loadTexture2 = new THREE.TextureLoader().load("./image/far_right.png");
                            var material = new THREE.MeshBasicMaterial( { 
                                color:0xd9d9d9,transparent:true,opacity:0.8,
                                map: loadTexture2
                                
                                 });
                            cube = new THREE.Mesh( geometry, material );
                            cube.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2 +17.5,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2 -2.5,buildingZ+40);

                            // scene.add( cube );
                            //阳台-left
                            var geometry = new THREE.CubeGeometry( 5,40,40 );
                            var material = new THREE.MeshBasicMaterial( { 
                               color:0xc8c8c8,transparent:true,opacity:0.8,
                                
                                 map:loadTexture,
                                 });
                            cube = new THREE.Mesh( geometry, material );
                            cube.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2 - 32.5,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2 -20,buildingZ+20);

                            scene.add( cube );
                            //阳台-right
                            var geometry = new THREE.CubeGeometry( 5,40,40 );
                            var material = new THREE.MeshBasicMaterial( { 
                                color:0xd9d9d9,transparent:true,opacity:0.8,
                                
                                 map:loadTexture2,
                                 });
                            cube = new THREE.Mesh( geometry, material );
                            cube.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2 +32.5,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2 - 20 ,buildingZ + 20);

                            scene.add( cube );
                            //阳台-bottom
                            var geometry = new THREE.CubeGeometry( 70,5,40 );
                            var material = new THREE.MeshBasicMaterial( { 
                                color:0xd9d9d9,transparent:true,opacity:0.8,
                                
                                 map:loadTexture,
                                 });
                            cube = new THREE.Mesh( geometry, material );
                            cube.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2+37.5,buildingZ + 20);
                            scene.add( cube ); 

                        }
                    }
 
                }

            }
        } 
        createCube(buildingXNumber,buildingYNumber);
        addCorridor(buildingXNumber,buildingYNumber);
        console.log(scene);
        var OrbitControls = new THREE.OrbitControls(camera,renderer.domElement); 
        //判断是否有屋顶  添加屋顶
        if ( haveRoof == true) {

            function drawShape(){
                var shape = new THREE.Shape();
                shape.moveTo(0,0);
                shape.lineTo(parseInt(buildingZ/2),50);

                shape.lineTo(parseInt(buildingZ),0);
                shape.lineTo(0,0);

                return shape;
            }
            var options = {

                amount:-parseInt(buildingX)*buildingXNumber*1.5,
                bevelThickness:2,
                bevelSize:1,
                bevelSegments:3,
                bevelEnabled:true,
                curveSegments:12,
                steps:1,
                options:false

            };
            var geometry = new THREE.ExtrudeGeometry(drawShape(), options);
            var materiala = new THREE.MeshBasicMaterial({
                color: 0xe9e9e9,
                transparent: true,
                opacity: 0.8,
                // map : new THREE.TextureLoader().load("./image/qiang_0.jpg") 
            });
            var cube = new THREE.Mesh( geometry , materiala );
            cube.position.set(-buildingX*(buildingXNumber*1.5)/2,parseInt(buildingY*buildingYNumber)/2 + 1,0);
            cube.rotation.y =  -0.5 * Math.PI;
            scene.add(cube);

        }               
    }

 
                   



// FUNCTIONS 		
                    // function init(){
                    //     // SCENE
                    //     scene = new THREE.Scene();
                    //     scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

                    //     // CAMERA
                    //     var SCREEN_WIDTH = $(element).width() || 500,
                    //         SCREEN_HEIGHT = $(element).height() || 300;
                    //     var VIEW_ANGLE = 45, 
                    //         ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, 
                    //         NEAR = 0.1, 
                    //         FAR = 20000;
                    //     camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                    //     scene.add(camera);
                    //     camera.position.set(-50,150,1000);
                    //     // camera.position.set(0,0,1000);
                    //     camera.lookAt(scene.position);
                    //     // RENDERER
                    //      if ( Detector.webgl ){
                    //          renderer = new THREE.WebGLRenderer( {antialias:true} );
                    //      }else{
                    //         renderer = new THREE.CanvasRenderer();
                    //      }
                    //     renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
                    //     $(element).append( renderer.domElement );
                    //     // EVENTS
                    //     THREEx.WindowResize(renderer, camera);
                    //     THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
                    //     // CONTROLS
                    //     controls = new THREE.OrbitControls( camera, renderer.domElement );
                    //     // STATS
                    //     // stats = new Stats();
                    //     // stats.domElement.style.position = 'absolute';
                    //     // stats.domElement.style.bottom = '0px';
                    //     // stats.domElement.style.zIndex = 100;
                    //     //  $(element).append( stats.domElement );
                    //     // LIGHT
                    //     var light = new THREE.PointLight(0xdfebf0, 1.25 );

                    //     light.position.set( 0, 200, 100);
                    //     light.position.multiplyScalar(5);
                    //     light.castShadow = true;
                    //     scene.add(light);
                    //     // ground
                    //     var groundTexture = THREE.ImageUtils.loadTexture( "styles/img/threeD/back_2.jpg" );
                    //     groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
                    //     groundTexture.repeat.set( 25, 25 );
                    //     groundTexture.anisotropy = 16;
                    //     var groundMaterial = new THREE.MeshPhongMaterial({ 
                    //                                     color: 0xffffff, 
                    //                                     specular: 0x111111, 
                    //                                     map: groundTexture } );
                    //     var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
                    //     mesh.position.y = -250;
                    //     mesh.rotation.x = - Math.PI / 2;
                    //     mesh.receiveShadow = true;
                    //     scene.add( mesh );
                    //     // 建筑尺寸
                    //     var build_x = 260,//长
                    //         build_y = 520,//高
                    //         build_z = 130;//宽
                    //    createCube(build_x,build_y,build_z);
                    //    // 创建建筑
                    //     function createCube(w,h,z){
                    //         var cubeGeometry = new THREE.CubeGeometry(w, h, z);
                    //         var cubeMaterialArray = [
                    //                 loadTexture( 'styles/img/threeD/cm_11.png' ), // right
                    //                 loadTexture( 'styles/img/threeD/cm_11.png' ), // left
                    //                 loadTexture( 'styles/img/threeD/bm_11.png' ), // top
                    //                 loadTexture( 'styles/img/threeD/bm_11.png' ), // bottom
                    //                 loadTexture( 'styles/img/threeD/zm_11.png' ), // front
                    //                 loadTexture( 'styles/img/threeD/bm_11.png' )  // back
                    //                 ];
                    //         var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);

                    //         cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
                    //         cube.position.set(0, 20,65); //立方体放置的位置 
                    //         scene.add(cube);
                    //         cube.rotateX(Math.PI);
                    //         cube.rotateY(Math.PI);
                    //         cube.rotateZ(Math.PI);
                    //     console.log("cube>>>",cube);
                    //     }
                    //     // 建筑材质贴图
                    //     function loadTexture(path){
                    //         var texture = new THREE.ImageUtils.loadTexture(path);
                    //         var material = new THREE.MeshBasicMaterial({
                    //                             map : texture,
                    //                             transparent:true,
                    //                             opacity:0.8
                    //                         });
                    //         return material;
                    //     }
                      
                    //     //修改为动画渲染场景到镜头
                    //     function render(){
                    //         requestAnimationFrame(render);
                    //         // cube.rotation.y += 0.01;
                    //         renderer.render(scene, camera);
                    //     }
                    //     //调用render方法
                    //     // render();

                    //     createLineCube();
                    //     // 绘制形变后的线形建筑模型
                    //     function createLineCube(){
                    //     var lineGeometry = new THREE.Geometry();
                    //     var vertArray = lineGeometry.vertices;
                    //     // 1:NEU  2:SEU 3:SWU 4:NWU 5:NED  6:SED 7:SWD 8:NWD
                    //     //描绘红色的线
                    //     var x=150;
                    //      // 上部右后点
                    //     var vct1 = new THREE.Vector3(
                    //         build_x/2+scope.cumulativeShift[0].y, 
                    //         build_y/2+20+scope.cumulativeShift[0].h, 
                    //         0+scope.cumulativeShift[0].x
                    //         );
                    //     // 上部右前点
                    //     var vct2 = new THREE.Vector3(
                    //         build_x/2+scope.cumulativeShift[1].y, 
                    //         build_y/2+20+scope.cumulativeShift[1].h, 
                    //         build_z+scope.cumulativeShift[1].x
                    //         );
                    //     // 上部左前点
                    //     var vct3 = new THREE.Vector3(
                    //         -build_x/2+scope.cumulativeShift[2].y, 
                    //         build_y/2+20+scope.cumulativeShift[2].h, 
                    //         build_z+scope.cumulativeShift[2].x
                    //         );
                    //     // 上部左后点
                    //     var vct4 = new THREE.Vector3(
                    //         -build_x/2+scope.cumulativeShift[3].y, 
                    //         build_y/2+20+scope.cumulativeShift[3].h, 
                    //         0+scope.cumulativeShift[3].x
                    //         );

                    //     // 底部右后点
                    //     var vct5 = new THREE.Vector3(build_x/2, -(build_y/2)+20, 0);
                    //     // 底部右前点
                    //     var vct6 = new THREE.Vector3(build_x/2, -(build_y/2)+20, build_z);
                    //     // 底部左前点
                    //     var vct7 = new THREE.Vector3(-build_x/2, -(build_y/2)+20, build_z);
                    //     // 底部左后点
                    //     var vct8 = new THREE.Vector3(-build_x/2, -(build_y/2)+20, 0);
                    //     // 竖线
                    //     vertArray.push( vct8, vct4 );   //8->4
                    //     vertArray.push( vct2, vct6 );   //6->2
                    //     vertArray.push( vct7, vct3 );   //7->3
                    //     vertArray.push( vct1, vct5 );    //1->5
                    //     // 顶
                    //     vertArray.push( vct1, vct2 );
                    //     vertArray.push( vct3, vct2 );
                    //     vertArray.push( vct4, vct3 );
                    //     vertArray.push( vct4, vct1 );
                    //     // 底
                    //     vertArray.push(vct5, vct6 );    // 8->7
                    //     vertArray.push( vct6, vct7 );   // 8->5
                    //     vertArray.push( vct7, vct8 );   // 5->6
                    //     vertArray.push( vct8, vct5 );   // 6->7

                    //     lineGeometry.computeLineDistances();
                    //     var lineMaterial = new THREE.LineBasicMaterial( { color: getColor(x),linewidth:2 } );
                    //     console.log(lineMaterial);
                    //     var line = new THREE.Line( lineGeometry, lineMaterial );
                    //     scene.add(line);

                    //     }
                    //      function getColor(a) {
                    //         return 0x038fd0;
                    //         // return 0xcc0000;
                    //         if(a<140){
                    //             return 0xcc0000;
                    //         }
                    //         else if(a==150){
                    //             return 0xcc00ff;
                    //         }
                    //         else{
                    //             return 0xccffff;
                    //         }
                    //     }

                    //     // createBall();
                    //     function createBall(){
                    //         var sphereGeometry = new THREE.SphereGeometry(10,20, 20);
                    //         var sphereMaterial = new THREE.MeshLambertMaterial({
                    //             color : 0xff0000,
                    //             transparent:true,
                    //             opacity:0.5
                    //         });
                    //         var meshs=new THREE.Mesh(sphereGeometry,sphereMaterial);
                    //         scene.add(meshs);
                    //         meshs.position.set(0,100,130);
                    //     }
                         


                    //     // createRedIcon();
                    //     function createRedIcon(){
                    //         var lineGeometrys = new THREE.Geometry();
                    //         var vertArrays = lineGeometrys.vertices;
                    //         var vct9 = new THREE.Vector3(build_x/2, (build_y/2)+20, build_z);
                    //         var vct10 = new THREE.Vector3(build_x/2+3, (build_y/2)+20, build_z);
                    //         var vct11 = new THREE.Vector3(build_x/2, (build_y/2)+20+3, build_z);
                    //         var vct12 = new THREE.Vector3(build_x/2+3, (build_y/2)+20+3, build_z);
                    //         vertArrays.push( vct9, vct10 );
                    //         vertArrays.push( vct11, vct12 );
                    //         vertArrays.push( vct9, vct11 );
                    //         vertArrays.push( vct10, vct12 );
                    //         lineGeometrys.computeLineDistances();
                    //         var lineMaterials = new THREE.LineBasicMaterial( { color: 0xff0000,linewidth:5 } );
                    //         var lines = new THREE.Line( lineGeometrys, lineMaterials );
                    //         scene.add(lines);
                    //     }
                      
                    //     // 右后点
                    //     createSpritey(  build_x/2, 
                    //                     build_y/2+40, 
                    //                     0,
                    //                     "监测1(X:"+scope.cumulativeShift[0].x+", Y:"+scope.cumulativeShift[0].y+", Z:"+scope.cumulativeShift[0].h+")");
                    //     // 右前点
                    //     createSpritey(
                    //                     build_x/2, 
                    //                     build_y/2+40, 
                    //                     build_z,
                    //                     "监测2(X:"+scope.cumulativeShift[1].x+", Y:"+scope.cumulativeShift[1].y+", Z:"+scope.cumulativeShift[1].h+")");
                    //    // 左前点
                    //     createSpritey(
                    //                     -build_x/2,
                    //                     build_y/2+40, 
                    //                     build_z,
                    //                     "监测3(X:"+scope.cumulativeShift[2].x+", Y:"+scope.cumulativeShift[2].y+", Z:"+scope.cumulativeShift[2].h+")");
                    //     // 左后点
                    //     createSpritey(
                    //                     -build_x/2,
                    //                     build_y/2+40, 
                    //                     0,
                    //                     "监测4(X:"+scope.cumulativeShift[3].x+", Y:"+scope.cumulativeShift[3].y+", Z:"+scope.cumulativeShift[3].h+")");
                    //     // 顶部检测信息
                    //     function createSpritey(x,y,z,txt){
                    //         var spritey = makeTextSprite( txt,
                    //         {   fontsize: 20, 
                    //             borderColor: {r:63, g:63, b:63, a:1.0}, 
                    //             backgroundColor: {r:235, g:235, b:235, a:0.8} 
                    //         } );
                    //         spritey.position.set(x, y, z);
                    //         scene.add( spritey );
                    //     }


                      
                    //     // 四个监测仪器的形状
                    //     createAntenna(scene, build_x/2, build_y/2+25, 0);
                    //     createAntenna(scene, build_x/2, build_y/2+25, build_z);
                    //     createAntenna(scene, -build_x/2, build_y/2+25, build_z);
                    //     createAntenna(scene, -build_x/2, build_y/2+25, 0);
                    // }

                
                    function createAntenna(scene, x, y, h){
                        // cylinder
                        var crateMaterial = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.8 } );
                        var multiMaterial = [  crateMaterial ];
                        var shape = THREE.SceneUtils.createMultiMaterialObject(
                            // radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
                            new THREE.CylinderGeometry( 1, 1, 10, 20, 4 ),
                            multiMaterial );
                        shape.position.set(x, y, h);
                        scene.add( shape );
                        // console.log('shape',shape);
                        // dome
                        var shape = THREE.SceneUtils.createMultiMaterialObject(
                            new THREE.SphereGeometry( 3, 32, 16, 0, 2 * Math.PI, 0, Math.PI / 2 ),
                            multiMaterial );
                        // should set material to doubleSided = true so that the 
                        //   interior view does not appear transparent.
                        shape.position.set(x, y+3, h);
                        scene.add( shape );
                    }

                    var parame;
                    function makeTextSprite( message, parameters )
                    {
                        parame=arguments[1];
                        if ( parameters === undefined ) parameters = {};

                        var fontface = parameters.hasOwnProperty("fontface") ?
                            parameters["fontface"] : "Arial";

                        var fontsize = parameters.hasOwnProperty("fontsize") ?
                            parameters["fontsize"] : 18;

                        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
                            parameters["borderThickness"] : 4;

                        var borderColor = parameters.hasOwnProperty("borderColor") ?
                            parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

                        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
                            parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

                        var spriteAlignment = THREE.SpriteAlignment.topLeft;

                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext('2d');
                        context.font = "Bold " + fontsize + "px " + fontface;

                        // get size data (height depends only on font size)
                        var metrics = context.measureText( message );
                        var textWidth = metrics.width;

                        // background color
                        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                            + backgroundColor.b + "," + backgroundColor.a + ")";
                        // border color
                        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                            + borderColor.b + "," + borderColor.a + ")";

                        context.lineWidth = borderThickness;
                        roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
                        // 1.4 is extra height factor for text below baseline: g,j,p,q.

                        // text color
                        context.fillStyle = "rgba(0, 0, 255, 1.0)";

                        context.fillText( message, borderThickness, fontsize + borderThickness);

                        // canvas contents will be used for a texture
                        var texture = new THREE.Texture(canvas);
                        texture.needsUpdate = true;

                        var spriteMaterial = new THREE.SpriteMaterial(
                            { map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
                        var sprite = new THREE.Sprite( spriteMaterial );
                        sprite.scale.set(120,50,1.0);
                      
                        return sprite;
                    }

// function for drawing rounded rectangles

                    function roundRect(ctx, x, y, w, h, r)
                    {
                        ctx.beginPath();
                        ctx.moveTo(x+r, y);
                        ctx.lineTo(x+w-r, y);
                        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
                        ctx.lineTo(x+w, y+h-r);
                        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
                        ctx.lineTo(x+r, y+h);
                        ctx.quadraticCurveTo(x, y+h, x, y+h-r);
                        ctx.lineTo(x, y+r);
                        ctx.quadraticCurveTo(x, y, x+r, y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }


                    function animate()
                    {
                        requestAnimationFrame( animate );
                        render();
                        update();
                    }

                    function update()
                    {
                        if ( keyboard.pressed("z") )
                        {
                            // do something
                        }

                        controls.update();
                        // stats.update();
                    }

                    function render()
                    {
                        renderer.render( scene, camera );
                    }

                    function geo2line( geo ) // credit to WestLangley!
                    {
                        var geometry = new THREE.Geometry();
                        var vertices = geometry.vertices;
                        for ( var i = 0; i < geo.faces.length; i++ )
                        {
                            var face = geo.faces[ i ];
                            if ( face instanceof THREE.Face3 )
                            {
                                var a = geo.vertices[ face.a ].clone();
                                var b = geo.vertices[ face.b ].clone();
                                var c = geo.vertices[ face.c ].clone();
                                vertices.push( a,b, b,c, c,a );
                            }
                        }

                        geometry.computeLineDistances();
                        return geometry;
                    }
                })
            }
        }
    });