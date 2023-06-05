//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var active_camera;
var cameras = new Array(5);
var key_press_map = {};
var dirLight;
var VRCamera;

var materials = [];
var meshes = [];

var moon;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xeeeeff);

    createMoon();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////


function change_camera() {
    'use strict'

    if(key_press_map[49]) {
        active_camera = (active_camera + 1) % 2;
        key_press_map[49] = false;
    }
}

function createCameras() {
    'use strict'
    active_camera = 0;
    createIsometricOrtogonalCamera();
    createVRCamera();
}

function createIsometricOrtogonalCamera() {
    'use strict'
    cameras[0] = new THREE.OrthographicCamera( -window.innerWidth / 32,
                                         window.innerWidth / 32,
                                          window.innerHeight / 32,
                                           -window.innerHeight / 32,
                                            1,
                                             100);
    cameras[0].position.set(0, 20, 20);
    cameras[0].rotation.z = 0;
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

function change_directional_light(){
    'use strict'

    if(key_press_map[68]) {
        directionalLight.visible = !directionalLight.visible;
        key_press_map[68] = false;
    }
}

function createDirectionalLight() {
	dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
	dirLight.position.set(30, 30, 60);
	dirLight.target.position.set(0, 0, 0); //Width and height?
    directionalLight.castShadow = true;

    /*directionalLight.shadow.mapSize.width = 10;
    directionalLight.shadow.mapSize.height = 10;
    directionalLight.shadow.camera.near = 10;
    directionalLight.shadow.camera.far = 10;*/

	dirLight.target.updateMatrixWorld();
	scene.add(dirLight);
}



function createLights(){
    createDirectionalLight();
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createMoon(){
    'use strict';
    var lambertMaterial = new THREE.MeshLambertMaterial({color: 0xffffbf,});
    var phongMaterial = new THREE.MeshPhongMaterial({color: 0xffffbf,});
    var toonMaterial = new THREE.MeshToonMaterial({color: 0xffffbf,});
    
    var sphere = new THREE.SphereGeometry(5, 32, 16);
    moon = new THREE.Mesh(sphere, lambertMaterial); 
    
    moon.position.set(-30, 30, -30);

    meshes.push(moon);
    materials.push([lambertMaterial, phongMaterial, toonMaterial]);    
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

    change_camera();
    change_directional_light();
    change_materials();

}

function change_materials(){
    'use strict'
    for (var i = 0; i < meshes.length; i++) {
        if(key_press_map[81]){ // Cartoon
            meshes[i].material = materials[i][0];	
            key_press_map[81] = 2;	
        }
        if(key_press_map[87]){ // Phong
            meshes[i].material = materials[i][0];		
            key_press_map[87] = 1;
        }
        if(key_press_map[69]){ // Gouraud
            meshes[i].material = materials[i][0];	
            key_press_map[69] = 0;
        }
    }
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

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

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
    // Toggle directional cameras
    case 68: // D
    case 100: // d
        key_press_map[68] = 1;
        break;
    }
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
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {

    }
}