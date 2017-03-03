/**
 * Created by Jiaochi on 2016/12/20.
 */
'use strict';
// 房屋今日数据分析图组
angular.module('app.qx')
    .directive('qxDetail3d', function (lazyScript) {
        return {
            restrict: 'A',

            // scope: {
            //     syncExtremes: '='
            // },
            link: function (scope, element, attrs) {
                lazyScript.register('build/vendor.graphs.js').then(function () {
                    var parame={};
                    var container, scene, camera, renderer, controls, stats,imgFile;
                    var keyboard = new THREEx.KeyboardState();
                    var clock = new THREE.Clock();
// custom global variables
                    var cube;
                    init();
                    animate();
                    console.log('this');

// FUNCTIONS 		
                    function init()
                    {
                        // SCENE
                        scene = new THREE.Scene();
                        scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );
                        //添加坐标轴
                         //axes
                         var axes = new THREE.AxisHelper( 20000 );
                         scene.add(axes);
                        // CAMERA
                        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
                        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
                        camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
                        scene.add(camera);
                        camera.position.set(-50,150,1000);
                        camera.lookAt(scene.position);
                        // RENDERER
                        if ( Detector.webgl )
                            renderer = new THREE.WebGLRenderer( {antialias:true} );
                        else
                            renderer = new THREE.CanvasRenderer();
                        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
                        container = document.getElementById( 'ThreeJS' );
                        container.appendChild( renderer.domElement );
                        // EVENTS
                        THREEx.WindowResize(renderer, camera);
                        THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
                        // CONTROLS
                        controls = new THREE.OrbitControls( camera, renderer.domElement );
                        // STATS
                        stats = new Stats();
                        stats.domElement.style.position = 'absolute';
                        stats.domElement.style.bottom = '0px';
                        stats.domElement.style.zIndex = 100;
                        container.appendChild( stats.domElement );
                        // LIGHT
                        var light = new THREE.PointLight(0xdfebf0, 1.25 );
                        // light.position.set(0,250,0);
                        light.position.set( 0, 200, 100);
                        light.position.multiplyScalar(5);
                        light.castShadow = true;
                        // light.shadow.mapSize.width = 1024;
                        // light.shadow.mapSize.height = 1024;

                        // var d = 300;

                        // light.shadow.camera.left = - d;
                        // light.shadow.camera.right = d;
                        // light.shadow.camera.top = d;
                        // light.shadow.camera.bottom = - d;

                        // light.shadow.camera.far = 1000;
                        scene.add(light);

                        // light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
                        // light.position.set( 50, 200, 100 );
                        // light.position.multiplyScalar( 1.3 );

                        // light.castShadow = true;

                        // light.shadow.mapSize.width = 1024;
                        // light.shadow.mapSize.height = 1024;

                        // var d = 300;

                        // light.shadow.camera.left = - d;
                        // light.shadow.camera.right = d;
                        // light.shadow.camera.top = d;
                        // light.shadow.camera.bottom = - d;

                        // light.shadow.camera.far = 1000;

                        // scene.add( light );

                        // // FLOOR
                        // var floorTexture = new THREE.ImageUtils.loadTexture( 'images/grass-512.jpg' );
                        // floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
                        // floorTexture.repeat.set( 10, 10 );
                        // var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
                        // var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
                        // var floor = new THREE.Mesh(floorGeometry, floorMaterial);
                        // floor.position.y = -0.5;
                        // floor.rotation.x = Math.PI / 2;
                        // floor.name = "Checkerboard Floor";
                        // scene.add(floor);
// ground


                        var groundTexture = THREE.ImageUtils.loadTexture( "styles/img/threeD/back_2.jpg" );
                        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
                        groundTexture.repeat.set( 25, 25 );
                        groundTexture.anisotropy = 16;

                        var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

                        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
                        mesh.position.y = -250;
                        mesh.rotation.x = - Math.PI / 2;
                        mesh.receiveShadow = true;
                        scene.add( mesh );

                        // scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

                        ////////////
                        // CUSTOM //
                        ////////////

                        //var cubeGeometry = new THREE.CubeGeometry( 100, 100, 100);
                        //var crateMaterial = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.5 } );
                        //var crateMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff, transparent: true, opacity: 0.5 } );
                        //偏移线******************************************
                        //var crate = new THREE.Mesh( cubeGeometry.clone(), crateMaterial );
                        //var crate= new THREE.Mesh(
                        //new THREE.SphereGeometry(20,20),                //width,height,depth
                        //new THREE.MeshLambertMaterial({color: 0xff0000}) //材质设定
                        //);
                        //crate.position.set(0, 50, 50);
                        //scene.add( crate );
                        /*
                         var cubeGeometry = new THREE.CubeGeometry(260, 520, 160, 1, 1, 1);

                         var cubeMaterialArray = [];
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/side_c2.png'),
                         transparent:true
                         }));
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/side_c2.png'),
                         transparent:true
                         }));
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/侧面.png'),
                         transparent:true
                         }));
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/侧面.png'),
                         transparent:true
                         }));
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/side_z1.png'),
                         transparent:true
                         }));
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/side_c2.png'),
                         transparent:true
                         }));
                         var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);

                         cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
                         cube.position.set(500, 25, 120); 立方体放置的位置 
                         scene.add(cube);
                         cube.rotateX(Math.PI);
                         cube.rotateY(Math.PI);
                         cube.rotateZ(Math.PI);

                         */


                        //屋顶*********************************************************************************
                        /*
                         var cubeGeometry = new THREE.CubeGeometry(260, 520, 160, 1, 1, 1);

                         var cubeMaterialArray = [];
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/lou_1.png'),
                         transparent:true,opacity:0.8
                         }));
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/lou_1.png'),
                         transparent:true,opacity:0.8
                         }));
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/top_1.jpg'),
                         transparent:true,opacity:0.8
                         }));
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/top_1.jpg'),
                         transparent:true,opacity:0.8
                         }));
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/lou_1.png'),
                         transparent:true,opacity:0.8
                         }));
                         cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                         map : new THREE.ImageUtils.loadTexture('images/lou_1.png'),
                         transparent:true,opacity:0.8
                         }));
                         var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);

                         cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
                         cube.position.set(-125, 25, 300); 立方体放置的位置 
                         scene.add(cube);
                         cube.rotateX(Math.PI);
                         cube.rotateY(Math.PI);
                         cube.rotateZ(Math.PI);
                         */

//楼3****************************************************************************

                        var cubeGeometry = new THREE.CubeGeometry(260, 520, 130, 1, 1, 1);

                        var cubeMaterialArray = [];
                        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                            map : new THREE.ImageUtils.loadTexture('styles/img/threeD/cm_11.png'),
                            transparent:true,opacity:0.8
                        }));
                        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                            map : new THREE.ImageUtils.loadTexture('styles/img/threeD/cm_11.png'),
                            transparent:true,opacity:0.8
                        }));
                        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                            map : new THREE.ImageUtils.loadTexture('styles/img/threeD/bm_11.png'),
                            transparent:true,opacity:0.8
                        }));
                        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                            map : new THREE.ImageUtils.loadTexture('styles/img/threeD/bm_11.png'),
                            transparent:true,opacity:0.8
                        }));
                        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                            map : new THREE.ImageUtils.loadTexture('styles/img/threeD/zm_11.png'),
                            transparent:true,opacity:0.8
                        }));
                        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                            map : new THREE.ImageUtils.loadTexture('styles/img/threeD/bm_11.png'),
                            transparent:true,opacity:0.8
                        }));
                        var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);

                        cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
                        cube.position.set(0, 20,65); //立方体放置的位置 
                        scene.add(cube);
                        cube.rotateX(Math.PI);
                        cube.rotateY(Math.PI);
                        cube.rotateZ(Math.PI);
                        console.log(cube);
                        //楼层*****************************************************
//	var cubeGeometry = new THREE.CubeGeometry(260, 50, 160, 1, 1, 1);
//
//	var cubeMaterialArray = [];
//	cubeMaterialArray.push(new THREE.MeshBasicMaterial({
//		map : new THREE.ImageUtils.loadTexture('images/top_1.jpg'),
//		transparent:true
//	}));
//	cubeMaterialArray.push(new THREE.MeshBasicMaterial({
//		map : new THREE.ImageUtils.loadTexture('images/top_1.jpg'),
//		transparent:true
//	}));
//	cubeMaterialArray.push(new THREE.MeshBasicMaterial({
//		map : new THREE.ImageUtils.loadTexture('images/top_1.jpg'),
//		transparent:true
//	}));
//	cubeMaterialArray.push(new THREE.MeshBasicMaterial({
//		map : new THREE.ImageUtils.loadTexture('images/top_1.jpg'),
//		transparent:true
//	}));
//	cubeMaterialArray.push(new THREE.MeshBasicMaterial({
//		map : new THREE.ImageUtils.loadTexture('images/top_1.jpg'),
//		transparent:true
//	}));
//	cubeMaterialArray.push(new THREE.MeshBasicMaterial({
//		map : new THREE.ImageUtils.loadTexture('images/top_1.jpg'),
//		transparent:true
//	}));
//	var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);
//
//	cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
//	cube.position.set(-125, 280, 300); <!-- 立方体放置的位置 -->
//	scene.add(cube);
//	cube.rotateX(Math.PI);
//	cube.rotateY(Math.PI);
//	cube.rotateZ(Math.PI);
//修改为动画渲染场景到镜头
                        function render(){
                            requestAnimationFrame(render);
                            //cube.rotation.x += 0.03;
                            cube.rotation.z += 0.03;
                            //cube.rotation.y += 0.01;
                            renderer.render(scene, camera);
                        }
//调用render方法
                        //render();


                        /**
                         var lineGeometry = new THREE.Geometry();
                         var vertArray = lineGeometry.vertices;
                         // 1:NEU  2:SEU 3:SWU 4:NWU 5:NED  6:SED 7:SWD 8:NWD
                         var vct1 = new THREE.Vector3(50, 100, 0);
                         var vct2 = new THREE.Vector3(50, 100, 100);
                         var vct3 = new THREE.Vector3(-50, 100, 100);
                         var vct4 = new THREE.Vector3(-50, 100, 0);
                         var vct5 = new THREE.Vector3(50, 0, 0) ;
                         var vct6 = new THREE.Vector3(50, 0, 100) ;
                         var vct7 = new THREE.Vector3(-50, 0, 100) ;
                         var vct8 = new THREE.Vector3(-50, 0, 0);

                         vertArray.push( vct5, vct6 );	// 5->6
                         vertArray.push( vct6, vct7 );	// 6->7
                         vertArray.push(vct7, vct8 );	// 7->8
                         vertArray.push( vct8, vct5 );	// 8->5

                         vertArray.push( vct8, vct4 );	//8->4
                         vertArray.push( vct5, vct1 );	//5->1
                         vertArray.push( vct6, vct2 );	//6->2
                         vertArray.push( vct7, vct3 );	//7->3

                         vertArray.push( vct1, vct2 );
                         vertArray.push( vct2, vct3 );
                         vertArray.push( vct3, vct4 );
                         vertArray.push( vct4, vct1 );

                         lineGeometry.computeLineDistances();
                         var lineMaterial = new THREE.LineDashedMaterial( { color: 0x001111, dashSize: 1, gapSize: 3 } );
                         var line = new THREE.Line( lineGeometry, lineMaterial );
                         scene.add(line);
                         */

                        var lineGeometry = new THREE.Geometry();
                        var vertArray = lineGeometry.vertices;
                        // 1:NEU  2:SEU 3:SWU 4:NWU 5:NED  6:SED 7:SWD 8:NWD
                        //描绘红色的线
                        var x=150;
                        var vct1 = new THREE.Vector3(x, 280, 0);
                        var vct2 = new THREE.Vector3(x, 280, 130);
                        var vct3 = new THREE.Vector3(-130, 280, 130);
                        var vct4 = new THREE.Vector3(-130, 280, 0);
                        var vct5 = new THREE.Vector3(130, -240, 0);
                        var vct6 = new THREE.Vector3(130, -240, 130);
                        var vct7 = new THREE.Vector3(-130, -240, 130);
                        var vct8 = new THREE.Vector3(-130, -240, 0);



                        vertArray.push( vct8, vct4 );	//8->4
//	vertArray.push( vct5, vct1 );	//5->1
                        vertArray.push( vct2, vct6 );	//6->2
                        vertArray.push( vct7, vct3 );	//7->3

                        vertArray.push( vct1, vct2 );
                        vertArray.push( vct3, vct2 );
                        vertArray.push( vct4, vct3 );
                        vertArray.push( vct4, vct1 );
                        vertArray.push(vct5, vct6 );	// 8->7
                        vertArray.push( vct6, vct7 );	// 8->5
                        vertArray.push( vct7, vct8 );	// 5->6
                        vertArray.push( vct8, vct5 );	// 6->7

                        lineGeometry.computeLineDistances();
//	var shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture } );
//
//	mesh = new THREE.Mesh(lineGeometry, shadowMaterial );
                        var sphereGeometry = new THREE.SphereGeometry(10,20, 20);
                        var sphereMaterial = new THREE.MeshLambertMaterial({
                            color : 0xff0000,
                            transparent:true,
                            opacity:0.5
                        });
                        var meshs=new THREE.Mesh(sphereGeometry,sphereMaterial);
                        scene.add(meshs);
                        meshs.position.set(0,100,130);
                        function getColor(a) {
                            if(a>130&&a<140){
                                return 0xcc0000;
                            }
                            else if(a==150){
                                return 0xcc00ff;
                            }
                            else{
                                return 0xccffff;
                            }
                        }
                        var lineMaterial = new THREE.LineBasicMaterial( { color: getColor(x),linewidth:2 } );
                        console.log(lineMaterial);
                        var line = new THREE.Line( lineGeometry, lineMaterial );
                        scene.add(line);




                        var lineGeometrys = new THREE.Geometry();
                        var vertArrays = lineGeometrys.vertices;
                        var vct9 = new THREE.Vector3(130, 0, 130);
                        var vct10 = new THREE.Vector3(133, 0, 130);
                        var vct11 = new THREE.Vector3(130, 2, 130);
                        var vct12 = new THREE.Vector3(133, 2, 130);
                        vertArrays.push( vct9, vct10 );
                        vertArrays.push( vct11, vct12 );
                        vertArrays.push( vct9, vct11 );
                        vertArrays.push( vct10, vct12 );
                        lineGeometrys.computeLineDistances();
                        var lineMaterials = new THREE.LineBasicMaterial( { color: 0xcc0000,linewidth:2 } );

                        var lines = new THREE.Line( lineGeometrys, lineMaterials );
                        scene.add(lines);


                        var spritey = makeTextSprite( "监测1(X:130 Y:285 Z:0)",
                            { fontsize: 24, borderColor: {r:63, g:63, b:63, a:1.0}, backgroundColor: {r:235, g:235, b:235, a:0.8} } );
                        spritey.position.set(130, 300, 0);
                        scene.add( spritey );

                        var spritey = makeTextSprite( "监测2(X:130 Y:285 Z:130)",
                            { fontsize: 24, borderColor: {r:63, g:63, b:63, a:1.0}, backgroundColor: {r:235, g:235, b:235, a:0.8} } );
                        spritey.position.set(130, 300, 130);
                        scene.add( spritey );

                        var spritey = makeTextSprite( "监测3(X:130 Y:285 Z:130)",
                            { fontsize: 24, borderColor: {r:63, g:63, b:63, a:1.0}, backgroundColor: {r:235, g:235, b:235, a:0.8} } );
                        spritey.position.set(-130, 300, 130);
                        scene.add( spritey );

                        var spritey = makeTextSprite( "监测4(X:-130 Y:285 Z:0)",
                            { fontsize: 24, borderColor: {r:63, g:63, b:63, a:1.0}, backgroundColor: {r:235, g:235, b:235, a:0.8} } );
                        spritey.position.set(-130, 300, 0);
                        scene.add( spritey );

                        /*
                         function getG(a) {

                         setInterval(function () {
                         a+=20;
                         if(a>200){
                         a=0;
                         }
                         },1000);
                         //console.log(change);
                         return a;
                         }
                         */
                        var spritey = makeTextSprite("监测李冰峰(X:12,5 Y:23 H:32)",
                            { fontsize: 24, borderColor: {r:63, g:63, b:63, a:1.0}, backgroundColor: {r:235, g:235, b:235, a:0.8} } );
                        spritey.position.set(60,300,130);
                        console.log(spritey);
                        scene.add( spritey );

                        console.log('prame',parame);
                        function rend(){
                            requestAnimationFrame(rend);
                            //cube.rotation.x += 0.03;
                            //cube.rotation.z += 0.03;
//		parame.backgroundColor.r+=10;
//		if(parame.backgroundColor.r>255){
//			parame.backgroundColor.r=0;
//		}
                            lineMaterial.color.r+=0.05;
                            if(lineMaterial.color.r>2){
                                lineMaterial.color.r=0;
                            }
                            lineMaterials.color.r+=0.05;
                            if(lineMaterials.color.r>2){
                                lineMaterials.color.r=0;
                            }
                            //spritey.backgroundColor.g+=10;
                            renderer.render(scene, camera);
                        }
                        //rend();
                        function rends(){
                            requestAnimationFrame(rends);
                            //cube.rotation.x += 0.03;
                            //cube.rotation.z += 0.03;
                            parame.backgroundColor.g+=10;
                            if(parame.backgroundColor.g>255){
                                parame.backgroundColor.g=0;
                            }
                            renderer.render(scene, camera);
                        }
                        //rends();
                        /*
                         setInterval(function () {
                         change+=40;
                         if(change>200){
                         change=0
                         }

                         console.log(change);
                         },500);
                         */



                        createAntenna(scene, 130, 285, 0);
                        createAntenna(scene, 130, 285, 130);
                        createAntenna(scene, -130, 285, 130);
                        createAntenna(scene, -130, 285, 0);

                        /*
                         var length = 120, width = 80;

                         var shape = new THREE.Shape();
                         shape.moveTo( 0,0 );
                         shape.lineTo( 0, width );
                         shape.lineTo( length, width );
                         shape.lineTo( length, 0 );
                         shape.lineTo( 0, 0 );

                         var extrudeSettings = {
                         steps: 2,
                         amount: 100,
                         bevelEnabled: true,
                         bevelThickness: 1,
                         bevelSize: 1,
                         bevelSegments: 1
                         };

                         var geometry = new THREE.ExtrudeGeometry( shape,  extrudeSettings );
                         var material = new THREE.MeshBasicMaterial( { color: 0x00aa00 } );
                         var me = new THREE.Mesh( geometry, material ) ;
                         scene.add( me );
                         function rend(){
                         requestAnimationFrame(rend);
                         //cube.rotation.x += 0.03;
                         //cube.rotation.z += 0.03;
                         me.rotation.y3d_1.jpg
                         renderer.render(scene, camera);
                         }

                         //调用render方法
                         rend();
                         */
                        /**
                         // 添加不规则的物体
                         var extrudeSettings = {
    amount: 10,
    steps: 10,
    bevelSegments: 10,
    bevelSize: 10,
    bevelThickness: 10
};
                         var triangleShape = new THREE.Shape();
                         triangleShape.moveTo(  0, -50 );
                         triangleShape.lineTo(  -50, 50 );
                         triangleShape.lineTo( 50, 50 );
                         triangleShape.lineTo(  0, -50 );

                         var extrude = new THREE.Mesh(new THREE.ExtrudeGeometry(triangleShape, extrudeSettings), new THREE.MeshLambertMaterial({ color: 0xcc0000 }));
                         extrude.rotation.y = Math.PI / 2;
                         extrude.position.x = -300;
                         extrude.position.y = 150;
                         extrude.position.z = 300;
                         extrude.castShadow = extrude.receiveShadow = true;
                         this.scene.add(extrude);
                         */
                        /*
                         raycaster = new THREE.Raycaster();
                         mouse = new THREE.Vector2();
                         document.body.appendChild(renderer.domElement);
                         document.addEventListener('mousemove', onDocumentMouseMove, false);
                         rener();
                         */
                    }

                    /*function onDocumentMouseMove(event) {
                     event.preventDefault();
                     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                     }

                     function rener() {
                     requestAnimationFrame(render);
                     renderer.render(scene, camera);
                     raycaster.setFromCamera(mouse, camera);
                     var intersects = raycaster.intersectObjects(scene.children);
                     if (intersects.length > 0) {
                     if (INTERSECTED != intersects[0].object) {
                     if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
                     INTERSECTED = intersects[0].object;
                     INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                     INTERSECTED.material.color.set( 0xff0000 );
                     }
                     } else {
                     if (INTERSECTED) INTERSECTED.material.color.set(INTERSECTED.currentHex);
                     INTERSECTED = null;
                     }
                     }*/
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
                        console.log('shape',shape);
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
                        console.log('11111111111111',parame);
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
                        stats.update();
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



                    //addcube
                    var b = document.createElement('input');
                    var container = document.getElementById('ThreeJS');
                    var canvas = document.getElementByTagName('canvas');
                    b.type = 'button';
                    b.value = 'addCube11111111111';
                    b.onclick = 'addCube';
                    canvas.appendChild(b);       
                    container.appendChild(b);

                    this.addCube = function(){
                        var cubeSize = Math.ceil((Math.random()*3));
                        var CubeGeometry = new THREE.CubeGeometry(cubeSize,cubeSize,cubeSize);
                        var cubeMaterial = new THREE.MeshLambertMaterial(
                            {color:  0xff0000});
                        var cube = new THREE.Mesh(CubeGeometry,cubeMaterial);
                        cube.castShadow = true;
                        cube.name = "cube-"+ scene.children.length;
                        cube.rotation.x = -2 + Math.round((Math.random()*4));
                        cube.position.x = -3 + Math.round((Math.random()*4));
                        cube.position.y = Math.round((Math.random()*3));
                        cube.position.z = -2 + Math.round((Math.random()*4));
                        this.numberOfObjects = scene.children.length; 
                        
                        scene.add(cube);
                        console.log(scene);
                        renderer.render(scene,camera);
                    }
                    //changeScene
this.changeScene = function (id){
    var  idx = document.getElementById(id);
    var imgName  = idx.attributes.value.value;
    imgFile = imgName;
}
//createMesh
this.createMesh = function(){

    var x = document.getElementById('input-x').value,
        y = document.getElementById('input-y').value, 
        z = document.getElementById('input-z').value;
    console.log(x);
    console.log(y);
    console.log(z);
    
    var Material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture("styles/img/threeD/"+imgFile),
    wireframe: false,

     } );
    var Geometry  = new THREE.CubeGeometry(10,10,10);
    var mesh  = new THREE.Mesh(Geometry,Material);
    mesh.name = "test";
    mesh.position.set(x,y,z);
    scene.add(mesh);
    console.log(mesh);          
}
                })
            }
        }
    });