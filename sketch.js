let myShader;
let video;
let graphics;  // Graphics buffer for the text
let textArray = ["In","Response", "To", "You", "Don't", "Hate", "AI,", "You", "Hate", "Captialism", "By", "Charlie", "Engman"];
let currentTextIndex = 0;
let lastTime = 0;  // Time tracking for text change
let textSpeed = 700;  // Change text every 2 seconds (2000 ms)

// Define portrait canvas dimensions (matching the container)
let canvasWidth = 400;
let canvasHeight = 800;

function preload() {
  // Load the vertex and fragment shader files
  myShader = loadShader('shader.vert', 'shader.frag');
  
  // Load the video file (make sure it is in your project folder)
  video = createVideo(['reel(compressed).mp4']);  // Replace with your video file
}

function setup() {
  // Create a canvas with portrait dimensions and attach it to the container div
  let canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
  canvas.parent('canvas-container');  // Attach the canvas to the container

  video.loop();  // Loop the video continuously
  video.hide();  // Hide the default video element, we will use the texture instead

  // Create a graphics buffer for the text, matching the portrait dimensions
  graphics = createGraphics(canvasWidth, canvasHeight);
  
  noStroke();
}

function draw() {
  background(220);

  // Control frequency and amplitude based on time (sin and cos of frameCount)
  let frequencyValue = 5 + sin(frameCount * 0.001) * 1;  // Varies smoothly between 0 and 10
  let amplitudeValue = 0.3 + cos(frameCount * 0.02) * 0.6;  // Varies smoothly between 0.5 and 1.5
  
  // Check if the defined time (textSpeed) has passed to update the text
  if (millis() - lastTime > textSpeed) {
    currentTextIndex = (currentTextIndex + 1) % textArray.length;  // Loop through the text array
    lastTime = millis();  // Reset the timer
  }
  
  // Update the text buffer with the current text
  graphics.clear();  // Clear previous text
  graphics.background(0, 0);  // Transparent background
  graphics.textSize(100);
  graphics.textAlign(CENTER, CENTER);
  graphics.fill(255, 255, 255, 255);  // White text with full opacity
  graphics.text(textArray[currentTextIndex], canvasWidth / 2, canvasHeight / 2);  // Set current text in center
  
  shader(myShader);  // Activate the shader

  // Pass the video feed and text graphics to the shader
  myShader.setUniform('tex', video);  // Use the video texture instead of webcam feed
  myShader.setUniform('textTex', graphics);  // Text graphics as a texture
  myShader.setUniform('time', frameCount * 0.01);
  myShader.setUniform('frequency', frequencyValue);  // Pass noise-based frequencyValue to the shader
  myShader.setUniform('amplitude', amplitudeValue);  // Pass noise-based amplitudeValue to the shader
  
  // Draw the rectangle for the shader (covers the entire canvas)
  rect(-canvasWidth / 2, -canvasHeight / 2, canvasWidth, canvasHeight);
}

function windowResized() {
  // Adjust the canvas to match the new portrait dimensions
  resizeCanvas(canvasWidth, canvasHeight);
  graphics.resizeCanvas(canvasWidth, canvasHeight);  // Resize the graphics buffer as well
}
