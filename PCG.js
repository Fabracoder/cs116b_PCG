var floorHeight = 1000;
var speed = 100000;
var minBuildingSize;

var MARGIN = 0;
var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
var SCREEN_WIDTH = window.innerWidth;

var container, stats;
var camera, controls, scene, sceneCube, renderer;
var buildings = [];
var dirLight, pointLight, ambientLight;

var clock = new THREE.Clock();


var materialQ = new THREE.MeshPhongMaterial({

     specular: 0x333333,
     shininess: 15,
     map: THREE.ImageUtils.loadTexture("Resources/final_textures/greyc.jpg")
         //    ,specularMap: THREE.ImageUtils.loadTexture("Resources/final_textures/ea_specular_2048.jpg")
 });

 var materialX = new THREE.MeshPhongMaterial({
     // light
     specular: '#010101',
     // intermediate
     color: '#883311',
     // dark
     //         emissive: '#505063',
     shininess: 50
 });
     var materialNormalMap = new THREE.MeshPhongMaterial({

         specular: 0x333333,
         shininess: 15,
         map: THREE.ImageUtils.loadTexture("Resources/final_textures/ea2048.jpg"),
         specularMap: THREE.ImageUtils.loadTexture("Resources/final_textures/ea_specular_2048.jpg"),
         normalMap: THREE.ImageUtils.loadTexture("Resources/final_textures/ea_normal_2048.jpg"),
         normalScale: new THREE.Vector2(0.85, 0.85)

     });


 init();
 animate();

 function init() {

     container = document.createElement('div');
     document.body.appendChild(container);

     //   cameraInit();

     camera = new THREE.PerspectiveCamera(25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7);
     camera.position.z = 1000 * 5;
     camera.position.y = floorHeight * 5;

     //     SceneInit();
     scene = new THREE.Scene();
     scene.fog = new THREE.FogExp2(0x0000f0, 0.00000025);

     //     ControlInit();
     controls = new THREE.FlyControls(camera);
     controls.movementSpeed = speed;
     controls.domElement = container;
     controls.rollSpeed = Math.PI / 24;
     controls.autoForward = false;
     controls.dragToLook = false;

     //     LightingInit();
     dirLight = new THREE.DirectionalLight(0x999999);
     dirLight.position.set(0, 1, 1).normalize();
     dirLight.castShadow = true;
     dirLight.shadowDarkness = 0.4;
     scene.add(dirLight);

     ambientLight = new THREE.AmbientLight(0x515151);
     scene.add(ambientLight);

 
     var floorGeometry = new THREE.BoxGeometry(100000, floorHeight, 100000);
     var floorMesh = new THREE.Mesh(floorGeometry, materialNormalMap);
     floorMesh.recieveShadow = true;
     scene.add(floorMesh);
 
     //testing CSG

		var cube_geometry = new THREE.BoxGeometry( 1000, 1000 , 1000 );
		var cube_mesh = new THREE.Mesh( cube_geometry );
		cube_mesh.position.x = -2000;
        cube_mesh.position.y = 600;
		var cube_bsp = new ThreeBSP( cube_mesh );

		var cubegeometry = new THREE.BoxGeometry( 900, 900, 1000 );
		var cubemesh = new THREE.Mesh( cubegeometry );
		cubemesh.position.x = -2000;
        cubemesh.position.y = 600;
        cubemesh.position.z = 50;
     
		var cubebsp = new ThreeBSP( cubemesh );
      
		var sphere_geometry = new THREE.SphereGeometry( 100, 32, 32 );
		var sphere_mesh = new THREE.Mesh( sphere_geometry );
		sphere_mesh.position.x = -1500;
		sphere_mesh.position.y = 300;
		sphere_mesh.position.z = -450;
     
		var sphere_bsp = new ThreeBSP( sphere_mesh );
//        scene.add(sphere_mesh);
		var subtract_bsp = cube_bsp.subtract( sphere_bsp );
		var result = subtract_bsp.toMesh(materialQ );
		result.geometry.computeVertexNormals();
//		scene.add( result );
//        
        var subtract_bsp = cube_bsp.subtract( cubebsp );
		var result = subtract_bsp.toMesh(materialNormalMap );
		result.geometry.computeVertexNormals();
     	  result = new ThreeBSP(result);
          result = result.subtract(sphere_bsp);
          result = result.toMesh(materialNormalMap );
     	result.geometry.computeVertexNormals();
		scene.add( result );
     
   createRulerGrid();  
     // add random buildings
  createRoadWithBuildings(10000,1000,new THREE.Vector3(0,floorHeight,0));

 
     for (i = 0, j=0; i < 200; i++) {
         var x = Math.floor(Math.random()*1000+100);
         var y = Math.floor(Math.random()*1000+10);
         var z = Math.floor(Math.random()*1000+100);
         
//         makeBuilding(new THREE.Vector3( j+x/2 , floorHeight/2, -z),new THREE.Vector3(x, y, z));
//         makeBuilding(new THREE.Vector3( Math.floor(Math.random()*10000-(10000/2)) , floorHeight/2, Math.floor(Math.random()*10000-(10000/2))),new THREE.Vector3(x, y, z));         
         j+=x+10;
//         console.log(":"+x+":"+y+":"+z+":\t:"+j+":"+floorHeight+":"+-z+":");
     }
   
     // stars
     {
         var i, r = 1234,
             starsGeometry = [new THREE.Geometry(), new THREE.Geometry()];

         for (i = 0; i < 250; i++) {

             var vertex = new THREE.Vector3();
             vertex.x = Math.random() * 2 - 1;
             vertex.y = Math.random() * 2 - 1;
             vertex.z = Math.random() * 2 - 1;
             vertex.multiplyScalar(r);

             starsGeometry[0].vertices.push(vertex);

         }

         for (i = 0; i < 1500; i++) {

             var vertex = new THREE.Vector3();
             vertex.x = Math.random() * 2 - 1;
             vertex.y = Math.random() * 2 - 1;
             vertex.z = Math.random() * 2 - 1;
             vertex.multiplyScalar(r);

             starsGeometry[1].vertices.push(vertex);

         }

         var stars;
         var starsMaterials = [
     new THREE.PointCloudMaterial({
                 color: 0x555555,
                 size: 2,
                 sizeAttenuation: false
             }),
     new THREE.PointCloudMaterial({
                 color: 0x555555,
                 size: 1,
                 sizeAttenuation: false
             }),
     new THREE.PointCloudMaterial({
                 color: 0x333333,
                 size: 2,
                 sizeAttenuation: false
             }),
     new THREE.PointCloudMaterial({
                 color: 0x3a3a3a,
                 size: 1,
                 sizeAttenuation: false
             }),
     new THREE.PointCloudMaterial({
                 color: 0x1a1a1a,
                 size: 2,
                 sizeAttenuation: false
             }),
     new THREE.PointCloudMaterial({
                 color: 0x1a1a1a,
                 size: 1,
                 sizeAttenuation: false
             })
    ];

         for (i = 10; i < 30; i++) {

             stars = new THREE.PointCloud(starsGeometry[i % 2], starsMaterials[i % 6]);

             stars.rotation.x = Math.random() * 6;
             stars.rotation.y = Math.random() * 6;
             stars.rotation.z = Math.random() * 6;

             s = i * 10;
             stars.scale.set(s, s, s);

             stars.matrixAutoUpdate = false;
             stars.updateMatrix();

             scene.add(stars);

         }
     }
     renderer = new THREE.WebGLRenderer();
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
     renderer.shadowMapEnabled = true;
     renderer.shadowMapType = THREE.PCFSoftShadowMap;
     renderer.render(scene, camera);
     container.appendChild(renderer.domElement);

     stats = new Stats();
     stats.domElement.style.position = 'absolute';
     stats.domElement.style.top = '0px';
     stats.domElement.style.zIndex = 100;
     container.appendChild(stats.domElement);

     window.addEventListener('resize', onWindowResize, false);


 };

 function onWindowResize(event) {

     SCREEN_HEIGHT = window.innerHeight;
     SCREEN_WIDTH = window.innerWidth;

     renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

     camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
     camera.updateProjectionMatrix();

     composer.reset();

 };

 function animate() {

     requestAnimationFrame(animate);
     render();
     stats.update();

 };

 function render() {

     var delta = clock.getDelta();

     controls.movementSpeed = speed * (delta);
     controls.update(delta);

     //				renderer.clear();
     renderer.render(scene, camera);

 };

 function makeBuilding(centerPos, size, facing) // Notes: if ground falls away beneath, build foundation to fill space. (cliffside can taper into the hill eventually)
     {

         var bsize = new THREE.Vector3();

         if (size != undefined)
         //if ( size.className == THREE.Vector3.className) 
         {
             bsize = size;
         } else {
             bsize.x = Math.random() * 460 + 4;
             bsize.z = Math.random() * 460 + 4;
             bsize.y = Math.random() * 1000;
         }
         var buildingPos = new THREE.Vector3();
         if (centerPos != undefined)
         //if ( centerPos.className == THREE.Vector3.className) 
         {
             buildingPos.x = centerPos.x;
             buildingPos.y = centerPos.y + bsize.y / 2; // to make it sit flat on the land and center it
             buildingPos.z = centerPos.z + bsize.z / 2;
         } else {
             buildingPos.x = Math.random() * 10000;
             buildingPos.y = 100; //TODO: get height of land at location;
             buildingPos.z = Math.random() * 10000;
         }
         var geomMesh = new THREE.Mesh(new THREE.BoxGeometry(bsize.x, bsize.y, bsize.z), materialQ);
         
         if(facing!= undefined) // facing should be a THREE.Vector3
         {
             geomMesh.lookAt(facing) ;
         }
         geomMesh.translateX(buildingPos.x);
         geomMesh.translateY(buildingPos.y);
         geomMesh.translateZ(buildingPos.z);
         geomMesh.castShadow = true;
         var building = {
             'pos': buildingPos,
             'size': bsize,
             'mesh': geomMesh
         };
         buildings.push(building);
         //console.log(building);
         scene.add(building.mesh);
     }

function createRulerGrid()
{

    var segments = 2;

    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

    var positions = new Float32Array( segments * 3 );
    var colors = new Float32Array( segments * 3 );

    var r = 5;

    var x=0,y=0,z=0;
    positions[0]=0;
    positions[1]=0;
    positions[2]=0;
    positions[4]=10;
    positions[5]=110;
    positions[6]=110;
    
    colors[0]=30;
    colors[1]=210;
    colors[2]=10;
    colors[4]=120;
    colors[5]=110;
    colors[6]=110;
    
    
//    for ( var i = 0; i < segments; i ++ ) {
//
//          x = x+r;
//          y = y+r;
//          z = z+r;
//
//        // positions
//
//        positions[ i * 3 ] = x;
//        positions[ i * 3 + 1 ] = y;
//        positions[ i * 3 + 2 ] = z;
//
//        // colors
//
//        colors[ i * 3 ] = ( x / r ) + 0.5;
//        colors[ i * 3 + 1 ] = ( y / r ) + 0.5;
//        colors[ i * 3 + 2 ] = ( z / r ) + 0.5;
//
//    }

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

    geometry.computeBoundingSphere();

    mesh = new THREE.Line( geometry, material );
    scene.add( mesh );

}

 function createRoadWithBuildings(roadLength,roadWidth,startPos,direction) // I will need to figure out how to adjust this to curvature of terrain
{
    var roadgeometry = new THREE.BoxGeometry( roadWidth, 1, roadLength );
 	var roadmesh = new THREE.Mesh( roadgeometry, materialX );
    z = 0;
    var tblength = 0;
    for(i =0;tblength<roadLength;)
    { 
    var bwidth = Math.floor(Math.random()*1000)+100;
    var bheight = Math.floor(Math.random()*1000)+100;
    var blength = Math.floor(Math.random()*1000)+100;
    tblength += blength;
        if(tblength<roadLength)
        {
            roadmesh.position.x = startPos.x;
        roadmesh.position.y = startPos.y;
        roadmesh.position.z = startPos.z-roadLength/2;
        makeBuilding(new THREE.Vector3(roadWidth/2+bwidth/2,floorHeight,z-tblength),new THREE.Vector3(bwidth,bheight,blength));
        } 
    }
    tblength=0;
    for(i =0;tblength<roadLength;)
    { 
    var bwidth = Math.floor(Math.random()*1000)+100;
    var bheight = Math.floor(Math.random()*1000)+100;
    var blength = Math.floor(Math.random()*1000)+100;
    tblength += blength;
        if(tblength<roadLength)
        {
            roadmesh.position.x = startPos.x;
        roadmesh.position.y = startPos.y;
        roadmesh.position.z = startPos.z-roadLength/2;
        makeBuilding(new THREE.Vector3(-roadWidth/2-bwidth/2,floorHeight,z-tblength),new THREE.Vector3(bwidth,bheight,blength));
        } 
    }    
     scene.add(roadmesh);

}