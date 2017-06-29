
// RenderTarget containing the transformed positions
uniform sampler2D colors;
uniform sampler2D positions;
uniform sampler2D basePositions;
uniform float pointSize;

varying vec3 vPos;
varying vec3 vColor;

void main() {
  // the mesh is a normalized square so the uvs = the xy positions of the vertices
  vec3 pos = texture2D(positions, position.xy).xyz;
  vPos = pos;
  // pos now contains a 3D position in space, we can use it as a regular vertex

  vec3 color = texture2D(colors, position.xy).xyz;
  vColor = color;

  // regular projection of our position
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

  // sets the point size
  gl_PointSize = (10.0 - length(pos.xy)) * pointSize;
}
