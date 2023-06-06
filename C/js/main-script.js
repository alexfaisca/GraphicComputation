//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var scene, renderer;

var key_press_map = {};
var cameras = new Array(2);
var VRCamera;
var active_camera;
var dirLight;
var ambientLight;

var materials = [];
var meshes = [];

var sky, skyTexture;
var moon;
var house, body, door, window1, window2, roof;
var ufo;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xeeeeff);

    createSky();
    createMoon();
    createHouse();
    createUfo();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCameras() {
    'use strict'
    active_camera = 0;
    createIsometricPerspectiveCamera();
    createVRCamera();
}

function createIsometricPerspectiveCamera() {
    'use strict'
    cameras[0] = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 100);
    cameras[0].position.set(-20, -5, 20);
    cameras[0].lookAt(scene.position);
}

function createVRCamera(){
    VRCamera = new THREE.PerspectiveCamera(60,
                                    window.innerWidth / window.innerHeight,
                                    1,
                                    1000);
    
    VRCamera.position.set(0, 20, 20);
    VRCamera.lookAt(scene.position);
    cameras[1] = new THREE.StereoCamera();
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createDirectionalLight() {
	dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
	dirLight.position.set(100, 100, 200);
	dirLight.target.position.set(0, 0, 0); //Should width and height be used here?
    dirLight.castShadow = true;

    /*dirL1ight.shadow.mapSize.width = 10;
    dirLight.shadow.mapSize.height = 10;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 10;*/

	dirLight.target.updateMatrixWorld();
	scene.add(dirLight);
}

function createAmbientLight(){
    ambientLight = new THREE.AmbientLight(0x404040, 2); 
    scene.add(ambientLight);
}

function createLights(){
    createAmbientLight();
    createDirectionalLight();
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createSky() {
    skyTexture = new THREE.SphereGeometry(100, 180, 180);

    var material = new THREE.MeshPhongMaterial({
        vertexColors: THREE.vertexColors,
        side: THREE.DoubleSide,
        color: 'purple'
    });


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

    sky = new THREE.Mesh(skyTexture, material);
    scene.add(sky);

}

function createMoon(){
    'use strict';
    var lambertMaterialMoon = new THREE.MeshLambertMaterial({color: 0xffffbf});
    var phongMaterialMoon = new THREE.MeshPhongMaterial({color: 0xffffbf});
    var toonMaterialMoon = new THREE.MeshToonMaterial({color: 0xffffbf});
    var basicMaterialMoon = new THREE.MeshBasicMaterial({color: 0xffffbf});
    
    var sphere = new THREE.SphereGeometry(5, 32, 16);
    moon = new THREE.Mesh(sphere, lambertMaterialMoon); 
    
    moon.position.set(-30, 70, -30);

    meshes.push(moon);
    materials.push([lambertMaterialMoon, phongMaterialMoon, toonMaterialMoon, basicMaterialMoon]);    

    scene.add(moon);
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

    var lambertMaterialRoof = new THREE.MeshLambertMaterial({color: 0x880808});
    var phongMaterialRoof = new THREE.MeshPhongMaterial({color: 0x880808});
    var toonMaterialRoof = new THREE.MeshToonMaterial({color: 0x880808});
    var basicMaterialRoof = new THREE.MeshBasicMaterial({color: 0x880808});

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

    house = new THREE.Object3D();

    house.add(body, door, window1, window2, roof);    
    house.position.set(-5, 2.5, 0); // Center house
    house.rotateY((Math.PI)/(1/8)); // Better side visibility
    house.receiveShadow = true;
    house.castShadow = true;
    
    meshes.push(body, door, window1, window2, roof);
    materials.push([lambertMaterialBody, phongMaterialBody, toonMaterialBody, basicMaterialBody]);
    materials.push([lambertMaterialDoor, phongMaterialDoor, toonMaterialDoor, basicMaterialDoor]);
    materials.push([lambertMaterialWindow, phongMaterialWindow, toonMaterialWindow, basicMaterialWindow]);
    materials.push([lambertMaterialWindow, phongMaterialWindow, toonMaterialWindow, basicMaterialWindow]);
    materials.push([lambertMaterialRoof, phongMaterialRoof, toonMaterialRoof, basicMaterialRoof]);

    scene.add(house);
}

function createUfo() {
    ufo = new THREE.Group();
    const cockpit_geometry = new THREE.SphereGeometry(2.5, 32, 32, 0, 2 * Math.PI, 0, 4 * Math.PI / 9);
    var cockpit_lambert_material = new THREE.MeshLambertMaterial({color: 0x23395d});
    var cockpit_phong_material = new THREE.MeshPhongMaterial({color: 0x23395d});
    var cockpit_toon_material = new THREE.MeshToonMaterial({color: 0x23395d});
    var cockpit_basic_material = new THREE.MeshBasicMaterial({color: 0x23395d});
    const cockpit_sphere = new THREE.Mesh(cockpit_geometry, cockpit_basic_material);
    cockpit_sphere.position.setY(3.6);
    materials.push([cockpit_lambert_material, cockpit_phong_material, cockpit_toon_material, cockpit_basic_material]);
    meshes.push(cockpit_sphere);

    const body_geometry = new THREE.SphereGeometry(5, 32, 16);
    var body_lambert_material = new THREE.MeshLambertMaterial({color: 0x152238});
    var body_phong_material = new THREE.MeshPhongMaterial({color: 0x152238});
    var body_toon_material = new THREE.MeshToonMaterial({color: 0x152238});
    var body_basic_material = new THREE.MeshBasicMaterial({color: 0x152238});
    const body_sphere = new THREE.Mesh(body_geometry, body_basic_material);
    body_sphere.scale.set(1, 3 / 10, 1)
    body_sphere.position.setY(3);
    materials.push([body_lambert_material, body_phong_material, body_toon_material, body_basic_material]);
    meshes.push(body_sphere);

    const spotlight_geometry = new THREE.CylinderGeometry(2.5, 2.5, 1, 32);
    var spotlight_lambert_material = new THREE.MeshLambertMaterial({color: 0xffffbf});
    var spotlight_phong_material = new THREE.MeshPhongMaterial({color: 0xffffbf});
    var spotlight_toon_material = new THREE.MeshToonMaterial({color: 0xffffbf});
    var spotlight_basic_material = new THREE.MeshBasicMaterial({color: 0xffffbf});
    const spotlight_cilinder = new THREE.Mesh(spotlight_geometry, spotlight_basic_material);
    spotlight_cilinder.position.setY(2);
    materials.push([spotlight_lambert_material, spotlight_phong_material, spotlight_toon_material, spotlight_basic_material]);
    meshes.push(spotlight_cilinder);


    var pointlight_ring = [];
    const pointlight_geometry = new THREE.SphereGeometry( 0.25, 32, 16 );
    var pointlight_lambert_material = new THREE.MeshLambertMaterial({color: 0xffffbf});
    var pointlight_phong_material = new THREE.MeshPhongMaterial({color: 0xffffbf});
    var pointlight_toon_material = new THREE.MeshToonMaterial({color: 0xffffbf});
    var pointlight_basic_material = new THREE.MeshBasicMaterial({color: 0xffffbf});
    const pointlight_count = 16;
    var pointlight;


    for(let i = 0; i < pointlight_count; i++) {
        pointlight = new THREE.Mesh(pointlight_geometry, pointlight_basic_material);
        pointlight.position.set(15/ 4 * Math.sin(i * 2 * Math.PI / pointlight_count), 2.2, 15/ 4 * Math.cos(i * 2 * Math.PI / pointlight_count));
        pointlight_ring.push(pointlight);
        ufo.add(pointlight);
    }
    materials.push([pointlight_lambert_material, pointlight_phong_material, pointlight_toon_material, pointlight_basic_material]);
    meshes.push(pointlight_ring);

    ufo.add(cockpit_sphere, body_sphere, spotlight_cilinder);


    /*
    const geometry = new THREE.SphereGeometry( 15, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometry, material ); scene.add( sphere ); */

    ufo.position.set(-10, 0,10);
    scene.add(ufo);
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
    changeMaterials();
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


/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.clear();

    //TODO: VR
    
    renderer.render(scene, cameras[active_camera]);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({antialias: true})

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();
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

    update();

    render();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);
    
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
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {

    }
}