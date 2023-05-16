//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer;
var robot, trailer;
var active_camera;
var cameras = new Array(5);

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    
    var head, eyes, antlers, chest, waist, abdomen;
    var abd_tire_left, abd_tire_right;
    var lighting;

    var head_length = 1, head_height = 1, head_depth = 0.5,
        eyes_length = 0.25, eyes_height = 0.25, eyes_depth = 0.25,
        antlers_length = 0.25,  antlers_height = 0.25, antlers_depth = 0.25,
        chest_length = 6, chest_height = 2.5, chest_depth = 1.5,
        waist_length = 4, waist_height = 1.5, waist_depth = 1.5,
        abdomen_length = 4, abdomen_height = 1.5, abdomen_depth = 1.5,
        thigh_length = 0.5, thigh_height = 1.5,
        leg_width = 1.75, leg_depth = 1.5, leg_height = 7, wheel_radius = 0.75, wheel_height = 1, foot_length = 2.75,
        foot_depth = 1.25, foot_height = 1;

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));
    scene.background = new THREE.Color(0xeeeeff);

    lighting = new THREE.DirectionalLight(0xffffff, 1)
    lighting.position.set(5, 5, 5);
    scene.add(lighting);

    head = createCube(head_length, head_height, head_depth);
    head.position.set(0, 1.5*waist_height + chest_height + 0.5*head_height);

    //eyes

    let a = createCube(eyes_length, eyes_height, eyes_depth);
    a.position.set(0.25*head_length, 1.5*waist_height + chest_height + 0.75*head_height, 0.5*head_depth);

    waist = createCube(waist_length, waist_height, waist_depth);
    waist.position.set(0, waist_height, 0);

    chest = createCube(chest_length, chest_height, chest_depth);
    chest.position.set(0, 1.5*waist_height + 0.5*chest_height, 0);
    
    abdomen = createCube(abdomen_length, abdomen_height, abdomen_depth);
    abd_tire_left = createCylinder(wheel_radius, wheel_radius, wheel_height);
    abd_tire_right = createCylinder(wheel_radius, wheel_radius, wheel_height);

    abd_tire_left.rotateZ((Math.PI)/2);
    abd_tire_right.rotateZ((Math.PI)/2);

    abd_tire_left.position.set(-(abdomen_length + wheel_height) / 2, 0, 0);
    abd_tire_right.position.set((abdomen_length + wheel_height) / 2, 0, 0);

    /* LEGS */

    var left_thigh, right_thigh, left_leg, right_leg, leg_wheel_l1, leg_wheel_l2, leg_wheel_r1, leg_wheel_r2, leg_fitting_l, leg_fitting_r, left_foot, right_foot;

    left_thigh = createCube(thigh_length, thigh_height, thigh_length)
    left_thigh.position.set(-abdomen_length / 4, -(abdomen_height + thigh_height) / 2, 0)
    right_thigh = createCube(thigh_length, thigh_height, thigh_length)
    right_thigh.position.set(abdomen_length / 4, -(abdomen_height + thigh_height) / 2, 0)
    left_leg = createCube(leg_width, leg_height, leg_depth)
    left_leg.position.set(-abdomen_length / 4, -(abdomen_height / 2 + thigh_height + leg_height / 2), 0)
    right_leg = createCube(leg_width, leg_height, leg_depth)
    right_leg.position.set(abdomen_length / 4, -(abdomen_height / 2 + thigh_height + leg_height / 2), 0)
    leg_wheel_l1 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    leg_wheel_l1.position.set(-(abdomen_length / 4 + leg_width / 2 + wheel_height / 2), -(abdomen_height / 2 + thigh_height + leg_height - 11 / 3 * wheel_radius),0)
    leg_wheel_l1.rotateZ((Math.PI)/2);
    leg_wheel_l2 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    leg_wheel_l2.position.set(-(abdomen_length / 4 + leg_width / 2 + wheel_height / 2), -(abdomen_height / 2 + thigh_height + leg_height - wheel_radius),0)
    leg_wheel_l2.rotateZ((Math.PI)/2);
    leg_wheel_r1 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    leg_wheel_r1.position.set((abdomen_length / 4 + leg_width / 2 + wheel_height / 2), -(abdomen_height / 2 + thigh_height + leg_height - 11 / 3 * wheel_radius),0)
    leg_wheel_r1.rotateZ((Math.PI)/2);
    leg_wheel_r2 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    leg_wheel_r2.position.set((abdomen_length / 4 + leg_width / 2 + wheel_height / 2), -(abdomen_height / 2 + thigh_height + leg_height - wheel_radius),0)
    leg_wheel_r2.rotateZ((Math.PI)/2);
    left_foot = createCube(foot_length, foot_height, foot_depth)
    left_foot.position.set(-(abdomen_length / 4 - leg_width / 2 + foot_length / 2), -(abdomen_height / 2 + thigh_height + leg_height - foot_height / 2), leg_depth / 2 + foot_depth / 2)
    right_foot = createCube(foot_length, foot_height, foot_depth)
    right_foot.position.set((abdomen_length / 4 - leg_width / 2 + foot_length / 2), -(abdomen_height / 2 + thigh_height + leg_height - foot_height / 2), leg_depth / 2 + foot_depth / 2)
    /* --------------------------------------------------------------- */

    /* ARMS */
    var forearm_l, forearm_r, arm_l, arm_r, exhaust_l, exhaust_r;
    var forearm_width = 1, forearm_depth = 2 * abdomen_depth, forearm_height = 1.5, arm_width = 1, arm_depth = abdomen_depth, arm_height = 2.5, exhaust_radius = 0.5, exhaust_height = 4.75;

    forearm_l = createCube(forearm_width, forearm_height, forearm_depth);
    forearm_l.position.set(-(abdomen_length / 2 + wheel_height + forearm_width / 2), (abdomen_height / 2 + forearm_height / 2), -(abdomen_depth / 2))
    forearm_r = createCube(forearm_width, forearm_height, forearm_depth);
    forearm_r.position.set((abdomen_length / 2 + wheel_height + forearm_width / 2), (abdomen_height / 2 + forearm_height / 2), -(abdomen_depth / 2))
    arm_l = createCube(arm_width, arm_height, arm_depth);
    arm_l.position.set(-(abdomen_length / 2 + wheel_height + arm_width / 2), (abdomen_height / 2 + forearm_height + arm_height / 2), -(abdomen_depth + arm_depth) / 2)
    arm_r = createCube(arm_width, arm_height, arm_depth);
    arm_r.position.set((abdomen_length / 2 + wheel_height + arm_width / 2), (abdomen_height / 2 + forearm_height + arm_height / 2), -(abdomen_depth + arm_depth) / 2)
    exhaust_l = createCylinder(exhaust_radius, exhaust_radius, exhaust_height);
    exhaust_l.position.set(-(abdomen_length / 2 + wheel_height + arm_width + exhaust_radius), (abdomen_height / 2 + forearm_height + exhaust_height / 2), -(abdomen_depth / 2 + arm_depth - exhaust_radius))
    exhaust_r = createCylinder(exhaust_radius, exhaust_radius, exhaust_height);
    exhaust_r.position.set((abdomen_length / 2 + wheel_height + arm_width + exhaust_radius), (abdomen_height / 2 + forearm_height + exhaust_height / 2), -(abdomen_depth / 2 + arm_depth - exhaust_radius))
    /* --------------------------------------------------------------- */

    robot = new THREE.Object3D();
    robot.userData = {rotating : 0, step : 0};
    robot.add(head, chest, abdomen ,waist, abd_tire_left, abd_tire_right, left_thigh, right_thigh, left_leg, right_leg, leg_wheel_l1, leg_wheel_l2, leg_wheel_r1, leg_wheel_r2, left_foot, right_foot, forearm_l, forearm_r, arm_l, arm_r, exhaust_l, exhaust_r);

    scene.add(robot);

    createTrailer();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function change_camera(number) {
    'use strict'
    active_camera = number;
}

function createCameras() {
    'use strict'
    active_camera = 0;
    createFrontCamera();
    createLateralCamera();
    createTopCamera();
    createIsometricOrtogonalCamera();
    createIsometricPerspectiveCamera();
}

function createFrontCamera() {
    'use strict'
    cameras[0] = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 100);
    cameras[0].position.set(0, 0, 15);
    cameras[0].lookAt(scene.position);
}

function createLateralCamera() {
    'use strict'
    cameras[1] = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 100);
    cameras[1].position.set(15, 0, 0);
    cameras[1].lookAt(scene.position);
}

function createTopCamera() {
    'use strict'
    cameras[2] = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 100);
    cameras[2].position.set(0, 15, 0);
    cameras[2].lookAt(scene.position);
}

function createIsometricOrtogonalCamera() {
    'use strict'
    cameras[3] = new THREE.OrthographicCamera( window.innerWidth / - 32, window.innerWidth / 32, window.innerHeight / 32, window.innerHeight / - 32, 1, 100);
    cameras[3].position.set(15, 15, 15);
    cameras[3].rotation.z = 0;
    cameras[3].lookAt(scene.position);
}

function createIsometricPerspectiveCamera() {
    'use strict'
    cameras[4] = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 100);
    cameras[4].position.set(12, 12, 12);
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

function createCylinder(x, y, z){
    'use strict';

    var mycylinder = new THREE.CylinderGeometry(x, y, z, 10);

    mycylinder.userData = {rotating: 0, step: 0};

    var material = new THREE.MeshPhongMaterial({color: 0x444444, wireframe: 1})

    var mesh = new THREE.Mesh(mycylinder, material);

    mesh.position.set(0, 0, 0);

    return mesh;
}

function createTrailer(){
    var container, support, connection_piece, trailer_wheel_l1, trailer_wheel_l2, trailer_wheel_r1, trailer_wheel_r2;
    var trailer_origin_distance = 15, abdomen_height = 1.5, front_wheel_distance = 5.75, back_wheel_distance = 7.75, support_distance = 6.75;
    var container_length = 4, container_height = 8, container_depth = 17;
    var support_length = 2, support_height = 1, support_depth = 3.5;
    var wheel_radius = 0.75, wheel_height = 1, abdomen_length = 4;

    container = createCube(container_length, container_height, container_depth);
    container.position.set(0, (container_height + abdomen_height) / 2, -trailer_origin_distance);

    support = createCube(support_length, support_height, support_depth);
    support.position.set(0, 0, - trailer_origin_distance - support_distance);

    trailer_wheel_l1 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    trailer_wheel_l1.rotateZ((Math.PI)/2);
    trailer_wheel_l1.position.set((-(abdomen_length + wheel_height) / 2) + (wheel_height), 0, -trailer_origin_distance - front_wheel_distance)

    trailer_wheel_l2 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    trailer_wheel_l2.rotateZ((Math.PI)/2);
    trailer_wheel_l2.position.set((-(abdomen_length + wheel_height) / 2) + (wheel_height), 0, -trailer_origin_distance - back_wheel_distance)

    trailer_wheel_r1 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    trailer_wheel_r1.rotateZ((Math.PI)/2);
    trailer_wheel_r1.position.set(((abdomen_length + wheel_height) / 2) - (wheel_height), 0, -trailer_origin_distance - front_wheel_distance)

    trailer_wheel_r2 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    trailer_wheel_r2.rotateZ((Math.PI)/2);
    trailer_wheel_r2.position.set(((abdomen_length + wheel_height) / 2) - (wheel_height),0, -trailer_origin_distance - back_wheel_distance)

    // TODO: How will both connection pieces connect?

    trailer = new THREE.Object3D();
    trailer.userData = {rotating : 0, step : 0};
    trailer.add(container, support, connection_piece, trailer_wheel_l1, trailer_wheel_l2, trailer_wheel_r1, trailer_wheel_r2);

    scene.add(trailer);
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

    let step = 0.01;

    if (robot.userData.rotating) {
        robot.rotateOnAxis(new THREE.Vector3(0, 1, 0), step);
        robot.rotateZ(0);
    }

    if (trailer.userData.rotating) {
        trailer.rotateOnAxis(new THREE.Vector3(0, 1, 0), step);
        trailer.rotateZ(0);
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

    if (cameras[active_camera] instanceof THREE.OrthographicCamera) {
        // Does orthograpic need window resize?
        //cameras[active_camera].updateProjectionMatrix();
    }
    else
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
    case 49: // 1
        change_camera(0);
        break;
    case 50: // 2
        change_camera(1);
        break;
    case 51: // 3
        change_camera(2);
        break;
    case 52: // 4
        change_camera(3);
        break;
    case 53: // 5
        change_camera(4);
        break;

    case 54: // 6
        robot.userData.rotating = !robot.userData.rotating;
        trailer.userData.rotating = !trailer.userData.rotating;
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