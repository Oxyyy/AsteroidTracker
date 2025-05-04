import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { Raycaster, Vector2 } from 'three';

// Basiquement cette page est un copie colle de la page d'accueil, juste plus fun avec mon lien github

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threejsCanvas', { static: true }) canvasRef!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private stars!: THREE.Points;
  private earth!: THREE.Mesh;
  private robin!: THREE.Mesh;
  private capucine!: THREE.Mesh;
  private loic!: THREE.Mesh;
  private thomas!: THREE.Mesh;
  private lucas!: THREE.Mesh;
  private luigi!: THREE.Mesh;

  private raycaster = new Raycaster();
  private mouse = new Vector2();
  private time = 0;

  private planetData = {
    robin:    { radius: 25, speed: 0.004, inclination: 73 * Math.PI / 180, startAngle: 1.2 },
    capucine: { radius: 25, speed: 0.0025, inclination: 214 * Math.PI / 180, startAngle: 3.8 },
    loic:     { radius: 30, speed: 0.0015, inclination: 329 * Math.PI / 180, startAngle: 2.4 },
    thomas:   { radius: 30, speed: 0.0032, inclination: 158 * Math.PI / 180, startAngle: 0.7 },
    lucas:    { radius: 25, speed: 0.0038, inclination: 41 * Math.PI / 180, startAngle: 4.1 },
    luigi:    { radius: 30, speed: 0.0022, inclination: 287 * Math.PI / 180, startAngle: 5.5 }
  };

  ngAfterViewInit() {
    this.initThreeJS();
    this.animate();
    this.renderer.domElement.addEventListener('click', (event) => this.onClick(event));
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.camera.position.z = 50;

    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 6000; i++) {
      starVertices.push((Math.random() - 0.5) * 2000);
      starVertices.push((Math.random() - 0.5) * 2000);
      starVertices.push((Math.random() - 0.5) * 2000);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);

    const textureLoader = new THREE.TextureLoader();
    const createPlanet = (texture: string) => new THREE.Mesh(
      new THREE.SphereGeometry(10.5, 32, 32),
      new THREE.MeshBasicMaterial({ map: textureLoader.load(texture) })
    );

    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 32),
      new THREE.MeshBasicMaterial({ map: textureLoader.load('Earth.jpeg') })
    );
    this.scene.add(this.earth);

    this.robin = createPlanet('robinPlanet.png');
    this.capucine = createPlanet('capucinePlanet.png');
    this.loic = createPlanet('loicPlanet.png');
    this.thomas = createPlanet('thomasPlanet.png');
    this.lucas = createPlanet('lucasPlanet.png');
    this.luigi = createPlanet('luigiPlanet.png');

    this.scene.add(this.robin, this.capucine, this.loic, this.thomas, this.lucas, this.luigi);

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth - 15, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  private onClick(event: MouseEvent): void {
    const canvasBounds = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    this.mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.earth);

    if (intersects.length > 0) {
      window.open('https://www.google.com/maps/@43.1205514,5.9386232,384m/data=!3m1!1e3?hl=fr&entry=ttu', '_blank');
    }
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.time += 1;

    this.stars.rotation.x += 0.0004;
    this.stars.rotation.y += 0.0004;
    this.earth.rotation.y += 0.003;

    const updateOrbit = (mesh: THREE.Mesh, data: any) => {
      const angle = this.time * data.speed + data.startAngle;
      mesh.position.x = this.earth.position.x + Math.cos(angle) * data.radius;
      mesh.position.y = Math.sin(angle + data.inclination) * data.radius;
      mesh.position.z = this.earth.position.z + Math.sin(angle) * data.radius;
    };

    updateOrbit(this.robin, this.planetData.robin);
    updateOrbit(this.capucine, this.planetData.capucine);
    updateOrbit(this.loic, this.planetData.loic);
    updateOrbit(this.thomas, this.planetData.thomas);
    updateOrbit(this.lucas, this.planetData.lucas);
    updateOrbit(this.luigi, this.planetData.luigi);

    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy() {
    this.renderer.domElement.removeEventListener('click', (event) => this.onClick(event));
    this.renderer.dispose();
    this.scene.clear();

    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}