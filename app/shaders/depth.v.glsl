uniform sampler2D positions;
uniform sampler2D basePositions;
uniform float pointSize;


void main()	{
  // the mesh is a normalized square so the uvs = the xy positions of the vertices
  vec3 pos = texture2D(positions, position.xy).xyz;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;

  // sets the point size
  gl_PointSize = (5.0 - length(pos.xy)) * pointSize;
}
