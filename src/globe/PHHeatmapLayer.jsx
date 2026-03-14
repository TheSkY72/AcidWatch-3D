import * as THREE from "three"

export function createPHMaterial(){

  const material = new THREE.ShaderMaterial({

    uniforms: {
      ph:{value:8.1}
    },

    vertexShader:`

      varying vec2 vUv;

      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }

    `,

    fragmentShader:`

      varying vec2 vUv;
      uniform float ph;

      vec3 colorScale(float p){

        if(p > 8.1) return vec3(0.1,0.4,1.0);
        if(p > 7.9) return vec3(0.1,0.8,0.9);
        if(p > 7.8) return vec3(1.0,0.6,0.2);
        return vec3(0.9,0.1,0.1);

      }

      void main(){

        vec3 color = colorScale(ph);

        gl_FragColor = vec4(color,1.0);

      }

    `

  })

  return material

}
