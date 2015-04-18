// This file is a library to help build architecture 
// It assumes the use of CSG.js and THREEcsg.js


function PCGmakeSolidWall(length, height, thickness,lookat) // basically a box
{
        var geom = new THREE.BoxGeometry(length,height,thickness);
		var wall_mesh = new THREE.Mesh( geom ); 
    
        wall_mesh.lookAt(lookat);
//		var wall_bsp = new ThreeBSP( wall_mesh );
    return wall_mesh;
}


function PCGmakeRoom(size, thickness,lookat) // basically a box that is hollow with a wall missing
{
        var geom = new THREE.BoxGeometry(size.x,size.y,size.z);
		var outer_mesh = new THREE.Mesh( geom ); 
        var outer_bsp = new ThreeBSP( outer_mesh );
    
        var geom = new THREE.BoxGeometry(size.x,size.y,size.z);
		var outer_mesh = new THREE.Mesh( geom ); 
        var outer_bsp = new ThreeBSP( outer_mesh );
    
//        wall_mesh.lookAt(lookat);
//		var wall_bsp = new ThreeBSP( wall_mesh );
    return room_mesh;
}


function PCGmakeDoor(wall,pos,loc)
{
    //todo:
}

function PCGmakeWindow(wall,pos,loc)
{
    //todo:
}

function PCGmakeTunnel(wall,pos,loc)
{
    //todo:
}



//
//		var cube_geometry = new THREE.BoxGeometry( 3000, 3000, 3000 );
//		var cube_mesh = new THREE.Mesh( cube_geometry );
//		cube_mesh.position.x = -70;
//        cube_mesh.position.y = 170;
//		var cube_bsp = new ThreeBSP( cube_mesh );
//
//		var cubegeometry = new THREE.BoxGeometry( 3000, 2000, 2000 );
//		var cubemesh = new THREE.Mesh( cubegeometry );
//		cubemesh.position.x = -70;
//        cubemesh.position.y = 170;
//		var cubebsp = new ThreeBSP( cubemesh );
//           
//        var subtract_bsp = cube_bsp.subtract( cubebsp );
//		var result = subtract_bsp.toMesh(materialQ );
//		result.geometry.computeVertexNormals();
//		scene.add( result );
//     