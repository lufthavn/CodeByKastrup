function cubes(){
			var container, stats;
			var camera, scene, raycaster, renderer;

			var mouse = new THREE.Vector2(), INTERSECTED;
			var radius = 100, theta = 0;

			var shrinkingObjects = [];

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.getElementById("cubes").appendChild( container );

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

				scene = new THREE.Scene();

				var light = new THREE.DirectionalLight( 0xffffff, 1 );
				light.position.set( 1, 1, 1 ).normalize();
				scene.add( light );

				var otherlight = new THREE.DirectionalLight(0xffffff, 1);
				otherlight.position.set(-800, -800, -800).normalize();
				scene.add(otherlight);

				var geometry = new THREE.BoxGeometry( 20, 20, 20 );

				for ( var i = 0; i < 2000; i ++ ) {

					var value = Math.random() * 0xFF | 0xcc;
					var grayscale = (value << 16) | (value << 8) | value;

					var material = new THREE.MeshLambertMaterial( { color:  grayscale } );
					material.transparent = true;
					material.opacity = 0.95;

					var object = new THREE.Mesh( geometry, material);

					object.position.x = Math.random() * 800 - 400;
					object.position.y = Math.random() * 800 - 400;
					object.position.z = Math.random() * 800 - 400;

					object.rotation.x = Math.random() * 2 * Math.PI;
					object.rotation.y = Math.random() * 2 * Math.PI;
					object.rotation.z = Math.random() * 2 * Math.PI;

					object.scale.x = Math.random() + 0.5;
					object.scale.y = Math.random() + 0.5;
					object.scale.z = Math.random() + 0.5;

					scene.add( object );

				}

				raycaster = new THREE.Raycaster();

				renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0xf0f0f0 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.sortObjects = false;

				var rendererElement = renderer.domElement;
				rendererElement.id = "render-canvas";
				container.appendChild(rendererElement);
				renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );
				window.addEventListener("mousedown", onMouseDown, false);

			}

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				event.preventDefault();
				var canvas = document.getElementById("render-canvas");
				var top = canvas.getBoundingClientRect().top;

				mouse.x = ( event.clientX  / window.innerWidth ) * 2 - 1;
				mouse.y = - (( event.clientY - top ) / window.innerHeight ) * 2 + 1;

			}

			function onMouseDown(event){
				if(INTERSECTED)
				{
					shrinkingObjects.push(INTERSECTED);
				}
			}

			function animate() {

				requestAnimationFrame( animate );
				render();

			}


			function render() {

				theta += 0.15;

				camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
				camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
				camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
				camera.lookAt( scene.position );

				camera.updateMatrixWorld();

				// find intersections

				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( scene.children );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						if ( INTERSECTED ) {
							INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
						}

						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
						INTERSECTED.material.emissive.setHex( 0xff0000 );
						

					}

				} else {

					if ( INTERSECTED ) {
						INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
					}

					INTERSECTED = null;

				}

				for(i = 0; i < shrinkingObjects.length; i++)
				{
					var so = shrinkingObjects[i];
					so.scale.x = so.scale.x / 1.02;
					so.scale.y = so.scale.y / 1.02;
					so.scale.z = so.scale.z / 1.02;

					var box = new THREE.Box3().setFromObject(so);
					if(box.size().x < 1)
					{
						scene.remove(so);
						shrinkingObjects.splice(i, 1);
						console.log("removed element " + i);
					}

				}

				renderer.render( scene, camera );

			}
		}