//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer;
var robot, trailer, wireframe = false, left_arm, right_arm, feet, feet_axis;
var active_camera;
var cameras = new Array(5);
var key_press_map = {};
var m1 = new THREE.Matrix4(), m2 = new THREE.Matrix4(), m3 = new THREE.Matrix4()

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    var lighting;
    var mirror = new THREE.Vector3(-1, 1 ,1); // Mirror on y axis

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));
    scene.background = new THREE.Color(0xeeeeff);

    lighting = new THREE.DirectionalLight(0xffffff, 1)
    lighting.position.set(5, 5, 5);
    scene.add(lighting);

    var wheel_radius = 0.75, wheel_height = 1;

    /* --------------------------------------------------------------- */

    /* BODY */
    var body = new THREE.Object3D();
    var chest, waist, abdomen, abdomen_tire_left, abdomen_tire_right;
    var chest_length = 6 * wheel_height, chest_height = 10 / 3 * wheel_radius, chest_depth = 2 * wheel_radius, waist_length = 4 * wheel_height, waist_height = 2 * wheel_radius, waist_depth = 2 * wheel_radius, abdomen_length = 4 * wheel_height, abdomen_height = 2 * wheel_radius, abdomen_depth = 2 * wheel_radius;

    waist = createCube(waist_length, waist_height, waist_depth);
    waist.position.set(0, waist_height, 0);

    chest = createCube(chest_length, chest_height, chest_depth);
    chest.position.set(0, 1.5*waist_height + 0.5*chest_height, 0);
    
    abdomen = createCube(abdomen_length, abdomen_height, abdomen_depth);

    abdomen_tire_left = new THREE.Object3D().add(createCylinder(wheel_radius, wheel_radius, wheel_height));
    abdomen_tire_left.rotateZ((Math.PI)/2);
    abdomen_tire_left.position.set(-(abdomen_length + wheel_height) / 2, 0, 0);

    abdomen_tire_right = new THREE.Object3D();
    abdomen_tire_right.copy(abdomen_tire_left);
    abdomen_tire_right.position.setX(-abdomen_tire_left.position.x);


    body.add(waist, chest, abdomen, abdomen_tire_left, abdomen_tire_right);
    /* --------------------------------------------------------------- */

    /* LEGS */
    var legs = new THREE.Object3D();
    var left_leg = new THREE.Object3D(), right_leg = new THREE.Object3D();
    var thigh, upper_leg, leg_wheel_1, leg_wheel_2, leg_fitting, left_foot, right_foot;
    var thigh_length = wheel_height / 2, thigh_height = 2 * wheel_radius, leg_width = 7 / 4 * wheel_height, leg_depth = 2 * wheel_radius, leg_height = 8 * wheel_radius + wheel_height, foot_length = 11 / 4 * wheel_height, foot_depth = 5 / 3 * wheel_radius, foot_height = wheel_height;

    thigh = createCube(thigh_length, thigh_height, thigh_length)
    thigh.position.set(-abdomen_length / 4, -(-abdomen_height + thigh_height) / 2, 0)
    upper_leg = createCube(leg_width, leg_height, leg_depth)
    upper_leg.position.set(-abdomen_length / 4, -(-abdomen_height / 2 + thigh_height + leg_height / 2), 0)

    leg_wheel_1 = new THREE.Object3D().add(createCylinder(wheel_radius, wheel_radius, wheel_height))
    leg_wheel_1.position.set(-(abdomen_length / 4 + leg_width / 2 + wheel_height / 2), -(-abdomen_height / 2 + thigh_height + leg_height - 11 / 3 * wheel_radius),0)
    leg_wheel_1.rotateZ((Math.PI)/2);
    leg_wheel_2 = new THREE.Object3D().add(createCylinder(wheel_radius, wheel_radius, wheel_height))
    leg_wheel_2.position.set(-(abdomen_length / 4 + leg_width / 2 + wheel_height / 2), -(-abdomen_height / 2 + thigh_height + leg_height - wheel_radius),0)
    leg_wheel_2.rotateZ((Math.PI)/2);

    left_leg.add(thigh, upper_leg, leg_wheel_1, leg_wheel_2);
    right_leg.copy(left_leg);
    right_leg.scale.multiply(mirror);
    right_leg.position.setX(-left_leg.position.x);

    left_foot = new THREE.Object3D();
    left_foot.add(createCube(foot_length, foot_height, foot_depth));
    left_foot.position.set(-(abdomen_length / 4 - leg_width / 2 + foot_length / 2), foot_height / 2, foot_depth / 2);
    right_foot = new THREE.Object3D().copy(left_foot);
    right_foot.scale.multiply(mirror);
    right_foot.position.setX(-left_foot.position.x);

    const points = [];
    points.push( new THREE.Vector3( -1, 0, 0) );
    points.push( new THREE.Vector3( 1, 0, 0,) );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    feet_axis = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 'blue'}));
    feet_axis.position.set(0, -(-abdomen_height / 2 + thigh_height + leg_height), leg_depth / 2);
    scene.add( feet_axis );

    m1.makeTranslation(0, -(-abdomen_height / 2 + thigh_height + leg_height - foot_height / 2), leg_depth / 2 + foot_depth / 2)
    feet = new THREE.Object3D()
    feet.add(left_foot, right_foot);
    feet.userData = {rotating: 0, rotationAngle: 0, axis: new THREE.Vector3(0, -(abdomen_height / 2 + thigh_height + leg_height + foot_height / 2), leg_depth / 2)};
    feet.name = "feet";

    feet_axis.add(feet)

    legs.add(left_leg, right_leg, feet_axis);
    legs.name = "legs";

    /* --------------------------------------------------------------- */

    /* ARMS */
    left_arm = new THREE.Object3D(), right_arm = new THREE.Object3D();
    var forearm, arm, exhaust;
    var forearm_width = wheel_height, forearm_depth = 4 * wheel_radius, forearm_height = 2 * wheel_radius, arm_width = wheel_height, arm_depth = 2 * wheel_radius, arm_height = 10 / 3 * wheel_radius, exhaust_radius = 2 / 3 * wheel_radius, exhaust_height = 6 * wheel_radius;

    forearm = createCube(forearm_width, forearm_height, forearm_depth);
    forearm.position.set(0, forearm_height / 2, 0)
    arm = createCube(arm_width, arm_height, arm_depth);
    arm.position.set(0, (forearm_height + arm_height / 2), - arm_depth / 2)
    exhaust = createCylinder(exhaust_radius, exhaust_radius, exhaust_height);
    exhaust.position.set(-arm_width / 2 -exhaust_radius, forearm_height + exhaust_height / 2, -(arm_depth - exhaust_radius))

    left_arm.add(forearm, arm, exhaust);
    left_arm.position.set(-(abdomen_length / 2 + wheel_height + arm_width / 2), abdomen_height / 2, -(abdomen_depth) / 2)
    right_arm.copy(left_arm, true);
    right_arm.scale.multiply(mirror);
    right_arm.position.setX(-left_arm.position.x);

    left_arm.name = "left_arm";
    right_arm.name = "right_arm";
    left_arm.userData = {velocity : new THREE.Vector3(0, 0, 0)};
    right_arm.userData = {velocity : new THREE.Vector3(0, 0, 0)};

    /* --------------------------------------------------------------- */

    /* HEAD */
    var head = new THREE.Object3D();
    var skull, eye_l, eye_r, antler_l, antler_r;
    var head_length = wheel_height, head_height = wheel_height, head_depth = head_height / 2, eyes_length = head_length / 4, eyes_height = head_length / 4, eyes_depth = head_length / 4, antlers_length = eyes_length,  antlers_height = eyes_height, antlers_depth = eyes_depth;

    skull = createCube(head_length, head_height, head_depth);
    skull.position.set(0, 1.5*waist_height + chest_height + 0.5*head_height);
    eye_l = createCube(eyes_length, eyes_height, eyes_depth);
    eye_l.position.set(-0.25*head_length, 1.5*waist_height + chest_height + 0.75*head_height, 0.5*head_depth);
    eye_r = createCube(eyes_length, eyes_height, eyes_depth);
    eye_r.position.set(0.25*head_length, 1.5*waist_height + chest_height + 0.75*head_height, 0.5*head_depth);
    antler_l = createCube(antlers_depth, antlers_height, antlers_depth);
    antler_l.position.set(-0.25*head_length, 1.5*waist_height + chest_height + head_height + antlers_height / 2, 0);
    antler_r = createCube(antlers_depth, antlers_height, antlers_depth);
    antler_r.position.set(0.25*head_length, 1.5*waist_height + chest_height + head_height + antlers_height / 2, 0);

    eye_l.material.color.set("white")
    eye_r.material.color.set("white")
    antler_l.material.color.set("white")
    antler_r.material.color.set("white")

    head.add(skull, eye_l, eye_r, antler_l, antler_r);
    /* --------------------------------------------------------------- */


    robot = new THREE.Object3D();
    robot.userData = {rotating : 0, step : 0, rotate_head : 0};
    robot.add(head, body, legs, left_arm, right_arm);

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
    trailer.userData = {rotating : 0, step : 0, velocity : new THREE.Vector3(0,0,0)};
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
    window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    rotateRobot();
    rotateTrailer();
    updateTrailerPosition();
    updateHeadPosition();
    updateArmPosition();
    updateFeetPosition();

    render();

    requestAnimationFrame(animate);
}

function rotateRobot(){
    let step = 0.01;
    if (robot.userData.rotating) {
        robot.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), step);
    }
}

function rotateTrailer(){
    let step = 0.01;
    if (trailer.userData.rotating) {
        trailer.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), step);
    }
}

function updateTrailerPosition() {
    trailer.position = trailer.position.add(trailer.userData.velocity);
}

function updateHeadPosition() {
    // rotate on world axis?
}

function updateArmPosition() {
    let step = 0.03
    left_arm.position.add(left_arm.userData.velocity.multiplyScalar(step));
    right_arm.position.add(right_arm.userData.velocity.multiplyScalar(step));
}

function updateFeetPosition() {
    let step = 0.01, coords;
    console.log(feet.position)
    if(feet.userData.rotating != 0) {
        coords = feet.position
        console.log('update' + feet.userData.rotating);
        console.log(feet.userData.axis);
        feet_axis.position.addScaledVector(feet.userData.axis, -1)
        feet_axis.rotateOnAxis(new THREE.Vector3(1,0,0), feet.userData.rotating * step);
        feet.userData.rotationAngle += feet.userData.rotating * step;
        feet_axis.position.addScaledVector(feet.userData.axis, 1)
    }
}

function move_trailer(x, z){

    trailer.userData.velocity.setComponent(0, x);
    trailer.userData.velocity.setComponent(2, z);

    // Velocity vector length remains unchanged
    if(trailer.userData.velocity.getComponent(0) !== 0 && trailer.userData.velocity.getComponent(2) !== 0){
        trailer.userData.velocity.setComponent(0, trailer.userData.velocity.getComponent(0) * 0.707);
        trailer.userData.velocity.setComponent(2, trailer.userData.velocity.getComponent(2) * 0.707);
    }
}

function move_head(x){
    robot.userData.rotate_head = x;
}

function compute_trailer_movement() {
    if(key_press_map[37] && key_press_map[39] && key_press_map[38] && key_press_map[40]){ // Left + Right + Up + Down
        move_trailer(0, 0);
        render();
        return;
    }
    if(key_press_map[37] && key_press_map[39] && key_press_map[38]){ // Left + Right + Up
        move_trailer(0, -0.05);
        render();
        return;
    }
    if(key_press_map[37] && key_press_map[39] && key_press_map[40]){ // Left + Right + Down
        move_trailer(0, 0.05);
        render();
        return;
    }
    if(key_press_map[38] && key_press_map[40] && key_press_map[37]){ // Up + Down + Left
        move_trailer(-0.05, 0);
        render();
        return;
    }
    if(key_press_map[38] && key_press_map[40] && key_press_map[39]){ // Up + Down + Right
        move_trailer(0.05, 0);
        render();
        return;
    }
    if(key_press_map[38] && key_press_map[40]){ // Up + Down
        move_trailer(0.0, 0);
        render();
        return;
    }
    if(key_press_map[37] && key_press_map[39]){ // Left + Right
        move_trailer(0.0, 0);
        render();
        return;
    }
    if(key_press_map[38] && key_press_map[39]){ // Up + Right
        move_trailer(0.05, -0.05);
        render();
        return;
    }
    if(key_press_map[38] && key_press_map[37]){ // Up + Left
        move_trailer(-0.05, -0.05);
        render();
        return;
    }
    if(key_press_map[40] && key_press_map[39]){ // Down + Right
        move_trailer(0.05, 0.05);
        render();
        return;
    }
    if(key_press_map[40] && key_press_map[37]){ // Down + Left
        move_trailer(-0.05, 0.05);
        render();
        return;
    }
    if(key_press_map[37]){
        move_trailer(-0.05, 0);
        render();
        return;
    }
    if(key_press_map[38]){
        move_trailer(0, -0.05);
        render();
        return;
    }
    if(key_press_map[39]){
        move_trailer(0.05, 0);
        render();
        return;
    }
    if(key_press_map[40]){
        move_trailer(0, 0.05);
        render();
        return;
    }
    move_trailer(0,0);
    render();
}

function compute_arm_velocity() {
    if(key_press_map[68] && key_press_map[69]) {
        left_arm.userData.velocity.set(0, 0, 0);
        right_arm.userData.velocity.set(0, 0, 0);
        return;
    }
    if(key_press_map[68]) if(left_arm.position.x < -2.5) {
        left_arm.userData.velocity.set(1, 0, 0);
        right_arm.userData.velocity.set(-1, 0, 0);
        return;
    }
    if(key_press_map[69]) if(left_arm.position.x > -3.5) {
        left_arm.userData.velocity.set(-1, 0, 0);
        right_arm.userData.velocity.set(1, 0, 0);
        return;
    }
    left_arm.userData.velocity.set(0, 0, 0);
    right_arm.userData.velocity.set(0, 0, 0);
}

function compute_feet_rotation() {
    if(key_press_map[65] && key_press_map[81]) {
        feet.userData.rotating = 0;
        return;
    }
    if(key_press_map[81]) if(feet.userData.rotationAngle > 0) {
        console.log('CLOSE')
        feet.userData.rotating = -1;
        console.log(feet.userData.rotating)
        return;
    }
    if(key_press_map[65]) if(feet.userData.rotationAngle < Math.PI) {
        console.log('OPEN')
        feet.userData.rotating = 1;
        console.log(feet.userData.rotating)
        return;
    }
    feet.userData.rotating = 0;
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Ortho camera, does it need resizing?

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

    key_press_map[e.keyCode] = e.type == 'keydown'
    compute_trailer_movement();

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
    case 54: //6
        wireframe = !wireframe
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) node.material.wireframe = wireframe;
        })
        break;
    case 55: // 7
        robot.userData.rotating = !robot.userData.rotating;
        trailer.userData.rotating = !trailer.userData.rotating;
        break;
    // Trailer Movement
    case 37: // Left
        key_press_map[37] = 1;
        compute_trailer_movement();
        break;
    case 38: // Up
        key_press_map[38] = 1;
        compute_trailer_movement();
        break;
    case 39: // Right
        key_press_map[39] = 1;
        compute_trailer_movement();
        break;
    case 40: // Down
        key_press_map[40] = 1;
        compute_trailer_movement();
        break;
    // Move head
    case 82: // r
        move_head(1);
        break;

    case 70: // f
        move_head(-1);
        break;
    // Arm movement
    case 69: //E
    case 101: //e
        key_press_map[69] = 1;
        compute_arm_velocity();
        break;
    case 68: //D
    case 100: //d
        key_press_map[68] = 1;
        compute_arm_velocity();
        break;
    // Feet movement
    case 65: //A
    case 97: //a
        key_press_map[65] = 1;
        compute_feet_rotation();
        break;
    case 81: //Q
    case 113: //q
        key_press_map[81] = 1;
        compute_feet_rotation();
        break;
    }

    render();

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {

    case 37: // Left
        key_press_map[37] = 0;
        compute_trailer_movement();
        break;
    case 38: // Up
        key_press_map[38] = 0;
        compute_trailer_movement();
        break;
    case 39: // Right
        key_press_map[39] = 0;
        compute_trailer_movement();
        break;
    case 40: // Down
        key_press_map[40] = 0;
        compute_trailer_movement();
        break;

    case 82: // r
        move_head(0);
        break;
    case 70: // f
        move_head(0);
        break;
    case 69: //E
    case 101: //e
        key_press_map[69] = 0;
        compute_arm_velocity();
        break;
    case 68: //D
    case 100: //d
        key_press_map[68] = 0;
        compute_arm_velocity();
        break;
    // Feet movement
    case 65: //A
    case 97: //a
        key_press_map[65] = 0;
        compute_feet_rotation();
        break;
    case 81: //Q
    case 113: //q
        key_press_map[81] = 0;
        compute_feet_rotation();
        break;
    }

}