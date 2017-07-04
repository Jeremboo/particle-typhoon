
// RenderTarget containing the transformed positions
uniform sampler2D colors;
uniform sampler2D positions;
uniform sampler2D basePositions;
uniform float pointSize;

varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vPos;

#include <shadowmap_pars_vertex>

void main() {

  // the mesh is a normalized square so the uvs = the xy positions of the vertices
  vec3 pos = texture2D(positions, position.xy).xyz;
  vPos = pos;
  vNormal = normalize( pos );
  // pos now contains a 3D position in space, we can use it as a regular vertex

  vec3 color = texture2D(colors, position.xy).xyz;
  vColor = color;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);

  // regular projection of our position
  gl_Position = projectionMatrix * viewMatrix * worldPosition;

  // sets the point size
  gl_PointSize = (10.0 - length(pos.xy)) * pointSize;

  #include <shadowmap_vertex>
}


// varying vec3 vViewPosition;
// #ifndef FLAT_SHADED
// 	varying vec3 vNormal;
// #endif
// #include <common>
// #include <uv_pars_vertex>
// #include <uv2_pars_vertex>
// #include <displacementmap_pars_vertex>
// #include <envmap_pars_vertex>
// #include <color_pars_vertex>
// #include <fog_pars_vertex>
// #include <morphtarget_pars_vertex>
// #include <skinning_pars_vertex>
// #include <logdepthbuf_pars_vertex>
// #include <clipping_planes_pars_vertex>
//
//
// // RenderTarget containing the transformed positions
// uniform sampler2D colors;
// uniform sampler2D positions;
// uniform float pointSize;
//
// varying vec3 vColor;
// // varying vec3 vNormal;
// varying vec3 vPos;
//
// #include <shadowmap_pars_vertex>
//
// void main() {
//
//
//   // the mesh is a normalized square so the uvs = the xy positions of the vertices
//   vec3 pos = texture2D(positions, position.xy).xyz;
//   vPos = pos;
//   // vNormal = normalize( pos );
//   // pos now contains a 3D position in space, we can use it as a regular vertex
//
//   vec3 color = texture2D(colors, position.xy).xyz;
//   vColor = color;
//
//   #include <uv_vertex>
//   #include <uv2_vertex>
//   #include <color_vertex>
//   #include <beginnormal_vertex>
//   #include <morphnormal_vertex>
//   #include <skinbase_vertex>
//   #include <skinnormal_vertex>
//   #include <defaultnormal_vertex>
//   #ifndef FLAT_SHADED
//   vNormal = normalize( transformedNormal );
//   #endif
//   // BEGIN
//   vec3 transformed = vec3(pos);
//   // SKINNING
//   #include <skinning_vertex>
//   // DISPLACEMENT
//   #include <displacementmap_vertex>
//   // PROJECT
//   #include <project_vertex>
//   // LOGDE
//   #include <logdepthbuf_vertex>
//   // CLIPPING
//   #include <clipping_planes_vertex>
//   // vViewPosition = - mvPosition.xyz;
//   #include <worldpos_vertex>
//   #include <shadowmap_vertex>
//
//   gl_PointSize = (10.0 - length(pos.xy)) * pointSize;
// }
