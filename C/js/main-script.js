//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var active_camera;
var cameras = new Array(5);
var key_press_map = {};
var dirLight;

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

function createCameras() {
    'use strict'
    active_camera = 0;
    createIsometricOrtogonalCamera();
}

function createIsometricOrtogonalCamera() {
    'use strict'
    cameras[0] = new THREE.OrthographicCamera( -window.innerWidth / 32, window.innerWidth / 32, window.innerHeight / 32, -window.innerHeight / 32, 1, 100);
    cameras[0].position.set(15, 15, 15);
    cameras[0].rotation.z = 0;
    cameras[0].lookAt(scene.position);
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createDirectionalLight() {
	dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
	dirLight.position.set(30, 30, 60);
	dirLight.target.position.set(0, 0, 0); //Width and height?
	dirLight.target.updateMatrixWorld();
	scene.add(dirLight);
}



function createLights(){
    createDirectionalLight();
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

// Cube primitive mesh
function createSphere(radius, widthSegments, heightSegments) {
    'use strict';   

    const mySphere = new THREE.SphereGeometry(radius, widthSegments, heightSegments); 
    const material = new THREE.MeshBasicMaterial({color: 0xffff00}); 
    const mesh = new THREE.Mesh( geometry, material ); 
    
    mesh.position.set(0, 0, 0);
    
    return mesh;
}

function createMoon(){
    'use strict';
    moon = createSphere(5, 32, 16);

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

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

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
    // Camera changes
    case 49: // 1
        key_press_map[49] = !key_press_map[49];
        break;
    case 68: // D
    case 100: // d
        key_press_map[68] = 1;
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