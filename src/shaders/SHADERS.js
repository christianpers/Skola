export const PARTICLES_VERTEX = `
    attribute float size;
    varying vec3 vColor;
    void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        // gl_PointSize = size * ( 3.0 / -mvPosition.z );
        gl_PointSize = size;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

export const PARTICLES_FRAGMENT = `
    // uniform sampler2D texture;
    varying vec3 vColor;
    // struct PointLight {
    //     vec3 color;
    //     vec3 position; // light position, in camera coordinates
    //     float distance; // used for attenuation purposes. Since
    //                     // we're writing our own shader, it can
    //                     // really be anything we want (as long
    //                     // as we assign it to our light in its
    //                     // "distance" field
    // };
    
    // uniform PointLight pointLights[NUM_POINT_LIGHTS];
    void main() {
        gl_FragColor = vec4( vColor, 1.0 );
        // gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
    }
`;

export const CANVAS_RENDER_VERTEX = `
#ifdef GL_ES
precision mediump float;
#endif
	uniform float time;
	uniform vec2 resolution;
	void main()	{
		gl_Position = vec4( position, 1.0 );
	}
`;

export const CANVAS_RENDER_FRAGMENT = `
#ifdef GL_ES
precision mediump float;
#endif
	uniform float time;
	uniform vec2 resolution;
	uniform sampler2D u_texture0;
    uniform sampler2D u_texture1;
	uniform vec2 u_res;
	uniform float u_connection0;
    uniform float u_connection1;
    uniform float u_finalConnection;
    uniform float u_multiConnection;
	void main()	{
		vec2 st = gl_FragCoord.xy/u_res.xy;
		vec4 bgColor = texture2D(u_texture0, st);
        vec4 fgColor = texture2D(u_texture1, st);
		vec4 whiteColor = vec4(1., 1., 1., 1.);
        vec4 transparentColor = vec4(1.0, 1.0, 1.0, 0.0);
        vec4 finalFgColor = mix(transparentColor, fgColor, u_connection1);
        vec4 finalBgColor = mix(transparentColor, bgColor, u_connection0);
        
        float ra = (finalFgColor.a) * finalFgColor.r + (1.0 - finalFgColor.a) * finalBgColor.r;
        float ga = (finalFgColor.a) * finalFgColor.g + (1.0 - finalFgColor.a) * finalBgColor.g;
        float ba = (finalFgColor.a) * finalFgColor.b + (1.0 - finalFgColor.a) * finalBgColor.b;

        vec4 overlayColor = vec4(ra, ga, ba, 1.0);

        vec4 finalColor = mix(fgColor + bgColor, overlayColor, u_multiConnection);

        gl_FragColor = mix(whiteColor, finalColor, u_finalConnection);
	} 

`;


export const BASE_MAIN_HEADER = `
void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(1.);
`;

export const BASE_MAIN_FOOTER = `
	gl_FragColor = vec4(color,1.0);
}`;

// ------- MAIN --------

export const YUV_TO_RGB_MAIN = `
// UV values goes from -1 to 1
// So we need to remap st (0.0 to 1.0)
st -= 0.5;  // becomes -0.5 to 0.5
st *= 2.0;  // becomes -1.0 to 1.0

// we pass st as the y & z values of
// a three dimensional vector to be
// properly multiply by a 3x3 matrix
color *= yuv2rgb * vec3(0.5, st.x, st.y);`;

export const CIRCLE_SHAPE_MAIN = `
	vec2 center_st = vec2(0.5)-st;
	color *= (vec3(1.0) * shapeBorderCircle(center_st,0.6,0.06));
`;

export const LAVA_SHAPE_MAIN = `
    
    // float u_user_speed3 = 0.500;
    // float u_user_pattern_scale = -0.294;
    // float u_user_scale = 6.632;
    // float u_user_rotation = 0.804;
    // float u_user_speed2 = 0.028;
    // float u_user_blur = 0.7;
    // vec3 u_user_color1 = vec3(0.256,0.351,0.620);
    // vec3 u_user_color2 = vec3(1.000,0.420,0.420);
    
    
    // vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    color = vec3(0.0);
    vec2 pos = vec2(st*u_user_scale);

    float DF = 0.0;

    
    // Add a random position
    float a = 0.0;
    vec2 vel = vec2(u_time*u_user_speed3);
    DF += snoise(pos+vel)*u_user_pattern_scale+.25;

    // Add a random position
    a = snoise(pos*vec2(cos(u_time*.15),sin(u_time*u_user_rotation))*u_user_speed2)*3.405;
    vel = vec2(cos(a),sin(a));
    DF += snoise(pos+vel)*.25+.25;

    color = vec3( smoothstep(u_user_blur,.75,fract(DF)) );
    
    color = mix(u_user_color1, u_user_color2, color);
`;

export const VORONOI_MAIN = `
    // vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    color = vec3(.0);
    
    // Scale 
    st *= 5.;
    
    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 10.;  // minimun distance
    vec2 m_point;        // minimum point
    
    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5*sin(u_time + 6.2831*point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            if( dist < m_dist ) {
                m_dist = dist;
                m_point = point;
            }
        }
    }

    // Assign a color using the closest point position
    color += dot(m_point,vec2(0.30,0.60));
    
    // Add distance field to closest point center 
    color.g = m_dist;

    // Show isolines
    //color -= abs(sin(40.0*m_dist*(u_mouse.x/u_resolution.x)))*0.07;
    
    color = mix(u_user_fgColor, u_user_bgColor, m_dist);
    //color *= vec3(.2, .6, .8);
`;

export const GRADIENT_MAIN = `
	color *= vec3(st.x,st.y,abs(sin(u_time)));
`;

// ------ BASE SHADER -----

export const BASE_SHADER = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//CIRCLE
uniform float u_noise_amount;

//LAVA
uniform float u_user_speed3;
uniform float u_user_pattern_scale;
uniform float u_user_scale;
uniform float u_user_rotation;
uniform float u_user_speed2;
uniform float u_user_blur;
uniform vec3 u_user_color1;
uniform vec3 u_user_color2;

//VORONOI
uniform vec3 u_user_fgColor;
uniform vec3 u_user_bgColor;

// YUV to RGB matrix
mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983,
                    1.0, -0.39465, -0.58060,
                    1.0, 2.03211, 0.0);

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float shapeCircle(vec2 st, float radius) {
	//st = vec2(0.5)-st;
    float r = length(st)*2.0;
    float a = atan(st.y,st.x);
    float m = abs(mod(a+u_time*2.080,3.14*2.0)-3.14)/3.688;
    float f = radius;
    float mod1 = radius;
    m += noise(st+u_time*0.1)*.5;
    mod1 = sin(a*50.000)*noise(st+u_time*0.536)*0.156;
    mod1 += (sin(a*20.000)*0.116*pow(m,1.576));
    f += mod1 * u_noise_amount;
    return 1.-smoothstep(f,f+0.007,r);
}

float shapeBorderCircle(vec2 st, float radius, float width) {
    return shapeCircle(st,radius) - shapeCircle(st,radius-width);
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
`;

export default BASE_SHADER;