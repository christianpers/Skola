export const BASE_HEADER = `
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float audio_energy;
`;

export const EMPTY_WHITE = `color = vec3(1.0);`;

export const BASE_MAIN_HEADER = `
void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.);
`;

export const BASE_MAIN_FOOTER = `
	gl_FragColor = vec4(color,1.0);
}`;

export const BASE_GRADIENT = `
    color = vec3(st.x,st.y,abs(sin(u_time)));
`;

// ------- MAIN --------

export const YUV_TO_RGB_MAIN = `
// UV values goes from -1 to 1
// So we need to remap st (0.0 to 1.0)
st -= 0.5;  // becomes -0.5 to 0.5
st *= 2.0;  // becomes -1.0 to 1.0

// we pass st as the y & z values of
// a three dimensional vector to be
// properly multiply by a 3x3 matrix
color = yuv2rgb * vec3(0.5, st.x, st.y);`

// ------ FUNCTIONS -----
export const YUV_TO_RGB = `
// YUV to RGB matrix
mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983,
                    1.0, -0.39465, -0.58060,
                    1.0, 2.03211, 0.0);`

export default BASE_GRADIENT;