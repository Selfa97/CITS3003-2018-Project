#version 130

varying vec2 texCoord;  // The third coordinate is always 0.0 and is discarded
varying vec4 position;
varying vec3 normal;

uniform vec4 LightPosition;
uniform vec4 LightPosition2;
uniform float Shininess;
uniform vec3 AmbientProduct, DiffuseProduct, SpecularProduct;
uniform mat4 ModelView;

uniform sampler2D texture;

vec4 color;

out vec4 fColor;

void main()
{
 // Transform vertex position into eye coordinates
    vec3 pos = (ModelView * position).xyz;


    // The vector to the light from the vertex    
    vec3 Lvec = LightPosition.xyz - pos;

    vec3 Lvec2 = LightPosition2.xyz - pos;

    

    // Unit direction vectors for Blinn-Phong shading calculation
    vec3 L = normalize( Lvec );   // Direction to the light source
    vec3 L2 = normalize(Lvec2);	  //Direction to second light source
    vec3 E = normalize( -pos );   // Direction to the eye/camera
    vec3 H = normalize( L + E );  // Halfway vector
    vec3 H2 = normalize (L2 + E); //Halfway vector for the second light

    // Transform vertex normal into eye coordinates (assumes scaling
    // is uniform across dimensions)
    vec3 N = normalize( (ModelView*vec4(normal, 0.0)).xyz );

    // Compute terms in the illumination equation
    vec3 ambient = AmbientProduct;

    float Kd = max( dot(L, N), 0.0 );
    vec3  diffuse = Kd*DiffuseProduct;

    //second lights diffuse product
    float Kd2 = max( dot(L2, N), 0.0);
    vec3 diffuse2 = Kd2*DiffuseProduct;

    float Ks = pow( max(dot(N, H), 0.0), Shininess );
    vec3  specular = Ks * SpecularProduct;
    
    //second lights specular product
    float  Ks2 = pow( max(dot(N, H2), 0.0), Shininess );
    vec3 specular2 = Ks2 * SpecularProduct;
    
    if (dot(L, N) < 0.0 ) {
	specular = vec3(0.0, 0.0, 0.0);
    } 
    if (dot(L2, N) < 0.0) {
	specular2 = vec3(0.0, 0.0, 0.0);
    }

    // globalAmbient is independent of distance from the light source
    vec3 globalAmbient = vec3(0.1, 0.1, 0.1);

    //BRAD: Float to calculate fade as light 1 moves away from the object via dot 
    // Need to square root as dot gives square of the vectors magnitude
    float fade = sqrt(dot(Lvec,Lvec));

    color.rgb = ((ambient + diffuse)/fade) + globalAmbient  + ambient + diffuse2;

    color.a = 1.0;
 
  
    //BRAD: Separating specular from texture colour, so objects shine towards white
    gl_FragColor = color * texture2D( texture, texCoord * 2.0 ) + vec4(specular/fade +
    specular2, 1.0);
}
