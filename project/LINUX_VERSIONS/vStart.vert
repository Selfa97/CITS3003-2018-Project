#version 130 //Sets shader version to 1.30
attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vTexCoord;

attribute vec4 boneIDs;
attribute vec4 boneWeights;

varying vec2 texCoord;
varying vec4 color;
varying vec4 position;
varying vec3 normal;

uniform mat4 ModelView;
uniform mat4 Projection;

uniform mat4 boneTransforms[64];

uniform float texScale;


void main()
{
    //calculating the bone transformations for the 4 bone IDs using given bone weights
    ivec4 bone = ivec4(boneIDs); //convert boneIDs to vec4
    mat4 boneTransform = boneWeights[0] * boneTransforms[bone[0]] +
		         boneWeights[1] * boneTransforms[bone[1]] +
                         boneWeights[2] * boneTransforms[bone[2]] +
                         boneWeights[3] * boneTransforms[bone[3]];

    //Transforming vertex position and normal with bone transformation matrix
    vec4 positionTransform =  boneTransform * vec4(vPosition,1.0);
    vec3 normalTransform = mat3 (boneTransform) * vNormal;

    position = positionTransform;
    normal = normalTransform;

    gl_Position = Projection * ModelView * position;
    texCoord = vec2(vTexCoord[0] * texScale, vTexCoord[1] * texScale);  
}
