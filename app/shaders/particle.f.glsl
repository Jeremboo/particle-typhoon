varying vec3 vPos;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4( vColor, 1.0 );
  // gl_FragColor = vec4( vColor, vPos.z - 0.2 );
}
