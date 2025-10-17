document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // 1. Form Validation
    // ===================================
    const form = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const errorDiv = document.getElementById('passwordError');

    if (form && passwordInput && confirmPasswordInput && errorDiv) {
        form.addEventListener('submit', (event) => {
            if (passwordInput.value !== confirmPasswordInput.value) {
                errorDiv.textContent = 'รหัสผ่านทั้งสองช่องไม่ตรงกัน';
                errorDiv.style.color = 'red';
                event.preventDefault();  // ป้องกันการส่งฟอร์มแล้วโหลดหน้าใหม่
            } else {
                errorDiv.textContent = '';
            }
        });
    }

    // ===================================
    // 2. Modal เปิด/ปิด (แบบธรรมดา)
    // ===================================
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('modal');

    if (openBtn && closeBtn && modal) {
        // เปิด Modal
        openBtn.addEventListener('click', () => {
            modal.classList.add('open');
        });

        // ปิด Modal
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
        });

        // ปิดเมื่อคลิกพื้นหลังดำ
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });

        // ปิดด้วยปุ่ม ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                modal.classList.remove('open');
            }
        });
    }

    // ===================================
    // 3. Click Event - Table & List
    // ===================================
    document.addEventListener('click', function(e) {
            
            // === เช็ค li ก่อน (สำหรับ reportBox) ===
        const li = e.target.closest('li.report-item');
        const reportBox = e.target.closest('#reportBox_lastest');

        if (li && reportBox) {
            const problemLastestData = {
                id: li.dataset.id,
                title: li.dataset.title,
                description: li.dataset.description,
                status: li.dataset.status,
                priority: li.dataset.priority,
                createat: li.dataset.createat,
                createby: li.dataset.createby,
                department: li.dataset.department,
                location: li.dataset.location
            };
            
            if (problemLastestData.title && problemLastestData.title !== '-') {
                openProblemDetail(problemLastestData);
            } else {
                console.warn('ไม่มีข้อมูลใน dataset');
            }
            return; // จบเคส li
        }

        // === เช็ค td (สำหรับตาราง) ===
        const td = e.target.closest('td');
        if (!td) return;

        const row = td.closest('tr');
        if (!row) return;

        // หา table ที่ td นี้อยู่ในนั้น
        const table = td.closest('table');
        if (!table) return;

        // หา <th id="th_description"> ภายในตารางนั้นโดยเฉพาะ
        const descriptionHeader = table.querySelector('th#th_description');
        if (!descriptionHeader) return; // ถ้าไม่มีคอลัมน์นี้ก็ข้ามไปเลย

        // หา index ของคอลัมน์ description ภายในตารางนั้น
        const headers = Array.from(descriptionHeader.parentElement.children);
        const descriptionColumnIndex = headers.indexOf(descriptionHeader);

        // หาว่าคลิกอยู่คอลัมน์ไหน
        const cells = Array.from(row.children);
        const columnIndex = cells.indexOf(td);

        // ถ้าคลิกในคอลัมน์รายละเอียด
        if (columnIndex === descriptionColumnIndex) {
            // สร้าง object problemData โดยอิงจาก id ของ <th>
            const data = {};
            headers.forEach((header, idx) => {
                const id = header.id?.replace(/^th_/, ''); // เช่น 'th_title' -> 'title'
                if (id){
                     data[id] = cells[idx]?.textContent.trim() || '';
                }
                
                
            });
            
            const createbyHeader = table.querySelector('th#th_createby');

                // ถ้าไม่มี header 'th_createby'
             if (!createbyHeader) {
                data.createby = row.dataset.createby || '-';
             }           

            
          //  data.createby = td.closest("tr")?.dataset.createby || '-';
            console.log('ข้อมูลจากตาราง:', data);
            console.log('ข้อมูล createby:', data.createby);
            openProblemDetail(data);
        }
    });


  const attachBtn = document.getElementById("attachBtn");
  const fileInput = document.getElementById("fileInput");
  const previewArea = document.getElementById("previewArea");
  if(attachBtn && fileInput && previewArea){
  // ====================================================
  // =========== เมื่อคลิกปุ่ม attach → เปิดเลือกไฟล์ ===========
  // ====================================================
  attachBtn.addEventListener("click", () => fileInput.click());

  // เมื่อผู้ใช้เลือกไฟล์
  fileInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    previewArea.innerHTML = ""; // เคลียร์ preview เดิม

    files.forEach(file => {
      const fileType = file.type;
      const fileBox = document.createElement("div");
      fileBox.classList.add("preview-box");

      // ถ้าเป็นรูป (jpg, png)
      if (fileType.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.alt = file.name;
          img.classList.add("preview-thumb");

          const name = document.createElement("p");
          name.textContent = file.name;
          name.classList.add("preview-name");

          fileBox.appendChild(img);
          fileBox.appendChild(name);
          previewArea.appendChild(fileBox);
        };
        reader.readAsDataURL(file);
      }
      // ถ้าเป็น PDF
      else if (fileType === "application/pdf") {
        const icon = document.createElement("div");
        icon.classList.add("pdf-icon");
        icon.textContent = "📄";

        const name = document.createElement("p");
        name.textContent = file.name;
        name.classList.add("preview-name");

        fileBox.appendChild(icon);
        fileBox.appendChild(name);
        previewArea.appendChild(fileBox);
      }
    });
  });

    }

    
    
}); // ปิด DOMContentLoaded


// ===================================
// 4. ฟังก์ชันเปิด Modal (ใช้ Bootstrap)
// ===================================
window.openProblemDetail = function(problemData) {
    const modalElement = document.getElementById('problemDetailModal');
    
    // เช็คว่า Modal มีอยู่จริง
    if (!modalElement) {
        console.error('ไม่พบ Modal element');
        return;
    }
    
    const modal = new bootstrap.Modal(modalElement);
    
    // อัพเดทข้อมูลใน Modal
    const titleElement = document.getElementById('problemDetailModalLabel');
    const detailElement = document.getElementById('problemDetail');
    const statusElement = document.getElementById('problemStatus');
    const priorityElement = document.getElementById('problemPriority');
    const createDateElement = document.getElementById('createDate');
    const createrElement = document.getElementById('creater');
    const creadtedByDepartmentElement = document.getElementById('creadtedByDepartment');
    const createdLocationElement = document.getElementById('createdLocation');


    if (titleElement) {
        titleElement.innerHTML = '<i class="fas fa-info-circle me-2"></i>' + 
                                 (problemData.title || 'ชื่องาน');
    }
    
    // แสดงข้อมูลอื่นๆ ด้วย
    if (detailElement) 
        detailElement.textContent = problemData.description || '-';
    if (statusElement) 
        statusElement.textContent = problemData.status || '-';
    if (priorityElement) 
        priorityElement.textContent = problemData.priority || '-';
    if (createDateElement)
        createDateElement.textContent = problemData.createat || '-';
    if (createrElement)
        createrElement.textContent = problemData.createby || '-';

    if (creadtedByDepartmentElement)
        creadtedByDepartmentElement.textContent = problemData.department || '-';
    if (createdLocationElement)
        createdLocationElement.textContent = problemData.location || '-';

    // เปิด Modal
    modal.show();
};

