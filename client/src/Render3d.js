import React, {useRef, useEffect, useState} from 'react'
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"
import * as dat from 'dat.gui'

const Render3D = () => {

    const mountRef = useRef(null)
    const path = `./../../../uploads/profile4Draco.gltf`

    useEffect(() => {
        const currentRef = mountRef.current;
        const gui = new dat.GUI({ width: 400 })
        const sceneParams = {
            envMapIntensity: 0.38,
            dlColor: 0xf71257,
            alColor: 0x1ae2d8,
        }

        const {clientWidth: width, clientHeight: height} = currentRef;

        //Scene, camera, renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(10, width / height, 0.1, 100);
        scene.add(camera);
        camera.position.set(15, 5, 15);
        camera.lookAt(new THREE.Vector3());

        const renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.shadowMap.enabled = true;
        renderer.setSize(width, height);
        currentRef.appendChild(renderer.domElement);

        //OrbitControls
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.maxDistance = 30;
        orbitControls.minDistance = 1;
        orbitControls.maxPolarAngle = Math.PI * 0.5;
        orbitControls.minPolarAngle = Math.PI * 0.2;

        //Resize canvas
        const resize = () => {
            renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
            camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", resize);

        // Light
        const folderLights = gui.addFolder("Lights")

        const ambientalLight = new THREE.AmbientLight(0xffffff, 0.04);
        scene.add(ambientalLight);

        folderLights.add(ambientalLight, 'intensity')
            .min(0.001)
            .max(0.5)
            .step(0.0001)
            .name("DL Intensity")

        const pointlight = new THREE.PointLight(0xFCFFFA, 0.5);
        pointlight.position.set(5, 5, 1);
        scene.add(pointlight);

        folderLights.add(pointlight, 'intensity')
            .min(0.01)
            .max(5)
            .step(0.0001)
            .name("Point Light 1")

        const pointlight2 = new THREE.PointLight(0xffffff, 0.5);
        pointlight2.position.set(-5, 1, 1);
        scene.add(pointlight2);

        folderLights.add(pointlight2, 'intensity')
            .min(0.01)
            .max(5)
            .step(0.0001)
            .name("Point Light 2")

        //HDRI
        // new RGBELoader()
        //     .load("./../../../uploads/HDR1.hdr", function (texture){
        //         texture.mapping = THREE.EquirectangularReflectionMapping(0xf71257, 10);
        //         // scene.background = texture;
        //         scene.environment = texture;
        //     })

        const envMap = new THREE.CubeTextureLoader().load(
            [
                './envmap/px.png',
                './envmap/nx.png',
                './envmap/py.png',
                './envmap/ny.png',
                './envmap/pz.png',
                './envmap/nz.png',
            ]
        )
        scene.environment = envMap
        folderLights.add(sceneParams, 'envMapIntensity')
            .min(0)
            .max(2)
            .step(0.0001)
            .name("EnvMap Intensity")
            .onChange(() => {
                scene.traverse(child => {
                    if (child instanceof THREE.Mesh &&
                        child.material instanceof THREE.MeshStandardMaterial) {
                        child.material.envMapIntensity = sceneParams.envMapIntensity
                    }
                })
            })

        //Groups
        const det = new THREE.Group();

        //Loaders
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath("./../../../draco/")

        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        // gltfLoader.load(path, (gltf) => {
        gltfLoader.load(path, (gltf) => {
            scene.add(gltf.scene)
        })

        //Animate the scene
        const animate = () => {
            orbitControls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();


        return () => {
            window.removeEventListener("resize", resize);
            gui.destroy()
            currentRef.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div>
            <div
                className='Contenedor3D'
                ref={mountRef}
                style={{width: "100%", height: "100vh"}}
            >
            </div>
        </div>
    )
};

export default Render3D