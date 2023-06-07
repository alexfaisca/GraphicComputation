//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var scene, texture_scene, renderer, bufferTexture;

var key_press_map = {};
var cameras = new Array(2), secondary_camera;
var auxCamera;
var active_camera;
var presented = false;
var dirLight;
var ambientLight;

var materials = [];
var meshes = [];

var sky, skyTexture, skydome;
var moon;
var house, body, door, window1, window2, roof;
var ufo, spotlight, pointlights = [], spotlight_target;
var clock = new THREE.Clock();
var corkOak, trunk1, trunk2, treeTop1, treeTop2, treeTop3;

var plane; 
var field_edge = 100, skydome_radius = 200;

// -7.896139007327889 37.52503500684735

// -7.896139007327889 37.52503500684735


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScenes(){
    'use strict';

    scene = new THREE.Scene();
    texture_scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(100));

    scene.background = new THREE.Color(0xeeeeff);
    generateNature();
//    createFlowers();
    createSky();
    createStars();
    createMoon();
    createPlane();
    createHouse();
    createUfo();
    createCorkOaks();
}
/*
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xffffff);
    scene.add(new THREE.AxesHelper(20));

    plane = new THREE.Object3D();
    var colorArray = [];
    bufferTexture = new THREE.BufferGeometry();
    bufferTexture.setAttribute('position', new THREE.BufferAttribute( new Float32Array([
        -40, -40, 0,
        40, -40, 0,
        40, 40, 0,
        -40, 40, 0
    ]) 3)); 

    const indices =[
        0, 1, 2,
        2, 3, 0
    ] 

    var color1 = new THREE.Color().setHex(0xff0000);
    var color2 = new THREE.Color().setHex(0x0000ff);
    colorArray = color1.toArray()
                .concat(color2.toArray())
                .concat(color2.toArray())
                .concat(color1.toArray());
}   


var flower_color;
for(var i = 0; i < n_flowers; i++){
    flower_color = Math.random() * 0xffffff;
    geometry = new THREE.CircleGeometry(5, 32);
    material = new THREE.MeshBasicMaterial({color: flower_color});
    mesh = new THREE.Mesh(geometry, material);

    var position_x = Math.random() * 400 - 200;
    var position_y = Math.random() * 400 - 200;
    mesh.position.x = position_x;
    mesh.position.y = position_y;

    grass_scene.add(mesh);
}

*/

function generateNature(){
    texture_scene = new THREE.Scene();

    bufferTexture = new THREE.WebGLRenderTarget(150*field_edge, 150*field_edge, {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}) //wraps
    createFlowers();
}



//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCameras() {
    'use strict'
    active_camera = 0;
    createIsometricPerspectiveCamera();
    createVRCamera(0, 20, 20);
}

function createIsometricPerspectiveCamera() {
    'use strict'
    cameras[0] = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 250);
    secondary_camera = new THREE.PerspectiveCamera(100, bufferTexture.width / bufferTexture.height, 1, 250)

    cameras[0].position.set(20, 10, 20);
    secondary_camera.position.set(0, 60, 0);

    cameras[0].lookAt(scene.position);
    secondary_camera.lookAt(texture_scene.position);
}

function createVRCamera(x, y, z){
    auxCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    
    auxCamera.position.set(x, y, z);
    auxCamera.lookAt(scene.position);
    cameras[1] = new THREE.StereoCamera();
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLights(){
    createAmbientLight();
    createDirectionalLight();
}

function createDirectionalLight() {
	dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);

	dirLight.position.set(100, 100, 100);
	dirLight.target.position.set(0, 0, 0); 

    dirLight.castShadow = true;

    // Directional lights' default shadow properties
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 500;

	dirLight.target.updateMatrixWorld();
	scene.add(dirLight);
}

function createAmbientLight(){
    ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2); 
    scene.add(ambientLight);
    ambientLight2 = new THREE.AmbientLight(0xFFFFFF, 0.2);
    texture_scene.add(ambientLight2);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createSky() {
    var skydome_geometry = new THREE.SphereGeometry(skydome_radius, 180, 180);

    var skydome_material = new THREE.MeshPhongMaterial({
        vertexColors: THREE.vertexColors,
        side: THREE.DoubleSide,
        color: 'violet',
    });

    skydome = new THREE.Mesh(skydome_geometry, skydome_material);
    scene.add(skydome);

    /*
    const indices = [0, 1, 2, 2, 3, 0];
    skyTexture = new THREE.BufferGeometry();
    skyTexture.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([
            -300, 50, -300,
            300, 50, -300,
            300, 50, 300,
            -300, 50, 300
        ]), 3));

    skyTexture.setIndex(indices);

    var colorArray = [];
    var color1 = new THREE.Color().setHex("red");
    var color2 = new THREE.Color().setHex("violet");
    colorArray = (color1.toArray()
        .concat(color2.toArray())
        .concat(color2.toArray())
        .concat(color1.toArray()));

    skyTexture.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colorArray, 3), true))
    */

}
function createStars(){
    var star_color = new THREE.Color().setHex(0xffffff);
    for(var i = 0; i < 1500; i++){
        var geometry = new THREE.CircleGeometry(0.2*(Math.random() + 1), 32);
        var material = new THREE.MeshBasicMaterial({color: star_color});
        var mesh = new THREE.Mesh(geometry, material);
        
        /* Spherical coordinates */
        let r = skydome_radius - 5;
        let theta = (3 * Math.random() + 1) * (Math.PI)/2; 
        let phi = Math.random() * (Math.PI)/2;
        mesh.position.x = r * Math.sin(phi) * Math.sin(theta);
        mesh.position.y = r * Math.cos(phi)
        mesh.position.z = r * Math.sin(phi) * Math.cos(theta);
        mesh.lookAt(0, 0, 0);

        scene.add(mesh);
    }
}
function createMoon(){
    'use strict';
    // Moon yellow colour
    var lambertMaterialMoon = new THREE.MeshLambertMaterial({color: 0xEBC815, emissive: 0xEBC815});
    var phongMaterialMoon = new THREE.MeshPhongMaterial({color: 0xEBC815});
    var toonMaterialMoon = new THREE.MeshToonMaterial({color: 0xEBC815});
    var basicMaterialMoon = new THREE.MeshBasicMaterial({color: 0xEBC815});
    
    var moonShapeGeometry = new THREE.SphereBufferGeometry(5, 32, 16);
    moon = new THREE.Mesh(moonShapeGeometry, lambertMaterialMoon); 

    moon.receiveShadow = true;
    moon.castShadow = true;
    moon.position.set(-30, 30, -30);

    meshes.push(moon);
    materials.push([lambertMaterialMoon, phongMaterialMoon, toonMaterialMoon, basicMaterialMoon]);    

    scene.add(moon);
}

function createPlane() {

    var everglades_geometry = new THREE.CircleGeometry(field_edge, 2000);
    everglades_geometry.rotateX(Math.PI / 2);

    const loader = new THREE.TextureLoader();
    const displacement_map = loader.load('textures/terrain_heightmap.png');
    const normal_map = loader.load('textures/terrain_shadowmap.png');

    const everglades_phong_material = new THREE.MeshPhongMaterial({
        color: 0x90EE90,
        side : THREE.DoubleSide,
        displacementMap: displacement_map,
        normalMap: normal_map,
        displacementScale: 10,
        map: bufferTexture.texture,
    });
    const everglades_lambert_material = new THREE.MeshLambertMaterial({
        color: 0x90EE90,
        side : THREE.DoubleSide,
        displacementMap: displacement_map,
        normalMap: normal_map,
        displacementScale: 10,
        map: bufferTexture.texture,
    });
    const everglades_toon_material = new THREE.MeshToonMaterial({
        color: 0x90EE90,
        side : THREE.DoubleSide,
        displacementMap: displacement_map,
        normalMap: normal_map,
        displacementScale: 10,
        map: bufferTexture.texture,
    });
    const everglades_basic_material = new THREE.MeshBasicMaterial({
        color: 0x90EE90,
        side : THREE.DoubleSide,
        displacementMap: displacement_map,
        normalMap: normal_map,
        displacementScale: 10,
        map: bufferTexture.texture,
    });
    var everglades = new THREE.Mesh(everglades_geometry, everglades_phong_material);
    everglades.receiveShadow = true;
    meshes.push(everglades)
    materials.push([everglades_lambert_material, everglades_phong_material, everglades_toon_material, everglades_basic_material]);

    scene.add(everglades);
}
function createFlowers(){
    var flower_color;
    for(var i = 0; i < 1000; i++){
        switch(i % 4){
            case 0:
                flower_color = 0xffffff;
            break;
            case 1:
                flower_color = 0xFFFF00;
            break;
            case 2:
                flower_color = 0xCF9FFF;
            break;
            case 3:
                flower_color = 0x89cff0;
            break;
        }
        var geometry = new THREE.CircleGeometry(0.1*(Math.random() + 1), 32);
        var material = new THREE.MeshBasicMaterial({color: flower_color, side: THREE.BackSide});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;

        mesh.position.x = Math.random() * field_edge/2 * Math.sin(2 * Math.random() * Math.PI);
        mesh.position.y = 0;
        mesh.position.z = Math.random() * field_edge/2 * Math.cos(2 * Math.random() * Math.PI);
        mesh.rotateX(Math.PI / 2);
        texture_scene.add(mesh);
    }
}

//TODO: Set proper corkOak top
function createCorkOaks(){
    'use strict';
    var lambertMaterialTrunk = new THREE.MeshLambertMaterial({color: 0xa45729});
    var phongMaterialTrunk = new THREE.MeshPhongMaterial({color: 0xa45729});
    var toonMaterialTrunk = new THREE.MeshToonMaterial({color: 0xa45729});
    var basicMaterialTrunk = new THREE.MeshBasicMaterial({color: 0xa45729});

    var lambertMaterialTreeTop = new THREE.MeshLambertMaterial({color: 0x013220});
    var phongMaterialTreeTop = new THREE.MeshPhongMaterial({color: 0x013220});
    var toonMaterialTreeToop = new THREE.MeshToonMaterial({color: 0x013220});
    var basicMaterialTreeToop = new THREE.MeshBasicMaterial({color: 0x013220});
    /*
    var trunk1_path_start = new THREE.Vector3(0, 0, 0)
    var trunk1_path_end = new THREE.Vector3(1.5, 2, 0)
    const trunk1_path = new THREE.LineCurve3(trunk1_path_start, trunk1_path_end);

    const circle = new THREE.Shape(

    );

    circle.moveTo( 0,0 );
    circle.lineTo( 0, 0.5 );
    circle.lineTo( 0.5, 0.5 );
    circle.lineTo( 0.5, 0 );
    circle.lineTo( 0, 0 );
        
    const length = 12, width = 8;

    const shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, width );
    shape.lineTo( length, width );
    shape.lineTo( 0, 0 );
        
    const extrudeSettings = {
        extrudePath: trunk1_path
    };

    const trunk1_geometry = new THREE.ExtrudeGeometry( circle, extrudeSettings );
    const trunk1_material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    const mesh = new THREE.Mesh( trunk1_geometry, trunk1_material ) ;

    mesh.position.set(15, 5, 10);
    scene.add( mesh ); */
    //----

    for (let i = 0; i < 20; i++) {
        var trunk1ShapeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 10);
        trunk1 = new THREE.Mesh(trunk1ShapeGeometry, lambertMaterialTrunk); 
        trunk1.receiveShadow = true;
        trunk1.castShadow = true;

        trunk1.rotateZ((Math.PI)/(4));

        var trunk1ShapeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 10);
        trunk2 = new THREE.Mesh(trunk1ShapeGeometry, lambertMaterialTrunk); 
        trunk2.receiveShadow = true;
        trunk2.castShadow = true;

        trunk2.rotateZ((Math.PI)/(-4));
        trunk2.position.set(0.9, 0.9, 0);

        var treeTop1ShapeGeometry = new THREE.SphereBufferGeometry(1.5, 32, 16);
        treeTop1 = new THREE.Mesh(treeTop1ShapeGeometry, lambertMaterialTreeTop);
        treeTop1.receiveShadow = true;
        treeTop1.castShadow = true; 
        treeTop1.scale.set(2, 1, 1);
        treeTop1.position.set(-1.5, 2.5, 0);

        var treeTop2ShapeGeometry = new THREE.SphereBufferGeometry(1.5, 32, 16);
        treeTop2 = new THREE.Mesh(treeTop2ShapeGeometry, lambertMaterialTreeTop);
        treeTop2.receiveShadow = true;
        treeTop2.castShadow = true; 
        treeTop2.scale.set(1.5, 1, 1);
        treeTop2.position.set(0, 4, 0);

        var treeTop3ShapeGeometry = new THREE.SphereBufferGeometry(1.5, 32, 16);
        treeTop3 = new THREE.Mesh(treeTop3ShapeGeometry, lambertMaterialTreeTop);
        treeTop3.receiveShadow = true;
        treeTop3.castShadow = true; 
        treeTop3.scale.set(2, 1, 1);
        treeTop3.position.set(1.5, 2.5, 0);

        corkOak = new THREE.Group();

        corkOak.add(trunk1, trunk2, treeTop1, treeTop2, treeTop3);
        
        corkOak.rotateY(2*(Math.PI) * Math.random());
        corkOak.scale.set(1, 0.5 * (2 * Math.random() + 1), 1);

        /* Polar coordinates */
        let r = field_edge/4 * (Math.random() + 1);
        let theta = (3 * Math.random() + 1) * (Math.PI)/2;
        corkOak.position.x = r * Math.sin(theta);
        corkOak.position.z = r * Math.cos(theta);
        
        meshes.push(trunk1, trunk2, treeTop1, treeTop2, treeTop3);
        materials.push([lambertMaterialTrunk, phongMaterialTrunk, toonMaterialTrunk, basicMaterialTrunk]);
        materials.push([lambertMaterialTrunk, phongMaterialTrunk, toonMaterialTrunk, basicMaterialTrunk]);
        materials.push([lambertMaterialTreeTop, phongMaterialTreeTop, toonMaterialTreeToop, basicMaterialTreeToop]);
        materials.push([lambertMaterialTreeTop, phongMaterialTreeTop, toonMaterialTreeToop, basicMaterialTreeToop]);   
        materials.push([lambertMaterialTreeTop, phongMaterialTreeTop, toonMaterialTreeToop, basicMaterialTreeToop]);    
        scene.add(corkOak);
    }
}

function createHouse(){
    'use strict';

    // Create house's materials
    var lambertMaterialBody = new THREE.MeshLambertMaterial({color: 0xffffff});
    var phongMaterialBody = new THREE.MeshPhongMaterial({color: 0xffffff});
    var toonMaterialBody = new THREE.MeshToonMaterial({color: 0xffffff});
    var basicMaterialBody = new THREE.MeshBasicMaterial({color: 0xffffff});

    var lambertMaterialDoor = new THREE.MeshLambertMaterial({color: 0xC4A484});
    var phongMaterialDoor = new THREE.MeshPhongMaterial({color: 0xC4A484});
    var toonMaterialDoor = new THREE.MeshToonMaterial({color: 0xC4A484});
    var basicMaterialDoor = new THREE.MeshBasicMaterial({color: 0xC4A484});

    var lambertMaterialWindow = new THREE.MeshLambertMaterial({color: 0x89cff0});
    var phongMaterialWindow = new THREE.MeshPhongMaterial({color: 0x89cff0});
    var toonMaterialWindow = new THREE.MeshToonMaterial({color: 0x89cff0});
    var basicMaterialWindow = new THREE.MeshBasicMaterial({color: 0x89cff0});

    var lambertMaterialRoof = new THREE.MeshLambertMaterial({color: 0xDC582A});
    var phongMaterialRoof = new THREE.MeshPhongMaterial({color: 0xDC582A});
    var toonMaterialRoof = new THREE.MeshToonMaterial({color: 0xDC582A});
    var basicMaterialRoof = new THREE.MeshBasicMaterial({color: 0xDC582A});

    var bodyShapeGeometry = new THREE.BufferGeometry();

    const bodyVertices = new Float32Array( [
        0, 0, 0, // v0
        1, 0, 0, // v1
        0, 5, 0, // v2
        1, 5, 0, // v3
        10, 4, 0, // v4
        10, 5, 0, // v5
        1, 4, 0, // v6
        3, 4, 0, // v7
        3, 1.5, 0, // v8
        4, 1.5, 0, // v9
        4, 4, 0, // v10
        6, 4, 0, // v11
        6, 1.5, 0, // 12
        7, 1.5, 0, // v13
        7, 4, 0, // v14
        9, 4, 0, // v15
        9, 1.5, 0, // v16
        10, 1.5, 0, // v17
        10, 4, 0, // v18
        3, 0, 0, // v19
        10, 0, 0, // v20
        0, 0, -5, // v21
        0, 5, -5, // v22
        10, 0, -5, // v23
        10, 5, -5 // v24
    ] );

    const bodyIndexes = [
        0, 1, 2, // Front side
        3, 2, 1,
        4, 5, 6,
        6, 5, 3,
        7, 8, 9,
        9, 10, 7,
        11, 12, 13,
        13, 14, 11,
        15, 16, 17,
        17, 18, 15,
        19, 20, 17,
        17, 8, 19,
        0, 2, 22, // Left side
        22, 21, 0,
        20, 23, 5, // Right Side
        5, 23, 24,
        21, 22, 24, // Back side
        24, 23, 21
    ];
    
    bodyShapeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bodyVertices, 3));
    //bodyShapeGeometry.setAttribute('uv', new THREE.BufferAttribute(bodyVertices, 3));
    bodyShapeGeometry.setIndex(bodyIndexes);
    bodyShapeGeometry.computeVertexNormals();

    body = new THREE.Mesh(bodyShapeGeometry, lambertMaterialBody);
    body.receiveShadow = true;
    body.castShadow = true;
    
    var doorShapeGeometry = new THREE.BufferGeometry();

    const doorVertices = new Float32Array( [
       1, 0, 0, // v0
       3, 0, 0, // v1
       3, 4, 0, // v2
       1, 4, 0 // v3
    ] );

    const doorIndexes = [
        0, 1, 3,
        1, 2, 3
    ];
    
    doorShapeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(doorVertices, 3));
    //doorShapeGeometry.setAttribute('uv', new THREE.BufferAttribute(doorVertices, 3));
    doorShapeGeometry.setIndex(doorIndexes);
    doorShapeGeometry.computeVertexNormals();

    door = new THREE.Mesh(doorShapeGeometry, lambertMaterialDoor);
    door.receiveShadow = true;
    door.castShadow = true;

    var window1ShapeGeometry = new THREE.BufferGeometry();

    const window1Vertices = new Float32Array( [
       4, 1.5, 0, // v0
       6, 1.5, 0, // v1
       6, 4, 0, // v2
       4, 4, 0 // v3
    ] );

    const window1Indexes = [
        0, 1, 3,
        1, 2, 3
    ];
    
    window1ShapeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(window1Vertices, 3));
    //window1ShapeGeometry.setAttribute('uv', new THREE.BufferAttribute(window1Vertices, 3));
    window1ShapeGeometry.setIndex(window1Indexes);
    window1ShapeGeometry.computeVertexNormals();

    window1 = new THREE.Mesh(window1ShapeGeometry, lambertMaterialWindow);
    window1.receiveShadow = true;
    window1.castShadow = true;

    var window2ShapeGeometry = new THREE.BufferGeometry();

    const window2Vertices = new Float32Array( [
        7, 1.5, 0, // v0
        9, 1.5, 0, // v1
        9, 4, 0, // v2
        7, 4, 0 // v3
     ] );

    const window2Indexes = [
        0, 1, 3,
        1, 2, 3
    ];
    
    window2ShapeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(window2Vertices, 3));
    //window2ShapeGeometry.setAttribute('uv', new THREE.BufferAttribute(window2Vertices, 3));
    window2ShapeGeometry.setIndex(window2Indexes);
    window2ShapeGeometry.computeVertexNormals();

    window2 = new THREE.Mesh(window2ShapeGeometry, lambertMaterialWindow);
    window2.receiveShadow = true;
    window2.castShadow = true;

    var roofShapeGeometry = new THREE.BufferGeometry();

    const roofVertices = new Float32Array( [
        0, 5, 0, // v0
        10, 5, 0, // v1
        0, 7, -2.5, // v2
        10, 7, -2.5, // v3
        0, 5, -5, // v4
        10, 5, -5 // v5
     ] );

    const roofIndexes = [
        0, 1, 2, // Front side
        1, 3, 2,
        2, 3, 5, // Back side
        5, 4, 2,
        0, 2, 4, // Left side
        1, 5, 3 // Right side
    ];
    
      roofShapeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(roofVertices, 3));
    //roofShapeGeometry.setAttribute('uv', new THREE.BufferAttribute(roofVertices, 3));
    roofShapeGeometry.setIndex(roofIndexes);
    roofShapeGeometry.computeVertexNormals();

    roof = new THREE.Mesh(roofShapeGeometry, lambertMaterialRoof);
    roof.receiveShadow = true;
    roof.castShadow = true;

    house = new THREE.Group();

    house.add(body, door, window1, window2, roof);    
    house.position.set(-5, 0, 2.5); // Center house
    house.rotateY((Math.PI)/(1/8)); // Better side visibility
    
    meshes.push(body, door, window1, window2, roof);
    materials.push([lambertMaterialBody, phongMaterialBody, toonMaterialBody, basicMaterialBody]);
    materials.push([lambertMaterialDoor, phongMaterialDoor, toonMaterialDoor, basicMaterialDoor]);
    materials.push([lambertMaterialWindow, phongMaterialWindow, toonMaterialWindow, basicMaterialWindow]);
    materials.push([lambertMaterialWindow, phongMaterialWindow, toonMaterialWindow, basicMaterialWindow]);
    materials.push([lambertMaterialRoof, phongMaterialRoof, toonMaterialRoof, basicMaterialRoof]);

    scene.add(house);
}
function createUfo() {
    var ufo_x = 0, ufo_y = 10, ufo_z = 0;
    var target_geometry = new THREE.BufferGeometry();
    target_geometry.setAttribute('vertices', new THREE.BufferAttribute(new Float32Array( [ufo_x, 0, ufo_z]), 3));
    var target_material = new THREE.PointsMaterial( {visible: false} );
    spotlight_target = new THREE.Points(target_geometry, target_material);

    ufo = new THREE.Object3D();
    const cockpit_geometry = new THREE.SphereBufferGeometry(2.5, 32, 32, 0, 2 * Math.PI, 0, 4 * Math.PI / 9);
    var cockpit_lambert_material = new THREE.MeshLambertMaterial({color: 0x23395d});
    var cockpit_phong_material = new THREE.MeshPhongMaterial({color: 0x23395d});
    var cockpit_toon_material = new THREE.MeshToonMaterial({color: 0x23395d});
    var cockpit_basic_material = new THREE.MeshBasicMaterial({color: 0x23395d});
    const cockpit_sphere = new THREE.Mesh(cockpit_geometry, cockpit_lambert_material);
    cockpit_sphere.position.setY(3.6);
    cockpit_sphere.receiveShadow = true;
    cockpit_sphere.castShadow = true;
    materials.push([cockpit_lambert_material, cockpit_phong_material, cockpit_toon_material, cockpit_basic_material]);
    meshes.push(cockpit_sphere);

    const body_geometry = new THREE.SphereBufferGeometry(5, 32, 16);
    var body_lambert_material = new THREE.MeshLambertMaterial({color: 0x152238});
    var body_phong_material = new THREE.MeshPhongMaterial({color: 0x152238});
    var body_toon_material = new THREE.MeshToonMaterial({color: 0x152238});
    var body_basic_material = new THREE.MeshBasicMaterial({color: 0x152238});
    const body_sphere = new THREE.Mesh(body_geometry, body_lambert_material);
    body_sphere.scale.set(1, 3 / 10, 1)
    body_sphere.position.setY(3);
    body_sphere.receiveShadow = true;
    body_sphere.castShadow = true;
    materials.push([body_lambert_material, body_phong_material, body_toon_material, body_basic_material]);
    meshes.push(body_sphere);


    const spotlight_geometry = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 32);
    var spotlight_lambert_material = new THREE.MeshLambertMaterial({color: 0xffffbf});
    var spotlight_phong_material = new THREE.MeshPhongMaterial({color: 0xffffbf});
    var spotlight_toon_material = new THREE.MeshToonMaterial({color: 0xffffbf});
    var spotlight_basic_material = new THREE.MeshBasicMaterial({color: 0xffffbf});
    var spotlight_cilinder = new THREE.Mesh(spotlight_geometry, spotlight_lambert_material);
    spotlight_cilinder.add(createSpotLight(0,-0.1,0, ));
    spotlight_cilinder.position.setY(1.6);
    spotlight_cilinder.receiveShadow = true;
    spotlight_cilinder.castShadow = true;
    materials.push([spotlight_lambert_material, spotlight_phong_material, spotlight_toon_material, spotlight_basic_material]);
    meshes.push(spotlight_cilinder);



    const pointlight_radius = 0.25, pointlight_geometry = new THREE.SphereBufferGeometry(pointlight_radius, 32, 16 );
    var pointlight_lambert_material = new THREE.MeshLambertMaterial({color: 0xffffbf});
    var pointlight_phong_material = new THREE.MeshPhongMaterial({color: 0xffffbf});
    var pointlight_toon_material = new THREE.MeshToonMaterial({color: 0xffffbf});
    var pointlight_basic_material = new THREE.MeshBasicMaterial({color: 0xffffbf});
    const pointlight_count = 6;
    var pointlight;

    for(let i = 0; i < pointlight_count; i++) {
        pointlight = new THREE.Mesh(pointlight_geometry, pointlight_lambert_material);
        pointlight.add(createPointLight(0, -pointlight_radius, 0));
        pointlight.position.set(15/ 4 * Math.sin(i * 2 * Math.PI / pointlight_count), 2.2, 15/ 4 * Math.cos(i * 2 * Math.PI / pointlight_count));
        pointlight.receiveShadow = true;
        pointlight.castShadow = true;
        ufo.add(pointlight);
        materials.push([pointlight_lambert_material, pointlight_phong_material, pointlight_toon_material, pointlight_basic_material]);
        meshes.push(pointlight);
    }

    ufo.add(cockpit_sphere, body_sphere, spotlight_cilinder);

    ufo.userData = {
        angular_velocity :  Math.PI / 4,
        linear_velocity : new THREE.Vector3(0,0,0)
    };


    /*
    const geometry = new THREE.SphereBufferGeometry( 15, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometry, material ); scene.add( sphere ); */

    ufo.position.set(ufo_x, ufo_y, ufo_z);
    scene.add(ufo);
}
function createSpotLight(x, y, z){
    spotlight = new THREE.SpotLight(0xffffff,4,20, Math.PI / 6, 0, 0.5);
    spotlight.castShadow = true;

    // Place Spotlight at Spaceship
    spotlight.position.set(x,y,z);

    // Update Target of SpotLight
    spotlight.target = spotlight_target;
    scene.add(spotlight.target);
    return spotlight;
}
function createPointLight(x, y, z, color) {
    //we can change individual color of light
    var point = new THREE.PointLight(color, 0.3, 15);

    point.position.set(x, y, z);
    point.castShadow = true;
    pointlights.push(point);

    return point;
}
//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    changeCamera();
    changeDirectionalLight();
    changeSpotLight();
    changePointLight();

    let delta =  clock.getDelta();
    changeMaterials();
    updateUfoPosition(delta);
    updateUfoRotation(delta);
}

function changeCamera() {
    'use strict'

    if(key_press_map[49]) {
        active_camera = (active_camera + 1) % 2;
        key_press_map[49] = false;
    }
}

function changeDirectionalLight(){
    'use strict'
    if(key_press_map[68]) {
        dirLight.visible = !dirLight.visible;
        key_press_map[68] = 0;
    }
}

function changeSpotLight(){
    'use strict'
    if(key_press_map[83]) {
        spotlight.visible = !spotlight.visible;
        key_press_map[83] = 0;
    }
}

function changePointLight(){
    'use strict'
    if(key_press_map[80]) {
        for (const light of pointlights) light.visible = !light.visible;
        key_press_map[80] = 0;
    }
}

function changeMaterials(){
    'use strict'
    for (var i = 0; i < meshes.length; i++) {
        if(key_press_map[81]) // Cartoon
            meshes[i].material = materials[i][0];
        if(key_press_map[87]) // Phong
            meshes[i].material = materials[i][1];		
        if(key_press_map[69]) // Gouraud
            meshes[i].material = materials[i][2];	
        if(key_press_map[82]) // Basic material - no light calculation
            meshes[i].material = materials[i][3];	
    }
    key_press_map[81] = 0;	
    key_press_map[87] = 0;
    key_press_map[69] = 0;
    key_press_map[82] = 0;
}

function updateUfoPosition(delta) {
    'use strict';
    compute_ufo_movement();
    ufo.userData.linear_velocity = ufo.userData.linear_velocity.multiplyScalar(delta);
    ufo.position.add(ufo.userData.linear_velocity);
    spotlight_target.position.add(ufo.userData.linear_velocity);
}

function updateUfoRotation(delta) {
    'use strict';
    ufo.rotateY(ufo.userData.angular_velocity * delta);
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    if(renderer.xr.isPresenting){
        if(!presented){
            presented = true;
            scene.translateZ(-5);
            scene.translateY(-5);
        }
        renderer.clear(); // manual clear
        cameras[1].update(auxCamera);
        renderer.render(texture_scene, cameras[1].cameraL);
        renderer.render(texture_scene, cameras[1].cameraR);
        renderer.render(scene, cameras[1].cameraL);
        renderer.render(scene, cameras[1].cameraR);
    }
    else {
        renderer.setRenderTarget(bufferTexture);
        renderer.clear(); // manual clear
        renderer.render(texture_scene, secondary_camera);
        renderer.setRenderTarget(null);
        renderer.render(scene, cameras[0]);
    }
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

    renderer.setSize(400, 400);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setRenderTarget(null);

    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));
    
    renderer.xr.enabled = true;

    createScenes();
    createCameras();
    createLights();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    requestAnimationFrame(animate);
    renderer.setAnimationLoop(function(){
        render();
        update();
    })
}

function update_ufo_velocity(x, z){
    'use strict';
    ufo.userData.linear_velocity.setX(x);
    ufo.userData.linear_velocity.setZ(z);
    ufo.userData.linear_velocity.setLength(4);
}

function compute_ufo_movement() {
    'use strict';
    if(key_press_map[37] && key_press_map[39] && key_press_map[38] && key_press_map[40]){ // Left + Right + Up + Down
        update_ufo_velocity(0, 0);
        return;
    }
    if(key_press_map[37] && key_press_map[39] && key_press_map[38]){ // Left + Right + Up
        update_ufo_velocity(0, -4);
        return;
    }
    if(key_press_map[37] && key_press_map[39] && key_press_map[40]){ // Left + Right + Down
        update_ufo_velocity(0, 4);
        return;
    }
    if(key_press_map[38] && key_press_map[40] && key_press_map[37]){ // Up + Down + Left
        update_ufo_velocity(-4, 0);
        return;
    }
    if(key_press_map[38] && key_press_map[40] && key_press_map[39]){ // Up + Down + Right
        update_ufo_velocity(4, 0);
        return;
    }
    if(key_press_map[38] && key_press_map[40]){ // Up + Down
        update_ufo_velocity(0, 0);
        return;
    }
    if(key_press_map[37] && key_press_map[39]){ // Left + Right
        update_ufo_velocity(0, 0);
        return;
    }
    if(key_press_map[38] && key_press_map[39]){ // Up + Right
        update_ufo_velocity(4, -4);
        return;
    }
    if(key_press_map[38] && key_press_map[37]){ // Up + Left
        update_ufo_velocity(-4, -4);
        return;
    }
    if(key_press_map[40] && key_press_map[39]){ // Down + Right
        update_ufo_velocity(4, 4);
        return;
    }
    if(key_press_map[40] && key_press_map[37]){ // Down + Left
        update_ufo_velocity(-4, 4);
        return;
    }
    if(key_press_map[37]){
        update_ufo_velocity(-4, 0);
        return;
    }
    if(key_press_map[38]){
        update_ufo_velocity(0, -4);
        return;
    }
    if(key_press_map[39]){
        update_ufo_velocity(4, 0);
        return;
    }
    if(key_press_map[40]){
        update_ufo_velocity(0, 4);
        return;
    }
    update_ufo_velocity(0,0);
}


////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerWidth > 0 && window.innerHeight > 0) {
        cameras[active_camera].aspect = window.innerWidth / window.innerHeight;
        cameras[active_camera].updateProjectionMatrix();
    }
    
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
        // Change camera
        case 49: // 1
            key_press_map[49] = 1;
            break;
        // Toggle directional light
        case 68: // D
        case 100: // d
            key_press_map[68] = 1;
            break;
        // Change materials
        case 81: // Q
        case 113: // q
            key_press_map[81] = 1;
            break;
        case 87: // W
        case 119: // w
            key_press_map[87] = 1;
            break;
        case 69: // E
        case 101: // e
            key_press_map[69] = 1;
            break;
        // Change to basic material - no light calculation
        case 82: // R
        case 114: // r
            key_press_map[82] = 1;
            break;
        // UFO point lights
        case 80: // P
        case 112: // p
            key_press_map[80] = 1;
            break;
        // UFO spotlight
        case 83: // S
        case 115: // s
            key_press_map[83] = 1;
            break;
        // UFO Movement
        case 37: // Left
            key_press_map[37] = 1;
            break;
        case 38: // Up
            key_press_map[38] = 1;
            break;
        case 39: // Right
            key_press_map[39] = 1;
            break;
        case 40: // Down
            key_press_map[40] = 1;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict';

    switch(e.keyCode) {
        // Change camera
        case 49: // 1
            key_press_map[49] = 0;
            break;
        // Toggle directional light
        case 68: // D
        case 100: // d
            key_press_map[68] = 0;
            break;
        // Change materials
        case 81: // Q
        case 113: // q
            key_press_map[81] = 0;
            break;
        case 87: // W
        case 119: // w
            key_press_map[87] = 0;
            break;
        case 69: // E
        case 101: // e
            key_press_map[69] = 0;
            break;
        // Change to basic material - no light calculation
        case 82: // R
        case 114: // r
            key_press_map[82] = 0;
            break;
        // UFO point lights
        case 80: // P
        case 112: // p
            key_press_map[80] = 0;
            break;
        // UFO spotlight
        case 83: // S
        case 115: // s
            key_press_map[83] = 0;
            break;
        // UFO Movement
        case 37: // Left
            key_press_map[37] = 0;
            break;
        case 38: // Up
            key_press_map[38] = 0;
            break;
        case 39: // Right
            key_press_map[39] = 0;
            break;
        case 40: // Down
            key_press_map[40] = 0;
            break;
    }
}