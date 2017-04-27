/*
* ajax 获取json 数据
*/
window.onload = function(){
    $.getJSON("./lib/test.json",function(result){
        threeJs.init({
            buildingXNumber : result.house.unit,//建筑单元，默认1
            buildingYNumber : result.house.floor,//建筑楼层，默认1
            haveRoof : result.house.roof,//建筑是否有屋顶，默认true
        });
        for (var i = 0; i < result.crack.length; i++) {
            console.log(result.crack[0].floor);
            crackModel.addCrack({
                floor: result.crack[i].floor,
                unit : result.crack[i].room,
                face : result.crack[i].wall,
                position : ["49","49"],
            });
        }

        for (var i = 0; i < result.inclinator.length; i++) {
            console.log(result.inclinator[0].floor);
            inclinationModel.addCrack({
                floor: result.inclinator[i].floor,
                unit : result.inclinator[i].room,
                face : result.inclinator[i].wall,
                position : ["49","49"],
            });
        }   

        for (var i = 0; i < result.level.length; i++) {
            console.log(result.level[0].floor);
            settlementModel.addCrack({
                floor: result.level[i].floor,
                unit : result.level[i].room,
                face : result.level[i].wall,
                position : ["49","49"],
            });
        }    

        for (var i = 0; i < result.gps.length; i++) {
            console.log(result.gps[0].floor);
            beidouModel.addCrack({
                // floor: result.gps[i].floor,
                unit : result.gps[i].room,
                face : result.gps[i].wall,
                position : ["49","49"],
            });
        }

        animate();

  });

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
			canvas:document.getElementById('MainCanvas'),
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
            //通过圆柱几何体 建立房顶
            // var geometry = new THREE.CylinderGeometry(buildingY*0.577,buildingY*0.577,parseInt(buildingX)*buildingXNumber*1.5,3,1,false);
            // var material = new THREE.MeshBasicMaterial({
            //     color:0xe9e9e9,
            //     transparent : true,
            //     // map: new THREE.TextureLoader().load("./image/qiang_0.jpg"),
            //     opacity: 0.4
            // });
            // var cube = new THREE.Mesh( geometry , material );
            // cube.position.set(0,parseInt(buildingY*buildingYNumber)/2 + parseInt(buildingY)*0.288,parseInt(buildingY)*0.5);
            // cube.rotation.x =   Math.PI/6;
            // cube.rotation.z = 0.5*Math.PI;
            // scene.add(cube);

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
        var unit = parseInt(crack.unit) || "1";
        var floor = parseInt(crack.floor) || "1";
        var face = parseInt(crack.face) || "1";
        var size = parseFloat(crack.size) || "0.1";
        var position = crack.position || ['49','49'];
        animation = crack.animation || false;
        //以下设为默认值
        var facePiece = parseInt(crack.facePiece)|| "100";
        var buildingX = crack.buildingX || "100";
        var buildingY = crack.buildingY || "80";
        var buildingZ = crack.buildingZ || "100";
        // var buildingXNumber = buildingXNumber;
        // var buildingYNumber = buildingYNumber;
        console.log("buildingYNumber"+buildingXNumber+buildingYNumber);
        var crackX = crack.crackX || "10";
        var crackY = crack.crackY || "10";
        var x = null;
        var y = null;
        var z = null;

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
        var material = new THREE.MeshPhongMaterial({ 
            color: 0x4444ff, 
            ambient: 0xffffff, 
            emissive: 0x383838,specular:0xe9e9e9,shininess:50, 
            transparent: true });
        
        this.cube = new THREE.Mesh(geometry, material);
        
        this.cubes.push(this.cube);
        this.cube.name="nameCube";

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
            shape.lineTo(x/2,y/2);
            shape.moveTo(-x/2,-y/2);
            shape.lineTo(-3,-3);
            shape.lineTo(-3,3);
            shape.lineTo(3,3);
            shape.lineTo(3,-3);
            shape.lineTo(-3,-3);
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
        var unit = parseInt(crack.unit) || "1";
        var floor = parseInt(crack.floor) || "1";
        var face = parseInt(crack.face) || "1";
        var size = parseFloat(crack.size) || "";
        var position = crack.position || ['49','49'];
        animation = crack.animation || false;
        //以下设为默认值
        var facePiece = parseInt(crack.facePiece)|| "100";
        var buildingX = crack.buildingX || "100";
        var buildingY = crack.buildingY || "80";
        var buildingZ = crack.buildingZ || "100";
        // var buildingXNumber = buildingXNumber;
        // var buildingYNumber = buildingYNumber;
        console.log("buildingYNumber"+buildingXNumber+buildingYNumber);
        var crackX = crack.crackX || "10";
        var crackY = crack.crackY || "10";
        var x = null;
        var y = null;
        var z = null;

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
        var material = new THREE.MeshPhongMaterial({ color: 0x7777ff, ambient: 0xffffff, emissive: 0x4f4f4f, transparent: true });
        
        this.cube = new THREE.Mesh(geometry, material);
        
        this.cubes.push(this.cube);
        this.cube.name="nameCube";
        // if (unitA == 1) {
            // unit = unitA;
        // }else if( unitA > 1 && unitA <=3 ){
        //     unit = unitA + 1;
        // }else if( unitA > 3 && unitA <=6 ){
        //     unit = unitA + 2;
        // }else if( unitA > 5 && unitA <=9 ){
        //     unit = unitA + 3;
        // }else if( unitA > 7 && unitA <=12 ){
        //     unit = unitA + 4;
        // }
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
            shape.moveTo(-5,-7);
            shape.lineTo(-5,7);
            shape.lineTo(-4,7);
            shape.lineTo(-4,5);
            shape.lineTo(4,5);
            shape.lineTo(4,7);
            shape.lineTo(5,7);
            shape.lineTo(5,-7);
            shape.lineTo(4,-7);
            shape.lineTo(4,-5);
            shape.lineTo(-4,-5);
            shape.lineTo(-4,-7);
            shape.lineTo(-5,-7);


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
        var unit = parseInt(crack.unit) || "1";
        var floor = parseInt(crack.floor) || "1";
        var face = parseInt(crack.face) || "1";
        var size = parseFloat(crack.size) || "";
        var position = crack.position || ['49','49'];
        animation = crack.animation || false;
        //以下设为默认值
        var facePiece = parseInt(crack.facePiece)|| "100";
        var buildingX = crack.buildingX || "100";
        var buildingY = crack.buildingY || "80";
        var buildingZ = crack.buildingZ || "100";
        // var buildingXNumber = buildingXNumber;
        // var buildingYNumber = buildingYNumber;
        console.log("buildingYNumber"+buildingXNumber+buildingYNumber);
        var crackX = crack.crackX || "10";
        var crackY = crack.crackY || "10";
        var x = null;
        var y = null;
        var z = null;

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
        var material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, ambient: 0xffffff, emissive: 0x383838, transparent: true });
        this.cube = new THREE.Mesh(geometry, material);
        
        this.cubes.push(this.cube);
        this.cube.name="nameCube";

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
            shape.moveTo(-4.5,-7.5);
            shape.lineTo(-7.5,-4.5);
            shape.lineTo(-3,0);
            shape.lineTo(-4.5,4.5);
            shape.lineTo(0,3);
            shape.lineTo(4.5,7.5);
            shape.lineTo(7.5,4.5);
            shape.lineTo(3,0);
            shape.lineTo(4.5,-4.5);
            shape.lineTo(0,-3);
            shape.lineTo(-4.5,-7.5);



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


    //沉降传感器形状设计
        // function createMeshS(x,y,z){
        //     var geometryB = new THREE.CubeGeometry(10,5,10);
        //     var geometryM = new THREE.CylinderGeometry(3,3,10,3,1);
        //     var geometryT = new THREE.CubeGeometry(10,5,10);
            
      
        //     var material = new THREE.MeshBasicMaterial({ color: 0x34ce1a,transparent: false });
        //     var cubeB = new THREE.Mesh(geometryB,material);
        //     cubeB.position.set(x - (buildingX*(buildingXNumber*1.5)/2) ,y - buildingY*buildingYNumber/2 + 2.5,z); 
        //     var cubeM = new THREE.Mesh(geometryM,material); 
        //     cubeM.position.set(x - (buildingX*(buildingXNumber*1.5)/2) ,y - buildingY*buildingYNumber/2+10,z)
        //     var cubeT = new THREE.Mesh(geometryT,material); 
        //     cubeT.position.set(x - (buildingX*(buildingXNumber*1.5)/2) ,y - buildingY*buildingYNumber/2+10,z)
        //     // cubeT.geometry.verticesNeedUpdate = true;
        //     // cubeT.geometry.normalsNeedUpdate = true;
        //     scene.add(cubeM);
        //     scene.add(cubeB);
        //     scene.add(cubeT);
        //     var cube = Array();
        //     cube[0] = cubeM;
        //     cube[1] = cubeB;
        //     cube[2] = cubeT;
        //     console.log(cube.length);
        //     return cube;
        // }

        // createMeshS(x,y,z);
        
    },


};
/*
* beidouModel 北斗天线类
*/
var beidouModel = {
    animation : null,
    cube : null,
    mesh : null,
    cubes : new Array(),
    /*
    * addCrack
    */
    addCrack : function(crack){
        var unit = parseInt(crack.unit) || "1";
        var floor = buildingYNumber;
        var face = parseInt(crack.face) || "1";
        var size = parseFloat(crack.size) || "";
        var position = crack.position || ['49','49'];
        animation = crack.animation || false;
        //以下设为默认值
        var facePiece = parseInt(crack.facePiece)|| "100";
        var buildingX = crack.buildingX || "100";
        var buildingY = crack.buildingY || "80";
        var buildingZ = crack.buildingZ || "100";
        // var buildingXNumber = buildingXNumber;
        // var buildingYNumber = buildingYNumber;
        console.log("buildingYNumber"+buildingXNumber+buildingYNumber);
        var crackX = crack.crackX || "10";
        var crackY = crack.crackY || "10";
        var x = null;
        var y = null;
        var z = null;

        console.log("face"+face);
        console.log("分块数"+facePiece+"X"+position[0]+"Y"+position[1]);
        // 添加北斗
        var options = {
            amount: 3,
            bevelThickness: 2,
            bevelSize: 1,
            bevelSegments: 3,
            bevelEnabled: true,
            curveSegments: 12,
            steps: 1
        };      


        console.log("unit"+unit);
        if (face == "1") { 
            z = buildingZ;
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); } 
        else if ( face == "2" ) { 
            x = buildingX*unit; 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); /*faceRotate(this.cube);*/}
        else if ( face == "3" ) { 
            z = -0; 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); }
        else if ( face == "4" ) { 
            x = -0 + buildingX*(unit-1); 
            y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); /*faceRotate(this.cube);*/}
        else if ( face == "5" ) {
            x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1);
            y = buildingY*floor;
            z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); /*faceRotate(this.cube,"x")*/;
        }   
        console.log(x+"|"+y+"|"+z);


        this.cube = createMeshS(x,y,z);
        console.log("看下结果");
        console.log(this.cube.length);
        //添加到cube 集合中 （一个设备）
        this.cubes.push(this.cube);
        console.log(this.cubes);
        // this.cube.name="nameCube";

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


        //北斗形状设计
        function createMeshS(x,y,z){
            var geometryB = new THREE.CubeGeometry(10,5,10);
            var geometryM = new THREE.CylinderGeometry(2,2,10,10,1);
            var geometryT = new THREE.SphereGeometry(6,8,10,0,2*Math.PI,0,0.5*Math.PI);
            
            var materialB = new THREE.MeshPhongMaterial({ color: 0xc8c8c8 ,transparent: true });
            var material = new THREE.MeshPhongMaterial({ color: 0x7777ff,
                ambient: 0xffffff,
                emissive: 0x111111,
                transparent: true
            });
            var cubeB = new THREE.Mesh(geometryB,materialB);
            cubeB.position.set(x - (buildingX*(buildingXNumber*1.5)/2) ,y - buildingY*buildingYNumber/2 + 2.5,z); 
            var cubeM = new THREE.Mesh(geometryM,material); 
            cubeM.position.set(x - (buildingX*(buildingXNumber*1.5)/2) ,y - buildingY*buildingYNumber/2+10,z)
            var cubeT = new THREE.Mesh(geometryT,material); 
            cubeT.position.set(x - (buildingX*(buildingXNumber*1.5)/2) ,y - buildingY*buildingYNumber/2+10,z)
            // cubeT.geometry.verticesNeedUpdate = true;
            // cubeT.geometry.normalsNeedUpdate = true;
            scene.add(cubeM);
            scene.add(cubeB);
            scene.add(cubeT);
            var cube = Array();
            cube[0] = cubeM;
            cube[1] = cubeB;
            cube[2] = cubeT;
            console.log(cube.length);
            return cube;
        }
        createMeshS(x,y,z);
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

        // scene.add(this.cube);
        
    },


};


    // 添加动画
    function addAnimate(obj,i){
        console.log(obj);

        // for (var i = 0; i < obj.length; i++) {
        var n = obj[i];
        console.log(n.length);
        if (n.length == undefined) {
            n.scale.set(2,2,2);
            var obj = new Object();
            obj = n.material;
            obj.opacity = 0;
            var tweenOpa = new TWEEN.Tween(obj);
            tweenOpa.to({opacity: 1},500);
            var tween = new TWEEN.Tween(n.scale);
            tween.to({x:1,y:1,z:1},500);
            tween.start();
            tweenOpa.start();
            tween.repeat(10);
            tweenOpa.repeat(10); 
        } else{
            for (var i = 0; i < n.length; i++) {
                var a = n[i];
                console.log(a);
                a.scale.set(2,2,2);

                var obj = new Object();
                obj = a.material;
                obj.opacity = 0;
                var tweenOpa = new TWEEN.Tween(obj);
                tweenOpa.to({opacity: 1},500);

                var tween = new TWEEN.Tween(a.scale);
            tween.to({x:1,y:1,z:1},500);
            tween.start();
            tweenOpa.start();
            tween.repeat(10);
            tweenOpa.repeat(10); 
            }
        }

    }

    // opacity donghua
    // function opacityAnimate(obj,i){
    //     var a = obj[i];
    //     var n = new Object();
    //     n = a.material;
    //     n.opacity = 0;
    //     var tween = new TWEEN.Tween(n);
    //     tween.to({opacity: 1},500);
    //     tween.start();
    //     console.log(n.opacity);
    //     tween.repeat(10);
    // }

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


