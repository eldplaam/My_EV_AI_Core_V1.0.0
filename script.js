/* ======================================================
   CUBE CONTROL
====================================================== */
const cube = document.getElementById("scifiCube");

let isDragging = false;

let previousMousePosition = {
  x: 0,
  y: 0,
};
let currentRotation = {
  x: -20,
  y: 30,
};

cube.style.transform = `rotateX(${currentRotation.x}deg)
 rotateY(${currentRotation.y}deg)`;

/* MOUSE */
window.addEventListener("mousedown", (e) => {
  isDragging = true;

  previousMousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
});
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const deltaMove = {
    x: e.clientX - previousMousePosition.x,

    y: e.clientY - previousMousePosition.y,
  };

  currentRotation.y += deltaMove.x * 0.4;

  currentRotation.x -= deltaMove.y * 0.4;

  cube.style.transform = `rotateX(${currentRotation.x}deg)
     rotateY(${currentRotation.y}deg)`;

  previousMousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

/* TOUCH */
window.addEventListener("touchstart", (e) => {
  isDragging = true;

  previousMousePosition = {
    x: e.touches[0].clientX,

    y: e.touches[0].clientY,
  };
});

window.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const deltaMove = {
    x: e.touches[0].clientX - previousMousePosition.x,

    y: e.touches[0].clientY - previousMousePosition.y,
  };

  currentRotation.y += deltaMove.x * 0.4;

  currentRotation.x -= deltaMove.y * 0.4;

  cube.style.transform = `rotateX(${currentRotation.x}deg)
     rotateY(${currentRotation.y}deg)`;

  previousMousePosition = {
    x: e.touches[0].clientX,

    y: e.touches[0].clientY,
  };
});

window.addEventListener("touchend", () => {
  isDragging = false;
});

/* ======================================================
   LIVE DATA
====================================================== */
const speedValue = document.getElementById("speedValue");

const batteryValue = document.getElementById("batteryValue");

const evScene = document.getElementById("evScene");
const evCube = document.getElementById("evCube");

let evDragging = false;
let evPrevX = 0;
let evPrevY = 0;

let evRotX = -20;
let evRotY = 25;

evScene.addEventListener("mousedown", (e) => {
  evDragging = true;
  evPrevX = e.clientX;
  evPrevY = e.clientY;
});

window.addEventListener("mouseup", () => {
  evDragging = false;
});

window.addEventListener("mousemove", (e) => {
  if (!evDragging) return;

  handleEvMove(e.clientX, e.clientY);
});

evScene.addEventListener("touchstart", (e) => {
  evDragging = true;

  evPrevX = e.touches[0].clientX;
  evPrevY = e.touches[0].clientY;
});

window.addEventListener("touchend", () => {
  evDragging = false;
});

evScene.addEventListener("touchmove", (e) => {
  if (!evDragging) return;

  handleEvMove(e.touches[0].clientX, e.touches[0].clientY);
});

const rpmValue = document.getElementById("rpmValue");

const energyLevel = document.getElementById("energyLevel");

let speed = 86;
let battery = 92;
let rpm = 3240;

setInterval(() => {
  speed += Math.floor(Math.random() * 5 - 2);

  if (speed < 40) speed = 40;

  if (speed > 160) speed = 160;

  String(speed).padStart(3, "0");
}, 1000);

setInterval(() => {
  battery -= 0.03;

  if (battery < 15) {
    battery = 92;
  }

  batteryValue.innerText = Math.floor(battery) + "%";

  energyLevel.style.height = battery + "%";
}, 2000);

setInterval(() => {
  rpm += Math.floor(Math.random() * 250 - 125);

  if (rpm < 1000) rpm = 1000;

  if (rpm > 8000) rpm = 8000;

  rpmValue.innerText = rpm;
}, 900);

/* ======================================================
   POPUP
====================================================== */
window.addEventListener("load", () => {
  /* ======================================================
   POPUP SYSTEM
====================================================== */

  const popup = document.querySelector("#popup");

  const openButtons = document.querySelectorAll(".openPopup");

  const saveBtn = document.querySelector("#saveBtn");

  const closeBtn = document.querySelector("#closeBtn");

  const speedInput = document.querySelector("#speedInput");

  const batteryInput = document.querySelector("#batteryInput");

  const rpmInput = document.querySelector("#rpmInput");

  /* OPEN POPUP */
  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      popup.style.display = "flex";
    });
  });

  /* CLOSE */
  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  /* SAVE */
  saveBtn.addEventListener("click", () => {
    if (speedInput.value) {
      speed = parseInt(speedInput.value);

      speedValue.innerText = String(speed).padStart(3, "0");
    }

    if (batteryInput.value) {
      battery = parseInt(batteryInput.value);

      batteryValue.innerText = battery + "%";

      energyLevel.style.height = battery + "%";
    }

    if (rpmInput.value) {
      rpm = parseInt(rpmInput.value);

      rpmValue.innerText = rpm;
    }

    popup.style.display = "none";
  });

  /* CLICK OUTSIDE */
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
});

/* ======================================================
   POPUP OPEN
====================================================== */

const popup = document.getElementById("popup");

document.querySelectorAll(".openPopup").forEach((btn) => {
  btn.onclick = () => {
    popup.style.display = "flex";
  };
});

/* ======================================================
   CLOSE
====================================================== */

function closePopup() {
  popup.style.display = "none";
}

/* ======================================================
   SAVE
====================================================== */

function saveSystemData() {
  const speedInput = document.getElementById("speedInput");

  const batteryInput = document.getElementById("batteryInput");

  const rpmInput = document.getElementById("rpmInput");

  /* SPEED */
  if (speedInput.value) {
    speed = parseInt(speedInput.value);

    speedValue.innerText = String(speed).padStart(3, "0");
  }

  /* BATTERY */
  if (batteryInput.value) {
    battery = parseInt(batteryInput.value);

    batteryValue.innerText = battery + "%";

    energyLevel.style.height = battery + "%";
  }

  /* RPM */
  if (rpmInput.value) {
    rpm = parseInt(rpmInput.value);

    rpmValue.innerText = rpm;
  }

  closePopup();
}

/* ======================================================
             CLICK OUTSIDE
====================================================== */

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    closePopup();
  }
});
