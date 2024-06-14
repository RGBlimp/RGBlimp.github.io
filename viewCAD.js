import * as THREE from './build/three.module.js';

    import Stats from './jsm/libs/stats.module.js';

    import { OrbitControls } from './jsm/controls/OrbitControls.js';
    import { FBXLoader } from './jsm/loaders/FBXLoader.js';
    var threeobjrct;
    var count = 0.003;
    var container, stats, controls;
    var camera, scene, renderer, light;

    var clock = new THREE.Clock();

    var mixer;

    init();
    animate();

    function init() {
      container = document.getElementById('contains')
      // container = document.createElement( 'div' );
      // document.body.appendChild( container );

      camera = new THREE.PerspectiveCamera( 45, 1, 1, 2000 );
      camera.position.set( -0, -25, 310 );

      scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xffffff);
      // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

      light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
      light.position.set( 0, 1, 0 );
      scene.add( light );

      light = new THREE.DirectionalLight( 0xffffff );
      light.position.set( 0, 100, 10 );
      light.castShadow = true;
      light.shadow.camera.top = 180;
      light.shadow.camera.bottom = - 100;
      light.shadow.camera.left = - 120;
      light.shadow.camera.right = 120;
      scene.add( light );

      // scene.add( new CameraHelper( light.shadow.camera ) );

      // ground
      var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
      mesh.rotation.x = - Math.PI / 2;
      mesh.receiveShadow = true;
      scene.add( mesh );

      var grid = new THREE.GridHelper( 2000, 20, 0x999999, 0x999999 );
      grid.material.opacity = 0;
      grid.material.transparent = true;
      scene.add( grid );

      // model
      var loader = new FBXLoader();
      loader.load( './static/model/1.fbx', function ( object ) {
        console.log(object);
        threeobjrct=object;
        object.scale.set(800,800,800)
        object.rotation.set(-180/360*Math.PI,0,-180/360*Math.PI)
        object.position.set(0,30,0)
        object.traverse( function ( child ) {

          if ( child.isMesh ) {

            child.castShadow = false;
            child.receiveShadow = false;

          }

        } );

        scene.add( object );

      } );

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( 500*0.5, 500 );
      camera.aspect =250/500;
      camera.updateProjectionMatrix();
      renderer.shadowMap.enabled = true;
      container.appendChild( renderer.domElement );

      controls = new OrbitControls( camera, renderer.domElement );
      controls.target.set( 0, 0, 0 );
      controls.enableRotate=true
      controls.enableZoom=true
      controls.enablePan=false
      controls.update();
      

      window.addEventListener( 'resize', onWindowResize, false );

      // // stats
      // stats = new Stats();
      // container.appendChild( stats.dom );

    }

    function onWindowResize() {

      renderer.setSize( 500*0.5, 500 );
      camera.aspect =250/500;
      camera.updateProjectionMatrix();

    }

    //

    function animate() {

      requestAnimationFrame( animate );

      if(controls.enableRotate){
        threeobjrct.rotation.z += count
      }

      renderer.render( scene, camera );

      stats.update();

    }

    function startroate(){

      controls.enableRotate =false
    }

    function stoproate(){

    }
    scene.element.addEventListener('mouseover' , startroate, false);
    renderer.domElement.addListener('mouseout',stoproate)
    renderer.domElement.removeAttribute('tabindex')