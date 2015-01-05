window.mobilecheck = function() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
return check; }

var camera, scene, renderer;
var effect, controls;
var element, container;

var clock = new THREE.Clock();

init();
animate();

function init() {

	// Rendering a stereo screen
	renderer = new THREE.WebGLRenderer();
	element = renderer.domElement;
	container = document.getElementById('example');
	container.appendChild(element);
	effect = new THREE.StereoEffect(renderer);

	// Scene & Camera with controls
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
	camera.position.set(0, 20, 0);
	scene.add(camera);
	controls = new THREE.OrbitControls(camera, element);
	controls.rotateUp(Math.PI / 4);
	controls.target.set(
		camera.position.x + 0.1,
		camera.position.y,
		camera.position.z
	);
	controls.noZoom = true;
	controls.noPan = true;

	// For mobile VR, orientation
	if(mobilecheck()){
		controls = new THREE.DeviceOrientationControls(camera, true);
		controls.connect();
		controls.update();
		element.addEventListener('click', fullscreen, false);
	}

	// Lighting
	var light = new THREE.AmbientLight(0xFFFFFF);
	scene.add(light);

	// Floor
	var texture = THREE.ImageUtils.loadTexture('textures/patterns/carpet.png');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat = new THREE.Vector2(50, 50);
	texture.anisotropy = renderer.getMaxAnisotropy();
	var material = new THREE.MeshBasicMaterial({ map: texture, side:THREE.DoubleSide });
	var geometry = new THREE.PlaneGeometry(1000, 1000);
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	scene.add(mesh);

	// Wall
	for(var i=0;i<4;i++){
		var texture = THREE.ImageUtils.loadTexture('textures/sprites/wall.png');
		var material = new THREE.MeshBasicMaterial({ map: texture, side:THREE.DoubleSide });
		var geometry = new THREE.PlaneGeometry(400, 800);
		var mesh = new THREE.Mesh(geometry, material);

		var angle = Math.PI*2*(i/4);
		var radius = 200;
		mesh.position.x = -Math.sin(angle)*radius;
		mesh.position.z = -Math.cos(angle)*radius;
		mesh.position.y = 400;
		mesh.rotation.y = angle;

		scene.add(mesh);
	}

	// A RUNNER
	// MESHES WITH ANIMATED TEXTURES!
	var runnerTexture = new THREE.ImageUtils.loadTexture('textures/sprites/bored_walk.png');
	var animation = new TextureAnimator( runnerTexture, 5, 4, 20, 40 ); // texture, #horiz, #vert, #total, duration.
	var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, side:THREE.DoubleSide } );
	runnerMaterial.transparent = true;
	runnerMaterial.depthWrite = false;
	var runnerGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
	window.runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
	runner.position.x = 0;
	runner.position.z = -100;
	runner.position.y = 25;
	runner.rotation.y = 0;
	runner.animation = animation;
	scene.add(runner);

	// A MONOLITH
	window.monos = [];
	for(var i=0;i<8;i++){
		var monoTexture = new THREE.ImageUtils.loadTexture('textures/sprites/monolith.png');
		var animation = new TextureAnimator( monoTexture, 3, 1, 3, 100 ); // texture, #horiz, #vert, #total, duration.
		var monoMaterial = new THREE.MeshBasicMaterial( { map: monoTexture, side:THREE.DoubleSide } );
		monoMaterial.transparent = true;
		monoMaterial.depthWrite = false;
		var monoGeometry = new THREE.PlaneGeometry(22, 22, 1, 1);
		var mono = new THREE.Mesh(monoGeometry, monoMaterial);
		var angle = Math.PI*2*(i/8);
		var radius = Math.random()*100+50;
		mono.position.x = -Math.sin(angle)*radius;
		mono.position.z = -Math.cos(angle)*radius;
		mono.position.y = 11;
		mono.rotation.y = angle;
		mono.animation = animation;
		mono.animation.currentTile = Math.floor(Math.random()*3);
		window.monos.push(mono);
		scene.add(mono);
	}

	// Resize screen
	window.addEventListener('resize', resize, false);
	setTimeout(resize, 1);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  effect.setSize(width, height);
}

var runAngle = 0;
function update(dt) {
  resize();

  camera.updateProjectionMatrix();
  runner.animation.update(dt*1000);
  for(var i=0;i<8;i++){
  	monos[i].animation.update(dt*1000);
  }

  runAngle-=0.005;
  runner.rotation.y = runAngle;
  runner.position.z = -Math.cos(runAngle)*100;
  runner.position.x = -Math.sin(runAngle)*100;

  controls.update(dt);
}

function render(dt) {
  effect.render(scene, camera);
}

function animate(t) {
  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}


///////////////////


function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
{	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1/this.tilesHorizontal, 1/this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;
		
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if(this.currentTile==this.numberOfTiles){
				this.currentTile=0;
			}
			var currentColumn = this.currentTile % this.tilesHorizontal;
			var currentRow = (this.tilesVertical-1) - Math.floor(this.currentTile/this.tilesHorizontal);
			texture.offset.x = currentColumn / this.tilesHorizontal;
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}		

