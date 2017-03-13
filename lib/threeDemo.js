var threeJs = {

	scece : null,
	camera : null,
	renderer : null,
	canvas : null,

	init : function(building){
		var buildingXNumber = building.buildingXNumber || "1";
		var buildingYNumber = building.buildingYNumber || "1";
		var buildingX = building.buildingX || "100";
		var buildingY = building.buildingY || "100";
		var buildingZ = building.buildingZ || "100";
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
		light.position.set(0, 200, 100);
		light.position.multiplyScalar(5);
		light.castShadow = true;
		scene.add(light);

		//plane
        var groundTexture = new THREE.TextureLoader().load( "./image/back_2.jpg" );
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 25, 25 );
        groundTexture.anisotropy = 16;

        var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );
        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
        mesh.position.y = -0;
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add( mesh );

        //cube 大楼 一层
        function createCube(buildingXNumber,buildingYNumber){
        	var buildingXNumber = parseInt(buildingXNumber);
        	var buildingYNumber = parseInt(buildingYNumber);
        	console.log("buildingXNumber:"+buildingXNumber);
        	for (var a = 0; a < buildingXNumber; a++) {
        		console.log("a"+a);
	        	for (var i = 0; i < buildingYNumber; i++) {
	        		console.log("i"+i);
			        var geometry = new THREE.CubeGeometry( buildingX, buildingY, buildingZ, 1, 1, 1  );
			         var material1 = new THREE.MeshBasicMaterial( { 
			         map: new THREE.TextureLoader().load("./image/cm_2.png"),transparent:true, opacity:0.8 } );
			        var material2 = new THREE.MeshBasicMaterial( { 
			        map: new THREE.TextureLoader().load("./image/zm_2.png"),transparent:true, opacity:0.8 } );
			        var material3 = new THREE.MeshBasicMaterial( { 
			        map: new THREE.TextureLoader().load("./image/bm_11.png"),transparent:true, opacity:0.8 } );
			        var material4 = new THREE.MeshBasicMaterial({ transparent:true, opacity:0.8, color: 0xaaaaaa  });
			         var materials = [material1,material1,material4,material3,material2,material3];
			        var material = new THREE.MeshFaceMaterial( materials );
			        cubeM = new THREE.Mesh( geometry, material );
			        cubeM.position.set(buildingX*a + buildingX/2,buildingY*(i+1)-buildingY/2,buildingZ/2);
			        scene.add( cubeM );        		
		    	}
        	}
       	
        }

        createCube(buildingXNumber,buildingYNumber);
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

			    amount:-parseInt(buildingX)*buildingXNumber,
			    bevelThickness:2,
			    bevelSize:1,
			    bevelSegments:3,
			    bevelEnabled:true,
			    curveSegments:12,
			    steps:1

			};

			var material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa,});
	        var geometry = new THREE.ExtrudeGeometry(drawShape(), options);
	        var cube = new THREE.Mesh(geometry, material);
	        cube.position.set(0,parseInt(buildingY*buildingYNumber),0);
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
	* addCrack
	*/
    addCrack : function(crack){
    	var unit = parseInt(crack.unit) || "1";
    	var floor = parseInt(crack.floor) || "1";
    	var face = parseInt(crack.face) || "1";
    	var size = parseFloat(crack.size) || "0.1";
    	var facePiece = parseInt(crack.facePiece)|| "100";
    	var position = crack.position || ['49','49'];
    	var buildingX = crack.buildingX || "100";
    	var buildingY = crack.buildingY || "100";
    	var buildingZ = crack.buildingZ || "100";
    	var crackX = crack.crackX || "10";
    	var crackY = crack.crackY || "10";
    	var x = null;
    	var y = null;
    	var z = null;
    	console.log("face"+face) || "1";
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
        var cube = new THREE.Mesh(geometry, material);


    	if (face == "1") { 
    		z = buildingZ;
    		y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
    		x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); } 
    	else if ( face == "2" ) { 
    		x = buildingX*unit; 
    		y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
    		z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(cube);}
    	else if ( face == "3" ) { 
    		z = -0; 
    		y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1);
    		x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1); }
    	else if ( face == "4" ) { 
    		x = -0 + buildingX*(unit-1); 
    		y = ((floor-1)*buildingY) + (buildingY/facePiece) * (facePiece - parseInt(position[1])+1); 
    		z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(cube);}
    	else if ( face == "5" ) {
    		x = (buildingX/facePiece) * (parseInt(position[0]) + 1) + buildingX*(unit-1);
    		y = buildingY*floor;
    		z = (buildingZ/facePiece) * (facePiece - (parseInt(position[0])+1)); faceRotate(cube,"x");
    	}	
    	console.log(x+"|"+y+"|"+z);
        cube.position.set(x,y,z);    
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

        scene.add(cube);
        //文字
        var loader = new THREE.FontLoader();
        loader.load('./lib/helvetiker_regular.typeface.json',
			function(font) {
            var mesh = new THREE.Mesh(new THREE.TextGeometry(size, {
            font: font,
            size: 10,
            height: 1
          }), material);
			mesh.position.set(parseInt(x)+1,parseInt(y)+1,parseInt(z)+1);
			scene.add(mesh);
		});

    },

/*
* last requestAnimationFrame render
*/
    animate : function() {
    	requestAnimationFrame ( threeJs.animate );
    	threeJs.render();
    },

    render : function() {
    	renderer.render( scene,camera );
    },

}

