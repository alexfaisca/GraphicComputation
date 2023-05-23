//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer;
var robot, trailer, wireframe = false, legs, left_arm, right_arm, head_axis, feet_axis;
var active_camera;
var cameras = new Array(5);

var aspect_ratio = 16/9; var container;

var key_press_map = {};
var hitbox_init_set_map = { "head" : false,
                            "arms" : false,
                            "legs" : false,
                            "feet" : false };
var animation_mode = false;

// The point where the trailer drag animation stops
var meeting_point = new THREE.Vector3(0, 0, 0);

// Trailer constant velocity but arbitrary direction
var trailer_drag = new THREE.Vector3(0, 0, 0);

// Auxiliary vectors
let v = new THREE.Vector3(0, 0, 0);
let t = new THREE.Vector3(0, 0, 0);

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    var lighting;

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));
    scene.background = new THREE.Color(0xeeeeff);

    lighting = new THREE.DirectionalLight(0xffffff, 1)
    lighting.position.set(5, 5, 5);
    scene.add(lighting);

    createRobot();
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
    cameras[3] = new THREE.OrthographicCamera( -window.innerWidth / 32, window.innerWidth / 32, window.innerHeight / 32, -window.innerHeight / 32, 1, 100);
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

// The scene does not have lights.

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

// Cube primitive mesh
function createCube(x, y, z) {
    'use strict';   

    var mycube = new THREE.BoxGeometry(x, y, z);
    
    var material = new THREE.MeshPhongMaterial({color: 0xff5555, wireframe: 1});
    
    var mesh = new THREE.Mesh(mycube, material);

    mesh.position.set(0, 0, 0);
    
    return mesh;
}

// Cylinder primitive mesh
function createCylinder(x, y, z) {
    'use strict';

    var mycylinder = new THREE.CylinderGeometry(x, y, z, 10);

    mycylinder.userData = {rotating: 0};

    var material = new THREE.MeshPhongMaterial({color: 0x444444, wireframe: 1})

    var mesh = new THREE.Mesh(mycylinder, material);

    mesh.position.set(0, 0, 0);

    return mesh;
}

function createRobot() {

    var wheel_radius = 0.75, wheel_height = 1;
    var mirror = new THREE.Vector3(-1, 1 ,1); // Mirror on y axis

    // Create BODY
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // Create LEGS and FEET
    // ---------------------------------------------------------
    legs = new THREE.Object3D();
    var left_leg = new THREE.Object3D(), right_leg = new THREE.Object3D();
    var thigh, upper_leg, leg_wheel_1, leg_wheel_2, leg_fitting, left_foot, right_foot;
    var thigh_length = wheel_height / 2, thigh_height = 2 * wheel_radius, leg_width = 7 / 4 * wheel_height, leg_depth = 2 * wheel_radius, leg_height = 8 * wheel_radius + wheel_height, foot_length = 11 / 4 * wheel_height, foot_depth = 5 / 3 * wheel_radius, foot_height = wheel_height;
    var leg_fitting_radius = 0.25*wheel_height, leg_fitting_height = 0.25*wheel_height;

    thigh = createCube(thigh_length, thigh_height, thigh_length)
    thigh.position.set(-abdomen_length / 4, -(abdomen_height + thigh_height) / 2, 0)
    upper_leg = createCube(leg_width, leg_height, leg_depth)
    upper_leg.position.set(-abdomen_length / 4, -(abdomen_height / 2 + thigh_height + leg_height / 2), 0)

    leg_wheel_1 = new THREE.Object3D().add(createCylinder(wheel_radius, wheel_radius, wheel_height))
    leg_wheel_1.position.set(-(abdomen_length / 4 + leg_width / 2 + wheel_height / 2), -(abdomen_height / 2 + thigh_height + leg_height - 11 / 3 * wheel_radius),0)
    leg_wheel_1.rotateZ((Math.PI)/2);
    leg_wheel_2 = new THREE.Object3D().add(createCylinder(wheel_radius, wheel_radius, wheel_height))
    leg_wheel_2.position.set(-(abdomen_length / 4 + leg_width / 2 + wheel_height / 2), -(abdomen_height / 2 + thigh_height + leg_height - wheel_radius),0)
    leg_wheel_2.rotateZ((Math.PI)/2);

    leg_fitting = createCylinder(leg_fitting_radius, leg_fitting_radius, leg_fitting_height);
    leg_fitting.rotateX((Math.PI)/2);
    leg_fitting.position.set(abdomen_length / 4, -abdomen_height / 2 - thigh_height - 0.32*leg_height, -leg_width / 2);
    leg_fitting.material.color.set(0xffff88);

    left_leg.add(thigh, upper_leg, leg_wheel_1, leg_wheel_2, leg_fitting);
    right_leg.copy(left_leg);
    right_leg.scale.multiply(mirror);
    right_leg.position.setX(-left_leg.position.x);

    left_foot = new THREE.Object3D();
    left_foot.add(createCube(foot_length, foot_height, foot_depth));
    left_foot.position.set(-(abdomen_length / 4 - leg_width / 2 + foot_length / 2), foot_height / 2, foot_depth / 2);
    right_foot = new THREE.Object3D().copy(left_foot);
    right_foot.scale.multiply(mirror);
    right_foot.position.setX(-left_foot.position.x);

    const feet_axis_points = [];
    feet_axis_points.push( new THREE.Vector3( -1, 0, 0) );
    feet_axis_points.push( new THREE.Vector3( 1, 0, 0,) );
    const feet_axis_geometry = new THREE.BufferGeometry().setFromPoints(feet_axis_points);

    feet_axis = new THREE.Line(feet_axis_geometry, new THREE.LineBasicMaterial({transparent: 1, opacity: 0}));
    feet_axis.position.set(0, -(abdomen_height / 2 + thigh_height + leg_height), leg_depth / 2);
    scene.add( feet_axis );

    feet_axis.add(left_foot, right_foot)
    feet_axis.userData = {rotating: 0, rotationAngle: 0};
    feet_axis.name = "feet";


    legs.add(left_leg, right_leg, feet_axis);
    legs.userData = {rotating: 0, rotationAngle: 0};
    legs.name = "legs";

    // ---------------------------------------------------------
    // Create ARMS
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // Create HEAD
    // ---------------------------------------------------------
    var skull, eye_l, eye_r, antler_l, antler_r;
    var head_length = wheel_height, head_height = wheel_height, head_depth = head_height / 2, eyes_length = head_length / 4, eyes_height = head_length / 4, eyes_depth = head_length / 4, antlers_length = eyes_length,  antlers_height = eyes_height, antlers_depth = eyes_depth;

    skull = createCube(head_length, head_height, head_depth);
    skull.position.set(0,  head_height / 2, - head_depth / 2);
    eye_l = createCube(eyes_length, eyes_height, eyes_depth);
    eye_l.position.set(-0.25*head_length,  0.75*head_height, 0.5*head_depth - head_depth / 2);
    eye_r = createCube(eyes_length, eyes_height, eyes_depth);
    eye_r.position.set(0.25*head_length, 0.75*head_height, 0.5*head_depth - head_depth / 2);
    antler_l = createCube(antlers_depth, antlers_height, antlers_depth);
    antler_l.position.set(-0.25*head_length, head_height + antlers_height / 2, - head_depth / 2);
    antler_r = createCube(antlers_depth, 0.5 * antlers_height, antlers_depth);
    antler_r.position.set(0.25*head_length, head_height + antlers_height / 2, - head_depth / 2);

    eye_l.material.color.set("white")
    eye_r.material.color.set("white")
    antler_l.material.color.set("white")
    antler_r.material.color.set("white")

    const head_axis_points = [];
    head_axis_points.push( new THREE.Vector3( -1, 0, 0) );
    head_axis_points.push( new THREE.Vector3( 1, 0, 0,) );
    const head_axis_geometry = new THREE.BufferGeometry().setFromPoints(head_axis_points);

    head_axis = new THREE.Line( head_axis_geometry, new THREE.LineBasicMaterial({transparent: 1, opacity: 0}));
    head_axis.position.set(0, 1.5*waist_height + chest_height, head_depth / 2);
    scene.add( head_axis );

    head_axis.add(skull, eye_l, eye_r, antler_l, antler_r);
    head_axis.userData = {rotating: 0, rotationAngle: 0};
    head_axis.name = "head";

    // ---------------------------------------------------------
    // 3D Objects ASSEMBLY
    // ---------------------------------------------------------


    robot = new THREE.Object3D();
    robot.userData = {rotating : 0, rotate_head : 0,
                      min_point : new THREE.Vector3(-(abdomen_length / 2 + arm_width + 2 * exhaust_radius),
                                                    -abdomen_height / 2,
                                                    -(abdomen_depth / 2 + thigh_height + leg_height + foot_height / 2)),
                      max_point : new THREE.Vector3(abdomen_length / 2 + arm_width + 2 * exhaust_radius,
                                                    abdomen_height / 2 + waist_height + chest_height + head_height + antlers_height,
                                                    abdomen_depth / 2)
                     };
    robot.add(head_axis, body, legs, left_arm, right_arm);
    
    meeting_point.add(new THREE.Vector3(0, 0, -abdomen_height / 2 - thigh_height - 0.32*leg_height));

    scene.add(robot);
}

function createTrailer() {

    var support, connection_piece, trailer_wheel_l1, trailer_wheel_l2, trailer_wheel_r1, trailer_wheel_r2;
    var trailer_origin_distance = 25, abdomen_height = 1.5, front_wheel_distance = 5.75, back_wheel_distance = 7.75, support_distance = 6.75;
    var container_length = 4, container_height = 8, container_depth = 17;
    var support_length = 2, support_height = 1, support_depth = 3.5;
    var wheel_radius = 0.75, wheel_height = 1, abdomen_length = 4;
    var connection_piece_distance = 6, connection_piece_radius = 0.5, connection_piece_height = 0.25;

    // CONTAINER
    container = createCube(container_length, container_height, container_depth);
    container.position.set(0, connection_piece_height + (container_height + abdomen_height) / 2, 0);

    // SUPPORT
    support = createCube(support_length, support_height, support_depth);
    support.position.set(0, support_height / 2, -support_distance);

    // WHEELS
    trailer_wheel_l1 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    trailer_wheel_l1.rotateZ((Math.PI)/2);
    trailer_wheel_l1.position.set((-(abdomen_length + wheel_height) / 2) + (wheel_height), 0, -front_wheel_distance)

    trailer_wheel_l2 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    trailer_wheel_l2.rotateZ((Math.PI)/2);
    trailer_wheel_l2.position.set((-(abdomen_length + wheel_height) / 2) + (wheel_height), 0, -back_wheel_distance)

    trailer_wheel_r1 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    trailer_wheel_r1.rotateZ((Math.PI)/2);
    trailer_wheel_r1.position.set(((abdomen_length + wheel_height) / 2) - (wheel_height), 0, -front_wheel_distance)

    trailer_wheel_r2 = createCylinder(wheel_radius, wheel_radius, wheel_height)
    trailer_wheel_r2.rotateZ((Math.PI)/2);
    trailer_wheel_r2.position.set(((abdomen_length + wheel_height) / 2) - (wheel_height), 0, -back_wheel_distance)

    // CONNECTION PIECE
    connection_piece = createCylinder(connection_piece_radius, connection_piece_radius, connection_piece_height);
    connection_piece.position.set(0, (connection_piece_height + abdomen_height) / 2, connection_piece_distance);
    connection_piece.material.color.set(0xffff88);

    // Add robot difference distance offset to the meeting point
    
    meeting_point.add(new THREE.Vector3(0, 0, -connection_piece_distance));

    // ASSEMBLY
    trailer = new THREE.Object3D();
    trailer.userData = {rotating : 0, velocity : new THREE.Vector3(0,0,0),
                        min_point : new THREE.Vector3(-container_length / 2,
                                                      connection_piece_height + abdomen_height / 2 - support_height,
                                                      -trailer_origin_distance - container_depth / 2),
                        max_point : new THREE.Vector3(container_length / 2,
                                                      connection_piece_height + abdomen_height / 2 + container_height,
                                                      -trailer_origin_distance + container_depth / 2)
                       };
    trailer.add(container, support, connection_piece, trailer_wheel_l1, trailer_wheel_l2, trailer_wheel_r1, trailer_wheel_r2);
    trailer.position.set(0, 0, -trailer_origin_distance);

    scene.add(trailer);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

    // Enable cameras again after possible collision check
    if (animation_mode) animation_mode = false;

    if (!hitboxSetupCheck()) return;
    
    if (
    robot.userData.min_point.x <= trailer.userData.max_point.x &&
    robot.userData.max_point.x >= trailer.userData.min_point.x &&
    robot.userData.min_point.y <= trailer.userData.max_point.y &&
    robot.userData.max_point.y >= trailer.userData.min_point.y &&
    robot.userData.min_point.z <= trailer.userData.max_point.z &&
    robot.userData.max_point.z >= trailer.userData.min_point.z
    ) 
    {   
        handleCollisions();
        console.log("Touchy!");
        return;
    }

    console.log("Not touchy!");

}

// DEBUGGING PURPOSES
function sayCollision() {
    
    console.log(robot.userData.min_point.x <= trailer.userData.max_point.x);
    console.log(robot.userData.max_point.x >= trailer.userData.min_point.x);
    console.log(robot.userData.min_point.y <= trailer.userData.max_point.y);
    console.log(robot.userData.max_point.y >= trailer.userData.min_point.y);
    console.log(robot.userData.min_point.z <= trailer.userData.max_point.z); 
    console.log(robot.userData.max_point.z >= trailer.userData.min_point.z);

}

function hitboxSetupCheck() {
        
    // Checks for the robot ready-to-assemble-with-trailer state
    for (let [, group_state] of Object.entries(hitbox_init_set_map))
        if (!group_state) return false;
    return true;
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

    let step = 0.025;

    // Camera keys won't work after this
    animation_mode = true;
    
    v.set(0,0,0)
    t.set(0,0,0);
    trailer_drag.set(0,0,0);

    if (Math.abs(trailer.position.x - meeting_point.x) > 0.01 || Math.abs(trailer.position.z - meeting_point.z) > 0.01) {

        v.add(meeting_point);
        t.add(trailer.position);

        trailer_drag.add(v.add(t.multiplyScalar(-1)));

        trailer_drag.setLength(step);
        
        // Check for hitbox corner points too
        trailer.position.add(trailer_drag);
        trailer.userData.min_point.add(trailer_drag);
        trailer.userData.max_point.add(trailer_drag);

    }
    else animation_mode = false; // After the trailer is in position, camera changes are allowed

}

////////////
/* UPDATE */
////////////
function update() {
    'use strict';

    rotateRobot();
    rotateTrailer();
    updateTrailerPosition();
    updateHeadPosition();
    updateArmPosition();
    updateLegPosition();
    updateFeetPosition();

    // For now checks and handles thereafter
    checkCollisions();
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

    update();

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
    trailer.position.add(trailer.userData.velocity);
    trailer.userData.min_point.add(trailer.userData.velocity);
    trailer.userData.max_point.add(trailer.userData.velocity);
}

function updateHeadPosition() {
    let step = 0.02;

    if (head_axis.userData.rotating != 0 && head_axis.userData.rotationAngle >= 0 && head_axis.userData.rotationAngle <= Math.PI) {
       head_axis.rotateX(-head_axis.userData.rotating * step); // Minus sign for clockwise rotation
       head_axis.userData.rotationAngle += head_axis.userData.rotating * step;
       hitbox_init_set_map["head"] = false; console.log('head_not_ok');
    }
    if (head_axis.userData.rotating == 0) {
        if (head_axis.userData.rotationAngle < 0) {
            head_axis.userData.rotationAngle = 0;
            head_axis.rotation.x = head_axis.userData.rotationAngle;
        }   
        if (head_axis.userData.rotationAngle > Math.PI) {
            head_axis.userData.rotationAngle = Math.PI;
            head_axis.rotation.x = head_axis.userData.rotationAngle;
            hitbox_init_set_map["head"] = true; console.log('head_ok');
        }
    }
}

function updateArmPosition() {
    let step = 0.05

    if (left_arm.userData.velocity.x != 0) { // Only check for x component
        left_arm.position.add(left_arm.userData.velocity.multiplyScalar(step));
        right_arm.position.add(right_arm.userData.velocity.multiplyScalar(step));
        hitbox_init_set_map["arms"] = false; console.log('arms_not_ok');
    }
    else {
        if (left_arm.position.x < -3.5 && right_arm.position.x > 3.5) {
            left_arm.position.x = -3.5;
            right_arm.position.x = 3.5;
        }
        if (left_arm.position.x > -2.5 && right_arm.position.x < 2.5) {
            left_arm.position.x = -2.5;
            right_arm.position.x = 2.5;
            hitbox_init_set_map["arms"] = true; console.log('arms_ok');
        }

    }

}

function updateLegPosition() {
    let step = 0.01;

    if (legs.userData.rotating != 0 && legs.userData.rotationAngle >= 0 && legs.userData.rotationAngle <= Math.PI / 2) {
        legs.rotateX(legs.userData.rotating * step);
        legs.userData.rotationAngle += legs.userData.rotating * step;
        hitbox_init_set_map["legs"] = false; console.log('legs_not_ok');
    }
    if(legs.userData.rotating == 0) {
        if(legs.userData.rotationAngle < 0) {
            legs.userData.rotationAngle = 0;
            legs.rotation.x = legs.userData.rotationAngle;
        }
        if(legs.userData.rotationAngle > Math.PI / 2) {
            legs.userData.rotationAngle = Math.PI / 2;
            legs.rotation.x = legs.userData.rotationAngle;
            hitbox_init_set_map["legs"] = true; console.log('legs_ok');
        }

    }
}

function updateFeetPosition() {
    let step = 0.02;

    if (feet_axis.userData.rotating != 0 && feet_axis.userData.rotationAngle >= 0 && feet_axis.userData.rotationAngle <= Math.PI) {
        feet_axis.rotateX(feet_axis.userData.rotating * step);
        feet_axis.userData.rotationAngle += feet_axis.userData.rotating * step;
        hitbox_init_set_map["feet"] = false; console.log('feet_not_ok');
    }
    if (feet_axis.userData.rotating == 0) {
        if(feet_axis.userData.rotationAngle < 0) {
            feet_axis.userData.rotationAngle = 0;
            feet_axis.rotation.x = feet_axis.userData.rotationAngle;
        }
        if(feet_axis.userData.rotationAngle > Math.PI) {
            feet_axis.userData.rotationAngle = Math.PI;
            feet_axis.rotation.x = feet_axis.userData.rotationAngle;
            hitbox_init_set_map["feet"] = true; console.log('feet_ok');
        }

    }
}

function updateTrailerVelocity(x, z){

    trailer.userData.velocity.setX(x);
    trailer.userData.velocity.setZ(z);

    // Velocity vector length remains unchanged
    if(trailer.userData.velocity.x !== 0 && trailer.userData.velocity.z !== 0){
        trailer.userData.velocity.setLength(0.05);
    }
}

function compute_trailer_movement() {
    if(key_press_map[37] && key_press_map[39] && key_press_map[38] && key_press_map[40]){ // Left + Right + Up + Down
        updateTrailerVelocity(0, 0);
        return;
    }
    if(key_press_map[37] && key_press_map[39] && key_press_map[38]){ // Left + Right + Up
        updateTrailerVelocity(0, -0.05);
        return;
    }
    if(key_press_map[37] && key_press_map[39] && key_press_map[40]){ // Left + Right + Down
        updateTrailerVelocity(0, 0.05);
        return;
    }
    if(key_press_map[38] && key_press_map[40] && key_press_map[37]){ // Up + Down + Left
        updateTrailerVelocity(-0.05, 0);
        return;
    }
    if(key_press_map[38] && key_press_map[40] && key_press_map[39]){ // Up + Down + Right
        updateTrailerVelocity(0.05, 0);
        return;
    }
    if(key_press_map[38] && key_press_map[40]){ // Up + Down
        updateTrailerVelocity(0.0, 0);
        return;
    }
    if(key_press_map[37] && key_press_map[39]){ // Left + Right
        updateTrailerVelocity(0.0, 0);
        return;
    }
    if(key_press_map[38] && key_press_map[39]){ // Up + Right
        updateTrailerVelocity(0.05, -0.05);
        return;
    }
    if(key_press_map[38] && key_press_map[37]){ // Up + Left
        updateTrailerVelocity(-0.05, -0.05);
        return;
    }
    if(key_press_map[40] && key_press_map[39]){ // Down + Right
        updateTrailerVelocity(0.05, 0.05);
        return;
    }
    if(key_press_map[40] && key_press_map[37]){ // Down + Left
        updateTrailerVelocity(-0.05, 0.05);
        return;
    }
    if(key_press_map[37]){
        updateTrailerVelocity(-0.05, 0);
        return;
    }
    if(key_press_map[38]){
        updateTrailerVelocity(0, -0.05);
        return;
    }
    if(key_press_map[39]){
        updateTrailerVelocity(0.05, 0);
        return;
    }
    if(key_press_map[40]){
        updateTrailerVelocity(0, 0.05);
        return;
    }
    updateTrailerVelocity(0,0);
}


function compute_arm_velocity() {
    if (key_press_map[68] && key_press_map[69]) {
        left_arm.userData.velocity.set(0, 0, 0);
        right_arm.userData.velocity.set(0, 0, 0);
    }
    else if (key_press_map[68] && left_arm.position.x < -2.5) {
        left_arm.userData.velocity.set(1, 0, 0);
        right_arm.userData.velocity.set(-1, 0, 0);
    }
    else if (key_press_map[69] && left_arm.position.x > -3.5) {
        left_arm.userData.velocity.set(-1, 0, 0);
        right_arm.userData.velocity.set(1, 0, 0);
    }
    else {
        left_arm.userData.velocity.set(0, 0, 0);
        right_arm.userData.velocity.set(0, 0, 0);
    }
}

function compute_leg_rotation()
{
    if (key_press_map[83] && key_press_map[87]) {
        legs.userData.rotating = 0;
    }
    else if (key_press_map[87] && legs.userData.rotationAngle > 0) {
        legs.userData.rotating = -1;
    }
    else if (key_press_map[83] && legs.userData.rotationAngle < Math.PI / 2) {
        legs.userData.rotating = 1;
    }
    else legs.userData.rotating = 0;
}

function compute_feet_rotation() {
    if (key_press_map[65] && key_press_map[81]) {
        feet_axis.userData.rotating = 0;
    }
    else if (key_press_map[81] && feet_axis.userData.rotationAngle > 0) {
        feet_axis.userData.rotating = -1;
    }
    else if (key_press_map[65] &&feet_axis.userData.rotationAngle < Math.PI) {
        feet_axis.userData.rotating = 1;
    }
    else feet_axis.userData.rotating = 0;
}

function compute_head_rotation() {
    if (key_press_map[82] && key_press_map[70]){
        head_axis.userData.rotating = 0
    }
    else if (key_press_map[82] && head_axis.userData.rotationAngle > 0) {
        head_axis.userData.rotating = -1;
    }
    else if (key_press_map[70] && head_axis.userData.rotationAngle < Math.PI) {
        head_axis.userData.rotating = 1;
    }
    else head_axis.userData.rotating = 0;
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (cameras[active_camera] instanceof THREE.OrthographicCamera &&
    window.innerWidth / window.innerHeight > aspect_ratio) {

        // It kinf of works but leaves parts of the scene out
        cameras[3].left = -window.innerWidth / 32;
        cameras[3].right = window.innerWidth / 32;
        cameras[3].top = window.innerHeight / 32;
        cameras[3].bottom = -window.innerHeight / 32;
        cameras[3].updateProjectionMatrix();
    }
    
    if (window.innerWidth > 0 && window.innerHeight > 0) {
        for (let idx = 0; idx < cameras.length; idx++) {
            if (cameras[idx] instanceof THREE.OrthographicCamera) continue;
            cameras[idx].aspect = window.innerWidth / window.innerHeight;
            cameras[idx].updateProjectionMatrix();
            console.log(idx);
        }
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
        if (!animation_mode)
            change_camera(0);
        break;
    case 50: // 2
        if (!animation_mode)
            change_camera(1);
        break;
    case 51: // 3
        if (!animation_mode)
            change_camera(2);
        break;
    case 52: // 4
        if (!animation_mode)
            change_camera(3);
        break;
    case 53: // 5
        if (!animation_mode)
            change_camera(4);
        break;

    case 54: // 6
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
    // Head Movement
    case 82: // R
    case 114: // r
        key_press_map[82] = 1;
        compute_head_rotation();
        break;
    case 70: // F
    case 102: // f
        key_press_map[70] = 1;
        compute_head_rotation();
        break;
    // Arm movement
    case 69: // E
    case 101: // e
        key_press_map[69] = 1;
        compute_arm_velocity();
        break;
    case 68: // D
    case 100: // d
        key_press_map[68] = 1;
        compute_arm_velocity();
        break;
    // Legs movement
    case 87: // W
    case 119: // w
        key_press_map[87] = 1;
        compute_leg_rotation();
        break;
    case 83: // S
    case 115: // s
        key_press_map[83] = 1;
        compute_leg_rotation();
        break;
    // Feet movement
    case 81: // Q
    case 113: // q
        key_press_map[81] = 1;
        compute_feet_rotation();
        break;
    case 65: // A
    case 97: // a
        key_press_map[65] = 1;
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

    // Trailer Movement
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
    // Head Movement
    case 82: // R
    case 114: // r
        key_press_map[82] = 0;
        compute_head_rotation();
        break;
    case 70: // F
    case 102: // f
        key_press_map[70] = 0;
        compute_head_rotation();
        break;
    // Arms movement
    case 69: // E
    case 101: // e
        key_press_map[69] = 0;
        compute_arm_velocity();
        break;
    case 68: // D
    case 100: // d
        key_press_map[68] = 0;
        compute_arm_velocity();
        break;
    // Legs movement
    case 83: // S 
    case 115: // s
        key_press_map[83] = 0;
        compute_leg_rotation();
        break;
    case 87: // W
    case 119: // w
        key_press_map[87] = 0;
        compute_leg_rotation();
        break;
    // Feet movement
    case 81: // Q
    case 113: // q
        key_press_map[81] = 0;
        compute_feet_rotation();
        break;
    case 65: // A
    case 97: // a
        key_press_map[65] = 0;
        compute_feet_rotation();
        break;
    }
}