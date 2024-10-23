precision highp float;

varying vec2 vUV;

uniform sampler2D tex;        // Video texture
uniform sampler2D textTex;    // Text texture
uniform float time;
uniform float amplitude;
uniform float frequency;

void main() {
  vec2 uv = vUV;
  uv.y = 1.0 - uv.y;  // Flip Y to correct texture coordinates

  // Distort both X and Y coordinates
  float sineWaveX = sin(uv.y * frequency + time) * amplitude;
  float sineWaveY = cos(uv.x * frequency + time) * amplitude * 0.5;  // Slightly less vertical distortion
  
  // Combine X and Y distortions
  vec2 distort = vec2(sineWaveX, sineWaveY);
  
  // Apply the distortion to both textures
  vec4 videoColor = texture2D(tex, mod(uv + distort, 1.0));
  vec4 textColor = texture2D(textTex, mod(uv + distort, 1.0));
  
  // Mix the video and text textures. 
  // Ensure text alpha (transparency) is used to blend text over video.
  vec4 finalColor = mix(videoColor, textColor, textColor.a);  // Use alpha of text
  
  gl_FragColor = finalColor;
}
