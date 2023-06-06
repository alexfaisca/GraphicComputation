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
var house1, house2, house3, body, door, window1, window2, roof;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xeeeeff);

    createMoon();
    createHouse();
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
    cameras[0].position.set(20, 20, 20);
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
    const indices = [0, 1, 2, 2, 3, 0];
    sky = new THREE.Object3D();
    var colorArray = [];
    skyTexture =  new THREE.BufferGeometry();

    skyTexture.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([
            -40, -40, 0,
            40, -40, 0,
            40, 40, 0,
            -40, 40, 0
        ]), 3));
    skyTexture.setIndex(indices);

    var color1 = new THREE.Color().setHex(0xFAD6A5);
    var color2 = new THREE.Color().setHex(0x6F456E);
    colorArray = (color1.toArray()
        .concat(color2.toArray())
        .concat(color2.toArray())
        .concat(color1.toArray()));

    skyTexture.setAttribute('color', new Float32Array(colorArray, 3))

    var material = new THREE.MeshPhongMaterial({
        vertexColors: true,
        });

    material.setAttribute('uv', new Float32Array(colorArray, 3)); //?

    var mesh = new THREE.Mesh(skyTexture, material);

    scene.add(mesh);

}

function createMoon(){
    'use strict';
    var lambertMaterialMoon = new THREE.MeshLambertMaterial({color: 0xffffbf});
    var phongMaterialMoon = new THREE.MeshPhongMaterial({color: 0xffffbf});
    var toonMaterialMoon = new THREE.MeshToonMaterial({color: 0xffffbf});
    var basicMaterialMoon = new THREE.MeshBasicMaterial({color: 0xffffbf});
    
    var sphere = new THREE.SphereGeometry(5, 32, 16);
    moon = new THREE.Mesh(sphere, lambertMaterialMoon); 
    
    moon.position.set(-30, 30, -30);

    meshes.push(moon);
    materials.push([lambertMaterialMoon, phongMaterialMoon, toonMaterialMoon, basicMaterialMoon]);    

    scene.add(moon);
}

function createHouse(){
    'use strict';
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

    var cube = new THREE.BoxGeometry(10, 5, 5);
    body = new THREE.Mesh(cube, lambertMaterialBody);
    body.position.set(0, 0, 0);

    var cube = new THREE.BoxGeometry(2, 4, 0.5);
    door = new THREE.Mesh(cube, lambertMaterialDoor);
    door.position.set(-3, -0.5, 2.75);

    var cube = new THREE.BoxGeometry(2, 2, 0.5);
    window1 = new THREE.Mesh(cube, lambertMaterialWindow);
    window1.position.set(0, 0.5, 2.75);

    var cube = new THREE.BoxGeometry(2, 2, 0.5);
    window2 = new THREE.Mesh(cube, lambertMaterialWindow);
    window2.position.set(3, 0.5, 2.75);

    var cube = new THREE.BoxGeometry(9.99, 3.2016, 3.2016);
    roof = new THREE.Mesh(cube, lambertMaterialRoof);
    roof.position.set(0, 2.5, 0);
    roof.rotateX((Math.PI)/4);

    house1 = new THREE.Object3D();
    house1.add(body, door, window1, window2, roof);

    house2 = new THREE.Object3D();
    house2.copy(house1);
    house2.position.set(-20, 0, 0);

    house3 = new THREE.Object3D();
    house3.copy(house1);
    house3.position.set(-40, 0, 20);
    house3.rotateY((Math.PI)/4);

    //FIXME: all houses' materials should change
    
    meshes.push(body, door, window1, window2, roof);
    materials.push([lambertMaterialBody, phongMaterialBody, toonMaterialBody, basicMaterialBody]);
    materials.push([lambertMaterialDoor, phongMaterialDoor, toonMaterialDoor, basicMaterialDoor]);
    materials.push([lambertMaterialWindow, phongMaterialWindow, toonMaterialWindow, basicMaterialWindow]);
    materials.push([lambertMaterialWindow, phongMaterialWindow, toonMaterialWindow, basicMaterialWindow]);
    materials.push([lambertMaterialRoof, phongMaterialRoof, toonMaterialRoof, basicMaterialRoof]);
    
    
    scene.add(house1, house2, house3);
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