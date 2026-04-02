async function startRender() {
  const files = document.getElementById("images").files;
  const texts = document.getElementById("texts").value.split("\n");
  const filter = document.getElementById("filter").value;
  const musicFile = document.getElementById("music").files[0];
  const progress = document.getElementById("progress");

  if (files.length === 0) {
    alert("Upload gambar dulu!");
    return;
  }

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream);

  let chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);

  recorder.onstop = () => {
    progress.innerText = "Download siap...";
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vidora.webm";
    a.click();
  };

  recorder.start();

  let images = [];

  for (let file of files) {
    let img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise(res => img.onload = res);
    images.push(img);
  }

  let i = 0;
  let frame = 0;
  let alpha = 0;
  let scale = 1;

  function draw() {
    progress.innerText = "Rendering scene " + (i + 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let img = images[i];

    scale += 0.002;
    let w = canvas.width * scale;
    let h = canvas.height * scale;

    if (alpha < 1) alpha += 0.02;
    ctx.globalAlpha = alpha;

    ctx.filter = filter;
    ctx.drawImage(img, -(w - canvas.width)/2, -(h - canvas.height)/2, w, h);

    ctx.globalAlpha = 1;
    ctx.filter = "none";

    ctx.fillStyle = "white";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 6;

    ctx.fillText(texts[i] || "", canvas.width/2, canvas.height - 30);

    frame++;

    if (frame % 120 === 0) {
      i++;
      frame = 0;
      alpha = 0;
      scale = 1;

      if (i >= images.length) {
        recorder.stop();
        return;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();

  if (musicFile) {
    const audio = new Audio(URL.createObjectURL(musicFile));
    audio.play();
  }
}
  let images = [];

  for (let file of files) {
    let img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise(res => img.onload = res);
    images.push(img);
  }

  let index = 0;
  let frame = 0;
  let alpha = 0;
  let scale = 1;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let img = images[index];

    // ZOOM
    scale += 0.002;
    let w = canvas.width * scale;
    let h = canvas.height * scale;

    // FADE
    if (alpha < 1) alpha += 0.02;
    ctx.globalAlpha = alpha;

    // FILTER CINEMATIC
    ctx.filter = "brightness(0.9) contrast(1.2)";

    ctx.drawImage(img, -(w - canvas.width)/2, -(h - canvas.height)/2, w, h);

    ctx.globalAlpha = 1;
    ctx.filter = "none";

    // TEXT PER SCENE
    let currentText = textsInput[index] || "";

    ctx.fillStyle = "white";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";

    ctx.shadowColor = "black";
    ctx.shadowBlur = 6;

    ctx.fillText(currentText, canvas.width/2, canvas.height - 30);

    frame++;

    if (frame % 120 === 0) {
      index++;
      alpha = 0;
      scale = 1;

      if (index >= images.length) {
        recorder.stop();
        return;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();

  // MUSIC
  if (musicFile) {
    const audio = new Audio(URL.createObjectURL(musicFile));
    audio.play();
  }
}
