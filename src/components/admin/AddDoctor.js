import React, { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import userContext from "../../context/users/userContext";
import axios from "axios";
import Web3 from "web3";
export const AddDoctor = (props) => {
  const contractAddress = '0x31a3e125DaF2DAf9eD6f9eB3B11893035666ca1b';
  const [details, setDetails] = useState({
    doctorName: "",
    doctorEmail: "",
    doctorPassword: "",
    doctorSpeciality: "",
    phone: "",
    date: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [Tommorowdate, setTommorowDate] = useState();
  const context = useContext(userContext);
  let web3 = window.web3;
  const ethereum = window.ethereum;
  const [account, setacc] = useState([]);

  const { bookAppointment,getUser } = context;
  useEffect(() => {
    async function loadBlockchainData() {
      web3 = new Web3(ethereum);
      let x = await web3.eth.getAccounts();
      setacc(x);
    }
    async function getAllDoctors() {
      const resp = await fetch(
        "http://localhost:5000/api/auth/doctor/getalldoctors",
        {
          method: "GET",
        }
      );

      const doctorArray = await resp.json();
      setDoctors(doctorArray);
    }
    async function getAppointmentDetails() {
      if (localStorage.getItem("token")) {
        const user = await getUser(localStorage.getItem("token"));
        if (user._id) {
          details.patientName = user.name;
          //details.doctorId = value from dropdown
          //details.doctorName = doctor name from db
        } else {
          console.log("Auth token not found");
        }
      }
    }
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    let dd = currentDate.getDate();
    let mm = currentDate.getMonth() + 1;
    let yyyy = currentDate.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    setTommorowDate(`${yyyy}-${mm}-${dd}`);
    loadBlockchainData();
    getAllDoctors();
    getAppointmentDetails();
  }, []);

  // 
  const getAllDoctorsAgain =async ()=> {
    const resp = await fetch(
      "http://localhost:5000/api/auth/doctor/getalldoctors",
      {
        method: "GET",
      }
    );

    const doctorArray = await resp.json();
    setDoctors(doctorArray);
  }
  // 

  const onSubmit = async (e) => {
    e.preventDefault();

    let isSubmit = true;
    console.log(details)
    if (isSubmit && details.phone!=="" && details.doctorEmail !=="" && details.doctorName !=="" && details.doctorPassword !== "" && details.doctorSpeciality !== "") {
      details.date = Tommorowdate;
      try {
        const request = await axios.post('http://localhost:5000/api/auth/doctor/createdoctor',{
          name : details.doctorName,
          email : details.doctorEmail,
          password : details.doctorPassword,
          dob : details.date,
          phoneNumber : details.phone,
          specialization : details.doctorSpeciality
        })
        if(request){
          alert("Doctor Add Successfuly")
          getAllDoctorsAgain()
        }
        else{
          alert("Check The Fields!")
        }
      } catch (error) {
        alert("Server Error"+ error);
      }
    }
    else{
      alert("Fill All The Fields!")
    }
  };

  const onChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <h1>Add Doctor</h1>
          <br></br>
          <Form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column" }}
            method="POST"
          >
            <Form.Group
              style={{ display: "flex", flexDirection: "row" }}
              className="mb-3"
              controlId="doctor_patient_Details"
            >
              <div style={{ marginRight: "30px" }}>
                <Form.Label>Doctor Name</Form.Label>
                <Form.Control onChange={onChange} name="doctorName" type="text" placeholder="Doctor Name" value={details.doctorName} />
              </div>
              <div style={{ marginRight: "30px" }}>
                <Form.Label>Doctor Email</Form.Label>
                <Form.Control onChange={onChange} name="doctorEmail" value={details.doctorEmail} type="email" placeholder="name@example.com" />
              </div>

              
            </Form.Group>
            <Form.Group
              style={{ display: "flex", flexDirection: "row" }}
              className="mb-1"
              controlId="doctor_patient_Details"
            >
            </Form.Group>

            <div style={{ marginRight: "30px" }}>
                <Form.Label>Doctor Password</Form.Label>
                <Form.Control onChange={onChange} value={details.doctorPassword} name="doctorPassword" type="password" placeholder="Doctor Password" />
              </div>
              <div style={{ marginRight: "30px" , marginTop : "10px" }}>
                <Form.Label>Doctor Specialization</Form.Label>
                <Form.Control onChange={onChange} value={details.doctorSpeciality} name="doctorSpeciality" type="text" placeholder="Doctor Speaciality" />
              </div>

              <Form.Group
              style={{ display: "flex", flexDirection: "row" }}
              className="mb-1"
              controlId="doctor_patient_Details"
            >
            </Form.Group>

            <div style={{ marginRight: "30px" }}>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control onChange={onChange} value={details.phone} name="phone" type="number" placeholder="Phone Number" />
              </div>
            <div style={{ marginRight: "30px" , marginTop : "20px" }}>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </div>
        <div style={{ position: "absolute", left: "700px" }}>
          <h1>Doctor Details</h1>
          <table className="table table-info table-hover table-striped-columns">
            <thead>
              <tr>
                <th scope="col">Doctor ID</th>
                <th scope="col">Doctor Name</th>
                <th scope="col">Specialization</th>
              </tr>
            </thead>
            <tbody className="table-hover">
              {doctors.map((ele, i) => {
                return (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{ele.name}</td>
                    <td>{ele.specialization}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
