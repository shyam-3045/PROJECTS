const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mysql = require("mysql2");
const { notify } = require("../routes/login");

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const con = mysql
  .createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASS,
    database: process.env.DB,
  })
  .promise();

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.render("login", { msg: "Access Denied !" }); // Added return here
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/");
  }
};

const RBAC = (role) => {
  return async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const [result] = await con.query(
        "SELECT Role FROM users WHERE User_ID = ?",
        [user_id]
      );
      if (result[0].Role !== role) {
        return res
          .status(403)
          .send(
            `<script>alert('Access Restricted !!!'); window.location.href = '/';</script>`
          );
      }

      next();
    } catch (error) {
      console.error("RBAC Middleware Error:", error);
      return res.status(500).send("Authentication problem!");
    }
  };
};

exports.login = (req, res) => res.render("login");
exports.signup = (req, res) => res.render("signup");

exports.pat_Profile = [
  verifyUser,
  RBAC("patient"),

  async (req, res) => {
    const userId = req.params.id;
    const [uppcommingResult] = await con.query(
      "SELECT * FROM appointments WHERE Patient_ID = ? AND Date >= ? AND Status != ?",
      [
        userId,
        new Date().getFullYear() +
          "/" +
          String(new Date().getMonth() + 1).padStart(2, "0") +
          "/" +
          String(new Date().getDate()).padStart(2, "0"),
        "cancelled",
      ]
    );
    const [Details] = await con.query(
      "SELECT * FROM patients WHERE Patient_ID = ?",
      [userId]
    );

    const date = uppcommingResult.map((el) => {
      const date = new Date(el.Date);
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (add +1 to make it 1-12)
      const day = String(date.getDate()).padStart(2, "0"); // Get day
      return { month, day };
    });

    res.render("Pat_Profile", {
      userId,
      user: req.user,
      uppcommingResult,
      date,
      Details: Details[0],
    });
  },
];

exports.pat_billing = [
  verifyUser,
  RBAC("patient"),

  async (req, res) => {
    try {
      const [rows] = await con.query(
        "select * from billing where Patient_ID=? and Status=?",
        [req.user.id, "Pending"]
      );
      const [PaidBills] = await con.query(
        "select * from billing where Patient_ID=? and Status=?",
        [req.user.id, "Paid"]
      );
      res.render("pat_billing", {
        user: req.user,
        userId: req.params.id,
        pendingBills: rows,
        PaidBills,
      });
    } catch (error) {
      console.error("Error fetching billing info:", error);
      res.status(500).send("Internal Server Error");
    }
  },
];

exports.pat_MedRecord = [
  verifyUser,
  RBAC("patient"),

  async (req, res) => {
    const id = req.params.id;
    const [result] = await con.query(
      "select * from medical_records where Patient_ID=?",
      [id]
    );
    res.render("pat_medical_Rec", {
      user: req.user,
      userId: req.params.id,
      result,
    });
  },
];

exports.dashboard_admin = [
  verifyUser,
  RBAC("admin"),

  async (req, res) => {
    const [Patients] = await con.query("select * from patients");
    const [Doctors] = await con.query("select * from doctors");
    const [Inventory] = await con.query("select * from Medicines");
    const[count_pat]=await con.query("select count(Patient_ID) as total_pat from patients ",)
    const total_patient=count_pat[0].total_pat
    const[count_doc]=await con.query("select count(Doctor_ID) as total_doc from doctors",)
    const total_doc=count_doc[0].total_doc
    const[count_med]=await con.query("select count(Medicine_ID) as total_med from medicines",)
    const total_med=count_med[0].total_med
    const [count_app] = await con.query(
      "SELECT COUNT(Appointment_ID) AS total_app FROM appointments WHERE DATE(Date) = CURDATE()"
    );
    const total_app=count_app[0].total_app

    res.render("dashboard_admin", {
      user: req.user,
      userId: req.params.id,
      Patients,
      Doctors,
      Inventory,
      total_patient,
      total_doc,
      total_med,
      total_app
    });
  },
];

exports.dashboard_pat = [
  verifyUser,
  RBAC("patient"),

  async (req, res) => {
    const userId = req.user.id;
    const [Details] = await con.query(
      "select * from patients where Patient_ID = ?",
      [userId]
    );
    if (
      !Details[0].age ||
      !Details[0].gender ||
      !Details[0].address ||
      !Details[0].healthCondition
    ) {
      res.render("dashboard_pat", {
        user: req.user,
        userId: req.params.id,
        msg: "Please Fill the Credentials !!!",
      });
    } else {
      res.render("dashboard_pat", { user: req.user, userId: req.params.id });
    }
  },
];

exports.dashboard_doc = [
  verifyUser,
  RBAC("doctor"),

  async (req, res) => {
    const [results] = await con.query(
      "SELECT *  FROM doctors d INNER JOIN users u ON d.Name = u.Username where d.Name=?;",
      [req.user.name]
    ); //Join command
    const ID = req.user.id;

    const [result1] = await con.query(
      "select * from appointments a inner join doctors d on d.Name = a.DoctorName where a.Date >=? and a.Status not in (?,?,?) and d.Name=?",
      [
        new Date().getFullYear() +
          "/" +
          String(new Date().getMonth() + 1).padStart(2, "0") +
          "/" +
          String(new Date().getDate()).padStart(2, "0"),
        "Scheduled",
        "Completed",
        "Cancelled",
        req.user.name,
      ]
    );

    const [result2] = await con.query(
      "select * from appointments a inner join doctors d on d.Name = a.DoctorName where a.Date >=? and a.Status=? and d.Name=?",
      [
        new Date().getFullYear() +
          "/" +
          String(new Date().getMonth() + 1).padStart(2, "0") +
          "/" +
          String(new Date().getDate()).padStart(2, "0"),
        "Scheduled",
        req.user.name,
      ]
    );

    const [result3] = await con.query(
      "SELECT * FROM medical_records WHERE Doctor_Name=?",
      [req.user.name]
    );

    const [doc_name] = await con.query(
      "SELECT DISTINCT Patient_ID FROM appointments WHERE DoctorName = ?",
      [req.user.name]
    );

    const patients = (
      await Promise.all(
        doc_name.map(async (ID) => {
          const [result] = await con.query(
            "SELECT * FROM patients WHERE Patient_ID=?",
            [ID.Patient_ID]
          );
          return result;
        })
      )
    ).flat();

    res.render("dashboard_doc", {
      user: req.user,
      userId: req.params.id,
      result: results[0],
      result1,
      result2,
      result3,
      patients,
    });
  },
];

exports.appointment_pat = [
  verifyUser,
  RBAC("patient"),

  async (req, res) => {
    try {
      const patient_id = req.user.id;

      const [uppcommingResult] = await con.query(
        "SELECT * FROM appointments WHERE Patient_ID = ? AND Date >= ? AND Status != ?",
        [
          patient_id,
          new Date().getFullYear() +
            "/" +
            String(new Date().getMonth() + 1).padStart(2, "0") +
            "/" +
            String(new Date().getDate()).padStart(2, "0"),
          "cancelled",
        ]
      );

      const [PreviousResult] = await con.query(
        "SELECT * FROM appointments WHERE Patient_ID = ? AND Date < ?",
        [
          patient_id,
          new Date().getFullYear() +
            "/" +
            String(new Date().getMonth() + 1).padStart(2, "0") +
            "/" +
            String(new Date().getDate()).padStart(2, "0"),
        ]
      );

      const [cancelled] = await con.query(
        "SELECT * FROM appointments WHERE Patient_ID = ? AND Status = ?",
        [patient_id, "cancelled"]
      );
      const [doctors] = await con.query("SELECT * FROM doctors ");

      // Render the template with data
      res.render("appointment", {
        user: req.user,
        uppcommingResult,
        PreviousResult,
        cancelled,
        doctors,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching appointments");
    }
  },
];

exports.post_signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    username,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    return res.render("signup", { msg: "incorrect password" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "patient";

    await con.query(
      "INSERT INTO users (FirstName,LastName,Username,Password, Role, Email, Phone) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [firstName, lastName, username, hashedPassword, role, email, phone]
    );
    const [pat_id] = await con.query(
      "select User_ID from users where Username=?",
      [username]
    );

    if (role === "patient") {
      await con.query(
        "INSERT INTO patients (Patient_ID,Name,Phone,Email) VALUES(?,?,?,?)",
        [pat_id[0].User_ID, username, phone, email]
      );
    }
    if (role === "doctor") {
      await con.query("INSERT INTO doctors (name,Phone,email) VALUES(?,?,?)", [
        username,
        phone,
        email,
      ]);
    }

    res.send(
      `<script>alert('Signup successful! Please log in.'); window.location.href = '/';</script>`
    );
  } catch (error) {
    console.error("Error inserting data:", error);
    res.send(
      `<script>alert('Error signing up. Please try again!'); window.location.href = '/signup';</script>`
    );
  }
};

exports.post_login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const [results] = await con.query("SELECT * FROM users WHERE Username =?", [
      username,
    ]);

    if (results[0].length === 0) {
      return res.render("login", { msg: "User not Found !" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.Password);

    if (!passwordMatch) {
      return res.render("login", { msg: "Incorrect password !" });
    }

    const token = jwt.sign(
      {
        id: user.User_ID,
        role: user.Role,
        name: user.Username,
        email: user.Email,
        healthCondition: user.healthCondition,
      },
      "your_secret_key",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });

    if (user.Role === "admin") {
      return res.redirect(`/admin_dash/${user.User_ID}`);
    } else if (user.Role === "doctor") {
      return res.redirect(`/doctor_dash/${user.User_ID}`);
    } else {
      return res.redirect(`/patient_dash/${user.User_ID}`);
    }
  } catch (error) {
    console.error("Database error:", error);
    res.send(
      `<script>alert('No users Found'); window.location.href = '/';</script>`
    );
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

exports.appoitnment_booked = [
  verifyUser,
  RBAC("patient"),

  async (req, res) => {
    try {
      const { department, doctor, date, time, appointmentType, reason } =
        req.body;
      if (
        new Date(date) >=
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        )
      ) {
        const patientId = req.user.id;
        console.log(patientId);
        const address = req.user.email || "Amritha Viswa Vidyapeetham";
        const email = req.user.email;
        const healthCondition = req.user.healthCondition || "Fever";
        const status = "pending";

        const sql = await con.query(
          "INSERT INTO appointments (Patient_ID,DoctorName,DepartmentName,Date,Time,AppointmentType,Status,PatientReason)  VALUES(?,?,?,?,?,?,?,?)",
          [
            patientId,
            doctor,
            department,
            date,
            time,
            appointmentType,
            status,
            reason,
          ]
        );
        res.redirect(`/patient_appointments/${req.user.id}`);
      } else {
        res.send(
          `<script>alert('Cant choose the Previous date'); window.location.href = '/patient_appointments/${req.user.id}';</script>`
        );
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error booking appointment");
    }
  },
];

exports.delete_appointment = [
  verifyUser,
  RBAC("patient"),

  async (req, res) => {
    const { appointment_id } = req.body;
    console.log(req.body);

    try {
      await con.query("DELETE FROM appointments WHERE Appointment_ID = ?", [
        appointment_id,
      ]);
      res.redirect(`/patient_appointments/${req.user.id}`);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).send("Error deleting appointment");
    }
  },
];

exports.save_doc_profile = async (req, res) => {
  let { name, specialization, phone, email, avail } = req.body;

  avail = avail || "available";
  const [result] = await con.query(
    "SELECT *  FROM doctors d INNER JOIN users u ON d.Name = u.Username where d.Name=?;",
    [name]
  );
  const id = result[0].User_ID;
  const doc_id = result[0].Doctor_ID;

  try {
    await con.query(
      "UPDATE doctors SET Name=?,Specialization = ?, Phone = ?, Email = ?, avail = ? WHERE Doctor_ID = ?",
      [name, specialization, phone, email, avail, doc_id]
    );
    await con.query(
      "UPDATE users SET Username=?, Email = ?, Phone = ? WHERE User_ID = ?",
      [name, email, phone, id]
    );
    res.redirect(`/doctor_dash/${id}`);
  } catch (error) {
    console.error("Error updating doctor profile:", error);
  }
};
exports.confirm_app = async (req, res) => {
  const [result] = await con.query(
    "SELECT *  FROM doctors d INNER JOIN users u ON d.Name = u.Username;"
  );
  const id = result[0].User_ID;
  const app_id = req.params.id;
  await con.query("update appointments set Status=? where Appointment_ID=?", [
    "Scheduled",
    app_id,
  ]);
  const [doc_name] = await con.query(
    "select DoctorName from appointments where Appointment_ID=?",
    [app_id]
  );
  const [doc_id] = await con.query(
    "select User_ID from users where Username=?;",
    [doc_name[0].DoctorName]
  );
  res.redirect(`/doctor_dash/${doc_id[0].User_ID}`);
};

exports.cancel_app = async (req, res) => {
  const [result] = await con.query(
    "SELECT *  FROM doctors d INNER JOIN users u ON d.Name = u.Username;"
  );
  const id = result[0].User_ID;
  const app_id = req.params.id;
  await con.query("update appointments set Status=? where Appointment_ID=?", [
    "Cancelled",
    app_id,
  ]);
  const [doc_name] = await con.query(
    "select DoctorName from appointments where Appointment_ID=?",
    [app_id]
  );
  const [doc_id] = await con.query(
    "select User_ID from users where Username=?;",
    [doc_name[0].DoctorName]
  );
  res.redirect(`/doctor_dash/${doc_id[0].User_ID}`);
};

exports.save_medicalRecords_doc = async (req, res) => {
  const id = req.params.id;
  const [doc_name] = await con.query(
    "select Username from users where User_ID=?",
    id
  );
  const { Patient_ID, Date, Diagnosis, Prescriptions, Notes } = req.body;
  const [priceRows] = await con.query(
    "SELECT Price FROM Medicines WHERE Medicine_name = ?",
    [Prescriptions]
  );
  await con.query(
    "insert into billing (Patient_ID,Medicine_name,Amount) values(?,?,?)",
    [Patient_ID, Prescriptions, priceRows[0].Price]
  );
  await con.query(
    "insert into medical_records (Patient_ID,Doctor_id,Doctor_Name,Date,Diagnosis,Prescriptions,Notes) values(?,?,?,?,?,?,?)",
    [
      Patient_ID,
      id,
      doc_name[0].Username,
      Date,
      Diagnosis,
      Prescriptions,
      Notes,
    ]
  );

  res.redirect(`/doctor_dash/${id}`);
};

exports.update_pat_profile = async (req, res) => {
  const id = req.params.id;
  const { name, age, gender, phone, address, Email, Health_Conditions } =
    req.body;
  await con.query(
    "update patients set Name=?,Age=?,Gender=?,Address=?,Phone=?,Email=?,Health_Conditions=? where Patient_ID=?",
    [name, age, gender, address, phone, Email, Health_Conditions, id]
  );
  await con.query(
    "update users set Username=?,Email=?,Phone=? where User_ID=?",
    [name, Email, phone, id]
  );

  res.redirect(`/patient_appointments/patient_profile/${id}`);
};

exports.make_payment = async (req, res) => {
  const id = req.params.id;
  const [user] = await con.query(
    "select Patient_ID from billing where Bill_ID=?",
    [id]
  );
  await con.query("update billing set Status=? where Bill_ID=?", ["Paid", id]);
  res.redirect(`/patient_billing/${user[0].Patient_ID}`);
};

exports.del_pat_admin = async (req, res) => {
  const id = req.params.id;
  //await con.query('delete from patients where Patient_ID=?',[id])
  const [pat_name] = await con.query(
    "select Name from patients where Patient_ID=?",
    [id]
  );
  console.log(`\nPatient ${pat_name[0].Name} has been Deleted!!!`);
  //await con.query('delete from users where Username=?',[name])
  const [Patients] = await con.query("select * from patients");
    const [Doctors] = await con.query("select * from doctors");
    const [Inventory] = await con.query("select * from Medicines");

    res.render("dashboard_admin", {
      user: req.user,
      userId: req.params.id,
      Patients,
      Doctors,
      Inventory,
    });
};

exports.del_doc_admin = async (req, res) => {
  const id = req.params.id;
  //await con.query('delete from doctors where Doctor_ID=?',[id])
  const [pat_name] = await con.query(
    "select Name from doctors where Doctor_ID=?",
    [id]
  );
  console.log(`\nDoctor ${pat_name[0].Name} has been Deleted!!!`);
  //await con.query('delete from users where Username=?',[name])
  const [Patients] = await con.query("select * from patients");
    const [Doctors] = await con.query("select * from doctors");
    const [Inventory] = await con.query("select * from Medicines");

    res.render("dashboard_admin", {
      user: req.user,
      userId: req.params.id,
      Patients,
      Doctors,
      Inventory,
    });
};

exports.del_med_admin = async (req, res) => {
  const id = req.params.id;
  await con.query('delete from medicines where Medicine_ID=?',[id])

  const [Patients] = await con.query("select * from patients");
    const [Doctors] = await con.query("select * from doctors");
    const [Inventory] = await con.query("select * from Medicines");

    res.render("dashboard_admin", {
      user: req.user,
      userId: req.params.id,
      Patients,
      Doctors,
      Inventory,
    });
};

exports.add_med=async (req,res)=>

  {
    const {name,stock,price,status} = req.body
    await con.query('insert into medicines (Medicine_name,Price,Qty,status) values(?,?,?,?)',[name,price,stock,status])
    res.redirect(`/admin_dash/${req.params.id}`)
  }

exports.edit_pat_admin=async (req,res)=>
  {
    const {id,name,age,Gender,Phone,Email,status}=req.body
    await con.query('update users set Username=?,Email=?,Phone=? where Username=?',[name,Email,Phone,name])
    await con.query('update patients set Name=?,Age=?,Gender=?,Phone=?,Email=?,Status=? where Patient_ID=?',[name,age,Gender,Phone,Email,status,id])
    res.redirect(`/admin_dash/${req.params.id}`)
  }

exports.edit_doc_admin=async (req,res)=>
    {
      const {id,name,spec,phone,email,status}=req.body
      await con.query('update users set Username=?,Email=?,Phone=? where Username=?',[name,email,phone,name])
      await con.query('update doctors set Name=?,Specialization=?,Phone=?,Email=?,avail=? where Doctor_ID=?',[name,spec,phone,email,status,id])
      res.redirect(`/admin_dash/${req.params.id}`)
    }
    