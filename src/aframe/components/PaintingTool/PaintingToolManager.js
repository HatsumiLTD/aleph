// @ts-nocheck
import { Vector3 } from "three";
import "./PaintingToolMeshLine";
import { jsonpreset } from "./Presets";

/**
 * @constructs ShaderHolder this should be where we load ALL shaders
 * @param {String} _name the shadername
 */
export class ShaderHolder {
    constructor(_name) {
        THREE.ShaderChunk["MathRand"] = [
            "float Rand(vec2 co, vec2 amount){return fract(sin(dot(co.xy ,vec2(122.78, 118.92)*amount.x)) + cos(dot(co.xy ,vec2(122.78, 118.92)*amount.y)  ));}"
        ].join("\r\n");
        THREE.ShaderChunk["MathNoise"] = [
            "lowp vec3 permute(in lowp vec3 x) { return mod( x*x*34.+x, 289.); }",
            "lowp float snoise(in lowp vec2 v) {",
            "lowp vec2 i = floor((v.x+v.y)*.36602540378443 + v),",
            "x0 = (i.x+i.y)*.211324865405187 + v - i;",
            "lowp float s = step(x0.x,x0.y);",
            "lowp vec2 j = vec2(1.0-s,s),",
            "x1 = x0 - j + .211324865405187, ",
            "x3 = x0 - .577350269189626; ",
            "i = mod(i,289.);",
            "lowp vec3 p = permute( permute( i.y + vec3(0, j.y, 1 ))+ i.x + vec3(0, j.x, 1 )   ),",
            "m = max( .5 - vec3(dot(x0,x0), dot(x1,x1), dot(x3,x3)), 0.),",
            "x = fract(p * .024390243902439) * 2. - 1.,",
            "h = abs(x) - .5,",
            "a0 = x - floor(x + .5);",
            "return .5 + 65. * dot( pow(m,vec3(4.))*(- 0.85373472095314*( a0*a0 + h*h )+1.79284291400159 ), a0 * vec3(x0.x,x1.x,x3.x) + h * vec3(x0.y,x1.y,x3.y));",
            "}"
        ].join("\r\n");
        THREE.ShaderChunk["Line_pressure"] = [
            "float _pressure = 0.01;",
            "for(int i = 0; i < 20; i++){",
            "float perc = float(i)/float(20);",
            "float arryDist = clamp(1.0-(abs(vUV.x-perc)*20.0),0.0,1.);",
            "_pressure += pressures[i]*(arryDist);",
            "}"
        ].join("\r\n");
        THREE.ShaderChunk["Line_ends"] = [
            "float lineEnds = smoothstep(0.0,0.1, vUV.x);",
            "lineEnds *= smoothstep( 1.,0.8, clamp(vUV.x/lengthNormal, 0.0, 1.));",
            "c.a *= lineEnds;"
        ].join("\r\n");
        THREE.ShaderChunk["Line_Width_ends"] = [
            "float lineEnds = smoothstep(0.0,0.05, vUV.x);",
            "lineEnds *= smoothstep( 1.,0.8, clamp(vUV.x/lengthNormal, 0.0, 1.));",
            "float endswidth = lineEnds;"
        ].join("\r\n");
        THREE.ShaderChunk["basevertext"] = [
            "varying vec2 vUV;",
            "varying vec3 zdist;",
            "varying vec3 wrldpos;",
            "varying vec3 _normal;",
            "varying vec3 _wrldNormal;",
            "void main(void) {",
            "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
            "  vUV = uv;",
            "  vec4 worldPosition = (modelMatrix * vec4(position, 1.));",
            "  wrldpos = worldPosition.xyz;",
            "  zdist = gl_Position.xyz;",
            "_normal = normal.xyz;// * vec4(position, 1.0);",
            "_wrldNormal = normalMatrix * normalize(normal);",
            "}"
        ].join("\r\n");
        THREE.ShaderChunk["basevertextFresnal"] = [
            "varying vec2 vUV;",
            "varying vec3 zdist;",
            "varying vec3 wrldpos;",
            "varying vec3 _normal;",
            "varying vec3 _wrldNormal;",
            "varying float _fresnal;",
            "void main(void) {",
            "  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
            "  vec4 worldPosition = (modelMatrix * vec4(position, 1.));",
            "  vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",
            "  vec3 I = worldPosition.xyz - cameraPosition;",
            "float fresnelBias = 0.001;",
            "float fresnelScale = 0.9;",
            "float fresnelPower = 1.93;",
            " _fresnal = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );",
            "  gl_Position = projectionMatrix * mvPosition;",
            "  vUV = uv;",
            "  wrldpos = worldPosition.xyz;",
            "  zdist = gl_Position.xyz;",
            "_normal = normal.xyz;// * vec4(position, 1.0);",
            "_wrldNormal = worldNormal;",
            "}"
        ].join("\r\n");
        THREE.ShaderChunk["basefragmentVars"] = [
            "varying vec2 vUV;",
            "uniform sampler2D map;",
            "uniform vec3 colour;",
            "uniform float threshhold;",
            "varying vec3 zdist;",
            "varying vec3 wrldpos;",
            "varying vec3 _normal;",
            "uniform float time;",
            "uniform float lengthNormal;",
            "varying vec3 _wrldNormal;",
            " "
        ].join("\r\n");
        THREE.ShaderChunk["baseLinefragmentVars"] = [
            "",
            THREE.ShaderChunk.fog_pars_fragment,
            THREE.ShaderChunk.logdepthbuf_pars_fragment,
            "",
            "uniform sampler2D map;",
            "uniform sampler2D alphaMap;",
            "uniform float useMap;",
            "uniform float useAlphaMap;",
            "uniform float useDash;",
            "uniform float dashArray;",
            "uniform float dashOffset;",
            "uniform float dashRatio;",
            "uniform float visibility;",
            "uniform float alphaTest;",
            "uniform vec2 repeat;",
            "uniform float time;",
            "uniform float lengthNormal;",
            "uniform float speed;",
            "uniform float pressure;",
            "uniform vec3 color;",
            "uniform vec3 altcolor;",
            "",
            "varying vec2 vUV;",
            "varying vec4 vColor;",
            "varying float vCounters;",
            "varying vec3 wrldpos;",
            "varying vec3 zdist;",
            "varying float lwidth;",
            "uniform float pressures[20];",
            ""
        ].join("\r\n");
        //----------------------------
        this.vertexShader = [THREE.ShaderChunk.basevertext].join("\n");
        this.fragmentShader = [
            THREE.ShaderChunk.basefragmentVars,
            "void main() {",
            "vec4 tex = texture2D(map,vec2(vUV.x ,vUV.y));",
            "gl_FragColor =vec4(tex.rgb, 1.0);",
            "}"
        ].join("\n");
        //----------------------------
        if (_name == "spikeDisplacment") {
            this.vertexShader = [
                "varying vec2 vUV;",
                "varying vec3 zdist;",
                "varying vec3 wrldpos;",
                THREE.ShaderChunk.MathNoise,
                "void main(void) {",
                "float b = snoise(position.xz*3.0 );",
                "float displacement = b;",
                "vec3 newPosition = position + normal * displacement;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );",
                // '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
                "  vUV = uv;",
                "  vec4 worldPosition = (modelMatrix * vec4(position, 1.));",
                "  wrldpos = worldPosition.xyz;",
                "  zdist = gl_Position.xyz;",
                "}"
            ].join("\n");
        }
        if (_name == "AnimatedMaterial") {
            this.fragmentShader = [
                THREE.ShaderChunk.basefragmentVars,
                "float snoise(vec3 uv, float res){ vec3 s = vec3(1e0, 1e2, 1e3);uv *= res;vec3 uv0 = floor(mod(uv, res))*s;vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;vec3 f = fract(uv); f = f*f*(3.0-2.0*f);vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);vec4 r = fract(sin(v*1e-1)*1e3);float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);return mix(r0, r1, f.z)*2.-1.;}",
                "void main() {",
                "float off_y = -time;",
                // sample
                " vec2 uv = vUV;",
                " vec3 col = vec3(1.0,1.0,1.0);",
                "vec2 p = vUV - vec2(0.5, 0.5);",
                "float flameDisplacement = max(0.0, (zdist.z)+sin(time * .6242*2.0 + (p.y * 5.0)) * 0.3 * pow(uv.y - 0.1, 1.5));",
                "p.x += flameDisplacement;",
                "p.x += p.x / pow((1.0 - p.y), 0.97);",
                "float color = 3.0 - (3.*length(2.*p));",
                "vec3 coord = vec3(atan(p.x,p.y)/6.2832+.5, length(p)*.4, .5);",
                "for(int i = 0; i < 1; i++){",
                "float power = pow(2.0, float(2+i));",
                "float sintime = time*((5.0-wrldpos.z)*0.9);//abs(sin(time * 3.141));",
                "color += (1.5 / power) * snoise(coord + vec3(0.,-sintime*.05, sintime*.01), power*6.);",
                "}",
                "float alph = clamp( (1.0-zdist.z)* color * ((5.0-wrldpos.z)*0.2),0.0,1.);",
                "if(alph <0.1){discard;}",
                "if(color <0.1){discard;}",
                "float g = clamp(pow(max(color,0.),2.)*0.4,0.0,1.0);",
                "float b = clamp(pow(max(color,0.),3.)*0.15,0.0,1.0);",
                "vec3 _col = colour * vec3(clamp(color,0.0,1.0), g, b );",
                // 'vec3 _col = vec3(1.0,1.0,1.0);',
                "gl_FragColor =vec4(_col.rgb, alph);",
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedLava") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                THREE.ShaderChunk.MathNoise,
                "uniform vec4 linecolour;",
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                " vec2 uv = vUV;",
                " vec3 col = vec3(1.0,1.0,1.0);",
                "    vec4 c = vec4(1.0);",
                "    vec2 finnaluvpos = vUV * repeat ;",
                "vec2 p = finnaluvpos - vec2(0.5, 0.5);",
                //  float rocks = pow( snoise( float2(finnaluvpos.x*0.5,i.vUV.y)*0.1),4.f)*4.0f;

                "float rocks = pow( snoise( vec2(finnaluvpos.x*0.5,vUV.y)*1.6),4.0)*4.0;//pow(snoise(finnaluvpos * vec2(6.,4.0) ),4.)*4.0;",
                THREE.ShaderChunk.Line_Width_ends,
                "if( distance(vUV.y,0.5)*2.0 > endswidth ) discard;",
                "rocks = clamp(rocks+(1.0-endswidth), 0.0,1.0);",
                "float power = 2.10;",
                "float centerDist = 1.0-distance(vUV.y,0.5);",
                "finnaluvpos.x -= time ;",
                "finnaluvpos.y -= time ;",
                "vec4 colourmap = texture2D( map, finnaluvpos );",
                "float grey = (colourmap.r+colourmap.b+colourmap.g) ;",
                "if( useDash == 1. ){",
                "    c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));",
                "}",
                "float vignette = smoothstep(1.3-0.9, 1.3, centerDist);",
                " c.rgb *= colourmap.rgb;",
                " c.rgb *= vignette;",
                " if( c.r+(1.0-rocks) < 0.084 ) discard;",
                //THREE.ShaderChunk.Line_pressure,
                "float pressureRange = 1.0;//(1.-_pressure);",
                // ' vec3 colourMix = mix(color.rgb, altcolor.rgb, grey);',//old way
                " vec3 colourMix = mix(vec3(pressureRange),color.rgb, grey);",
                " c.rgb = colourMix * (rocks/(1.3-vignette));",
                // THREE.ShaderChunk.Line_ends,
                "    gl_FragColor = c;",
                "    gl_FragColor.a *= step(vCounters, visibility);",
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "AnimatedWind") {
            this.fragmentShader = [
                THREE.ShaderChunk.basefragmentVars,
                THREE.ShaderChunk.MathRand,
                "void main() {",
                " vec4 tex = texture2D(map,vec2(vUV.x ,vUV.y));",
                "float randPos = Rand(vec2(wrldpos.z,wrldpos.y), vec2(0.002, 0.001));",
                "float rtime =  mod( time-(randPos), 1.0);",
                "if(tex.b>0.02)discard;",
                // 'if(tex.r<0.01) discard;',
                // 'if(rtime<0.5){if(tex.r> rtime*2.0) discard;}',
                // 'if(rtime>0.5){if(tex.r < (rtime-0.5)*2.0) discard;}',
                "float distcol = abs((tex.r)-(rtime));",
                "float loopgtime = 0.5-abs(rtime-0.5);",
                "if(distcol>loopgtime*0.2) discard;",
                "gl_FragColor = vec4( colour.rgb, 0.5);",
                // 'gl_FragColor = vec4( vec3((wrldpos.y/5.0),0.0,0.0), tex.a);',
                "}"
            ].join("\n");
        }
        if (_name == "Ice") {
            this.vertexShader = [THREE.ShaderChunk.basevertextFresnal].join("\n");
            this.fragmentShader = [
                THREE.ShaderChunk.basefragmentVars,
                THREE.ShaderChunk.MathNoise,
                "varying float _fresnal;",
                "void main() {",
                "float _static = snoise( vUV*(40.0) )*0.2;",
                // 'float _statica = snoise( vUV*(20.0) + vec2(zdist.x,zdist.y*_normal.y)*2.0 )*0.2;',
                // 'vec4 tex = vec4(vec3(0.4+(_statica*3.0)),_statica);',
                "vec4 tex = texture2D(map,(vec2(vUV.x ,vUV.y)*4.0)-(vec2(zdist.x,zdist.y*_normal.y))*0.05);",
                "float snow = smoothstep(0.4, 0.5,_wrldNormal.y+_static);",
                "float base = smoothstep(0.8, 0.9,_wrldNormal.y);",
                "float fresnl = clamp(clamp(_fresnal, 0.0, 1.0 )*tex.a*2.0+snow, 0.0, 1.0 );",
                "gl_FragColor = vec4( vec3(fresnl) * tex.rgb * colour.rgb + vec3(snow)+vec3(base), fresnl);",
                // 'gl_FragColor = vec4( vec3((_fresnal),0.0,0.0), tex.a);',
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedCloud") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                "uniform vec4 linecolour;",
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                " vec2 uv = vUV;",
                " vec3 col = vec3(1.0,1.0,1.0);",
                "    vec4 c = vec4(1.0);",
                "    vec2 finnaluvpos = vUV * repeat ;",
                "vec2 p = finnaluvpos - vec2(0.5, 0.5);",
                "float power = 2.10;",
                "    float centerDist = 1.0-distance(vUV.y,0.5);",
                "    finnaluvpos.x -= time ;",
                "    finnaluvpos.y -= sin((finnaluvpos.x*6.284)+(time*3.141*2.0))*0.1;",
                "    vec4 colourmap = texture2D( map, finnaluvpos );",
                // '    vec4 colourmapA = texture2D( map, finnaluvpos + vec2(0.0, 0.5-time));',
                // '    colourmap *= colourmapA;',
                "    float grey = (colourmap.r+colourmap.b+colourmap.g) ;",
                "float vignette = smoothstep(1.3-0.9, 1.3, centerDist);",
                "   c = colourmap * vec4(color.rgb,1.0);",
                THREE.ShaderChunk.Line_ends,
                "    gl_FragColor = c;",
                // '    gl_FragColor.a *= step(vCounters, colourmap.a);',
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedClouds") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                THREE.ShaderChunk.MathNoise,
                "uniform vec4 linecolour;",
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                " vec2 uv = vUV;",
                " vec3 col = vec3(1.0,1.0,1.0);",
                "    vec4 c = vec4(1.0);",
                "    vec2 finnaluvpos = vUV * repeat ;",
                "    finnaluvpos.y -= sin((finnaluvpos.x*6.284)+(time*6.284))*0.1;",
                "float loopgtime = sin((time-0.5)*6.284);",
                "float _noise = snoise( vec2((loopgtime*2.0)+(finnaluvpos.x*5.0),(loopgtime*2.0)+finnaluvpos.y*2.0) );",
                //   '    if(_noise < 0.1)discard;',
                "    finnaluvpos.x += time ;",
                "    vec4 colourmap = texture2D( map, finnaluvpos );",
                "    colourmap.a *= _noise;",
                // "    if(colourmap.a < 0.05)discard;",
                "   c = colourmap * vec4(color.rgb,1.0);",
                THREE.ShaderChunk.Line_ends,
                "    gl_FragColor = c;",
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "TransparentCutout") {
            this.fragmentShader = [
                THREE.ShaderChunk.basefragmentVars,
                "void main() {",
                " vec4 tex = texture2D(map,vec2(vUV.x ,vUV.y));",
                " if(tex.a<threshhold) discard;",
                "gl_FragColor = vec4(tex.rgb * colour.rgb, tex.a);",
                "}"
            ].join("\n");
        }
        if (_name == "Transparent") {
            this.fragmentShader = [
                THREE.ShaderChunk.basefragmentVars,
                "void main() {",
                " vec4 tex = texture2D(map,vec2(vUV.x ,vUV.y));",
                " if(tex.a<0.001) discard;",
                "gl_FragColor = vec4(tex.rgb * colour.rgb, tex.a);",
                "}"
            ].join("\n");
        }
        if (_name == "LineMaterial") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                "    vec4 c = vColor;",
                THREE.ShaderChunk.Line_Width_ends,
                "    vec2 finnaluvpos = vUV * repeat * vec2(endswidth,1.0) ;",
                // "    if( distance(vUV.y,0.5)*2.0 > endswidth ) discard;",
                "    if( useMap == 1. ) c *= texture2D( map, finnaluvpos );",
                "    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, finnaluvpos ).a;",
                "    if( c.a < alphaTest ) discard;",
                "    c.a = 1.0;",
                "    if( useDash == 1. ){",
                "        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));",
                "    }",
                // THREE.ShaderChunk.Line_ends,
                "    gl_FragColor = c;",
                "    gl_FragColor.a *= step(vCounters, visibility);",
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "BrushLine") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                "    vec4 c = vColor;",
                THREE.ShaderChunk.Line_Width_ends,
                "    vec2 finnaluvpos = vUV * repeat * vec2(endswidth,1.0) ;",
                // "    if( distance(vUV.y,0.5)*2.0 > endswidth ) discard;",
                "    c *= texture2D( map, finnaluvpos );",
                "    if( c.a < alphaTest ) discard;",
                // THREE.ShaderChunk.Line_ends,
                "    gl_FragColor = c;",
                "    gl_FragColor.a *= step(vCounters, visibility);",
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "VineLine") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                "    vec4 c = vColor;",
                THREE.ShaderChunk.Line_Width_ends,
                "    if( distance(vUV.y,0.5) > endswidth ) discard;",
                "    vec2 finnaluvpos = vUV * repeat;",
                "    if( useMap == 1. ) c *= texture2D( map, finnaluvpos );",
                "    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, finnaluvpos ).a;",
                "    if( c.a < alphaTest ) discard;",
                "    c.a = 1.0;",
                "    if( useDash == 1. ){",
                "        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));",
                "    }",
                // THREE.ShaderChunk.Line_ends,
                "    gl_FragColor = c;",
                "    gl_FragColor.a *= step(vCounters, visibility);",
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "LineMaterialCutOut") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                "    vec4 c = vColor;",
                "    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );",
                "    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;",
                "    if( c.a < alphaTest ) discard;",
                "    if( useDash == 1. ){",
                "        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));",
                "    }",
                // THREE.ShaderChunk.Line_ends,
                "    gl_FragColor = c;",
                "    gl_FragColor.a *= step(vCounters, visibility);",
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedFire") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                "uniform vec4 linecolour;",
                THREE.ShaderChunk.MathNoise,
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                "vec2 uv = vUV;",
                "vec4 c = vec4(1.0);",
                "vec2 finnaluvpos = vUV * repeat+((1.0-lwidth)*30.0);",
                "float rtime =  mod( (time*2.)+(vUV.x*2.0), 1.0);",
                "float loopgtime = abs(time-0.5)*1.0;",
                "float _static = snoise( vec2(1.,4.)*(loopgtime)+finnaluvpos.x );",
                "finnaluvpos += vec2(_static)*.1;",
                "vec2 p = finnaluvpos - vec2(0.5, 0.5);",
                "float distFromAxis = distance(vUV.y,0.5);",
                "float centerDist = 1.0-distance(vUV.y,0.5);",
                // 'if( vUV.y <0.5 ){ ',
                "finnaluvpos.y += rtime ;",
                // '}else{',
                // 'finnaluvpos.y -= rtime ;',
                // '}',
                "finnaluvpos.x -= sin((distFromAxis*6.284)+(time*3.141*2.))*0.08;",
                "vec4 colourmap = texture2D( map, finnaluvpos );",
                "float grey = (colourmap.r+colourmap.b+colourmap.g) / 3.0;",
                THREE.ShaderChunk.Line_pressure,
                "float pressureRange = clamp(0.2+(1.-_pressure),0.2,0.8);",
                "float vignette = smoothstep(pressureRange, 1., centerDist);",
                "vignette *= 1.0+(grey*0.31);",
                "c = colourmap;",
                "c += vignette;",
                "c.r *= c.r*c.r*(1.-(pressureRange*0.8));",
                "c.g *= c.g*c.g*c.g;",
                "c.b *= 1.1;",
                "if(c.g <distFromAxis*1.65+pressureRange) discard;",
                "vec3 colourMix = color.rgb;//mix(color.rgb, altcolor.rgb,distFromAxis*0.4);",
                "colourMix = mix(colourMix, color.rgb,c.b);",
                "colourMix = mix(colourMix, altcolor.rgb+vec3(vignette),c.r-c.b);",
                "c.rgb = colourMix;",
                THREE.ShaderChunk.Line_ends,
                "    gl_FragColor = c;",
                // '    gl_FragColor.a = step(vCounters, visibility);',
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedFireCell") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                "uniform vec4 linecolour;",
                THREE.ShaderChunk.MathNoise,
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                "vec2 uv = vUV;",
                "vec4 c = vec4(1.0);",
                THREE.ShaderChunk.Line_Width_ends,
                "vec2 finnaluvpos = vUV * repeat+((1.0-lwidth)*30.0);",
                "float rtime =  mod( (time*4.)+(vUV.x*2.0), 1.0);",
                "float loopgtime = abs(time-0.5)*1.0;",
                "float _static = snoise( vec2(1.,4.)*(loopgtime)+finnaluvpos.x );",
                "finnaluvpos += vec2(_static)*.1;",
                "vec2 p = finnaluvpos - vec2(0.5, 0.5);",
                "float distFromAxis = distance(vUV.y,0.5);",
                "float centerDist = 1.0-distance(vUV.y,0.5);",
                "finnaluvpos.y += rtime ;",
                "finnaluvpos.x -= sin((distFromAxis*6.284)+(time*3.141*2.))*0.08;",
                "vec4 colourmap = texture2D( map, finnaluvpos );",
                "float grey = (colourmap.r+colourmap.b+colourmap.g) / 3.0;",
                THREE.ShaderChunk.Line_pressure,
                "float pressureRange = clamp(0.2+(1.-_pressure),0.2,0.8);",
                "float vignette = smoothstep(pressureRange, 1., centerDist);",
                "vignette *= 1.0+(grey*0.31);",
                "c = colourmap;",
                "c += vignette;",
                "c.r *= c.r*c.r*0.5;//*(1.-(pressureRange*0.8));",
                "c.g *= c.g*(0.35+abs(sin(uv.x*12.0))*0.1)*(0.5+endswidth);",
                "c.b *= 1.1;",
                "if(c.g <0.8) discard;",
                "vec3 colourMix = color.rgb;//mix(color.rgb, altcolor.rgb,distFromAxis*0.4);",
                "colourMix = mix(colourMix, altcolor.rgb*vec3(vignette),c.r-c.b);",
                "c.rgb = colourMix;",
                "    gl_FragColor = c;",
                // '    gl_FragColor.a = step(vCounters, visibility);',
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedWater") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                "uniform vec4 linecolour;",
                "float snoise(vec3 uv, float res){ vec3 s = vec3(1e0, 1e2, 1e3);uv *= res;vec3 uv0 = floor(mod(uv, res))*s;vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;vec3 f = fract(uv); f = f*f*(3.0-2.0*f);vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);vec4 r = fract(sin(v*1e-1)*1e3);float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);return mix(r0, r1, f.z)*2.-1.;}",
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                " vec2 uv = vUV;",
                " vec3 col = vec3(1.0,1.0,1.0);",
                "    vec4 c = vec4(1.0);",
                "    vec2 finnaluvpos = vUV * repeat ;",
                "vec2 p = finnaluvpos - vec2(0.5, 0.5);",
                "float power = 2.10;",
                "    float centerDist = 1.0-distance(vUV.y,0.5);",
                "    finnaluvpos.x -= time ;",
                "    vec4 colourmap = texture2D( map, finnaluvpos );",
                "    vec4 colourmapA = texture2D( map, finnaluvpos + vec2(0.0, 0.5-time));",
                "    colourmap *= colourmapA;",
                "    float grey = (colourmap.r+colourmap.b+colourmap.g) ;",
                "    if( useDash == 1. ){",
                "        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));",
                "    }",
                "    float vignette = smoothstep(1.3-0.9, 1.3, centerDist);",
                " c.rgb *= colourmap.rgb;",
                "    c.rgb *= vignette;",
                "    if( c.r < 0.084 ) discard;",
                "   vec3 colourMix = mix(color.rgb, altcolor.rgb,grey);",
                "   c.rgb = colourMix;",
                THREE.ShaderChunk.Line_ends,
                "    gl_FragColor = c;",
                "    gl_FragColor.a *= step(vCounters, visibility);",
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedWind") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                THREE.ShaderChunk.MathRand,
                "uniform vec4 linecolour;",
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                // 'float randPos = Rand(vec2(wrldpos.z,wrldpos.y), vec2(0.002, 0.001));',
                "float rtime =  mod( time+(vUV.x*1.0), 1.0);",
                " vec2 uv = vUV;",
                " vec3 col = color.rgb;",
                // '    float centerDist = 1.0-distance(vUV.y,0.5);',
                // '    float vignette = smoothstep(1.3-0.5, 1.3, centerDist) *10.0;',
                // '    vec4 c = vec4(vignette);',
                "    vec2 finnaluvpos = vUV * repeat ;",
                "vec2 p = finnaluvpos - vec2(0.5, 0.5);",
                "float power = 2.10;",
                "finnaluvpos.x -= time;",
                // '    finnaluvpos.y -= sin((finnaluvpos.x*6.284)+(time*3.141*2.0))*0.051;',
                "vec4 colourmap = texture2D( map, finnaluvpos );",
                "if(colourmap.b>0.02)discard;",
                // '    float grey = (colourmap.r+colourmap.b+colourmap.g) ;',
                // '    if( useDash == 1. ){',
                // '        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));',
                // '    }',
                // ' c.rgb *= colourmap.rgb;',
                // ' if( grey*vignette < 0.44 ) discard;',
                // ' c.rgb *= color.rgb*rtime;',
                "if(colourmap.g<0.1){",
                // 'if(colourmap.r<0.01) discard;',
                // 'if(rtime<0.5){if(colourmap.r> rtime*2.0) discard;}',
                // 'if(rtime>0.5){if(colourmap.r < (rtime-0.5)*2.0) discard;}',
                "float distcol = abs((colourmap.r)-(rtime));",
                "float loopgtime = 0.5-abs(rtime-0.5);",
                "if(distcol>loopgtime*0.4) discard;",
                "}else{",
                // ' float gradent = abs((stime*0.5)-1.0);',
                // 'if(colourmap.g>gradent*1.1) discard;',
                "}",
                "vec4 c = vec4(color.rgb, 0.5);",
                THREE.ShaderChunk.Line_ends,
                "gl_FragColor = c;",
                // '   vec3 colourMix = mix(color.rgb, altcolor.rgb,grey);',
                // '   c.rgb = color.rgb;',
                // '    gl_FragColor = color.rgb;',
                // '    gl_FragColor.a *= step(vCounters, visibility);',
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedBugs") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                THREE.ShaderChunk.MathRand,
                "uniform vec4 linecolour;",
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                "float rtime =  mod( (time*2.0), 1.0);",
                " vec2 uv = vUV;",
                " vec3 col = color.rgb;",
                //THREE.ShaderChunk.Line_pressure,
                // "vec2 finnaluvpos = vUV * repeat+((1.0-lwidth)*30.0);",
                //"float pressureRange = 3.;//3.0+floor((1.-_pressure)*4.0);", //testing(normal)//.2big, .8 small
                " vec2 finnaluvpos = vUV * repeat;// *pressureRange;",
                " finnaluvpos.x -= rtime;",
                // ' finnaluvpos.y -= sin(time*3.141*2.0)*0.1*(vUV.x);',
                "finnaluvpos.y -= sin((finnaluvpos.x*6.284)+(time*3.141*2.0))*0.062;//*_pressure;",
                " finnaluvpos.y *= 2.0;",
                "vec4 colourmap = texture2D( map, finnaluvpos );",
                "if(colourmap.g<0.1){",
                "if(colourmap.b>0.02)discard;",
                "if(colourmap.r<0.1) discard;",
                "if(rtime>0.5)rtime = (1.-rtime);",
                "float distcol = abs((colourmap.r)-(1.-rtime));",
                "if(distcol>0.2) discard;",
                "}",
                "vec4 c = vec4(color.rgb*colourmap.g, 1.0);",
                THREE.ShaderChunk.Line_ends,
                "float centerDist = 1.0-distance(vUV.y,0.5);",
                "float vignette = smoothstep(0.4, 1.0, centerDist);",
                "    c.a *= vignette;",
                "    gl_FragColor = c;",
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedBugs2") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                "uniform vec4 linecolour;",
                "mat2 rotate2d(float angle) {return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));}",
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                " vec2 uv = vUV;",
                // " vec3 col = color.rgb;",
                "vec2 finnaluvpos = vUV * repeat;",
                "float prg = 2.0;",
                "if (mod(finnaluvpos.x, 2.0)>1.0){",
                "prg = 0.0;",
                "}else{",
                "prg = 2.0;",
                "}",

                "float ttime =  mod( (time*2.0), 1.0);",
                "float rtime =  mod( (ttime*(2.0+prg)), 1.0);",
                "float fwdtime =  mod( (rtime+0.1), 1.0);",
                "float rrtime =  mod(ttime*(2.0), 1.0);",
                "float fwdrrtime =  mod( (rrtime+0.1), 1.0);",

                //"finnaluvpos.x -= time;",
                "vec2 center = vec2(sin(rtime*6.284)*0.7, cos(rrtime*6.284)*0.5);",
                "vec2 centerfwd = vec2(sin(fwdtime*6.284)*0.7, cos(fwdrrtime*6.284)*0.5);",
                "vec2 newUV = (vec2(mod(finnaluvpos.x,1.0),mod(finnaluvpos.y,1.0))/0.5);//center;",


                "float zoom = 1.2;",
                "vec2 scaleCenter = vec2(0.5);",
                "newUV = (newUV - scaleCenter) * zoom + scaleCenter;",
                "newUV += center*(zoom*0.5);",
                "newUV -= .5;",
                "float angle = atan(center.y-centerfwd.y,center.x-centerfwd.x);",
                "newUV *= rotate2d(-angle);",
                "newUV += .5;",

                "if(newUV.x>1.0)discard;",
                "if(newUV.x<0.0)discard;",
                "if(newUV.y>1.0)discard;",
                "if(newUV.y<0.0)discard;",

                "vec4 colourmap = texture2D( map, newUV );",
                "if(colourmap.a<0.2)discard;",

                "vec4 c = vec4(color.rgb*colourmap.rgb, 1.0);",
                "gl_FragColor = c;",
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedLightning") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                THREE.ShaderChunk.MathRand,
                "uniform vec4 linecolour;",
                "float snoise(vec3 uv, float res){ vec3 s = vec3(1e0, 1e2, 1e3);uv *= res;vec3 uv0 = floor(mod(uv, res))*s;vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;vec3 f = fract(uv); f = f*f*(3.0-2.0*f);vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);vec4 r = fract(sin(v*1e-1)*1e3);float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);return mix(r0, r1, f.z)*2.-1.;}",
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                // THREE.ShaderChunk.Line_pressure,
                "float speed = 2.0;",

                "float ttime =  mod( (time*4.0), 1.0);",
                "float gtime =  mod( 0.2+(ttime*speed), 1.0);",
                "float ltime =  mod( (ttime*4.), 1.0);",
                "vec2 uv = vUV;",
                // "vec2 finnaluvpos = vUV * repeat ;",
                "vec2 finnaluvpos = vUV * repeat+((1.0-lwidth)*30.0);",
                "float flipper = mod( (ttime*3.), 1.0)-0.5;",
                "if(flipper>0.0)finnaluvpos.y = 1.0-finnaluvpos.y;",
                "if(ttime>0.8)finnaluvpos.x -= 0.5;",
                "if(ttime>0.1)finnaluvpos.x += 0.5;",
                //'finnaluvpos.y -= sin((finnaluvpos.x*5.)+floor(ltime*3.141*2.0))*0.1;',
                "vec4 colourmap = texture2D( map, finnaluvpos );",
                "float grey = (colourmap.r+colourmap.b+colourmap.g) / 3.0;",
                "float rdistcol = colourmap.r;",
                "float gdistcol = colourmap.g;",
                "float bdistcol = colourmap.b;",
                "float light = rdistcol;",
                // "if(_pressure>0.4)light = mix(light,gdistcol,ltime);",
                // "if(_pressure>0.7)light = mix(light,bdistcol,gtime);",
                "light = mix(light,gdistcol,ltime);",
                "light = mix(light,bdistcol,gtime);",
                "if(grey<0.1) discard;",
                // '}',
                "vec4 c =  vec4(color.rgb, light *3.0);//*_pressure);",
                THREE.ShaderChunk.Line_ends,
                "gl_FragColor = c;",
                "",
                THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "AnimatedLightning") {
            this.fragmentShader = [
                THREE.ShaderChunk.basefragmentVars,
                "void main() {",
                "if(time>0.9)discard;",
                "if(time>0.2 && time<.3)discard;",
                "float _speed = 2.0;",
                "float gtime =  mod((wrldpos.y/5.0) + 0.2+(time*_speed), 1.0);",
                "float ltime =  mod((wrldpos.y/5.0) + (time*4.), 1.0);",
                "vec2 uv = vUV;",
                "vec2 finnaluvpos = vUV;",
                "float flipper = mod( (time*8.), 1.0)-0.5;",
                "if(flipper>0.0)finnaluvpos.y = 1.0-finnaluvpos.y;",
                // 'if(timeww>0.9)finnaluvpos.xy *= 0.1;',
                // 'fwinnaluvpos.y -= sin((finnaluvpos.x*5.)+floor(ltime*3.141*2.0))*0.01;',
                "vec4 colourmap = texture2D( map, finnaluvpos );",
                "float grey = (colourmap.r+colourmap.b+colourmap.g) / 3.0;",
                "if(grey<0.001) discard;",
                "float rdistcol = colourmap.r;",
                "float gdistcol = colourmap.g;",
                "float bdistcol = colourmap.b;",
                "float light = rdistcol*ltime*gtime;",
                "light = mix(light,gdistcol,ltime);",
                "light = mix(light,bdistcol,gtime);",
                "float camdis = 1.0 - abs(zdist.z*0.25);",
                // '}',
                'float finAlph = light * 2.0;',
                'if(finAlph < 0.3)discard;',
                "gl_FragColor = vec4(colour.rgb, finAlph);",
                "",
                "}"
            ].join("\n");
        }
        if (_name == "LineAnimatedStatic") {
            this.fragmentShader = [
                THREE.ShaderChunk.baseLinefragmentVars,
                THREE.ShaderChunk.MathNoise,
                THREE.ShaderChunk.MathRand,
                "uniform vec4 linecolour;",
                "void main() {",
                "",
                //THREE.ShaderChunk.Line_pressure,
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                "float gtime = mod(+(time*1.0), 1.0);",
                "float loopgtime = abs(gtime-0.5)*1.0;",
                "vec4 c = vec4(color.rgb,1.0);",
                "vec2 finnaluvpos = vUV * repeat ;",
                "float randPos = Rand(vec2(loopgtime), vec2(10.2, 10.1));",
                "float _static = snoise( finnaluvpos*(20.0+randPos) );",
                // 'if(_static<0.4)discard;',
                "float centerDist = 1.0-distance(vUV.y,0.5);",
                "float vignette = smoothstep(1.3-0.9, 1.3, centerDist);",
                "float finStatic = vignette * _static;// * _pressure;",
                "if(finStatic<0.05)discard;",
                "if(finStatic<(0.05 + centerDist*0.5))discard;",
                "c.rgb *= _static;",
                "c.a = _static;",
                THREE.ShaderChunk.Line_ends,
                "gl_FragColor = c;",
                "",
                // THREE.ShaderChunk.fog_fragment,
                "}"
            ].join("\n");
        }
        if (_name == "ShadedDot") {
            this.fragmentShader = [
                "",
                THREE.ShaderChunk.fog_pars_fragment,
                THREE.ShaderChunk.logdepthbuf_pars_fragment,
                "",
                "uniform sampler2D map;",
                "uniform sampler2D alphaMap;",
                "uniform float useMap;",
                "uniform float useAlphaMap;",
                "uniform float useDash;",
                "uniform float dashArray;",
                "uniform float dashOffset;",
                "uniform float dashRatio;",
                "uniform float visibility;",
                "uniform float alphaTest;",
                "uniform vec2 repeat;",
                "uniform vec3 color;",
                "uniform float opacity;",
                "varying vec2 vUV;",
                "float dist_circ(vec2 cent, float r, vec2 uv ){",
                "float d = distance( cent, uv ) - r;",
                "return d;",
                "}",
                "void main() {",
                "",
                THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                "vec4 bg = vec4(0.,0.,0.,0.); ",
                " vec3 obc = color; ",
                " float dc1 = dist_circ(vec2(0.5,0.5),0.08,vUV); ",
                "vec4 shape = vec4(obc,1.0 - smoothstep(0.0,0.49,dc1)); ",
                "shape.a *= opacity;",
                "gl_FragColor = mix(bg,shape,shape.a);",
                "",
                "}"
            ].join("\n");
            this.vertexShader = [
                "varying vec2 vUV;",
                "void main(void) {",
                "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
                "  vUV = uv;",
                "}"
            ].join("\r\n");
        }
        if (_name == "ParticelDot") {
            this.fragmentShader = [
                "",
                THREE.ShaderChunk.fog_pars_fragment,
                THREE.ShaderChunk.logdepthbuf_pars_fragment,
                "",
                "uniform sampler2D map;",
                "uniform sampler2D alphaMap;",
                "uniform float useMap;",
                "uniform float useAlphaMap;",
                "uniform float useDash;",
                "uniform float dashArray;",
                "uniform float dashOffset;",
                "uniform float dashRatio;",
                "uniform float visibility;",
                "uniform float alphaTest;",
                "uniform vec2 repeat;",
                "uniform vec3 color;",
                "uniform float opacity;",
                "varying vec3 vColor;",
                "float dist_circ(vec2 cent, float r, vec2 uv ){",
                "float d = distance( cent, uv ) - r;",
                "return d;",
                "}",
                "void main() {",
                "",
                // THREE.ShaderChunk.logdepthbuf_fragment,
                "",
                "vec4 bg = vec4(0.0,0.,0.,0.0); ",
                " vec3 obc = vColor; ",
                " float dc1 = dist_circ(vec2(0.5,0.5),0.08,gl_PointCoord); ",
                "vec4 shape = vec4(obc,1.0 - smoothstep(0.0,0.49,dc1)); ",
                "shape.a *= opacity;",
                "gl_FragColor = mix(bg,shape,shape.a);",
                "}"
            ].join("\n");
            this.vertexShader = [
                "attribute float size;",
                "attribute vec3 customColor;",
                "varying vec3 vColor;",
                "void main() {",
                "vColor = customColor;",
                "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
                "gl_PointSize = size * ( 300.0 / -mvPosition.z );",
                "gl_Position = projectionMatrix * mvPosition;",
                " }"
            ].join("\r\n");
        }
        if (_name == "AnimatedParticelDot") {
            this.fragmentShader = [
                "",
                THREE.ShaderChunk.fog_pars_fragment,
                THREE.ShaderChunk.logdepthbuf_pars_fragment,
                "",
                "uniform float time;",
                // "uniform sampler2D map;",
                // "uniform sampler2D alphaMap;",
                "uniform float useMap;",
                "uniform float useAlphaMap;",
                "uniform float useDash;",
                "uniform float dashArray;",
                "uniform float dashOffset;",
                "uniform float dashRatio;",
                "uniform float visibility;",
                "uniform float alphaTest;",
                "uniform vec2 repeat;",
                "uniform vec3 color;",
                "uniform float opacity;",
                "varying vec3 vColor;",
                "varying vec3 wrldpos;",
                THREE.ShaderChunk.MathRand,
                "float circle(vec2 U, vec2 pos, float r) {",
                "    return smoothstep(r, 0.0, length(U-pos));",
                "}",
                "float dist_circ(vec2 cent, float r, vec2 uv ){",
                "float d = distance( cent, uv ) - r;",
                "return d;",
                "}",
                "void main() {",
                "",
                // THREE.ShaderChunk.logdepthbuf_fragment,
                "vec2 U = gl_PointCoord.xy - vec2(0.5,0.5);",
                "float randPos = Rand(vec2(wrldpos.z,wrldpos.y), vec2(200.8, 120.5));",
                "float _time = mod(randPos + (time), 1.0);",
                "float _ttime = mod(randPos + (time*2.0), 1.0);",
                "float shapef = circle(U, vec2(0.0,0.0), .3);",
                "for (int t = 0; t < 20; t++)",
                "{",
                "    float tt = sin(float(t)*3.434)*6.42;",
                "    float posx = sin(tt +(_ttime*6.284))*0.2;",
                "    float posy = cos(tt +_time*6.284)*0.2;",
                "    shapef += circle(U, vec2(posx,posy), 0.2)*0.1;",
                "}",
                "vec4 bg = vec4(0.0,0.,0.,0.0); ",
                " vec3 obc = vColor; ",
                " float dc1 = dist_circ(vec2(0.5,0.5),0.08,gl_PointCoord); ",
                "vec4 shape = vec4(obc,1.0); ",
                "shape.a *= opacity*shapef;",
                "gl_FragColor = mix(bg,shape,shape.a);",
                "}"
            ].join("\n");
            this.vertexShader = [
                "attribute float size;",
                "attribute vec3 customColor;",
                "varying vec3 vColor;",
                "varying vec3 wrldpos;",
                "void main() {",
                "vColor = customColor;",
                "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
                "  vec4 worldPosition = (modelMatrix * vec4(position, 1.));",
                "  wrldpos = worldPosition.xyz;",
                "gl_PointSize = size * ( 300.0 / -mvPosition.z );",
                "gl_Position = projectionMatrix * mvPosition;",
                " }"
            ].join("\r\n");
        }

    }
}
class MaterialsCache {
    constructor() {
        this.textureName;
        this.materialName;
        this.lineMaterial;
        this.objMaterial;
        this.colour;
        this.lineWidth;
        this.lineLength;
        this.startTime;
        this.pressures = [];
        this.time;
    }
    MaterialsCache(_textureName, _materialName) {
        this.textureName = _textureName;
        this.materialName = _materialName;
        this.lineWidth = 1.0;
        this.time = 0;
        this.startTime = Math.random();
    }
}
class MaterialsHolder {
    constructor() { }
    makeMaterial(_BrushVariablesInput, _textureName, _materialName) {
        if (_materialName == "LineTexturedMaterial") {
            var _ShaderHolder = new ShaderHolder("BrushLine");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            // mcolour.lerp(lcolour, 0.5);
            return new PaintingToolMeshLineMaterial({
                name: "No custom Shader",
                color: mcolour,
                map: texture,
                // useMap: 1,
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                alphaTest: 0.1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                // depthTest: false,
                // depthWrite: true,
                // blending: THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineTexturedMaterial2") {
            var _ShaderHolder = new ShaderHolder("LineMaterial");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            // mcolour.lerp(lcolour, 0.5);
            return new PaintingToolMeshLineMaterial({
                name: "No custom Shader",
                color: mcolour,
                map: texture,
                useMap: 1,
                //alphaTest: 0.5,
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                depthTest: true,
                depthWrite: true,
                // blending: THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineTexturedMaterialColoured") {
            var _ShaderHolder = new ShaderHolder("LineMaterial");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            mcolour.lerp(lcolour, 0.5);
            return new PaintingToolMeshLineMaterial({
                name: "No custom Shader",
                color: mcolour,
                map: texture,
                useMap: 1,
                //alphaTest: 0.5,
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                depthTest: true,
                depthWrite: true,
                // blending: THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "VineLineMaterial") {
            var _ShaderHolder = new ShaderHolder("VineLine");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            mcolour.lerp(lcolour, 0.5);
            return new PaintingToolMeshLineMaterial({
                name: "No custom Shader",
                color: mcolour,
                map: texture,
                useMap: 1,
                //alphaTest: 0.5,
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                depthTest: true,
                depthWrite: true,
                // blending: THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineMaterialAnimatedWater") {
            var _ShaderHolder = new ShaderHolder("LineAnimatedWater");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            // mcolour.lerp (lcolour, 0.5 );
            return new PaintingToolMeshLineMaterial({
                name: _materialName,
                color: mcolour,
                altcolor: lcolour,
                map: texture,
                useMap: 1,
                alphaTest: 0.5,
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                // depthTest: false,
                // depthWrite: true,
                // blending: THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineMaterialAnimatedFire") {
            var _ShaderHolder = new ShaderHolder("LineAnimatedFireCell");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var lcolour = new THREE.Color(
            //   _BrushVariablesInput.lineColour.r,
            //   _BrushVariablesInput.lineColour.g,
            //   _BrushVariablesInput.lineColour.b
            // );
            var lcolour = new THREE.Color(0.9, 0.9, 0.3); //new THREE.Color(0.7,0.7,0)//weird changing _BrushVariablesInput.lineColour has no effect
            // mcolour.lerp (lcolour, 0.5 );
            return new PaintingToolMeshLineMaterial({
                name: _materialName,
                color: mcolour,
                altcolor: lcolour,
                map: texture,
                useMap: 1,
                alphaTest: 0.5,
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                // depthTest: true,
                // depthWrite: false,
                blending: THREE.AdditiveBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineMaterialAnimatedLava") {
            var _ShaderHolder = new ShaderHolder("LineAnimatedLava");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            return new PaintingToolMeshLineMaterial({
                name: _materialName,
                color: mcolour,
                altcolor: lcolour,
                map: texture,
                useMap: 1,
                alphaTest: 0.5,
                transparent: true,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineCloud") {
            var _ShaderHolder = new ShaderHolder("LineAnimatedClouds");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            // mcolour.lerp(lcolour, 0.5);
            var isBlack = (mcolour.r < 0.1 && mcolour.g < 0.1 && mcolour.b < 0.1);
            var BelndingMode = THREE.AdditiveBlending;
            if (isBlack) BelndingMode = THREE.NormalBlending;
            return new PaintingToolMeshLineMaterial({
                name: _materialName,
                color: mcolour,
                map: texture,
                useMap: 1,
                alphaMap: texture,
                useAlphaMap: true,
                transparent: true,
                opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                // depthTest: false,
                // depthWrite: true,
                blending: BelndingMode,//THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineMaterialAnimatedWind") {
            var _ShaderHolder = new ShaderHolder("LineAnimatedWind");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            // mcolour.lerp (lcolour, 0.5 );
            return new PaintingToolMeshLineMaterial({
                name: _materialName,
                color: mcolour,
                altcolor: lcolour,
                map: texture,
                useMap: 1,
                alphaTest: 0.5,
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                // depthTest: false,
                // depthWrite: true,
                // blending: THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineMaterialAnimatedBugs") {
            var _ShaderHolder = new ShaderHolder("LineAnimatedBugs2");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            // mcolour.lerp (lcolour, 0.5 );
            return new PaintingToolMeshLineMaterial({
                name: _materialName,
                color: mcolour,
                altcolor: lcolour,
                map: texture,
                useMap: 1,
                alphaTest: 0.5,
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                // depthTest: false,
                // depthWrite: true,
                // blending: THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineMaterialAnimatedClouds") {
            var _ShaderHolder = new ShaderHolder("LineAnimatedCloud");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            // mcolour.lerp (lcolour, 0.5 );
            return new PaintingToolMeshLineMaterial({
                name: _materialName,
                color: mcolour,
                altcolor: lcolour,
                map: texture,
                useMap: 1,
                alphaTest: 0.5,
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                // depthTest: false,
                // depthWrite: true,
                blending: THREE.AdditiveBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineMaterialAnimatedLightning") {
            var _ShaderHolder = new ShaderHolder("LineAnimatedLightning");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            // mcolour.lerp (lcolour, 0.5 );
            return new PaintingToolMeshLineMaterial({
                name: _materialName,
                color: mcolour,
                altcolor: lcolour,
                map: texture,
                useMap: 1,
                alphaTest: 0.5,
                // pressures: [0.1,0.2,0.3,0.4,0.5,0.1,0.2,0.3,0.4,0.5,0.1,0.2,0.3,0.4,0.5,0.1,0.2,0.3,0.4,0.5],
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                // depthTest: false,
                // depthWrite: true,
                blending: THREE.AdditiveBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader,
                name: _materialName
            });
        }
        if (_materialName == "LineMaterialAnimatedStatic") {
            var _ShaderHolder = new ShaderHolder("LineAnimatedStatic");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            // mcolour.lerp (lcolour, 0.5 );
            return new PaintingToolMeshLineMaterial({
                name: _materialName,
                color: mcolour,
                altcolor: lcolour,
                map: texture,
                useMap: 1,
                alphaTest: 0.5,
                // pressures: [0.1,0.2,0.3,0.4,0.5,0.1,0.2,0.3,0.4,0.5,0.1,0.2,0.3,0.4,0.5,0.1,0.2,0.3,0.4,0.5],
                // alphaMap: texture,
                // useAlphaMap: true,
                transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                // depthTest: false,
                // depthWrite: true,
                // blending: THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader,
                name: _materialName
            });
        }
        if (_materialName == "AnimatedMaterial") {
            var _ShaderHolder = new ShaderHolder("AnimatedMaterial");
            var loader = new THREE.TextureLoader();
            var texture = loader.load(_textureName, function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
            });
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            mcolour.lerp(lcolour, 0.5);
            var uniforms = {
                map: { type: "t", value: texture },
                opacity: { type: "f", value: 1.0 },
                time: { type: "f", value: 1.0 },
                colour: { type: "c", value: mcolour }
            };
            return new THREE.ShaderMaterial({
                name: _materialName,
                uniforms: uniforms,
                vertexShader: _ShaderHolder.vertexShader,
                fragmentShader: _ShaderHolder.fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: true,
                depthTest: false
            });
        }
        if (_materialName == "AnimatedMaterialWind") {
            var _ShaderHolder = new ShaderHolder("AnimatedWind");
            var loader = new THREE.TextureLoader();
            var texture = loader.load(_textureName, function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
            });
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            // mcolour.lerp(lcolour, 0.5);
            var uniforms = {
                map: { type: "t", value: texture },
                opacity: { type: "f", value: 1.0 },
                time: { type: "f", value: 1.0 },
                colour: { type: "c", value: mcolour }
            };
            return new THREE.ShaderMaterial({
                name: _materialName,
                uniforms: uniforms,
                vertexShader: _ShaderHolder.vertexShader,
                fragmentShader: _ShaderHolder.fragmentShader,
                // blending: THREE.AdditiveBlending,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: true,
                depthTest: true
            });
        }
        if (_materialName == "AnimatedMaterialLightning") {
            var _ShaderHolder = new ShaderHolder("AnimatedLightning");
            var loader = new THREE.TextureLoader();
            var texture = loader.load(_textureName, function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
            });
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            // mcolour.lerp(lcolour, 0.5);
            var uniforms = {
                map: { type: "t", value: texture },
                opacity: { type: "f", value: 1.0 },
                time: { type: "f", value: 1.0 },
                colour: { type: "c", value: mcolour }
            };
            return new THREE.ShaderMaterial({
                name: _materialName,
                uniforms: uniforms,
                vertexShader: _ShaderHolder.vertexShader,
                fragmentShader: _ShaderHolder.fragmentShader,
                blending: THREE.AdditiveBlending,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: true,
                depthTest: true,
                name: _materialName
            });
        }
        if (_materialName == "rock") {
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(6, 6);
            //var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            //mcolour.lerp (lcolour, 0.5 );
            return new THREE.MeshBasicMaterial({
                name: _materialName,
                color: lcolour,
                map: texture,
                name: "No custom Shader"
            });
        }
        if (_materialName == "ice") {
            var _ShaderHolder = new ShaderHolder("Ice");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            // mcolour.lerp(lcolour, 0.5);
            var uniforms = {
                map: { type: "t", value: texture },
                colour: { type: "c", value: mcolour },
                threshhold: { type: "f", value: 0.9 },
                time: { type: "f", value: 1.0 }
            };
            return new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: _ShaderHolder.vertexShader,
                fragmentShader: _ShaderHolder.fragmentShader,
                transparent: true,
                // side: THREE.DoubleSide,
                depthWrite: true,
                depthTest: true,
                // blending: THREE.AdditiveBlending,//NormalBlending,
                name: _materialName
            });
        }
        if (_materialName == "leaf") {
            var _ShaderHolder = new ShaderHolder("TransparentCutout");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var newcolour = new THREE.Color(0xffffff);
            // //if (_BrushVariablesInput.mainColour.r) {
            // newcolour.r = _BrushVariablesInput.mainColour.r;
            // newcolour.g = _BrushVariablesInput.mainColour.g;
            // newcolour.b = _BrushVariablesInput.mainColour.b;
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            // mcolour.lerp(lcolour, 0.5);
            var uniforms = {
                map: { type: "t", value: texture },
                colour: { type: "c", value: mcolour },
                threshhold: { type: "f", value: 0.1 }
            };
            return new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: _ShaderHolder.vertexShader,
                fragmentShader: _ShaderHolder.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: true,
                depthTest: true,
                name: "No custom Shader"
            });
        }
        if (_materialName == "cloud") {
            var _ShaderHolder = new ShaderHolder("Transparent");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            // mcolour.lerp(lcolour, 0.5);
            var uniforms = {
                map: { type: "t", value: texture },
                colour: { type: "c", value: mcolour }
            };
            return new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: _ShaderHolder.vertexShader,
                fragmentShader: _ShaderHolder.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                depthTest: true,
                name: "No custom Shader"
            });
        }
        if (_materialName == "spike") {
            var _ShaderHolder = new ShaderHolder("TransparentCutout");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var newcolour = new THREE.Color(0xffffff);
            // //if (_BrushVariablesInput.mainColour.r) {
            // newcolour.r = _BrushVariablesInput.mainColour.r;
            // newcolour.g = _BrushVariablesInput.mainColour.g;
            // newcolour.b = _BrushVariablesInput.mainColour.b;
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            //mcolour.lerp(lcolour, 0.5);
            var uniforms = {
                map: { type: "t", value: texture },
                colour: { type: "c", value: mcolour },
                threshhold: { type: "f", value: 0.3 }
            };
            return new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: _ShaderHolder.vertexShader,
                fragmentShader: _ShaderHolder.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                depthTest: true,
                name: "No custom Shader"
            });
        }
        if (_materialName == "ShadedDot") {
            var _ShaderHolder = new ShaderHolder("ShadedDot");
            var loader = new THREE.TextureLoader();
            var texture = loader.load(_textureName, function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
            });
            var mcolour = new THREE.Color(1, 1, 1);
            var uniforms = {
                map: { type: "t", value: texture },
                opacity: { type: "f", value: 1.0 },
                color: { type: "c", value: mcolour }
            };
            return new THREE.ShaderMaterial({
                name: _materialName,
                uniforms: uniforms,
                vertexShader: _ShaderHolder.vertexShader,
                fragmentShader: _ShaderHolder.fragmentShader,
                transparent: true
                // blending: THREE.AdditiveBlending,
                // depthWrite: true,
                // depthTest: false
            });
        }
        if (_textureName == "" || _textureName == "null") {
            return new THREE.MeshBasicMaterial({
                color: 0xffffff,
                name: "No custom Shader"
            });
        }
        else {
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            return new THREE.MeshBasicMaterial({
                color: 0xffffff,
                map: texture,
                name: "No custom Shader",
                alphaMap: texture,
                depthWrite: false,
                depthTest: true,
                transparent: true,
                name: "No custom Shader"
            });
        }
    }
}
class PaintingNode {
    /*
export interface AlNode extends AlGraphEntry {
  normal?: string;
  position?: string;
  scale?: number;
  targetId?: string;
}
*/
    constructor(_position, _normal, _pressure) {
        this.position = new THREE.Vector3(_position.x, _position.y, _position.z);
        this.normal = new THREE.Vector3(_normal.x, _normal.y, _normal.z);
        this.pressure = _pressure;
    }
}
export class PaintingToolManager {
    constructor(assetsPath) {
        //     var coordinates = AFRAME.utils.coordinates;
        //     this.line;
        // var geometry;
        /**
         * @constructs BrushVariablesEditorInputs
         * This holds the properties of the brush stroke(whats shown to the user), and is edited by the designers
         * @param {Object} n The properties.
         * @param {String} n.lineType Line, Dotted line, Multi line, Crossed line, Object line, Decaled line, Decales.
         * @param {THREE.Color} n.mainColour the main colour.
         * @param {THREE.Color} n.decalColour the decals colour.
         * @param {THREE.Color} n.lineColour the line colour.
         * @param {String[]} n.texture names of main texture.
         * @param {String[]} n.textureAlt names of Alt texture.
         * @param {String[]} n.materials names of materials.
         * @param {String[]} n.objects names of objects (meshes).
         * @param {Float} n.animationSpeed animation Speed.
         * @param {Float} n.animationSpeedAlt animationAlt Speed.
         * @param {Float} n.facing the direction the object faces
         * @param {Float} n.spacing spacing of brush dots or objects.
         * @param {Float} n.maxlineWidth Max size of the width of the line
         * @param {Float} n.maxelementWidth Max size of the width of the elements
         * @param {Float} n.jitter the jitter position amount of other brush elements.
         * @param {Float} n.rotation the rotation of the main texture.
         * @param {Float} n.rotationjitter the rotation jitter.
         * @param {Float} n.repeatingAmount Repeating Texture Amount(0 for stretch)
         * @param {Float} n.dynamicSpeedSize the amount speed effects size
         * @param {Float} n.dynamicSpeedOpacity the amount speed effects opacity.
         * @param {Float} n.dynamicSpeedSpecial the amount a special variable is effected.
         * @param {Float} n.dynamicPressureSize the amount pressure effects size
         * @param {Float} n.dynamicPressureOpacity the amount pressure effects opacity.
         * @param {Float} n.dynamicPressureSpecial the amount a special variable is effected.
         */
        this.DistanceFromBody = 0.03;
        this.clock = new THREE.Clock();
        this.currentTime = 0;
        this.lastTime = 0;
        this.parentGroup;
        this.CurrentWidth = 1.0;

        this.currentPreset = 0;
        this.assetsPath = assetsPath;
        this.decalColour = new THREE.Color();
        this.lineColour = new THREE.Color();
        this.BillboardObjects = [];
        this.currentBillboardObjectCount = 0;
        this.timer = 0.0;
        this.group = new THREE.Group();
        this.materialsCache = [];
        this.currentMaterialCache;
        this.materialsHolder = new MaterialsHolder();
        this.shaderHolder = new ShaderHolder();
        this.nodes = [];
        this.strokecount = 0;
        this.currentstrokecount = -1;
        this.NodeRangeBegining = 0;
        this.NodeRangeEnding = 0;
        this.PaintingToolMeshLinesCache = [];
        this.currentPaintingToolMeshLine = new PaintingToolMeshLine();
        this.geoCount = 200;
        this.geo = new THREE.Geometry();
        for (var j = 0; j < this.geoCount; j++) {
            this.geo.vertices.push(new THREE.Vector3());
        }
        this.currentPaintingToolMeshLine.setGeometry(this.geo, function (p) {
            return p;
        });


        this.NextPreset();
        document.addEventListener("keydown", key => {
            if (key.code === "KeyQ") {
                this.NextPreset();
            }
        });
        document.addEventListener("al-palette-option-selected", e => {
            const optionIndex = e.detail.optionIndex;
            if (optionIndex <= 11) {
                const preset = this.GetPresetByIndex(optionIndex);
                this.SetPreset(preset);
            } else {
                this.ChangecolourByIndex(optionIndex);
            }
        });

        // document.addEventListener("al-node-spawned", e => {
        //     // this.nodes = e.detail.nodes;
        //     let position = AFRAME.utils.coordinates.parse(e.detail.nodes[e.detail.nodes.length - 1].position);
        //     let normal = AFRAME.utils.coordinates.parse(e.detail.nodes[e.detail.nodes.length - 1].normal);
        //     let paintingNode = new PaintingNode(position, normal, 0.0);
        //     this.nodes.push(paintingNode);//e.detail.nodes[e.detail.nodes.length - 1]);
        //     this.updateStroke();
        // });

        this.Temp_PaintingNode = new PaintingNode(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 1.0);
        document.addEventListener("al-update-brush-node", e => {
            if (this.NodeRangeEnding - this.NodeRangeBegining > 1) {
                let nodepos = AFRAME.utils.coordinates.parse(e.detail.intersection.point);
                let pos = new THREE.Vector3(e.detail.intersection.point.x, e.detail.intersection.point.y, e.detail.intersection.point.z);
                let nrm = new THREE.Vector3(e.detail.intersection.face.normal.x, e.detail.intersection.face.normal.y, e.detail.intersection.face.normal.z);
                // console.log("al-update-brush-node: " + e.detail.intersectedEl.name);
                // this.nodes[this.nodes.length - 1].position = pos;
                // this.nodes[this.nodes.length - 1].normal = nrm;
                this.Temp_PaintingNode.position = pos;
                this.Temp_PaintingNode.normal = nrm;
                this.updateStroke();
            }
        });

        document.addEventListener("al-node-spawned", e => {
            if (this.NodeRangeEnding - this.NodeRangeBegining < 2) {//place nodes normally at the begining of stroke
                let nodepos = AFRAME.utils.coordinates.parse(e.detail.nodes[e.detail.nodes.length - 1].position);
                let normal = AFRAME.utils.coordinates.parse(e.detail.nodes[e.detail.nodes.length - 1].normal);
                this.Temp_PaintingNode.position = new THREE.Vector3(nodepos.x, nodepos.y, nodepos.z);
                this.Temp_PaintingNode.normal = new THREE.Vector3(normal.x, normal.y, normal.z);;
                const paintingNode = new PaintingNode(nodepos, normal, 1.0);
                this.nodes.push(paintingNode);
                this.updateStroke();
            } else {
                //calculate disdance between last node position and new node position
                let _startpos = AFRAME.utils.coordinates.parse(e.detail.nodes[e.detail.nodes.length - 2].position);
                let _endpos = AFRAME.utils.coordinates.parse(e.detail.nodes[e.detail.nodes.length - 1].position);
                let _snormal = AFRAME.utils.coordinates.parse(e.detail.nodes[e.detail.nodes.length - 2].normal);
                let _enormal = AFRAME.utils.coordinates.parse(e.detail.nodes[e.detail.nodes.length - 1].normal);

                let startpos = new THREE.Vector3(_startpos.x, _startpos.y, _startpos.z);
                let endpos = new THREE.Vector3(_endpos.x, _endpos.y, _endpos.z);
                let snormal = new THREE.Vector3(_snormal.x, _snormal.y, _snormal.z);
                let enormal = new THREE.Vector3(_enormal.x, _enormal.y, _enormal.z);

                let distance = startpos.distanceTo(endpos);
                // console.log("distance: " + distance);
                var minDistance = 0.0001;
                var maxDistance = 0.01;
                if (distance > minDistance) {
                    //add multipul new node in between the Aleph Node positions
                    var count = (((distance * 1000.0) / (minDistance * 1000.0)) / 1000.0) * 2.0;
                    // if (count > 2)
                    // console.log("count: " + count);
                    for (var i = 0; i <= count; i++) {
                        let perc = parseFloat(i) / parseFloat(Math.floor(count + 1));
                        // if (count > 2)
                        // console.log("perc: " + perc);
                        let newpos = startpos.clone();
                        newpos.lerp(endpos, perc);
                        let newNorm = snormal.clone();
                        newNorm.lerp(enormal, perc);
                        const paintingNode = new PaintingNode(newpos, newNorm, 1.0);
                        this.nodes.push(paintingNode);
                    }
                    this.updateStroke();
                } else {
                    //place nodes normally at smaller distances
                    let nodepos = AFRAME.utils.coordinates.parse(e.detail.nodes[e.detail.nodes.length - 1].position);
                    let normal = AFRAME.utils.coordinates.parse(e.detail.nodes[e.detail.nodes.length - 1].normal);
                    const paintingNode = new PaintingNode(nodepos, normal, 1.0);
                    this.nodes.push(paintingNode);
                    this.updateStroke();
                }
            }
        });
    }
    stringToVector3(vec) {
        const res = vec.split(" ");
        var vect = new THREE.Vector3();
        vect.x = Number(res[0]);
        vect.y = Number(res[1]);
        vect.z = Number(res[2]);
        return vect;
    }
    GetPresets() {
        return Object.values(jsonpreset.remembered);
    }

    GetPresetByIndex(index) {
        var presets = this.GetPresets();
        var indexTranslation = index;
        if (index == 7) indexTranslation = 0;//brush
        if (index == 4) indexTranslation = 1;//Fire
        if (index == 5) indexTranslation = 2;//Water
        if (index == 0) indexTranslation = 3;//Smake
        if (index == 10) indexTranslation = 4;//Vine(with leaves)
        if (index == 6) indexTranslation = 5;//Lava
        if (index == 9) indexTranslation = 6;//Wind
        if (index == 8) indexTranslation = 7;//Bugs
        if (index == 1) indexTranslation = 8;//Lightning
        if (index == 11) indexTranslation = 9;//Vine (Spkied)
        if (index == 2) indexTranslation = 10;//TV Static
        if (index == 3) indexTranslation = 11;//Ice
        return presets[indexTranslation]["0"];
    }
    ChangecolourByIndex(index) {
        console.log("ChangecolourByIndex");
        var _colour = this.mainColour;
        if (index == 12) {//red orange
            _colour = new THREE.Color("rgb(255, 52, 0)");
        }
        if (index == 13) {//orange
            _colour = new THREE.Color("rgb(255, 127, 0)");
        }
        if (index == 14) {//yellow orange
            _colour = new THREE.Color("rgb(255, 187, 16)");
        }
        if (index == 15) {//yellow
            _colour = new THREE.Color("rgb(255, 248, 5)");
        }
        if (index == 16) {//yellow green
            _colour = new THREE.Color("rgb(187, 255, 0)");
        }
        if (index == 17) {//green
            _colour = new THREE.Color("rgb(87, 255, 0)");
        }
        if (index == 18) {//turquoise
            _colour = new THREE.Color("rgb(0, 255, 170)");
        }
        if (index == 19) {//light blue
            _colour = new THREE.Color("rgb(2, 152, 255)");
        }
        if (index == 20) {//blue
            _colour = new THREE.Color("rgb(19, 25, 255)");
        }
        if (index == 21) {//purple
            _colour = new THREE.Color("rgb(130, 0, 255)");
        }
        if (index == 22) {//pink
            _colour = new THREE.Color("rgb(255, 1, 243)");
        }
        if (index == 22) {//pink
            _colour = new THREE.Color("rgb(255, 1, 243)");
        }
        if (index == 23) {//red
            _colour = new THREE.Color("rgb(255, 0, 49)");
        }
        //-----
        //white button 26
        //grey button 24
        //black button 25
        if (index == 26) {//white
            _colour = new THREE.Color("rgb(255, 255, 255)");
        }
        if (index == 25) {//black
            _colour = new THREE.Color("rgb(0, 0, 0)");
        }
        if (index == 24) {//grey
            _colour = new THREE.Color("rgb(127, 127, 127)");
        }
        //-----
        this.changeCurrentColour(_colour);

    }
    NextPreset() {
        var presets = Object.values(jsonpreset.remembered);
        var preset = presets[this.currentPreset]["0"];
        this.SetPreset(preset);
        if (this.currentPreset < presets.length - 1) {
            this.currentPreset++;
        }
        else {
            this.currentPreset = 0;
        }
        this.ResetCurrentBrush();
    }
    PrevPreset() {
        var presets = Object.values(jsonpreset.remembered);
        this.currentPreset--;
        if (this.currentPreset < 0) {
            this.currentPreset = presets.length - 1;
        }
        var preset = presets[this.currentPreset]["0"];
        this.SetPreset(preset);
        this.ResetCurrentBrush();
    }
    ResetCurrentBrush() {
        this.SetupMaterials();
        this.currentBillboardObjectCount = 0;
        this.strokecount++;
        this.NodeRangeBegining = 0;
        if (this.nodes) {
            this.NodeRangeBegining = this.nodes.length;
        }
    }
    GetPressure() {
        if (!this.nodes.length) {
            return;
        }
        var pressureArray = [];
        var lengthRatio = this.nodes.length / 20.0;
        for (var i = 0; i <= 20; i++) {
            var ipos = i * lengthRatio;
            if (ipos < 0) ipos = 0;
            if (ipos > this.nodes.length - 1) ipos = this.nodes.length - 1;
            pressureArray.push(this.nodes[Math.floor(ipos)].pressure);
        }
        return pressureArray;
    }

    SetPreset(preset) {
        console.log("set preset");
        this.lineType = preset.lineType;
        this.mainColour = new THREE.Color(preset.mainColour);
        this.paintDecals = preset.paintDecals;
        this.paintLine = preset.paintLine;
        this.texture = preset.texture;
        this.textureAlt = preset.textureAlt;
        this.materials = preset.materials;
        this.objects = preset.objects;
        this.animationSpeed = preset.animationSpeed;
        this.animationSpeedAlt = preset.animationSpeedAlt;
        this.decalColour = new THREE.Color(preset.decalColour);
        this.facing = preset.facing;
        this.spacing = preset.spacing;
        this.maxlineWidth = preset.maxlineWidth;
        this.maxelementWidth = preset.maxelementWidth;
        this.jitter = preset.jitter;
        this.rotation = preset.rotation;
        this.rotationjitter = preset.rotationjitter;
        this.repeatingAmount = preset.repeatingAmount;
        this.dynamicSpeedSize = preset.dynamicSpeedSize;
        this.dynamicSpeedOpacity = preset.dynamicSpeedOpacity;
        this.dynamicSpeedSpecial = preset.dynamicSpeedSpecial;
        this.dynamicPressureSize = preset.dynamicPressureSize;
        this.dynamicPressureOpacity = preset.dynamicPressureOpacity;
        this.dynamicPressureSpecial = preset.dynamicPressureSpecial;
        this.SetupMaterials();
    }

    SetupMaterials() {
        console.log("setup materials");
        var materials = this.materials.split(",");
        var textures = this.texture.split(",");
        console.log("setup materials", textures);
        var noMaterialFound = true;
        //cache the materials-----
        for (var i = 0; i < this.materialsCache.length; i++) {
            if (this.materialsCache[i].textureName == this.texture
                && this.materialsCache[i].materialName == this.materials
            ) {
                this.currentMaterialCache = this.materialsCache[i];
                if (textures[1]) {
                    this.ObjectsMaterial = this.materialsCache[i].objMaterial;
                }
                noMaterialFound = false;
                break;
            }
        }
        //cache the materials-----
        if (noMaterialFound) {
            this.currentMaterialCache = new MaterialsCache(this.texture, this.materials);
            this.currentMaterialCache.colour = this.mainColour;
            this.currentMaterialCache.lineWidth = this.maxlineWidth * this.CurrentWidth;
            this.currentMaterialCache.startTime = Math.random();
            this.currentMaterialCache.time = 0;
            // this.LineMaterial =
            this.currentMaterialCache.lineMaterial =
                this.materialsHolder.makeMaterial(this, this.assetsPath + textures[0], materials[0]);
            if (textures[1]) {
                this.ObjectsMaterial =
                    this.currentMaterialCache.objMaterial = this.materialsHolder.makeMaterial(this, this.assetsPath + textures[1], materials[1]);
            }
            this.materialsCache.push(this.currentMaterialCache);
        }
        //-----old way of adding materials to the scene------
        // this.LineMaterial = this.materialsHolder.makeMaterial(
        //   this,
        //   this.assetsPath + textures[0],
        //   materials[0]
        // );
        // if (textures[1]) {
        //   this.ObjectsMaterial = this.materialsHolder.makeMaterial(
        //     this,
        //     this.assetsPath + textures[1],
        //     materials[1]
        //   );
        // }
        //-----old way of adding materials to the scene------
    }

    updateStroke() {
        this.UpdateBrush(this.parentGroup, this.getGeometry());
        this.addDecals();
    }
    changeCurrentColour(_colour) {
        let $this = this;
        this.mainColour = _colour;
    }
    changeCurrentWidth(delta) {
        var value = delta;
        this.CurrentWidth -= value * 0.01;
        this.CurrentWidth = THREE.Math.clamp(this.CurrentWidth, 0.2, 1.0);
        var _scaler = this.maxlineWidth;
        this.currentMaterialCache.lineWidth = _scaler * this.CurrentWidth;
    }
    changeCurrentWidthDirectly(value) {
        this.CurrentWidth = value;
        this.CurrentWidth = THREE.Math.clamp(this.CurrentWidth, 0.2, 1.0);
        var _scaler = this.maxlineWidth;
        this.currentMaterialCache.lineWidth = _scaler * this.CurrentWidth;

        this.DistanceFromBody = 0.005 + (0.025 * this.CurrentWidth);
    }
    UpdateBrush(_group, _Geometry) {
        if (this.strokecount == this.currentstrokecount) {
            //add to exsisting stroke
            const geo = new THREE.Geometry();
            for (var j = 0; j < this.geoCount; j++) {
                if (j < _Geometry.vertices.length) {
                    geo.vertices.push(_Geometry.vertices[j]);
                }
                else {
                    if (_Geometry.vertices.length <= 1) {
                        geo.vertices.push(new THREE.Vector3());
                    }
                    else {
                        geo.vertices.push(_Geometry.vertices[_Geometry.vertices.length - 1]);
                    }
                }
            }
            if (_Geometry.vertices.length < 2) {
                this.PaintingToolMeshLinesCache[this.PaintingToolMeshLinesCache.length - 1].visible = false;
            }
            else {
                this.PaintingToolMeshLinesCache[this.PaintingToolMeshLinesCache.length - 1].visible = true;
            }
            this.currentPaintingToolMeshLine.setGeometry(geo, function (p) {
                return p;
            });
        } else {
            this.currentstrokecount = this.strokecount;
            // create new stroke
            var linethreemesh = this.makeLine(this.geo);
            linethreemesh.visible = false;
            linethreemesh.frustumCulled = false;
            this.PaintingToolMeshLinesCache.push(linethreemesh);
            if (linethreemesh != null) {
                _group.add(linethreemesh);
            }
        }
    }
    makeLine(_Geometry) {
        if (!_Geometry) {
            return;
        }
        if (_Geometry.vertices.length <= 0) {
            return null;
        }
        console.log("makeLine");
        this.currentPaintingToolMeshLine = new PaintingToolMeshLine();
        return new THREE.Mesh(this.currentPaintingToolMeshLine.geometry, this.currentMaterialCache.lineMaterial);
    }
    getGeometry() {
        // if (!paintingToolManager.nodes) {
        //   return;
        // }

        let $this = this;
        const _nodes = $this.nodes;
        const geometry = new THREE.Geometry();
        //get a node range to read from.
        $this.NodeRangeEnding = _nodes.length + 1;
        //add some drawingdistance from body if in VR mode
        var drawingdistance = true;//!this.VRMode;disabled for now
        var int_counter = 0;

        _nodes.forEach(function (node) {
            if ((int_counter > $this.NodeRangeBegining) && (int_counter < $this.NodeRangeEnding)) {
                const position = node.position;//AFRAME.utils.coordinates.parse(node.position);
                if (drawingdistance) {
                    //add some drawingdistance from body
                    var _position = new THREE.Vector3(position.x, position.y, position.z);
                    let norml = new THREE.Vector3(node.normal.x, node.normal.y, node.normal.z);
                    _position.add(norml.multiplyScalar($this.DistanceFromBody));
                    geometry.vertices.push(_position);
                    //add some drawingdistance from body
                } else {
                    if (int_counter == $this.NodeRangeEnding - 2) {
                        var _position = new THREE.Vector3(position.x, position.y, position.z);
                        //console.log("position: " + _position.x + ", " + _position.y + ", " + _position.z);
                    }
                    geometry.vertices.push(position);
                }
            }
            int_counter++;
        });
        //---add dummy position---
        if ($this.NodeRangeEnding - $this.NodeRangeBegining > 2) {
            let _position = new THREE.Vector3($this.Temp_PaintingNode.position.x, $this.Temp_PaintingNode.position.y, $this.Temp_PaintingNode.position.z);
            let norml = new THREE.Vector3($this.Temp_PaintingNode.normal.x, $this.Temp_PaintingNode.normal.y, $this.Temp_PaintingNode.normal.z);
            _position.add(norml.multiplyScalar($this.DistanceFromBody));
            geometry.vertices.push(_position);
            int_counter++;
        }
        //---add dummy position---
        return geometry;
    }
    updateLineLength(pointerDown) {
        let $this = this;
        let retrunValue = false;
        if (pointerDown) {
            var lineLength = ($this.NodeRangeEnding - $this.NodeRangeBegining) / ($this.geoCount - 1);
            if (lineLength > 1.0) retrunValue = true;
            $this.currentMaterialCache.lineLength = THREE.Math.clamp(lineLength * 0.9, 0.01, 1.0);
            // $this.currentMaterialCache.pressures = $this.GetPressure();
            //console.log($this.materialsCache.length + ":$this.materialsCache[i].lineLength: " + $this.currentMaterialCache.lineLength);
        }
        return retrunValue;
    }
    changeBlendingModeBasedOnColour(lineMaterial, colour) {
        if (lineMaterial.name == "LineCloud") {
            var mcolour = colour;//new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var isBlack = (mcolour.r < 0.1 && mcolour.g < 0.1 && mcolour.b < 0.1);
            var BelndingMode = THREE.AdditiveBlending;
            if (isBlack) BelndingMode = THREE.NormalBlending;
            lineMaterial.blending = BelndingMode;
        }
    }
    runAnimation(scene, pointerDown) {
        let $this = this;
        var delta = $this.clock.getDelta();// * 20.0;
        $this.currentTime += delta;
        let slowUpdate = true;
        if ($this.currentTime - $this.lastTime > 0.06) {
            $this.lastTime = $this.currentTime;
            slowUpdate = true;
        } else {
            slowUpdate = false;
        }
        ////get camera position--------
        // var scene = this.el.sceneEl;
        var cameraEl = scene.camera;
        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(cameraEl.matrixWorld);
        // ////get camera position--------
        //--------run timer---------
        $this.timer += delta * 0.1;// * $this.animationSpeed;
        if ($this.timer >= 1.0)
            $this.timer -= 1.0;
        if ($this.timer <= -1.0)
            $this.timer += 1.0;
        //--------run timer---------
        // //-------Update the line materials------
        //------need to find some way to pass pressuers into the mesh line (probably with vertext), not this way.
        // if (pointerDown) {
        //     var lineLength = ($this.NodeRangeEnding - $this.NodeRangeBegining) / ($this.geoCount - 1);
        //     if (lineLength > 1.0) retrunValue = true;
        //     // $this.forceTouchUp();//
        //     $this.currentMaterialCache.lineLength = THREE.Math.clamp(lineLength * 0.9, 0.01, 1.0);
        //     // $this.currentMaterialCache.pressures = $this.GetPressure();
        //     //console.log($this.materialsCache.length + ":$this.materialsCache[i].lineLength: " + $this.currentMaterialCache.lineLength);
        // }
        //------need to find some way to pass pressuers into the mesh line (probably with vertext), not this way.

        for (var i = 0; i < $this.materialsCache.length; i++) {
            if ($this.materialsCache[i].lineMaterial) {
                if ($this.materialsCache[i].lineMaterial.name != "No custom Shader") {
                    if ($this.materialsCache[i].lineMaterial.uniforms.time) {
                        let shouldUpdate = slowUpdate;
                        if (i == $this.materialsCache.length - 1) shouldUpdate = true;
                        if (shouldUpdate) {
                            $this.materialsCache[i].time += delta * 0.1;
                            if ($this.materialsCache[i].time >= 1.0)
                                $this.materialsCache[i].time -= 1.0;
                            if ($this.materialsCache[i].time <= -1.0)
                                $this.materialsCache[i].time += 1.0;
                            var _time = ($this.materialsCache[i].time + $this.materialsCache[i].startTime) % 1.0;//($this.timer + $this.materialsCache[i].startTime) % 1.0;
                            $this.materialsCache[i].lineMaterial.uniforms.time.value = _time;
                            $this.materialsCache[i].lineMaterial.uniforms.lineWidth.value = $this.materialsCache[i].lineWidth;
                            //$this.materialsCache[i].lineMaterial.uniforms.color.value = new THREE.Color(Math.random(), Math.random(), Math.random() );
                            $this.materialsCache[i].lineMaterial.uniforms.lengthNormal.value = $this.materialsCache[i].lineLength;
                            // if($this.materialsCache[i].lineMaterial.uniforms.pressures)
                            //   $this.materialsCache[i].lineMaterial.uniforms.pressures.value = $this.materialsCache[i].pressures;
                            $this.materialsCache[i].lineMaterial.needsUpdate = true;
                        }
                    }
                } else {
                    if (i == $this.materialsCache.length - 1) {//only update the curently painting lineMaterial
                        $this.materialsCache[i].lineMaterial.uniforms.color.value = $this.materialsCache[i].colour;
                        $this.materialsCache[i].lineMaterial.uniforms.lineWidth.value = $this.materialsCache[i].lineWidth;
                        $this.materialsCache[i].lineMaterial.uniforms.lengthNormal.value = $this.materialsCache[i].lineLength;
                        $this.materialsCache[i].lineMaterial.needsUpdate = true;
                        $this.changeBlendingModeBasedOnColour($this.materialsCache[i].lineMaterial, $this.materialsCache[i].colour);
                    }
                }
            }
        }


        //-------Update the decal objects(BillboardObjects)------
        if ($this.BillboardObjects.length > 0) {
            $this.BillboardObjects.forEach(function (obj) {
                obj.UpdateDelta(worldPos, $this.timer);
            });
        }
        //-------Update the decal objects(BillboardObjects)------
    }

    addDecals() {
        let $this = this;
        // console.log("add decals");
        if (!$this.paintDecals)
            return;
        const nodes = $this.nodes;
        if ($this.spacing < 0) {
            var counter = 0;
            for (var j = $this.NodeRangeBegining; j < nodes.length; j++) {
                if (counter-- == 0) {
                    var vec3 = nodes[j].position;
                    var originalPos = nodes[j].position;
                    nodes[j].position = vec3;
                    var _DecalElement = new DecalElement($this.ObjectsMaterial, nodes[j], paintingToolManager, $this.materialsCache[$this.materialsCache.length - 1]);
                    if (_DecalElement.mesh && !nodes[j].nodeAttached) {
                        $this.parentGroup.add(_DecalElement.mesh);
                        $this.BillboardObjects.push(_DecalElement);
                        nodes[j].nodeAttached = true;
                    }
                    counter = -$this.spacing;
                    nodes[j].position = originalPos;
                }
            }
        }
        else {
            for (var j = $this.NodeRangeBegining; j < nodes.length; j++) {
                var vec3 = nodes[j].position;
                vec3 = new THREE.Vector3(vec3.x, vec3.y, vec3.z);
                var vec3target = nodes[j].position;
                vec3target = new THREE.Vector3(vec3target.x, vec3target.y, vec3target.z);
                if (j + 1 < nodes.length) {
                    vec3target = nodes[j + 1].position;
                    vec3target = new THREE.Vector3(vec3target.x, vec3target.y, vec3target.z);
                }
                var distance = vec3.distanceTo(vec3target);
                var direction = new THREE.Vector3();
                direction.subVectors(vec3target, vec3).normalize();
                var originalPos = nodes[j].position;
                //console.log("originalPos", originalPos);
                for (var i = 0; i <= $this.spacing; i++) {
                    if (!nodes[j].nodeAttached) {
                        var perc = parseFloat(i) / parseFloat($this.spacing + 1.0);
                        var lerpedpos = new THREE.Vector3();
                        var _direction = direction.clone();
                        lerpedpos.addVectors(vec3, _direction.multiplyScalar(distance * perc));
                        nodes[j].position = lerpedpos;
                        var _DecalElement = new DecalElement($this.ObjectsMaterial, nodes[j], paintingToolManager, $this.materialsCache[$this.materialsCache.length - 1]); //createDecal(nnodes[j]);

                        if (_DecalElement.mesh) {
                            $this.parentGroup.add(_DecalElement.mesh);
                            $this.BillboardObjects.push(_DecalElement);
                            nodes[j].nodeAttached = true;
                        } else {
                        }
                    }
                }
                nodes[j].position = originalPos;
            }
        }
    }
}

//var _BrushVariablesInput = new BrushVariablesEditorInputs();//for the editor

class BrushInputs {
    /**
     * @constructs BrushInputs
     * This is the data passed from the user to this brushstroke
     * @param {Object} n The properties.
     * @param {THREE.Color} n.colour the user colour selected.
     * @param {Float} n.size the user size selected.
     * @param {THREE.Vector3} n.position the user painted position
     * @param {THREE.Vector4} n.normal the user painted normal and distance from body mesh
     * @param {Float} n.speed the user painted speed
     * @param {Float} n.pressure the user painted pressure
     */
    constructor(n = {}) {
        this.colour = n.colour;
        this.size = n.size;
        this.position = n.position;
        this.normal = n.normal;
        this.speed = n.speed;
        this.pressure = n.pressure;
    }
}

export class DecalElement {
    constructor(_ObjectsMaterial, _node, _BrushVariablesInput, _parentMaterialCache) {
        if (!_ObjectsMaterial) {
            return;
        }
        this.parentMaterialCache = _parentMaterialCache;
        this.group = new THREE.Group();
        this.type = _BrushVariablesInput.objects;
        this.Node = _node;
        this._position = new THREE.Vector3(_node.position.x, _node.position.y, _node.position.z);
        //add some drawingdistance from body
        let norml = _node.normal.clone();
        this._position.add(norml.multiplyScalar(paintingToolManager.DistanceFromBody));
        //add some drawingdistance from body

        this._pressure = 1.0; //_node.pressure;
        this._speed = _node.speed;
        this.Material = _ObjectsMaterial;
        this._scale = _BrushVariablesInput.maxelementWidth * this.parentMaterialCache.lineWidth;
        // _BrushVariablesInput.maxelementWidth *
        // (this._pressure ? this._pressure : 0.25);
        this._shouldCreateObject = true;
        if (this.Material.name == "AnimatedMaterialLightning") {
            if (this._pressure < 0.5)
                this._shouldCreateObject = false;
        }
        // if (ObjectsMaterial.name == "ice") {
        //     if ((Math.random()*_BrushVariablesInput.spacing)>this._pressure)
        //         this._shouldCreateObject = false;
        // }
        if (!this._shouldCreateObject)
            return;
        if (_BrushVariablesInput.objects == "plain") {
            this.geometry = new THREE.PlaneGeometry(this._scale, this._scale, this._scale);
        }
        if (_BrushVariablesInput.objects == "shard") {
            this.geometry = new THREE.SphereBufferGeometry(this._scale, 2, 1);
        }
        if (_BrushVariablesInput.objects == "lsphere") {
            this.geometry = new THREE.SphereBufferGeometry(this._scale, 3, 3);
        }
        if (_BrushVariablesInput.objects == "rsphere") {
            this.geometry = new THREE.SphereBufferGeometry(this._scale, 2 + Math.random() * 3, 2 + Math.random() * 3);
        }
        if (_BrushVariablesInput.objects == "rock") {
            this.geometry = new THREE.SphereBufferGeometry(this._scale, 6, 6);
            this.geometry.scale(1, 0.25, 0.5);
        }
        if (_BrushVariablesInput.objects == "cube") {
            this.geometry = new THREE.BoxBufferGeometry(this._scale, this._scale, this._scale, 2, 2, 2);
        }
        if (_BrushVariablesInput.objects == "spike") {
            this.geometry = new THREE.DodecahedronBufferGeometry(this._scale, 2);
            //this.geometry = new THREE.IcosahedronBufferGeometry(this._scale);
        }
        this.delta = 0.0;
        this.startTime = Math.random();
        this._BrushVariablesInput = _BrushVariablesInput;
        this.mesh = new THREE.Mesh(this.geometry, this.Material);
        var randomAmoutx = (-0.5 + Math.random()) *
            2.0 *
            ((this._BrushVariablesInput.jitter * this._scale) / 10.0);
        var randomAmouty = (-0.5 + Math.random()) *
            2.0 *
            ((this._BrushVariablesInput.jitter * this._scale) / 10.0);
        var randomAmoutz = (-0.5 + Math.random()) *
            2.0 *
            ((this._BrushVariablesInput.jitter * this._scale) / 10.0);
        this.mesh.position.set(this._position.x + randomAmoutx, this._position.y + randomAmouty, this._position.z + randomAmoutz);
        this.rotationZ =
            _BrushVariablesInput.rotation +
            (-0.5 + Math.random()) * 2.0 * _BrushVariablesInput.rotationjitter;
    }
    stringToVector3(vec) {
        const res = vec.split(" ");
        var vect = new THREE.Vector3();
        vect.x = Number(res[0]);
        vect.y = Number(res[1]);
        vect.z = Number(res[2]);
        return vect;
    }
    UpdateDelta(_CameraworldPos, _delta) {
        if (!this.mesh)
            return;
        if (!this._shouldCreateObject)
            return;
        var cameraworldPos = AFRAME.utils.coordinates.parse(_CameraworldPos);
        //console.log("_CameraworldPos: " + vec3.x);
        // var vec3 = AFRAME.utils.coordinates.parse(_CameraworldPos);
        // console.log("_CameraworldPos: " + _CameraworldPos);
        //this._BrushVariablesInput.facing = "Camera"; //temp for now
        if (this._BrushVariablesInput.facing == "Camera") {
            this.LookAt(cameraworldPos);
            this.mesh.rotateZ(this.rotationZ);
        }
        if (this._BrushVariablesInput.facing == "Body") {
            var lookatposition = new THREE.Vector3(this.Node.normal.x, this.Node.normal.y, this.Node.normal.z); //undefiended, why???
            this.LookAt(lookatposition);
            this.mesh.rotateX(this.rotationZ);
            this.mesh.rotateY(1.571);
        }
        // if (this._BrushVariablesInput.facing == "Line") {
        //   var meshPosition =  AFRAME.utils.coordinates.parse(this.mesh.position);//this.mesh.position;
        //   //  meshPosition.transformDirection( this.mesh.matrixWorld );
        //   var position = AFRAME.utils.coordinates.parse(this._position);//this._position.clone();
        //   //  _position.transformDirection( this.mesh.matrixWorld );
        //   this.mesh.getWorldPosition(position);
        //   var direction = new THREE.Vector3();
        //   direction.subVectors(position, meshPosition);
        //   // direction.transformDirection( this.mesh.matrixWorld );
        //   this.LookAt(direction);
        //   this.mesh.rotateZ(this.rotationZ);
        // }
        // if (this._BrushVariablesInput.facing == "LineRight") {
        //   var meshPosition =  AFRAME.utils.coordinates.parse(this.mesh.position);//this.mesh.position;
        //   //  meshPosition.transformDirection( this.mesh.matrixWorld );
        //   var position = AFRAME.utils.coordinates.parse(this._position);//this._position;//.clone();
        //   //  _position.transformDirection( this.mesh.matrixWorld );
        //   this.mesh.getWorldPosition(position);
        //   var direction = new THREE.Vector3();
        //   direction.subVectors(position, meshPosition);
        //   // direction.transformDirection( this.mesh.matrixWorld );
        //   this.LookAt(direction);
        //   this.mesh.rotateX(this.rotationZ);
        //   this.mesh.rotateY(1.571);
        // }

        var _time = (_delta + this.startTime) % 1.0;
        this.delta = _time;//_delta;
        if (this.Material) {
            if (this.Material.name != "No custom Shader") {
                this.Material.uniforms.time.value = this.delta;
                this.Material.needsUpdate = true;
            }
            if (this.Material.uniforms.color) {
                this.Material.uniforms.color.value = this.parentMaterialCache.colour;
                this.Material.needsUpdate = true;
            }
        }
    }
    LookAt(pos) {
        if (!this._shouldCreateObject)
            return;
        this.mesh.lookAt(pos);
    }
}