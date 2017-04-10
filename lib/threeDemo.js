/*
* ajax 获取json 数据
*/
window.onload = function(){
        threeJs.init({
            buildingXNumber : "4",//建筑单元，默认1
            buildingYNumber : "6",//建筑楼层，默认1
            haveRoof : "1",//建筑是否有屋顶，默认true
        });
        //裂缝传感器
        crackModel.addCrack({
            unit : "1",//建筑单元，默认1
            floor : "1",//建筑楼层，默认1
            face : "1",//建筑面向，默认1(正面，顺时针旋转2,3,4面,房顶面5)
            size: "0.3",//裂缝尺寸
            position : ['49',49],//裂缝位置信息
            crackX : "10",//裂缝X周走向，默认10
            crackY : "10"//裂缝Y轴走向，默认10
        });
        //倾角传感器    
        inclinationModel.addCrack({
            unit : "2",
            floor : "3",
            face : "3",
            position : ['49','49'],
        });  
        //沉降传感器      
        settlementModel.addCrack({
            unit : "3",
            floor : "4",
            face : "4",
            position : ['49','49'],

        });
        //北斗天线
        beidouModel.addCrack({
            unit : "4",
            face : "5",
            position : ['49','49'],
        });
        beidouModel.addCrack({
            unit : "2",
            face : "5",
            position : ['49','49'],
        });        
        beidouModel.addCrack({
            unit : "1",
            face : "5",
            position : ['49','49'],
        });

        // console.log(promise);
    //放在最后执行

    animate();
}


var buildingXNumber = null;
var buildingYNumber = null;
var scece = null;
var camera = null;
var renderer = null;
var canvas = null;

var threeJs = {


    // buildingXNumber : null,
    // buildingYNumber : null, 
    animate : null,
	init : function(building){
		buildingXNumber = building.buildingXNumber || "2";
		buildingYNumber = building.buildingYNumber || "6";

        console.log("buildingXNumber"+buildingXNumber);
		var buildingX = building.buildingX || 100;
		var buildingY = building.buildingY || 80;
		var buildingZ = building.buildingZ || 80;
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
			canvas:document.getElementById('MainCanvas'),
			antialias:true
		});
		renderer.setSize(window.innerWidth,window.innerHeight);

        //axes
        var axes = new THREE.AxisHelper( 20000 );
        scene.add(axes);

		//light
		// var light = new THREE.PointLight(0xdfebf0, 1.25);
		// light.position.set(0, 200, 100);
		// light.position.multiplyScalar(5);
		// light.castShadow = true;
		// scene.add(light);
        var lightA = new THREE.AmbientLight(0xffffff);
        scene.add(lightA);

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
                //UV 定制

                var material = new THREE.MeshPhongMaterial({
                        map: THREE.ImageUtils.loadTexture('./image/texture-atlas.jpg'),
                        transparent: true,
                        opacity: 0.7
                    });

                    var bricks = [new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
                    var clouds = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
                    var crate = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
                    var stone = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
                    var water = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
                    var wood = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];

                    geometry.faceVertexUvs[0] = [];

                    geometry.faceVertexUvs[0][0] = [bricks[0], bricks[1], bricks[3]];
                    geometry.faceVertexUvs[0][1] = [bricks[1], bricks[2], bricks[3]];

                    geometry.faceVertexUvs[0][2] = [clouds[0], clouds[1], clouds[3]];
                    geometry.faceVertexUvs[0][3] = [clouds[1], clouds[2], clouds[3]];

                    geometry.faceVertexUvs[0][4] = [crate[0], crate[1], crate[3]];
                    geometry.faceVertexUvs[0][5] = [crate[1], crate[2], crate[3]];

                    geometry.faceVertexUvs[0][6] = [stone[0], stone[1], stone[3]];
                    geometry.faceVertexUvs[0][7] = [stone[1], stone[2], stone[3]];

                    geometry.faceVertexUvs[0][8] = [water[0], water[1], water[3]];
                    geometry.faceVertexUvs[0][9] = [water[1], water[2], water[3]];

                    geometry.faceVertexUvs[0][10] = [wood[0], wood[1], wood[3]];
                    geometry.faceVertexUvs[0][11] = [wood[1], wood[2], wood[3]];

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
                                        
            var material1 = new THREE.MeshBasicMaterial( { 
             map: new THREE.TextureLoader().load("./image/qiang_0.jpg"),transparent:true, opacity:0.8 } );
            var material2 = new THREE.MeshBasicMaterial( { 
            map: new THREE.TextureLoader().load("./image/door_1.png"),transparent:true, opacity:0.8 } );
            var material3 = new THREE.MeshBasicMaterial( { 
            map: new THREE.TextureLoader().load("./image/yangtai_20.png"),transparent:true, opacity:0.8 } );
            var material4 = new THREE.MeshBasicMaterial( { 
            map: new THREE.TextureLoader().load("./image/louti_2.png"), transparent:true, opacity:0.8 } );
            var material5 = new THREE.MeshBasicMaterial({ transparent:true, opacity:0.8, color: 0xe9e9e9  });

            for (var i = 0; i < buildingXNumber+buildingXNumber/2; i++) {
                if( (i+1)%3 == 0){
                    console.log('单元'+i);
                    for (var a = 0; a < buildingYNumber; a++) {
                        console.log(a);
                        if (a == 0) {
                            //楼道一层
                            var geometry = new THREE.CubeGeometry( buildingX, buildingY, buildingZ+32, 1, 1, 1  );

                            console.log("a:"+a+"I:"+i);
                            var materials = [material1,material1,material1,material5,material2,material3];
                            var material = new THREE.MultiMaterial( materials );
                            cubeM = new THREE.Mesh( geometry, material );
                            cubeM.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2,parseInt(buildingZ/2) -14);
                            scene.add( cubeM );  
                            //楼道一层 顶部突出
                            var loadTexture = new THREE.TextureLoader().load('./image/qiang_1.jpg');
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
                            var geometry = new THREE.CubeGeometry( buildingX, buildingY, buildingZ+32, 1, 1, 1  );

                             var materials = [material1,material1,material1,material1,material4,material3];
                            var material = new THREE.MultiMaterial( materials );
                            cubeM = new THREE.Mesh( geometry, material );
                            cubeM.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2,parseInt(buildingZ/2)-14);
                            scene.add( cubeM );
                            //楼道

                            //阳台-far
                            var geometry = new THREE.CubeGeometry( 35,40,5 );
                            var loadTexture = new THREE.TextureLoader().load("./image/far_left.png");
                            var material = new THREE.MeshBasicMaterial( { 
                                color:0xd9d9d9,transparent:true,opacity:0.8,
                                map: loadTexture
                                 });
                            cube = new THREE.Mesh( geometry, material );
                            scene.add(cube);
                            cube.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2 - 17.5,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2 -20,buildingZ+40);
                            var geometry = new THREE.CubeGeometry( 35,75,5 );
                            var loadTexture2 = new THREE.TextureLoader().load("./image/far_right.png");
                            var material = new THREE.MeshBasicMaterial( { 
                                color:0xd9d9d9,transparent:true,opacity:0.8,
                                map: loadTexture2
                                
                                 });
                            cube = new THREE.Mesh( geometry, material );
                            cube.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2 +17.5,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2 -2.5,buildingZ+40);

                            scene.add( cube );
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
                            var geometry = new THREE.CubeGeometry( 5,80,40 );
                            var material = new THREE.MeshBasicMaterial( { 
                                color:0xd9d9d9,transparent:true,opacity:0.8,
                                
                                 map:loadTexture2,
                                 });
                            cube = new THREE.Mesh( geometry, material );
                            cube.position.set(buildingX*i - buildingX/2 - buildingX*(buildingXNumber*1.5)/2 +32.5,buildingY*(a+1)-buildingY/2 -buildingY*buildingYNumber/2 ,buildingZ + 20);

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

			var material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./image/qiang_0.jpg"),
                transparent:true});
	        var geometry = new THREE.ExtrudeGeometry(drawShape(), options);
	        var cube = new THREE.Mesh(geometry, material);
	        cube.position.set(-buildingX*(buildingXNumber*1.5)/2,parseInt(buildingY*buildingYNumber)/2 + 1,0);
	        cube.rotation.y =  -0.5 * Math.PI;
	        scene.add(cube);

        }               
	},


	/*
	* remoteCube
	*/
	remoteCube : function() {
        var allChildren = scene.children;
        var lastObject = allChildren[allChildren.length-1];
        if(lastObject instanceof THREE.Mesh){
            scene.remove(lastObject);
            this.numberOfObjects = scene.children.length;
        }
        renderer.render(scene,camera);
    },


    /*
    * 导入模型
    */
        // createMtlObj:function(options){

        //     var mtlLoader = new THREE.MTLLoader();
        //     mtlLoader.setBaseUrl( options.mtlBaseUrl );
        //     mtlLoader.setPath( options.mtlPath );
        //     mtlLoader.load( options.mtlFileName, 
        //         function( materials ) {
        //             console.log(materials);
        //         materials.preload();
        //         // materials.map.side = THREE.DoubleSide;
        //         var objLoader = new THREE.OBJLoader();
        //         objLoader.setMaterials( materials );
        //         objLoader.setPath( options.objPath );
        //         objLoader.load( options.objFileName, function ( object ) {
        //             if(typeof options.completeCallback=="function"){
        //                 options.completeCallback(object);
        //             }
        //         }, 
        //         function ( xhr ) {
        //             if ( xhr.lengthComputable ) {
        //                 var percentComplete = xhr.loaded / xhr.total * 100;
        //                 if(typeof options.progress =="function"){
        //                     options.progress( Math.round(percentComplete, 2));
        //                 }
        //                 //console.log( Math.round(percentComplete, 2) + '% downloaded' );
        //             }
        //         }, 
        //         function(error){
        //             console.log('error');
        //         } );

        //     });
        // },

};
/*
* crackModel  裂缝传感器
*/
var crackModel = {
    animation : null,
    cube : null,
    cubes : new Array(),
    /*
    * addCrack
    */
    addCrack : function(crack){
        var unitA = parseInt(crack.unit) || "1";
        var floor = parseInt(crack.floor) || "1";
        var face = parseInt(crack.face) || "1";
        var size = parseFloat(crack.size) || "0.1";
        var position = crack.position || ['49','49'];
        animation = crack.animation || false;
        //以下设为默认值
        var facePiece = parseInt(crack.facePiece)|| "100";
        var buildingX = crack.buildingX || "100";
        var buildingY = crack.buildingY || "80";
        var buildingZ = crack.buildingZ || "80";
        // var buildingXNumber = buildingXNumber;
        // var buildingYNumber = buildingYNumber;
        console.log("buildingYNumber"+buildingXNumber+buildingYNumber);
        var crackX = crack.crackX || "10";
        var crackY = crack.crackY || "10";
        var x = null;
        var y = null;
        var z = null;
        var unit = null;
        console.log("face"+face);
        console.log("分块数"+facePiece+"X"+position[0]+"Y"+position[1]);
        // 添加裂缝
        var options = {
            amount: 1,
            bevelThickness: 2,
            bevelSize: 1,
            bevelSegments: 3,
            bevelEnabled: true,
            curveSegments: 12,
            steps: 1
        };      
        var geometry = new THREE.ExtrudeGeometry(drawShape(crackX,crackY), options);
        var material = new THREE.MeshBasicMaterial({ color: choseColor(size),transparent: false });
        this.cube = new THREE.Mesh(geometry, material);
        
        this.cubes.push(this.cube);
        this.cube.name="nameCube";
        if (unitA == 1) {
            unit = unitA;
        }else if( unitA > 1 && unitA <=3 ){
            unit = unitA + 1;
        }else if( unitA > 3 && unitA <=6 ){
            unit = unitA + 2;
        }else if( unitA > 5 && unitA <=9 ){
            unit = unitA + 3;
        }else if( unitA > 7 && unitA <=12 ){
            unit = unitA + 4;
        }
        console.log("unit"+unit);
        if (face == "1") { 
            z = buildingZ;
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); } 
        else if ( face == "2" ) { 
            x = buildingX*unit; 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube);}
        else if ( face == "3" ) { 
            z = -0; 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); }
        else if ( face == "4" ) { 
            x = -0 + buildingX*(unit-1); 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube);}
        else if ( face == "5" ) {
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1);
            y = buildingY*floor;
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube,"x");
        }   
        console.log(x+"|"+y+"|"+z);

        this.cube.position.set(x - (buildingX*(buildingXNumber*1.5)/2) ,y - buildingY*buildingYNumber/2,z);    
        //rotate aslong Y 0.5*Math.PI
        function faceRotate(obj,a){
            var a = a || "y"; 
            console.log('旋转轴：'+a);
            var cube = obj;
            if (a == "x") {
                cube.rotation.x  = -0.5*Math.PI;
            } else {        
            cube.rotation.y = 0.5 * Math.PI;
            }
            // return cube;
        }
        //drawShape on Carek
        function drawShape(crackX,crackY){
            var x = parseInt(crackX);
            var y = parseInt(crackY);
            var shape = new THREE.Shape();
            shape.moveTo(0,0);
            shape.bezierCurveTo(x/2,0,x/2,y,x,y);
            return shape;
        }

        //chose color from size
        function choseColor(size){
            var size = size;
            var color = null;
            if (size <= 0.1 ) {
                color = 0xff0000;
            } else if (0.1< size <= 0.2) {
                color = 0xaaaaaa;
            } else if (size > 0.2) {
                color = 0xffff00;
            }

            return color;
        }

        scene.add(this.cube);


        //文字
        var loader = new THREE.FontLoader();
        loader.load('./lib/helvetiker_regular.typeface.json',function(font) {
            var mesh = new THREE.Mesh(new THREE.TextGeometry(size, { font: font, size: 10, height: 1 }), material);
            mesh.position.set(parseInt(x) + 1 - buildingX*(buildingXNumber*1.5)/2 ,parseInt(y)+1 - buildingY*buildingYNumber/2,parseInt(z)+1);
            scene.add(mesh);
        });  
    },

};

/*
* inclinationModel 倾角传感器类 
*/
var inclinationModel = {
    animation : null,
    cube : null,
    cubes : new Array(),
    /*
    * addCrack
    */
    addCrack : function(crack){
        var unitA = parseInt(crack.unit) || "1";
        var floor = parseInt(crack.floor) || "1";
        var face = parseInt(crack.face) || "1";
        var size = parseFloat(crack.size) || "";
        var position = crack.position || ['49','49'];
        animation = crack.animation || false;
        //以下设为默认值
        var facePiece = parseInt(crack.facePiece)|| "100";
        var buildingX = crack.buildingX || "100";
        var buildingY = crack.buildingY || "80";
        var buildingZ = crack.buildingZ || "80";
        // var buildingXNumber = buildingXNumber;
        // var buildingYNumber = buildingYNumber;
        console.log("buildingYNumber"+buildingXNumber+buildingYNumber);
        var crackX = crack.crackX || "10";
        var crackY = crack.crackY || "10";
        var x = null;
        var y = null;
        var z = null;
        var unit = null;
        console.log("face"+face);
        console.log("分块数"+facePiece+"X"+position[0]+"Y"+position[1]);
        // 添加裂缝
        var options = {
            amount: 3,
            bevelThickness: 2,
            bevelSize: 1,
            bevelSegments: 3,
            bevelEnabled: true,
            curveSegments: 12,
            steps: 1
        };      
        var geometry = new THREE.ExtrudeGeometry(drawShape(crackX,crackY), options);
        var material = new THREE.MeshBasicMaterial({ color: choseColor(size),transparent: false });
        this.cube = new THREE.Mesh(geometry, material);
        
        this.cubes.push(this.cube);
        this.cube.name="nameCube";
        if (unitA == 1) {
            unit = unitA;
        }else if( unitA > 1 && unitA <=3 ){
            unit = unitA + 1;
        }else if( unitA > 3 && unitA <=6 ){
            unit = unitA + 2;
        }else if( unitA > 5 && unitA <=9 ){
            unit = unitA + 3;
        }else if( unitA > 7 && unitA <=12 ){
            unit = unitA + 4;
        }
        console.log("unit"+unit);
        if (face == "1") { 
            z = buildingZ;
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); } 
        else if ( face == "2" ) { 
            x = buildingX*unit; 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube);}
        else if ( face == "3" ) { 
            z = -0; 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); }
        else if ( face == "4" ) { 
            x = -0 + buildingX*(unit-1); 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube);}
        else if ( face == "5" ) {
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1);
            y = buildingY*floor;
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube,"x");
        }   
        console.log(x+"|"+y+"|"+z);

        this.cube.position.set(x - (buildingX*(buildingXNumber*1.5)/2) ,y - buildingY*buildingYNumber/2,z);    
        //rotate aslong Y 0.5*Math.PI
        function faceRotate(obj,a){
            var a = a || "y"; 
            console.log('旋转轴：'+a);
            var cube = obj;
            if (a == "x") {
                cube.rotation.x  = -0.5*Math.PI;
            } else {        
            cube.rotation.y = 0.5 * Math.PI;
            }
            // return cube;
        }
        //drawShape on Carek
        function drawShape(crackX,crackY){
            var x = parseInt(crackX);
            var y = parseInt(crackY);
            var shape = new THREE.Shape();
            shape.moveTo(0,0);
            shape.lineTo(5,8);
            shape.lineTo(10,0);
            return shape;
        }

        //chose color from size
        function choseColor(size){
            var size = size;
            var color = null;
            if (size <= 0.1 ) {
                color = 0xff0000;
            } else if (0.1< size <= 0.2) {
                color = 0xaaaaaa;
            } else if (size > 0.2) {
                color = 0xffff00;
            }

            return color;
        }

        scene.add(this.cube);


    },
    // 添加动画
    addAnimate : function(obj){
        console.log(obj);
        for (var i = 0; i < obj.length; i++) {
            var n = obj[i];
            console.log(n);
            n.scale.set(1,1,1);
            var tween = new TWEEN.Tween(n.scale);
            tween.to({x:2,y:2,z:2},500);
            tween.start();
            tween.repeat(10);    
        }
    },

};
/*
* settlementModel 沉降传感器类
*/
var settlementModel = {
    animation : null,
    cube : null,
    cubes : new Array(),
    /*
    * addCrack
    */
    addCrack : function(crack){
        var unitA = parseInt(crack.unit) || "1";
        var floor = parseInt(crack.floor) || "1";
        var face = parseInt(crack.face) || "1";
        var size = parseFloat(crack.size) || "";
        var position = crack.position || ['49','49'];
        animation = crack.animation || false;
        //以下设为默认值
        var facePiece = parseInt(crack.facePiece)|| "100";
        var buildingX = crack.buildingX || "100";
        var buildingY = crack.buildingY || "80";
        var buildingZ = crack.buildingZ || "80";
        // var buildingXNumber = buildingXNumber;
        // var buildingYNumber = buildingYNumber;
        console.log("buildingYNumber"+buildingXNumber+buildingYNumber);
        var crackX = crack.crackX || "10";
        var crackY = crack.crackY || "10";
        var x = null;
        var y = null;
        var z = null;
        var unit = null;
        console.log("face"+face);
        console.log("分块数"+facePiece+"X"+position[0]+"Y"+position[1]);
        // 添加裂缝
        var options = {
            amount: 3,
            bevelThickness: 2,
            bevelSize: 1,
            bevelSegments: 3,
            bevelEnabled: true,
            curveSegments: 12,
            steps: 1
        };      
        var geometry = new THREE.ExtrudeGeometry(drawShape(crackX,crackY), options);
        var material = new THREE.MeshBasicMaterial({ color: choseColor(size),transparent: false });
        this.cube = new THREE.Mesh(geometry, material);
        
        this.cubes.push(this.cube);
        this.cube.name="nameCube";
        if (unitA == 1) {
            unit = unitA;
        }else if( unitA > 1 && unitA <=3 ){
            unit = unitA + 1;
        }else if( unitA > 3 && unitA <=6 ){
            unit = unitA + 2;
        }else if( unitA > 5 && unitA <=9 ){
            unit = unitA + 3;
        }else if( unitA > 7 && unitA <=12 ){
            unit = unitA + 4;
        }
        console.log("unit"+unit);
        if (face == "1") { 
            z = buildingZ;
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); } 
        else if ( face == "2" ) { 
            x = buildingX*unit; 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube);}
        else if ( face == "3" ) { 
            z = -0; 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); }
        else if ( face == "4" ) { 
            x = -0 + buildingX*(unit-1); 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube);}
        else if ( face == "5" ) {
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1);
            y = buildingY*floor;
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube,"x");
        }   
        console.log(x+"|"+y+"|"+z);

        this.cube.position.set(x - (buildingX*(buildingXNumber*1.5)/2) ,y - buildingY*buildingYNumber/2,z);    
        //rotate aslong Y 0.5*Math.PI
        function faceRotate(obj,a){
            var a = a || "y"; 
            console.log('旋转轴：'+a);
            var cube = obj;
            if (a == "x") {
                cube.rotation.x  = -0.5*Math.PI;
            } else {        
            cube.rotation.y = 0.5 * Math.PI;
            }
            // return cube;
        }
        //drawShape on Carek
        function drawShape(crackX,crackY){
            var x = parseInt(crackX);
            var y = parseInt(crackY);
            var shape = new THREE.Shape();
            shape.moveTo(0,0);
            // shape.bezierCurveTo(x/2,0,x/2,y,x,y);
            shape.lineTo(3,7);
            shape.lineTo(7,7);
            shape.lineTo(11,0);
            shape.lineTo(3.5, -3);
            shape.lineTo(0,0);
            return shape;
        }

        //chose color from size
        function choseColor(size){
            var size = size;
            var color = null;
            if (size <= 0.1 ) {
                color = 0xff0000;
            } else if (0.1< size <= 0.2) {
                color = 0xaaaaaa;
            } else if (size > 0.2) {
                color = 0xffff00;
            }

            return color;
        }


        scene.add(this.cube);




        
    },
    // 添加动画
    addAnimate : function(obj){
        console.log(obj);

        for (var i = 0; i < obj.length; i++) {
            var n = obj[i];
            console.log(n);
            n.scale.set(1,1,1);
            var tween = new TWEEN.Tween(n.scale);
            tween.to({x:2,y:2,z:2},500);
            tween.start();
            tween.repeat(10);
    
        }

    },

};
/*
* beidouModel 北斗天线类
*/

var beidouModel = {
    animation : null,
    cube : null,
    cubes : new Array(),
    /*
    * addCrack
    */
    addCrack : function(crack){
        var unitA = parseInt(crack.unit) || "1";
        var floor = buildingYNumber;
        var face = parseInt(crack.face) || "1";
        var size = parseFloat(crack.size) || "";
        var position = crack.position || ['49','49'];
        animation = crack.animation || false;
        //以下设为默认值
        var facePiece = parseInt(crack.facePiece)|| "100";
        var buildingX = crack.buildingX || "100";
        var buildingY = crack.buildingY || "80";
        var buildingZ = crack.buildingZ || "80";
        // var buildingXNumber = buildingXNumber;
        // var buildingYNumber = buildingYNumber;
        console.log("buildingYNumber"+buildingXNumber+buildingYNumber);
        var crackX = crack.crackX || "10";
        var crackY = crack.crackY || "10";
        var x = null;
        var y = null;
        var z = null;
        var unit = null;
        console.log("face"+face);
        console.log("分块数"+facePiece+"X"+position[0]+"Y"+position[1]);
        // 添加裂缝
        var options = {
            amount: 3,
            bevelThickness: 2,
            bevelSize: 1,
            bevelSegments: 3,
            bevelEnabled: true,
            curveSegments: 12,
            steps: 1
        };      
        var geometry = new THREE.ExtrudeGeometry(drawShape(crackX,crackY), options);
        var material = new THREE.MeshBasicMaterial({ color: choseColor(size),transparent: false });
        this.cube = new THREE.Mesh(geometry, material);
        
        this.cubes.push(this.cube);
        this.cube.name="nameCube";
        if (unitA == 1) {
            unit = unitA;
        }else if( unitA > 1 && unitA <=3 ){
            unit = unitA + 1;
        }else if( unitA > 3 && unitA <=6 ){
            unit = unitA + 2;
        }else if( unitA > 5 && unitA <=9 ){
            unit = unitA + 3;
        }else if( unitA > 7 && unitA <=12 ){
            unit = unitA + 4;
        }
        console.log("unit"+unit);
        if (face == "1") { 
            z = buildingZ;
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); } 
        else if ( face == "2" ) { 
            x = buildingX*unit; 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube);}
        else if ( face == "3" ) { 
            z = -0; 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); }
        else if ( face == "4" ) { 
            x = -0 + buildingX*(unit-1); 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube);}
        else if ( face == "5" ) {
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1);
            y = buildingY*floor;
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(this.cube,"x");
        }   
        console.log(x+"|"+y+"|"+z);

        this.cube.position.set(x - (buildingX*(buildingXNumber*1.5)/2) ,y - buildingY*buildingYNumber/2,z);    
        //rotate aslong Y 0.5*Math.PI
        function faceRotate(obj,a){
            var a = a || "y"; 
            console.log('旋转轴：'+a);
            var cube = obj;
            if (a == "x") {
                cube.rotation.x  = -0.5*Math.PI;
            } else {        
            cube.rotation.y = 0.5 * Math.PI;
            }
            // return cube;
        }
        //drawShape on Carek
        function drawShape(crackX,crackY){
            var x = parseInt(crackX);
            var y = parseInt(crackY);
            var shape = new THREE.Shape();
            shape.moveTo(0,4);
            shape.lineTo(3,3);
            shape.lineTo(4,0);
            shape.lineTo(3,-3);
            shape.lineTo(0,-4);
            shape.lineTo(-3,-3);
            shape.lineTo(-4,0);
            shape.lineTo(-4,3);
            shape.lineTo(4,0);
            return shape;
        }

        //chose color from size
        function choseColor(size){
            var size = size;
            var color = null;
            if (size <= 0.1 ) {
                color = 0xff0000;
            } else if (0.1< size <= 0.2) {
                color = 0xaaaaaa;
            } else if (size > 0.2) {
                color = 0xffff00;
            }

            return color;
        }

        scene.add(this.cube);

        
    },


};


    // 添加动画
    function addAnimate(obj){
        console.log(obj);

        for (var i = 0; i < obj.length; i++) {
            var n = obj[i];
            console.log(n);
            n.scale.set(2,2,2);
            
            var tween = new TWEEN.Tween(n.scale);
            tween.to({x:1,y:1,z:1},500);
            tween.start();
            tween.repeat(10); 
            // tween.onComplete(function(n){
            //     var a = n;
            //     a.scale.set(1,1,1);
            // })
        }

    }

/*
* last requestAnimationFrame render
*/
    function animate() {
        requestAnimationFrame ( animate );
        TWEEN.update();
        render();
    }

    function render(){
        renderer.render( scene,camera );
    }


