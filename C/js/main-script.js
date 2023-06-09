//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let key_press_map = {};
let presented = false;
let scene, texture_scene, renderer, everglades_texture, firmament_texture;
let meshes = [], ufo;
let dirLight;

const field_radius = 100;
const perspective_camera_settings = {fov:100, x:20, y:10, z:20}, vr_camera_settings = {x:0, y:20, z:20};
const create_flowers_args = {l:30, w:30, x:0, y:0, z:0, count:1000}, create_stars_args = {l:100, w:100, x:0, y:110, z:0, count:2500};

const clock = new THREE.Clock();
const cameras = new Array(5);

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createTextures() {
    renderer.autoClear = false;
    texture_scene = new THREE.Scene();
    texture_scene.userData = {has_stars: false, has_flowers: false};
    texture_scene.add(createAmbientLight(0xFFFFFF, 1));

    cameras[2] = createOrthographicCamera(create_flowers_args.l, create_flowers_args.w, create_flowers_args.x, create_flowers_args.y, create_flowers_args.z, texture_scene.position.x, texture_scene.position.y, texture_scene.position.z);
    everglades_texture = new THREE.WebGLRenderTarget(150*field_radius, 150*field_radius, {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping}) //wraps
    everglades_texture.texture.repeat.set(10,10);
    generateNature(create_flowers_args.l, create_flowers_args.w, create_flowers_args.x, create_flowers_args.y, create_flowers_args.z, create_flowers_args.count);
    renderer.setRenderTarget(everglades_texture);
    renderer.clear(); // manual clear
    renderer.render(texture_scene, cameras[2]);
    renderer.setRenderTarget(null)

    cameras[3] = createOrthographicCamera(create_stars_args.l, create_stars_args.w, create_stars_args.x, create_stars_args.y, create_stars_args.z, texture_scene.position.x, texture_scene.position.y, texture_scene.position.z);
    firmament_texture = new THREE.WebGLRenderTarget(150*field_radius, 150*field_radius, {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping})
    firmament_texture.texture.repeat.set(25, 1);
    generateFirmament(create_stars_args.l, create_stars_args.w, create_stars_args.x, create_stars_args.y, create_stars_args.z, create_stars_args.count);
    renderer.setRenderTarget(firmament_texture);
    renderer.clear(); // manual clear
    renderer.render(texture_scene, cameras[3]);
    renderer.setRenderTarget(null);

    renderer.autoClear = true;
}
function generateNature(l, w, x, y, z, count) {
    texture_scene.add(createGrass(l, w, x, y, z));
    texture_scene.add(texture_scene.userData.flowers = createFlowers(l, w, x, y, z, count));
    texture_scene.userData.has_flowers = true;
}
function generateFirmament(l, w, x, y, z, count) {
    texture_scene.add(createSunset(l, w, x, y, z));
    texture_scene.add(texture_scene.userData.stars = createStars(l, w, x, y, z, count));
    texture_scene.userData.has_stars = true;
}
function createScene(){
    'use strict';
    const number_of_cork_oaks = 20, space_ship = {x: -5, y: 10, z: -5, pointlights_count: 6}, moon = {x: -30, y:30, z: -30};

    const cork_oaks_positions = [ [-10, -1.1, 20], 
                                  [-20, -1.1, 10],
                                  [-20, -1.1, 20],
                                  [-40, -1.1, 50],
                                  [-50, -1.1, 30],
                                  [-60, -1.1, 10],  // 4th octant
                                  [-20, -1.1, -10],
                                  [-20, -1.1, -40],
                                  [-30, -1.1, -60],
                                  [-40, -1.1, -50],
                                  [-50, -1.1, -20],
                                  [-30, -1.1, -20], // 3rd octant
                                  [10, -1.1, -10],
                                  [20, -1.1, -50],
                                  [50, -1.1, -20],
                                  [40, -1.1, -30],
                                  [50, -1.1, -60],
                                  [60, -1.1, -10],  // 2nd octant
                                  [5, -1.1, 25],
                                  [30, -1.1, 5] ]   // 1st octant

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(100));
    scene.background = new THREE.Color(0xeeeeff);

    scene.add(createSky(field_radius));
    scene.add(createMoon(moon.x, moon.y, moon.z));
    scene.add(createEverglades(field_radius));
    scene.add(createHouse());
    scene.add(ufo = createUfo(space_ship.x, space_ship.y, space_ship.z, space_ship.pointlights_count));
    scene.add(createCorkOaks(number_of_cork_oaks, cork_oaks_positions));
}
//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict'
    cameras[0] = createIsometricPerspectiveCamera(perspective_camera_settings.fov, perspective_camera_settings.x, perspective_camera_settings.y, perspective_camera_settings.z);
    cameras[1] = createVRCamera(vr_camera_settings.x, vr_camera_settings.y, vr_camera_settings.z);
}
function createIsometricPerspectiveCamera(fov, x, y, z) {
    'use strict'
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 250);
    camera.position.set(x, y, z);
    camera.lookAt(scene.position.x, scene.position.y, scene.position.z);
    //camera.rotateX(Math.PI/ 4);
    return camera;
}
function createVRCamera(x, y, z){
    cameras[4] = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    cameras[4].position.set(x, y, z);
    cameras[4].lookAt(scene.position.x, scene.position.y, scene.position.z);
    return new THREE.StereoCamera();
}
function createOrthographicCamera(l, w, targetX, targetY, targetZ, lookAtX, lookAtY, lookAtZ) {
    const camera = new THREE.OrthographicCamera(-l / 2 + 0.1, l / 2 - 0.1, w / 2 - 0.1, -w / 2 + 0.1, 15);
    camera.position.set(targetX, targetY + 30, targetZ);
    camera.lookAt(lookAtX, lookAtY, lookAtZ);
    return camera;
}
/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    scene.add(dirLight = createDirectionalLight(0xEBC815, 0.8, 100, 100, 100, 0, 0, 0));
    scene.add(createAmbientLight(0xFFFFFF, 0.5));
}
function createDirectionalLight(color, intensity, x, y, z, tx, ty, tz) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    light.target.position.set(tx, ty, tz);
    light.castShadow = true;

    // Directional lights' default shadow properties
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.left = -512;
    light.shadow.camera.right = 512;
    light.shadow.camera.top = 512;
    light.shadow.camera.bottom = -512;

    light.target.updateMatrixWorld(true);
    return light;
}
function createAmbientLight(color, intensity) {
    return new THREE.AmbientLight(color, intensity);
}
////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createGrass(l, w, x, y, z) {
    const grass_geometry = new THREE.PlaneGeometry(l, w, 200);
    grass_geometry.rotateX(Math.PI / 2);
    const grass_material = new THREE.MeshPhongMaterial({
        color: 0x236b25,
        side : THREE.DoubleSide,
    });
    const grass = new THREE.Mesh(grass_geometry, grass_material);
    grass.position.set(x, y, z);
    return grass;
}
function createFlowers(l, w, x, y, z, count) {
    const flowers = new THREE.Group();
    const flower_geometry = new THREE.CircleGeometry(0.1, 32);
    const flower_material_white = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide});
    const flower_material_yellow = new THREE.MeshBasicMaterial({color: 0xFFFF00, side: THREE.BackSide});
    const flower_material_blue = new THREE.MeshBasicMaterial({color: 0x8f00ff, side: THREE.BackSide});
    const flower_material_purple = new THREE.MeshBasicMaterial({color: 0x89cff0, side: THREE.BackSide});

    for(let i = 0, flower_mesh, scale = Math.random() / 2 + 1; i < count; i++, scale = Math.random() / 2 + 1) {
        switch(i % 4){
            case 0:
                flower_mesh = new THREE.Mesh(flower_geometry, flower_material_white);
                break;
            case 1:
                flower_mesh = new THREE.Mesh(flower_geometry, flower_material_yellow);
                break;
            case 2:
                flower_mesh = new THREE.Mesh(flower_geometry, flower_material_blue);
                break;
            case 3:
                flower_mesh = new THREE.Mesh(flower_geometry, flower_material_purple);
                break;
        }
        flower_mesh.position.set((Math.random() -0.5) * l + x, 0 + y, (Math.random() - 0.5) * w + z);
        flower_mesh.rotateX(Math.PI / 2);
        flower_mesh.scale.set(scale, scale, scale);
        flowers.add(flower_mesh);
    }
    return flowers;
}
function createSunset(l, w, x, y, z) {
    const sunset_geometry = new THREE.BufferGeometry();
    // Position vertices
    sunset_geometry.setAttribute('position', new THREE.BufferAttribute( new Float32Array([
        -l / 2, 0, -w / 2,
        l / 2, 0, -w / 2,
        l / 2, 0, w / 2,
        -l / 2, 0, w / 2
    ]), 3));
    // Index vertices
    const indices = [
        0, 1, 2,
        2, 3, 0
    ]
    sunset_geometry.setIndex(indices);
    // Color vertices
    const color1 = new THREE.Color().setHex(0x152887); // blue
    const color2 = new THREE.Color().setHex(0x6C3D60); // purple
    const colorArray = color2.toArray()
        .concat(color2.toArray())
        .concat(color1.toArray())
        .concat(color1.toArray());
    sunset_geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colorArray), 3));

    const sunset_material = new THREE.MeshBasicMaterial({
        vertexColors: true, side: THREE.BackSide,
    });
    const sunset = new THREE.Mesh(sunset_geometry, sunset_material);
    sunset.position.set(x, y, z);
    return sunset;
}
function createStars(l, w, x, y, z, count){
    const stars = new THREE.Group();
    const star_color = new THREE.Color().setHex(0xffffff);
    const star_geometry = new THREE.CircleGeometry(0.05, 32);
    const star_material = new THREE.MeshBasicMaterial({color: star_color, side: THREE.BackSide});
    for(let i = 0, star_mesh, scale = Math.random() / 2 + 1; i < count; i++, scale = Math.random() / 2 + 1) {
        star_mesh = new THREE.Mesh(star_geometry, star_material);
        star_mesh.position.set((Math.random() - 0.5) * l + x, 0 + y, (Math.random() - 0.5) * w + z);
        star_mesh.rotateX(Math.PI / 2);
        star_mesh.scale.set(scale, scale, scale);
        stars.add(star_mesh);
    }
    return stars;
}
function createSky() {
    const sky_dome_geometry = new THREE.SphereGeometry(field_radius, 180, 180, 0, Math.PI * 2, 0, 6 * Math.PI / 11);
    const sky_dome_material = new THREE.MeshPhongMaterial({
        side: THREE.BackSide,
        map: firmament_texture.texture,
    });
    return new THREE.Mesh(sky_dome_geometry, sky_dome_material);
}
function createMoon(x, y, z) {
    'use strict';
    // Moon yellow colour
    const moon_lambert_material = new THREE.MeshLambertMaterial({color: 0xEBC815, emissive: 0xEBC815});
    const moon_phong_material = new THREE.MeshPhongMaterial({color: 0xEBC815, emissive: 0xEBC815});
    const moon_toon_material = new THREE.MeshToonMaterial({color: 0xEBC815, emissive: 0xEBC815});
    const moon_basic_material = new THREE.MeshBasicMaterial({color: 0xEBC815});

    const moonShapeGeometry = new THREE.SphereGeometry(5, 32, 16);

    const moon = new THREE.Mesh(moonShapeGeometry, moon_lambert_material);
    moon.position.set(x, y, z);
    moon.userData = {lambert_material: moon_lambert_material, phong_material: moon_phong_material, toon_material: moon_toon_material, basic_material: moon_basic_material};

    meshes.push(moon);
    moon.receiveShadow = true;
    moon.castShadow = true;

    return moon;
}
function createEverglades() {
    const everglades_geometry = new THREE.CircleGeometry(field_radius, 6000);
    everglades_geometry.rotateX(Math.PI / 2);

    const loader = new THREE.TextureLoader();
    const displacement_map = loader.load('textures/terrain_heightmap.png');
    const normal_map = loader.load('textures/terrain_shadowmap.png');

    const everglades_phong_material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side : THREE.BackSide,
        displacementMap: displacement_map,
        normalMap: normal_map,
        displacementScale: 25,
        map: everglades_texture.texture,
    });

    const everglades = new THREE.Mesh(everglades_geometry, everglades_phong_material);
    everglades.position.set(0, 5, 0);
    everglades.receiveShadow = true;


    return everglades;
}
function createCorkOaks(number_of_cork_oaks, cork_oaks_positions) {
    'use strict';
    const trees = new THREE.Group();

    // Create trunks' materials
    const wood_lambert_material = new THREE.MeshLambertMaterial({color: 0xa45729});
    const wood_phong_material = new THREE.MeshPhongMaterial({color: 0xa45729});
    const wood_toon_material = new THREE.MeshToonMaterial({color: 0xa45729});
    const wood_basic_material = new THREE.MeshBasicMaterial({color: 0xa45729});
    // Create canopies' materials
    const canopy_lambert_material = new THREE.MeshLambertMaterial({color: 0x013220});
    const canopy_phong_material = new THREE.MeshPhongMaterial({color: 0x013220});
    const canopy_toon_material = new THREE.MeshToonMaterial({color: 0x013220});
    const canopy_basic_material = new THREE.MeshBasicMaterial({color: 0x013220});

    const trunk_geometry = new THREE.CylinderGeometry(0.65, 0.5, 2, 10);
    const main_bough_geometry = new THREE.CylinderGeometry(0.45, 0.5, 3, 10);
    const secondary_bough_geometry = new THREE.CylinderGeometry(0.35, 0.35, 2.5, 10);
    const canopy_geometry = new THREE.SphereGeometry(1.5, 32, 16);
    
    let scale;
    for (let i = 0, trunk, main_bough, secondary_bough, first_canopy, second_canopy, third_canopy, corkOak; i < number_of_cork_oaks; i++) {
        trunk = new THREE.Mesh(trunk_geometry, wood_lambert_material);
        trunk.position.set(0, 0, 0);
        trunk.rotateZ(Math.PI);
        trunk.userData = {lambert_material: wood_lambert_material, phong_material: wood_phong_material, toon_material: wood_toon_material, basic_material: wood_basic_material};

        main_bough = new THREE.Mesh(main_bough_geometry, wood_lambert_material);
        main_bough.position.set(-0.795, 1.9, 0);
        main_bough.rotateZ((Math.PI)/5);
        main_bough.userData = {lambert_material: wood_lambert_material, phong_material: wood_phong_material, toon_material: wood_toon_material, basic_material: wood_basic_material};

        secondary_bough = new THREE.Mesh(secondary_bough_geometry, wood_lambert_material);
        secondary_bough.rotateZ((Math.PI)/(-4));
        secondary_bough.position.set(1, 1.8, 0);
        secondary_bough.userData = {lambert_material: wood_lambert_material, phong_material: wood_phong_material, toon_material: wood_toon_material, basic_material: wood_basic_material};

        first_canopy = new THREE.Mesh(canopy_geometry, canopy_lambert_material);
        first_canopy.scale.set(2, 1, 1);
        first_canopy.position.set(-2.0, 4, 0.7);
        first_canopy.userData = {lambert_material: canopy_lambert_material, phong_material: canopy_phong_material, toon_material: canopy_toon_material, basic_material: canopy_basic_material};

        second_canopy = new THREE.Mesh(canopy_geometry, canopy_lambert_material);
        second_canopy.scale.set(1.5, 1, 1);
        second_canopy.position.set(-1, 4.5, -0.7);
        second_canopy.userData = {lambert_material: canopy_lambert_material, phong_material: canopy_phong_material, toon_material: canopy_toon_material, basic_material: canopy_basic_material};

        third_canopy = new THREE.Mesh(canopy_geometry, canopy_lambert_material);
        third_canopy.scale.set(2, 1, 1);
        third_canopy.position.set(1.5, 3.8, -0.3);
        third_canopy.userData = {lambert_material: canopy_lambert_material, phong_material: canopy_phong_material, toon_material: canopy_toon_material, basic_material: canopy_basic_material};

        meshes.push(main_bough, secondary_bough, first_canopy, second_canopy, third_canopy);
        // Set receiveShadow and castShadow settings to true on all trees' meshes
        trunk.receiveShadow = true;
        trunk.castShadow = true;
        main_bough.receiveShadow = true;
        main_bough.castShadow = true;
        secondary_bough.receiveShadow = true;
        secondary_bough.castShadow = true;
        first_canopy.receiveShadow = true;
        first_canopy.castShadow = true;
        second_canopy.receiveShadow = true;
        second_canopy.castShadow = true;
        third_canopy.receiveShadow = true;
        third_canopy.castShadow = true;

        // Assemble and position cork oak
        corkOak = (new THREE.Group()).add(trunk, main_bough, secondary_bough, first_canopy, second_canopy, third_canopy);

        scale = Math.random();

        corkOak.rotateY(2 * Math.PI * scale);
        corkOak.scale.set(0.5 * (2 * scale + 1), 0.5 * (2 * scale + 1), 0.5 * (2 * scale + 1));
        corkOak.position.set(cork_oaks_positions[i][0], cork_oaks_positions[i][1], cork_oaks_positions[i][2]);

        trees.add(corkOak);
    }
    return trees;
}
function createHouse(){
    'use strict';

    // Create house's materials
    const body_lambert_material = new THREE.MeshLambertMaterial({color: 0xffffff});
    const body_phong_material = new THREE.MeshPhongMaterial({color: 0xffffff});
    const body_toon_material = new THREE.MeshToonMaterial({color: 0xffffff});
    const body_basic_material = new THREE.MeshBasicMaterial({color: 0xffffff});

    const door_lambert_material = new THREE.MeshLambertMaterial({color: 0xC4A484});
    const door_phong_material = new THREE.MeshPhongMaterial({color: 0xC4A484});
    const door_toon_material = new THREE.MeshToonMaterial({color: 0xC4A484});
    const door_basic_material = new THREE.MeshBasicMaterial({color: 0xC4A484});

    const window_lambert_material = new THREE.MeshLambertMaterial({color: 0x89cff0});
    const window_phong_material = new THREE.MeshPhongMaterial({color: 0x89cff0});
    const window_toon_material = new THREE.MeshToonMaterial({color: 0x89cff0});
    const window_basic_material = new THREE.MeshBasicMaterial({color: 0x89cff0});

    const roof_lambert_material = new THREE.MeshLambertMaterial({color: 0xDC582A});
    const roof_phong_material = new THREE.MeshPhongMaterial({color: 0xDC582A});
    const roof_toon_material = new THREE.MeshToonMaterial({color: 0xDC582A});
    const roof_basic_material = new THREE.MeshBasicMaterial({color: 0xDC582A});

    const body_vertices = new Float32Array( [
        0, 0, 0,    // v0
        1, 0, 0,    // v1
        0, 5, 0,    // v2
        1, 5, 0,    // v3
        10, 4, 0,   // v4
        10, 5, 0,   // v5
        1, 4, 0,    // v6
        3, 4, 0,    // v7
        3, 1.5, 0,  // v8
        4, 1.5, 0,  // v9
        4, 4, 0,    // v10
        6, 4, 0,    // v11
        6, 1.5, 0,  // 12
        7, 1.5, 0,  // v13
        7, 4, 0,    // v14
        9, 4, 0,    // v15
        9, 1.5, 0,  // v16
        10, 1.5, 0, // v17
        10, 4, 0,   // v18
        3, 0, 0,    // v19
        10, 0, 0,   // v20
        0, 0, -5,   // v21
        0, 5, -5,   // v22
        10, 0, -5,  // v23
        10, 5, -5   // v24
    ] );
    const door_vertices = new Float32Array( [
        1, 0, 0,  // v0
        3, 0, 0,  // v1
        3, 4, 0,  // v2
        1, 4, 0   // v3
    ] );
    const first_window_vertices = new Float32Array( [
        4, 1.5, 0, // v0
        6, 1.5, 0, // v1
        6, 4, 0,   // v2
        4, 4, 0    // v3
    ] );
    const second_window_vertices = new Float32Array( [
        7, 1.5, 0, // v0
        9, 1.5, 0, // v1
        9, 4, 0,   // v2
        7, 4, 0    // v3
    ] );
    const roof_vertices = new Float32Array( [
        0, 5, 0,     // v0
        10, 5, 0,    // v1
        0, 7, -2.5,  // v2
        10, 7, -2.5, // v3
        0, 5, -5,    // v4
        10, 5, -5    // v5
    ] );

    const body_indices = [
        0, 1, 2,    // Front side
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
        0, 2, 22,   // Left side
        22, 21, 0,
        20, 23, 5,  // Right Side
        5, 23, 24,
        21, 22, 24, // Back side
        24, 23, 21
    ];
    const door_indices = [
        0, 1, 3,
        1, 2, 3
    ];
    const first_window_indices = [
        0, 1, 3,
        1, 2, 3
    ];
    const second_window_indices = [
        0, 1, 3,
        1, 2, 3
    ];
    const roof_indices = [
        0, 1, 2, // Front side
        1, 3, 2,
        2, 3, 5, // Back side
        5, 4, 2,
        0, 2, 4, // Left side
        1, 5, 3  // Right side
    ];

    const body_geometry = new THREE.BufferGeometry();
    body_geometry.setAttribute('position', new THREE.Float32BufferAttribute(body_vertices, 3));
    body_geometry.setIndex(body_indices);
    body_geometry.computeVertexNormals();


    const door_geometry = new THREE.BufferGeometry();
    door_geometry.setAttribute('position', new THREE.Float32BufferAttribute(door_vertices, 3));
    door_geometry.setIndex(door_indices);
    door_geometry.computeVertexNormals();

    const first_window_geometry = new THREE.BufferGeometry();
    first_window_geometry.setAttribute('position', new THREE.Float32BufferAttribute(first_window_vertices, 3));
    first_window_geometry.setIndex(first_window_indices);
    first_window_geometry.computeVertexNormals();

    const second_window_geometry = new THREE.BufferGeometry();
    second_window_geometry.setAttribute('position', new THREE.Float32BufferAttribute(second_window_vertices, 3));
    second_window_geometry.setIndex(second_window_indices);
    second_window_geometry.computeVertexNormals();

    const roof_geometry = new THREE.BufferGeometry();
    roof_geometry.setAttribute('position', new THREE.Float32BufferAttribute(roof_vertices, 3));
    roof_geometry.setIndex(roof_indices);
    roof_geometry.computeVertexNormals();

    const body = new THREE.Mesh(body_geometry, body_lambert_material);
    body.userData = {lambert_material: body_lambert_material, phong_material: body_phong_material, toon_material: body_toon_material, basic_material: body_basic_material};
    const door = new THREE.Mesh(door_geometry, door_lambert_material);
    door.userData = {lambert_material: door_lambert_material, phong_material: door_phong_material, toon_material: door_toon_material, basic_material: door_basic_material};
    const first_window = new THREE.Mesh(first_window_geometry, window_lambert_material);
    first_window.userData = {lambert_material: window_lambert_material, phong_material: window_phong_material, toon_material: window_toon_material, basic_material: window_basic_material};
    const second_window = new THREE.Mesh(second_window_geometry, window_lambert_material);
    second_window.userData = {lambert_material: window_lambert_material, phong_material: window_phong_material, toon_material: window_toon_material, basic_material: window_basic_material};
    const roof = new THREE.Mesh(roof_geometry, roof_lambert_material);
    roof.userData = {lambert_material: roof_lambert_material, phong_material: roof_phong_material, toon_material: roof_toon_material, basic_material: roof_basic_material};


    // Assemble and position house
    const house = (new THREE.Group()).add(body, door, first_window, second_window, roof);
    house.position.set(-5, -1.1, 2.5); // Center house

    // Store meshes
    meshes.push(body, door, first_window, second_window, roof);

    // Set shadow settings
    body.receiveShadow = true;
    body.castShadow = true;
    door.receiveShadow = true;
    door.castShadow = true;
    first_window.receiveShadow = true;
    first_window.castShadow = true;
    second_window.receiveShadow = true;
    second_window.castShadow = true;
    roof.receiveShadow = true;
    roof.castShadow = true;
    house.receiveShadow = true;
    house.castShadow = true;

    return house;
}
function createUfo(ufo_x, ufo_y, ufo_z, pointlight_count) {
    const ufo = new THREE.Group();
    const spotlight_target = createSpotlightTarget(ufo_x, 0, ufo_z);
    const spotlight = createSpotLight(0, 0, 0, spotlight_target);
    const pointlights = createPointLight(0, 0, 0, 0xffffff, pointlight_count)

    ufo.add(createShip(pointlights, pointlight_count), spotlight);
    ufo.userData = {
        spotlight : spotlight,
        spotlight_target : spotlight_target,
        pointlights : pointlights,
        angular_velocity :  Math.PI / 6,
        linear_velocity : new THREE.Vector3(0,0,0),
    };
    ufo.position.set(ufo_x, ufo_y, ufo_z);
    return ufo;
}
function createShip(pointlights, pointlight_count) {
    const pointlight_radius = 0.25;
    const ufo = new THREE.Group();

    const cockpit_geometry = new THREE.SphereGeometry(2.5, 32, 32, 0, 2 * Math.PI, 0, 4 * Math.PI / 9);
    const body_geometry = new THREE.SphereGeometry(5, 32, 16);
    const spotlight_geometry = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 32);
    const pointlight_geometry = new THREE.SphereGeometry(pointlight_radius, 32, 16 );

    const cockpit_lambert_material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
    const cockpit_phong_material = new THREE.MeshPhongMaterial({color: 0xaaaaaa});
    const cockpit_toon_material = new THREE.MeshToonMaterial({color: 0xaaaaaa});
    const cockpit_basic_material = new THREE.MeshBasicMaterial({color: 0xaaaaaa});
    const body_lambert_material = new THREE.MeshLambertMaterial({color: 0x152238});
    const body_phong_material = new THREE.MeshPhongMaterial({color: 0x152238});
    const body_toon_material = new THREE.MeshToonMaterial({color: 0x152238});
    const body_basic_material = new THREE.MeshBasicMaterial({color: 0x152238});
    const spotlight_lambert_material = new THREE.MeshLambertMaterial({color: 0xffffbf});
    const spotlight_phong_material = new THREE.MeshPhongMaterial({color: 0xffffbf});
    const spotlight_toon_material = new THREE.MeshToonMaterial({color: 0xffffbf});
    const spotlight_basic_material = new THREE.MeshBasicMaterial({color: 0xffffbf});
    const pointlight_lambert_material = new THREE.MeshLambertMaterial({color: 0xffffbf});
    const pointlight_phong_material = new THREE.MeshPhongMaterial({color: 0xffffbf});
    const pointlight_toon_material = new THREE.MeshToonMaterial({color: 0xffffbf});
    const pointlight_basic_material = new THREE.MeshBasicMaterial({color: 0xffffbf});

    const cockpit_sphere = new THREE.Mesh(cockpit_geometry, cockpit_lambert_material);
    cockpit_sphere.userData = {lambert_material: cockpit_lambert_material, phong_material: cockpit_phong_material, toon_material: cockpit_toon_material, basic_material: cockpit_basic_material};

    cockpit_sphere.position.setY(3.6);

    const body_sphere = new THREE.Mesh(body_geometry, body_lambert_material);
    body_sphere.userData = {lambert_material: body_lambert_material, phong_material: body_phong_material, toon_material: body_toon_material, basic_material: body_basic_material};
    body_sphere.scale.set(1, 3 / 10, 1)
    body_sphere.position.setY(3);

    const spotlight_cylinder = new THREE.Mesh(spotlight_geometry, spotlight_lambert_material);
    spotlight_cylinder.userData = {lambert_material: spotlight_lambert_material, phong_material: spotlight_phong_material, toon_material: spotlight_toon_material, basic_material: spotlight_basic_material};
    spotlight_cylinder.position.setY(1.6);

    meshes.push(cockpit_sphere);
    meshes.push(body_sphere);
    meshes.push(spotlight_cylinder);
    body_sphere.receiveShadow = true;
    body_sphere.castShadow = true;
    cockpit_sphere.receiveShadow = true;
    cockpit_sphere.castShadow = true;
    spotlight_cylinder.receiveShadow = true;
    spotlight_cylinder.castShadow = true;

    const pointlight_group = new THREE.Group();

    for(let i = 0, pointlight; i < pointlight_count; i++) {
        pointlight = new THREE.Mesh(pointlight_geometry, pointlight_lambert_material);
        pointlight.userData = {lambert_material: pointlight_lambert_material, phong_material: pointlight_phong_material, toon_material: pointlight_toon_material, basic_material: pointlight_basic_material};
        pointlight.add(pointlights[i]);
        pointlight.position.set(15/ 4 * Math.sin(i / pointlight_count * 2 * Math.PI), 2.2, 15 / 4 * Math.cos(i / pointlight_count * 2 * Math.PI));
        meshes.push(pointlight);
        pointlight.receiveShadow = true;
        pointlight.castShadow = true;
        pointlight_group.add(pointlight);
    }

    ufo.add(cockpit_sphere, body_sphere, spotlight_cylinder, pointlight_group);
    return ufo;
}
function createSpotlightTarget(x, y, z) {
    // Create spotlight target
    const target_geometry = new THREE.BufferGeometry();
    const target_material = new THREE.PointsMaterial( {visible: false} );
    target_geometry.setAttribute('vertices', new THREE.BufferAttribute(new Float32Array( [0, 0, 0]), 3));
    const target = new THREE.Points(target_geometry, target_material);
    target.position.set(x, y, z);
    return target;
}
function createSpotLight(x, y, z, target) {
    const spotlight = new THREE.SpotLight(0xffffff,4,20, Math.PI / 6, 0, 0.5);
    spotlight.castShadow = true;

    // Place Spotlight on given position
    spotlight.position.set(x,y,z);

    // Set SpotLight Target
    spotlight.target = target;
    scene.add(spotlight.target);
    return spotlight;
}
function createPointLight(x, y, z, color, count) {
    const pointlights = [];

    for(let i = 0, point; i < count; i++) {
        point = new THREE.PointLight(color, 1, 12, 1);
        point.position.set(x, y, z);
        point.castShadow = true;
        point.visible = true;
        pointlights.push(point);
    }
    return pointlights;
}
////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    changeDirectionalLight();
    changeSpotLight();
    changePointLight();
    toggleStars();
    toggleFlowers();

    let delta =  clock.getDelta();
    changeMaterials();
    updateUfoPosition(delta);
    updateUfoRotation(delta);
}
function changeDirectionalLight() {
    'use strict'
    if(key_press_map[68]) {
        dirLight.visible = !dirLight.visible;
        key_press_map[68] = 0;
    }
}
function changeSpotLight() {
    'use strict'
    if(key_press_map[83]) {
        ufo.userData.spotlight.visible = !ufo.userData.spotlight.visible;
        key_press_map[83] = 0;
    }
}
function changePointLight() {
    'use strict'
    if(key_press_map[80]) {
        for (const light of ufo.userData.pointlights) light.visible = !light.visible;
        key_press_map[80] = 0;
    }
}
function toggleFlowers() {
    'use strict'
    if(key_press_map[49]) {
        if(texture_scene.userData.has_flowers){ // Destroy flowers
            texture_scene.remove(texture_scene.userData.flowers);
        } else { // Create flowers
            texture_scene.add(texture_scene.userData.flowers = createFlowers(create_flowers_args.l, create_flowers_args.w, create_flowers_args.x, create_flowers_args.y, create_flowers_args.z, create_flowers_args.count));
        }
        texture_scene.userData.has_flowers = !texture_scene.userData.has_flowers;
        renderer.setRenderTarget(everglades_texture);
        renderer.clear();
        renderer.render(texture_scene, cameras[2]);
        renderer.setRenderTarget(null);
        key_press_map[49] = 0;
    }
}
function toggleStars() {
    'use strict'
    if(key_press_map[50]) {
        if(texture_scene.userData.has_stars){ // Destroy stars
            texture_scene.remove(texture_scene.userData.stars);
        } else { // Create stars
            texture_scene.add(texture_scene.userData.stars = createStars(create_stars_args.l, create_stars_args.w, create_stars_args.x, create_stars_args.y, create_stars_args.z, create_stars_args.count));
        }
        texture_scene.userData.has_stars = !texture_scene.userData.has_stars;
        renderer.setRenderTarget(firmament_texture);
        renderer.clear();
        renderer.render(texture_scene, cameras[3]);
        renderer.setRenderTarget(null);
        key_press_map[50] = 0;
        //renderer.renderLists.dispose();
    }
}
function changeMaterials() {
    'use strict'
    if(key_press_map[81]){
        for (let i = 0; i < meshes.length; i++) meshes[i].material = meshes[i].userData.lambert_material;
        key_press_map[81] = 0;
    }
    if(key_press_map[87]) {
        for (let i = 0; i < meshes.length; i++) meshes[i].material = meshes[i].userData.phong_material;
        key_press_map[87] = 0;
    }
    if(key_press_map[69]) {
        for (let i = 0; i < meshes.length; i++) meshes[i].material = meshes[i].userData.toon_material;
        key_press_map[69] = 0;
    }
    if(key_press_map[82]) {
        for (let i = 0; i < meshes.length; i++) meshes[i].material = meshes[i].userData.basic_material;
        key_press_map[82] = 0;
    }
}
function updateUfoPosition(delta) {
    'use strict';
    compute_ufo_movement();
    ufo.userData.linear_velocity = ufo.userData.linear_velocity.multiplyScalar(delta);
    ufo.position.add(ufo.userData.linear_velocity);
    ufo.userData.spotlight_target.position.add(ufo.userData.linear_velocity);
}
function updateUfoRotation(delta) {
    'use strict';
    ufo.rotateY(ufo.userData.angular_velocity * delta);
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
/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    if(renderer.xr.isPresenting) {
        if(!presented){
            presented = true;
            scene.translateZ(-5);
            scene.translateY(-5);
        }
        cameras[1].update(cameras[4]);
        renderer.render(scene, cameras[1].cameraL);
        renderer.render(scene, cameras[1].cameraR);
    }
    else {
        renderer.render(scene, cameras[0]);
    }
}
////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setRenderTarget(null);

    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    renderer.xr.enabled = true;

    createTextures();
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

    renderer.setAnimationLoop(animate);
}
////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerWidth > 0 && window.innerHeight > 0) {
        cameras[0].aspect = window.innerWidth / window.innerHeight;
        cameras[0].updateProjectionMatrix();
        cameras[4].aspect = window.innerWidth / window.innerHeight;
        cameras[4].updateProjectionMatrix();
    }
}
///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
        // Toggle flowers
        case 49: // 1
            key_press_map[49] = 1;
            break;
        // Toggle stars
        case 50: // 2
            key_press_map[50] = 1;
            break
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
        // Change to basic material - no light calculation whatsover
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
        // Change to basic material - no light calculation whatsover
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