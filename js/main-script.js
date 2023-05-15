//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;
var robot;

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
function createCamera() {   
    'use strict';

    camera = new THREE.PerspectiveCamera(20,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 40;
    camera.position.y = 50;
    camera.position.z = 60;
    camera.lookAt(scene.position);
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

    renderer.render(scene, camera);

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
    createCamera();

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
        camera.aspect = window.innerWidth / window.innerHeight; // what happened
        camera.updateProjectionMatrix();
    }
    
    render();
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
    
    case 49:
        camera.position.x = 20;
        camera.position.y = 20;
        camera.position.z = 60;
        camera.lookAt(scene.position);
        break;

    case 50:
        camera.position.x = 60;
        camera.position.y = 20;
        camera.position.z = 20;
        camera.lookAt(scene.position);
        break;

    case 51:
        camera.position.x = 20;
        camera.position.y = 60;
        camera.position.z = 20;
        camera.lookAt(scene.position);
        break;

    case 52:
        robot.userData.rotating = !robot.userData.rotating;
        break;    
    
    case 53:
        camera.position.x = 40;
        camera.position.y = 50;
        camera.position.z = 60;
        camera.lookAt(scene.position);
        break;

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