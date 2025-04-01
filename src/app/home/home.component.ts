import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { ApiService } from '../api.service';
import { Raycaster, Vector2 } from 'three';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('threejsCanvas', { static: true }) canvasRef!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private stars!: THREE.Points;
  private earth!: THREE.Mesh;
  private moon!: THREE.Mesh;
  private moonOrbitAngle: number = 0;
  private moonInclination: number = 5 * (Math.PI / 180);

  private raycaster = new Raycaster();
  private mouse = new Vector2();

  nearEarthObjectCount!: number;
  closeApproachCount!: number;
  lastUpdated!: string;

  constructor(private apiService: ApiService) {}

  ngAfterViewInit() {
    console.log('HeaderComponent initialized - TypeScript is running');
    //Mon Observable pour choper les stats
    this.apiService.getAsteroidStats().subscribe((data: any) => {
      this.nearEarthObjectCount = data.near_earth_object_count;
      this.closeApproachCount = data.close_approach_count;
      this.lastUpdated = data.last_updated;

      this.renderer.domElement.addEventListener('click', (event) => this.onClick(event));
    });

    //Les Initialisations de ThreeJS
    this.initThreeJS();
    this.animate();
  }


  //La Partie Dessin
  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Create stars
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

    // Create Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(10, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('Earth.jpeg'); // Use a local texture file
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
    this.scene.add(this.earth);

    // Create Moon Sphere
    const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const moonTexture = textureLoader.load('moon.jpeg'); 
    const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
    this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
    this.scene.add(this.moon);

    this.camera.position.z = 50;

    // Adjust canvas size on window resize
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth - 15, window.innerHeight); // Si on veut garder de la place, on enleve ici (100 - 150)
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  private onClick(event: MouseEvent): void {
    
    const canvasBounds = this.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    this.mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    // Détecter les objets sous la souris
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.earth);

    if (intersects.length > 0) {
        window.open('https://www.google.com/maps/@43.1205514,5.9386232,384m/data=!3m1!1e3?hl=fr&entry=ttu&g_ep=EgoyMDI1MDMyNS4xIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D', '_blank'); // Ouvre Google Maps
    }
}

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.stars.rotation.x += 0.0004;
    this.stars.rotation.y += 0.0004;
    this.earth.rotation.y += 0.003;

    this.moonOrbitAngle -= 0.001;
    this.moon.position.x = this.earth.position.x + Math.cos(this.moonOrbitAngle) * 60;
    this.moon.position.y = Math.cos(this.moonOrbitAngle + this.moonInclination) * 15;
    this.moon.position.z = this.earth.position.z + Math.sin(this.moonOrbitAngle) * 60;
    this.moon.rotation.y += 0.001;

    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy() {
    // Clean up the event listener to prevent memory leaks
    this.renderer.domElement.removeEventListener('click', (event) => this.onClick(event));
    this.renderer.dispose();
    this.scene.clear();

    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}

