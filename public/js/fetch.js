document.addEventListener('DOMContentLoaded', async () => {    
  //ทำให้ดึงข้อมูลมาทีละหน้า 
  let currentPage = 1;
  let currentStatus = "all";
  const itemsPerPage = 10;
  let allData = []; // เก็บข้อมูลทั้งหมด

  //================== //
  //มีแก้อยู่ ยังไม่เข้าใจโค๊ดขขนาดนั้น 
  //ตารางหน้าปัญหา
  const page_problem_Container = document.getElementById('page-problem-content');
  if (page_problem_Container) {
  axios.get("/main/problemlist/data")
    .then(res => {
      allData = res.data; 
      renderPage(); // แสดงตารางและ pagination หน้าแรก
    })
    .catch(err => console.error(err));
  }

  // const page_problem_Container = document.getElementById('page-problem-content');
  // if (page_problem_Container) {
  // axios.get("/main/problemlist/data")
  //   .then(response => {
  //     const data = response.data; // axios จะใส่ข้อมูล JSON ไว้ใน response.data
  //     const table = document.getElementById("problemTable");
  //     table.innerHTML = ""; // เคลียร์ข้อมูลเก่าก่อนแสดงใหม่

  //     data.forEach(row => {
  //       const tr = document.createElement("tr");
  //       tr.innerHTML = `
  //         <td>${row.problemid}</td>
  //         <td>${new Date(row.createat).toLocaleString("th-TH")}</td>
  //         <td>${row.createby || "-"}</td>
  //         <td>${row.title || "-"}</td>
  //         <td>${row.categoryname || "-"}</td>
  //         <td class="col-description">${row.description || "-"}</td>
  //         <td>${row.departmentname || "-"}</td>
  //         <td>${row.statusstate || "-"}</td>
  //         <td>${row.prioritylevel || "-"}</td>
  //         <td>${row.location || "-"}</td>
  //         <td>${row.comment || "-"}</td>
  //       `;
  //       table.appendChild(tr);
  //     });
  //   })
  //   .catch(error => {
  //     console.error("Error fetching problems:", error);
  //   });

  const page_myWorkassignment_content = document.getElementById('page-myWorkassignment-content');
  if (page_myWorkassignment_content) {
    fetch("/main/myWorkAssignment/data")
      .then(res => res.json())
      .then(data => {
        const table = document.getElementById("myWorkAssignmentTable");
        table.innerHTML = "";
        data.forEach(row => {
          const tr = document.createElement("tr");
          tr.dataset.createby = row.createby || "-";
          tr.innerHTML = `
            <td>${row.problemid}</td>
            <td>${new Date(row.createat).toLocaleString("th-TH", { timeZone: "Asia/Bangkok", dateStyle: "short", timeStyle: "short" })}</td>
            <td>${row.title || "-"}</td>
            <td>${row.categoryname || "-"}</td>
            <td class="col-description">${row.description || "-"}</td>
            <td>${row.departmentname || "-"}</td>
            <td>${row.statusstate || "-"}</td>
            <td>${row.prioritylevel || "-"}</td>
            <td>${row.location || "-"}</td>
            <td>${new Date(row.assignat).toLocaleString("th-TH", { timeZone: "Asia/Bangkok", dateStyle: "short", timeStyle: "short" })}</td>
            <td>${
              row.resolvetime
                ? row.resolvetime >= 60
                  ? Math.floor(row.resolvetime / 60) + " ชั่วโมง" + (row.resolvetime % 60 !== 0 ? " " + (row.resolvetime % 60) + " นาที" : "")
                  : row.resolvetime + " นาที"
                : "-"
            }</td>
          `;
          table.appendChild(tr);
        });
      })
      .catch(err => console.error("Error fetching problems:", err));
  }

  const page_myWorkHistory_content = document.getElementById('page-myWorkHistory-content');
  if (page_myWorkHistory_content) {
    fetch("/main/myWorkHistory/data")
      .then(res => res.json())
      .then(data => {
        const table = document.getElementById("myWorkAssignmentHistoryTable");
        table.innerHTML = "";
        data.forEach(row => {
          const tr = document.createElement("tr");
          tr.dataset.createby = row.createby || "-";
          tr.innerHTML = `
            <td>${row.problemid}</td>
            <td>${new Date(row.createat).toLocaleString("th-TH", { timeZone: "Asia/Bangkok", dateStyle: "short", timeStyle: "short" })}</td>
            <td>${row.title || "-"}</td>
            <td>${row.categoryname || "-"}</td>
            <td class="col-description">${row.description || "-"}</td>
            <td>${row.departmentname || "-"}</td>
            <td>${row.statusstate || "-"}</td>
            <td>${row.prioritylevel || "-"}</td>
            <td>${row.location || "-"}</td>
            <td>${new Date(row.assignat).toLocaleString("th-TH", { timeZone: "Asia/Bangkok", dateStyle: "short", timeStyle: "short" })}</td>
            <td>${row.finishat ? new Date(row.finishat).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }) : "ยังไม่เสร็จ"}</td>
          `;
          table.appendChild(tr);
        });
      })
      .catch(err => console.error("Error fetching problems:", err));
  }

  const page_home_Container = document.getElementById('page-main-content');
  if (page_home_Container) {
    // ดึงชื่อผู้ใช้
    fetch("/main/data")
      .then(res => {
        if (!res.ok) throw new Error("HTTP status " + res.status);
        return res.json();
      })
      .then(data => {
        const el = document.getElementById("firstname");
        if (!el) return;
        const name = data && (data.firstname || data.lastname)
          ? `${data.firstname || ''} ${data.lastname || ''}`.trim()
          : "ไม่ทราบชื่อ";
        el.textContent = name;
      })
      .catch(err => console.error("Error fetching user data:", err));

    // ดึง latest 3 problems
    fetch("/main/problemlastest/data")
      .then(res => {
        if (!res.ok) throw new Error("HTTP status " + res.status);
        return res.json();
      })
      .then(data => {
        const list = document.getElementById("reportBox_lastest");
        list.innerHTML = "";
        if (data.length === 0) {
          list.innerHTML = '<li class="text-muted py-3">ไม่มีรายการปัญหา</li>';
          return;
        }
        data.forEach(row => {
          const li = document.createElement("li");
          li.className = "report-item py-3";
          li.style.cursor = "pointer";
          li.dataset.id = row.problemid || '';
          li.dataset.title = row.title || '-';
          li.dataset.description = row.description || '-';
          li.dataset.status = row.statusstate || '-';
          li.dataset.priority = row.prioritylevel || '-';
          li.dataset.createat = row.createat || '-';
          li.dataset.createby = row.createby || '-';
          li.dataset.department = row.departmentname || '-';
          li.dataset.location = row.location || '-';
          li.innerHTML = `• ${row.title || "-"} <span class="text-muted">   (${row.statusstate})</span>`;
          list.appendChild(li);
        });
      })
      .catch(err => {
        console.error("Error fetching latest problems:", err);
        document.getElementById("reportBox_lastest").innerHTML = '<li class="text-danger py-3">เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
      });
  }

  //ตารางหน้าประวัติของฉัน
  const page_history_Container = document.getElementById('page-history-content');
  if (page_history_Container) {

  axios.get("/main/myHistory/data")
    .then(response => {
      const data = response.data; // ✅ axios แปลง JSON ให้อัตโนมัติ
      const table = document.getElementById("problemTable");
      table.innerHTML = "";

      if (data.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="11" class="text-center text-muted py-3">ไม่มีรายการปัญหา</td>`;
        table.appendChild(tr);
        return;
      }

      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.problemid}</td>
          <td>${new Date(row.createat).toLocaleString("th-TH")}</td>
          <td>${row.title || "-"}</td>
          <td>${row.categoryname || "-"}</td>
          <td class="col-description">${row.description || "-"}</td>
          <td>${row.departmentname || "-"}</td>
          <td>${row.statusstate || "-"}</td>
          <td>${row.prioritylevel || "-"}</td>
          <td>${row.location || "-"}</td>
          <td>${row.comment || "-"}</td>
        `;
        table.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Error fetching myHistory data:", err);
      // สามารถแจ้งผู้ใช้ได้ เช่น alert หรือแสดงในหน้า
      // alert("เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ");
    });
}

  // ส่งฟอร์มปัญหา
  const form = document.getElementById("problemForm");
  if (form) {
    const sessionRes = await fetch("/api/check-session", { credentials: "include" });
    const sessionData = await sessionRes.json();
    if (!sessionData.loggedIn) {
      alert("ยังไม่ได้ login");
      return window.location.href = "/";
    }
    const userId = sessionData.user.usersid;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        title: document.getElementById("problemname").value,
        description: document.getElementById("description").value,
        createby: userId,
        categoryid: document.getElementById("categoryDropdown").value,
        statusid: 1,
        departmentid: document.getElementById("departmentDropdown").value,
        priorityid: document.getElementById("priorityDropdown").value,
        location: document.getElementById("locationDropdown").value,
        comment: document.getElementById("comment")?.value || ""
      };
      const res = await fetch("/add-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
      const result = await res.json();
      if (result.success) {
        alert("ส่งข้อมูลสำเร็จ!");
        form.reset();
        window.location.href = "/main";
      } else {
        alert("เกิดข้อผิดพลาด: " + result.message);
      }
    });
  }

  // ดึง dropdown
  const dropdown = document.getElementById("categoryDropdown");
  if (dropdown) {
    let loaded = false;
    dropdown.addEventListener("click", () => {
      if (loaded) return;
      fetch("/main/category")
        .then(res => res.json())
        .then(data => {
          data.forEach(category => {
            const option = document.createElement("option");
            option.value = category.categoryid;
            option.textContent = category.categoryname;
            dropdown.appendChild(option);
          });
          loaded = true;
        })
        .catch(err => console.error(err));
    });
  }

  const dropdowndep = document.getElementById("departmentDropdown");
  if (dropdowndep) {
    let loadeddep = false;
    dropdowndep.addEventListener("click", () => {
      if (loadeddep) return;
      fetch("/main/department")
        .then(res => res.json())
        .then(data => {
          data.forEach(department => {
            const option = document.createElement("option");
            option.value = department.departmentid;
            option.textContent = department.departmentname;
            dropdowndep.appendChild(option);
          });
          loadeddep = true;
        })
        .catch(err => console.error(err));
    });
  }

  const dropdownpri = document.getElementById("priorityDropdown");
  if (dropdownpri) {
    let loadedpri = false;
    dropdownpri.addEventListener("click", () => {
      if (loadedpri) return;
      fetch("/main/priority")
        .then(res => res.json())
        .then(data => {
          data.forEach(servicelevelagreement => {
            const option = document.createElement("option");
            option.value = servicelevelagreement.priorityid;
            option.textContent = servicelevelagreement.prioritylevel;
            dropdownpri.appendChild(option);
          });
          loadedpri = true;
        })
        .catch(err => console.error(err));
    });
  }

  // ตรวจสอบ role
  fetch("/main/users/data")
    .then(res => {
      if (!res.ok) throw new Error("HTTP status " + res.status);
      return res.json();
    })
    .then(user => {
      const nameEl = document.getElementById("firstname");
      if (nameEl) nameEl.textContent = user.firstname || "ไม่ระบุชื่อ";

      const menus = ["menu-home", "menu-totalproblem", "menu-mywork", "menu-myhistory", "menu-myworkhistory"];
      menus.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });

      if (user.rolename === "user") {
        ["menu-home", "menu-totalproblem", "menu-myhistory"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = "inline-block";
        });
      } else if (user.rolename === "Admin" || user.rolename === "Technician") {
        ["menu-home", "menu-totalproblem", "menu-mywork", "menu-myworkhistory"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = "inline-block";
        });
      } else {
        console.warn("ไม่พบ role ที่ตรงกับผู้ใช้:", user.roleid);
      }
    })
    .catch(err => console.error("Error loading user info:", err));

    //ปุ่มเลือกสถานะ
    const tableBody = document.getElementById("problemTable");
    

    const statusMap = {
      "all": "all",
      "pending": "Pending/รอข้อมูล",
      "in-progress": "Open/กำลังดำเนินการ",
      "completed": "Closed/ปิดงานแล้ว"
    };

    //จำไม่ได้ว่าอันนี้เพิ่มมาใหม่รึเปล่าเช็คเอานะคะ
    // ฟังก์ชันดึงข้อมูลจาก API
    function loadData() {
        axios.get("/main/problemlist/data") // เปลี่ยนเป็น endpoint จริงของคุณ
            .then(res => {
                console.log(res.data);
                allData = res.data; // เก็บข้อมูลทั้งหมด
                renderTable(allData); // แสดงตารางทั้งหมดตอนแรก
            })
            .catch(err => {
                console.error("Error fetching data:", err);
            });
    }

    // ฟังก์ชันสร้าง row ของ table
    // function renderTable(data) {
    //     tableBody.innerHTML = ""; // ล้างตารางก่อน
    //     data.forEach(item => {
    //         const row = document.createElement("tr");
    //         row.innerHTML = `
    //             <td>${item.problemid}</td>
    //             <td>${item.createat}</td>
    //             <td>${item.createby}</td>
    //             <td>${item.title}</td>
    //             <td>${item.categoryname}</td>
    //             <td>${item.description}</td>
    //             <td>${item.departmentname}</td>
    //             <td>${item.statusstate}</td>
    //             <td>${item.prioritylevel}</td>
    //             <td>${item.location}</td>
    //             <td>${item.comment || ''}</td>
    //         `;
    //         tableBody.appendChild(row);
    //     });
    // }

    // ================== //
    // ฟังก์ชันสร้าง row ของ table
    function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.problemid}</td>
        <td>${new Date(item.createat).toLocaleString("th-TH")}</td>
        <td>${item.createby || "-"}</td>
        <td>${item.title || "-"}</td>
        <td>${item.categoryname || "-"}</td>
        <td>${item.description || "-"}</td>
        <td>${item.departmentname || "-"}</td>
        <td>${item.statusstate || "-"}</td>
        <td>${item.prioritylevel || "-"}</td>
        <td>${item.location || "-"}</td>
        <td>${item.comment || "-"}</td>
      `;
      tableBody.appendChild(tr);
    });
  }


  // ================== //
  // ฟังก์ชัน render pagination
  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = "";

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    paginationInfo.textContent = `แสดง ${startItem}-${endItem} จาก ${totalItems} รายการ`;

    // ปุ่ม Prev
    const prev = document.createElement("li");
    prev.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prev.innerHTML = `<a class="page-link" href="#">Prev</a>`;
    prev.addEventListener("click", e => {
      e.preventDefault();
      if (currentPage > 1) { currentPage--; renderPage(); }
    });
    pagination.appendChild(prev);

    // ปุ่มเลขหน้า
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", e => {
        e.preventDefault();
        currentPage = i;
        renderPage();
      });
      pagination.appendChild(li);
    }

    // ปุ่ม Next
    const next = document.createElement("li");
    next.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    next.innerHTML = `<a class="page-link" href="#">Next</a>`;
    next.addEventListener("click", e => {
      e.preventDefault();
      if (currentPage < totalPages) { currentPage++; renderPage(); }
    });
    pagination.appendChild(next);
  }

   // ================== //
  // ฟังก์ชัน render หน้า (รวม filter + pagination)
  function renderPage() {
    let filteredData = currentStatus === "all"
      ? allData
      : allData.filter(item => item.statusstate === statusMap[currentStatus]);

    const totalItems = filteredData.length;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    renderTable(pageData);
    renderPagination(totalItems);
  }
    // ================== //
    // ฟังก์ชันกรองสถานะ อันนี้มีแก้ให้พอกดปุ่มแล้วเปลี่ยนสีข้างหลังปุ่มตามด้วย 
    function filterStatus(status) {
          if(status === "all") {
              console.log(filtered);
              renderTable(allData);
          } else {
              // const mappedStatus = statusMap[status];
              // const filtered = allData.filter(item => item.statusstate === mappedStatus);
              // console.log("Mapping status:", mappedStatus);
              // console.log("Filtered items:", filtered);
              const filtered = allData.filter(item => item.statusstate === status);
              renderTable(filtered);
          }
      }
      document.querySelectorAll('.btn-filter').forEach(button => {
      button.addEventListener('click', () => {
        //ลบคลาส active ออกจากปุ่มทั้งหมด
        document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
        //เพิ่มคลาส active ให้ปุ่มที่คลิก
        button.classList.add('active');

        //อ่านค่า data-filter ของปุ่ม
        const status = button.dataset.filter;
        currentStatus = status;
        currentPage = 1; // กลับไปหน้าแรก
        renderPage();
      });
    });
    loadData(); // เริ่มโหลดข้อมูล อันนี้ต้องใส่ไม่งั้นจะไม่โหลดข้อมูลมาแสดง

  // ================== //
  // ฟังก์ชันโหลดข้อมูลจาก server พร้อม pagination และ filter
  function loadProblems(page = 1, status = "all") {
    currentPage = page;
    currentStatus = status;

    axios.get(`/main/pblistpaginte/data?page=${page}&status=${status}`)
        .then(res => {
            const data = res.data.data;
            const totalItems = res.data.totalItems;
            const totalPages = res.data.totalPages;

            renderTable(data);
            renderPagination(page, totalPages, totalItems);
        })
        .catch(err => console.error(err));
  }
    
});
