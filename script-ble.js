let isScanning = false;
function calculateDistance(rssi) {
  const txPower = -59;

  if (!rssi || rssi === 0) {
    return (Math.random() * 4 + 1).toFixed(1);
  }

  const ratio = rssi / txPower;

  if (ratio < 1.0) {
    return Math.pow(ratio, 10).toFixed(1);
  }

  return (0.89976 * Math.pow(ratio, 7.7095) + 0.111).toFixed(1);
}

async function startRadarBleScan() {
  const radarBleScreen = document.getElementById("radar-ble-screen");

  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,

      optionalServices: ["battery_service", "device_information"],
    });

    const deviceName = device.name || "Unknown";

    const deviceId = device.id;

    const mockRssi = Math.floor(Math.random() * 50) - 90;

    const distance = calculateDistance(mockRssi);

    const oldBlip = document.getElementById(`radar-blip-${deviceId}`);

    if (oldBlip) {
      oldBlip.remove();
    }

    const angle = Math.random() * Math.PI * 2;

    const radius = (distance / 5) * 42;

    const x = 50 + Math.cos(angle) * radius;

    const y = 50 + Math.sin(angle) * radius;

    const radarBlip = document.createElement("div");

    radarBlip.className = "radar-ble-blip";

    radarBlip.id = `radar-blip-${deviceId}`;

    radarBlip.style.left = `${x}%`;

    radarBlip.style.top = `${y}%`;

    const radarCard = document.createElement("div");

    radarCard.className = "radar-ble-blip-card";

    radarCard.innerHTML = `

        <div class="radar-ble-device-name">
        📡 ${deviceName}
        </div>

        <div class="radar-ble-device-id">
        ${deviceId.substring(0, 12)}...
        </div>

        <div
        class="radar-ble-device-id"
        style="color:#00ff66;">
        RANGE ~${distance}M
        </div>

        `;

    radarBlip.appendChild(radarCard);

    radarBleScreen.appendChild(radarBlip);
  } catch (err) {
    console.log(err);

    alert("Bluetooth scan cancelled");
  }
}

document.getElementById("scan-btn").addEventListener("click", async () => {
  if (isScanning) return;

  isScanning = true;

  const radarBleScreen = document.getElementById("radar-ble-screen");

  document.querySelectorAll(".radar-ble-blip").forEach((el) => el.remove());

  radarBleScreen.classList.add("scanning");

  try {
    await startRadarBleScan();
  } finally {
    setTimeout(() => {
      radarBleScreen.classList.remove("scanning");

      isScanning = false;
    }, 15000);
  }
});
