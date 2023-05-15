//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer;
var robot;
var active_camera;
var cameras = new Array(5);

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    
    var abdomen;
    var abd_tire_left, abd_tire_right;
    var lighting;

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));
    scene.background = new THREE.Color(0xeeeeff);

    lighting = new THREE.DirectionalLight( 0xffffff, 1)
    lighting.position.set(5, 5, 5);
    scene.add(lighting);
    
    abdomen = createCube(5, 1.5, 1.5);
    abd_tire_left = createCylinder(0.75, 0.75, 1.5);
    abd_tire_right = createCylinder(0.75, 0.75, 1.5);

    abd_tire_left.rotateZ((Math.PI)/2);
    abd_tire_right.rotateZ((Math.PI)/2);

    abd_tire_left.position.set(-3.25, 0, 0);
    abd_tire_right.position.set(3.25, 0, 0);

    robot = new THREE.Object3D();
    robot.userData = {rotating : 0, step : 0};
    robot.add(abdomen, abd_tire_left, abd_tire_right);

    scene.add(robot);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function change_camera(number) {
    active_camera = number;
}

function createCameras() {
    active_camera = 0;
    createFrontCamera();
    createLateralCamera();
    createTopCamera();
    createIsometricOrtogonalCamera();
    createIsometricPerspectiveCamera();
}

function createFrontCamera() {
    cameras[0] = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 100);
    cameras[0].position.set(10, 0, 0);
    cameras[0].lookAt(scene.position);
}

function createLateralCamera() {
    'use strict'
    cameras[1] = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 100);
    cameras[1].position.set(0, 10, 0);
    cameras[1].lookAt(scene.position);
}

function createTopCamera() {
    'use strict'
    cameras[2] = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 100);
    cameras[2].position.set(0, 0, 10);
    cameras[2].lookAt(scene.position);
}

function createIsometricOrtogonalCamera() {
    'use strict'
    cameras[3] = new THREE.OrthographicCamera( window.innerWidth / - 32, window.innerWidth / 32, window.innerHeight / 32, window.innerHeight / - 32, 1, 100);
    cameras[3].position.set(10, 10, 10);
    cameras[3].rotation.z = 0;
    cameras[3].lookAt(scene.position);
}

function createIsometricPerspectiveCamera() {
    'use strict'
    cameras[4] = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 100);
    cameras[4].position.set(10, 10, 10);
    cameras[4].lookAt(scene.position);
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createCube(x, y, z) {
    'use strict';   

    var mycube = new THREE.BoxGeometry(x, y, z);
    
    var material = new THREE.MeshPhongMaterial({color: 0xff5555, wireframe: 1});
    
    var mesh = new THREE.Mesh(mycube, material);

    mesh.position.set(0, 0, 0);
    
    return mesh;
}

function createCylinder(x, y, z) {
    'use strict';

    var mycylinder = new THREE.CylinderGeometry(x, y, z, 10);

    mycylinder.userData = {rotating: 0, step: 0};

    var material = new THREE.MeshPhongMaterial({color: 0x444444, wireframe: 1})

    var mesh = new THREE.Mesh(mycylinder, material);

    mesh.position.set(0, 0, 0);

    return mesh;
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
    renderer.clear();
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

    render();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("front_view", onKeyDown);
    window.addEventListener("sided_view", onKeyDown);
    window.addEventListener("top_view", onKeyDown);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    let step = 0.2;

    if (robot.userData.rotating) {
        robot.rotateOnAxis(new THREE.Vector3(0, 1, 0), step);
        robot.rotateZ(0);
    }

    render();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        cameras[active_camera].aspect = window.innerWidth / window.innerHeight;
        cameras[active_camera].updateProjectionMatrix();
    }
    
    render();
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
    // Camera changes
    case 49:
        change_camera(0);
        break;
    case 50:
        change_camera(1);
        break;
    case 51:
        change_camera(2);
        break;
    case 52:
        change_camera(3);
        break;
    case 53:
        change_camera(4);
        break;

    case 54:
        robot.userData.rotating = !robot.userData.rotating;

    case 69:  //e
    case 101: //E
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh)
                node.material.wireframe = !node.material.wireframe;
        })
        break;
    }

    render();

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}