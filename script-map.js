/* ======================================================
   WAIT DOM
====================================================== */
window.addEventListener(
  "load",

  () => {
    /* ======================================================
       MAP
====================================================== */
    const map = L.map("map", {
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: false,
      trackResize: true,
    }).setView([7.8804, 98.3923], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "OSM",
      maxZoom: 19,
    }).addTo(map);
    /* ======================================================
       🔥 ข้อความ GPS และการอัปเดตตำแหน่งแบบเรียลไทม์บนแผนที่
====================================================== */
    function updateGPSNode(lat, lng) {
      currentLat = lat;
      currentLng = lng;
      const latText = lat.toFixed(9);
      const lngText = lng.toFixed(9);

      // ประกาศขนาดและจุด Anchor ด้วยอาเรย์ตัวเลขชัดเจน
      const sizeWidth = 200;
      const sizeHeight = 80;
      const anchorX = 100;
      const anchorY = 75;

      const updatedIcon = L.divIcon({
        className: "custom-gps-node",
        iconSize: [sizeWidth, sizeHeight],
        iconAnchor: [anchorX, anchorY],
        html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; width: 200px; height: 80px; box-sizing: border-box;">
                <!-- 1. กล่องข้อความพิกัด GPS เรียลไทม์ -->
                <div style="background: rgba(30, 42, 54, 0.95); color: #ff557f; padding: 6px 12px; border-radius: 6px; font-family: monospace; font-size: 11px; font-weight: bold; border: 1px solid rgba(255, 0, 255, 0.4); box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 6px; white-space: nowrap; margin-bottom: 6px; position: relative; z-index: 9999;">
                    📌 <span style="color: #ffffff;">${latText}, ${lngText}</span> 🛠️
                    <!-- ติ่งสามเหลี่ยมชี้ลงล่าง -->
                    <div style="position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid rgba(30, 42, 54, 0.95);"></div>
                </div>
                
                <!-- 2. จุดสีชมพูศูนย์กลางพิกัดรถ -->
                <div style="width: 10px; height: 10px; background-color: #ff00ff; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 10px #ff00ff; margin-bottom: 5px; z-index: 10000; position: relative; box-sizing: border-box;"></div>
            </div>
        `,
      });

      // ค้นหาหมุดตัวเดิมเพื่อขยับย้ายพิกัดและสลับชุดข้อความ
      if (typeof gpsMarker !== "undefined" && gpsMarker) {
        gpsMarker.setLatLng([lat, lng]);
        gpsMarker.setIcon(updatedIcon);
      } else if (typeof marker !== "undefined" && marker) {
        marker.setLatLng([lat, lng]);
        marker.setIcon(updatedIcon);
      } else {
        gpsMarker = L.marker([lat, lng], { icon: updatedIcon }).addTo(map);
        map.setView([lat, lng], 16);
      }
    }
    /* ======================================================
        ฟังก์ชันเริ่มระบบติดตามตำแหน่งดักจับสัญญาณ GPS
====================================================== */
    function startTrackingSystem() {
      if (!navigator.geolocation) {
        console.error("เบราว์เซอร์นี้ไม่รองรับระบบ Geolocation");
        return;
      }

      navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // เรียกใช้งานฟังก์ชันวาดหมุดบนแผ่นแผนที่
          updateGPSNode(lat, lng);
        },
        (error) => {
          console.warn("สัญญาณดาวเทียมขัดข้องชั่วคราว: ", error.message);
          if (typeof map !== "undefined" && map) {
            map.invalidateSize(true);
          }
        },
        {
          enableHighAccuracy: true, // เปิดโหมดดึงพิกัดสดความแม่นยำสูง
          maximumAge: 0, // เคลียร์ค่าแคชทิ้งทลายข้อมูลเก่า
          timeout: 5000, // กำหนดการหมดเวลาค้นหา 5 วินาที
        },
      );
    }
    startTrackingSystem();

    /* ======================================================
       IMPORTANT
====================================================== */
    setTimeout(() => {
      map.invalidateSize();
    }, 1000);

    /* ======================================================
       GPS
====================================================== */
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const lat = position.coords.latitude;

        const lng = position.coords.longitude;

        currentLat = position.coords.latitude;
        currentLng = position.coords.longitude;
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 16);

        document.getElementById("liveLat").innerText = lat.toFixed(9);

        document.getElementById("liveLng").innerText = lng.toFixed(9);

        map.setView([lat, lng], 16);
      });
    }
  },
);

window.onload = function () {
  loadSelectedProfile();
  startRealGPS();

  console.log("APT PRO GPS SYSTEM READY");
};

function handleSocketMessage(data) {
  const parsedMessage = JSON.parse(data);
  switch (parsedMessage.command) {
    case "reload": {
      reloadPage();
    }
  }
}
// วางโค้ดชุดนี้ไว้ล่างสุดของไฟล์ script.js
if (typeof map !== "undefined" && map !== null) {
  // บังคับให้แผนที่สั่งคำนวณขนาดกล่องใหม่ เพื่อป้องกันอาการแผนที่เบี้ยวไปมุมจอ
  map.invalidateSize();

  // ดึงค่าพิกัดปัจจุบันของหมุด GPS แล้วสั่งให้แผนที่วาร์ปมาอยู่ตรงกลางกล่องทันที
  // (ระบบจะอิงจากพิกัดที่มีการตั้งค่าไว้ในตัวแปรระบบของคุณ)
  if (typeof lat !== "undefined" && typeof lng !== "undefined") {
    map.setView([lat, lng], map.getZoom());
  } else {
    // หากระบบหาตัวแปรพิกัดไม่เจอ ให้ใช้วิธีสั่งจับโฟกัสไปที่กึ่งกลางหน้าจอเดิม
    map.panTo(map.getCenter());
  }
}

if (typeof map !== "undefined" && map !== null) {
  map.invalidateSize(); // สั่งให้แผนที่คำนวณสัดส่วนกล่องกึ่งกลางใหม่
  map.panTo(map.getCenter()); // บังคับให้แผนที่วาร์ปมาอยู่ตรงกลางกล่องเป๊ะๆ
}
// ดักจับเหตุการณ์เมื่อผู้ใช้ย่อ/ขยาย หรือเปลี่ยนขนาดหน้าจออุปกรณ์
window.addEventListener("resize", function () {
  if (typeof map !== "undefined" && map !== null) {
    // สั่งให้แผนที่คำนวณสัดส่วนและขนาดหน้าจอใหม่ทันที
    map.invalidateSize();

    // บังคับให้แผนที่ดึงหมุดพิกัด GPS กลับมาไว้ตรงกลางกล่องเป๊ะๆ ไม่ให้หลุดโฟกัส
    map.panTo(map.getCenter());
  }
});

/* ======================================================
FORCE GPS PIN TO THE DEAD CENTER บังคับหมุดอยู่กลางกล่องเป๊ะๆ
/*======================================================*/
function centerLeafletMap() {
  if (typeof map !== "undefined" && map !== null) {
    // 1. สั่งให้แผนที่อัปเดตคำนวณสัดส่วนกล่องปัจจุบัน
    map.invalidateSize();

    // 2. ค้นหาหมุดพิกัดในระบบ (หาจากตัวแปรพิกัดของคุณ หรือดึงจากตำแหน่ง Marker ปัจจุบัน)
    let centerLatLng = map.getCenter();

    // หากในโค้ดของคุณมีตัวแปรเก็บพิกัด GPS เช่น lat, lng ให้เปิดใช้งานบรรทัดล่างนี้โดยลบ // ออก
    // if (typeof lat !== 'undefined' && typeof lng !== 'undefined') { centerLatLng = [lat, lng]; }

    // 3. สั่งวาร์ปแผนที่พร้อมตั้งค่าอนิเมชันให้หมุดดีดกลับมาอยู่กึ่งกลางกล่องพอดีเป๊ะ
    map.setView(centerLatLng, map.getZoom(), { animate: false });

    // 4. สั่งเลื่อนกล้องชดเชยระยะเพื่อแก้ปัญหาอาการเยื้องล่าง
    // เลื่อนกล้องลงเล็กน้อยเพื่อดันให้ตัวหมุดดีดกลับขึ้นมาตรงกลางกล่องพอดี
    map.panBy([0, -12]);
  }
}

// สั่งให้ทำงานทันทีตอนโหลดหน้าเว็บสำเร็จ
setTimeout(centerLeafletMap, 300);

// สั่งให้ทำงานโดยอัตโนมัติทุกครั้งที่มีการย่อ-ขยายหน้าจอคอมพิวเตอร์หรือมือถือ
window.addEventListener("resize", centerLeafletMap);
