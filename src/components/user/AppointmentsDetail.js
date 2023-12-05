import React, { useEffect, useState } from "react";
import contractABI from "./appointmentABI.json";
import { ethers } from "ethers";
const AppointmentsDetail = (props) => {
  const contractAddress = "0x31a3e125DaF2DAf9eD6f9eB3B11893035666ca1b";
  const [res, setRes] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  useEffect(() => {
    async function init() {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const createContract = await new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const address = await signer.getAddress();
      setWalletAddress(address);
      const getAllAppointments = await createContract
        .connect(signer)
        .getAllAppointments();
      setRes(getAllAppointments);
      //let x = await props.contract.methods.getAllAppointments().call();
      //setRes(x);
    }
    init();
  }, []);
  return (
    <div>
      <h1>Appointments Details</h1>
      <table
        style={{ width: "100% !important" }}
        className="table table-info table-hover table-striped-columns"
      >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Sender Address</th>
            <th scope="col">Patient Name</th>
            <th scope="col">Doctor Name</th>
            {props.type === "admin" && <th scope="col">Doctor ID</th>}
            <th scope="col">Slot Number</th>
            <th scope="col">Date</th>
            <th scope="col">Timestamp</th>
            <th scope="col">Report</th>
          </tr>
        </thead>
        <tbody className="table-hover">
          {res.map((ele, i) => {
            return ele.sender === walletAddress || props.type === "admin" ? (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>{ele.sender}</td>
                <td>{ele.patient}</td>
                <td>{ele.doctor}</td>
                {props.type === "admin" && (
                  <td scope="col">{ele.doctorNo.toString()}</td>
                )}
                <td>{ele.slotNo.toString()}</td>
                <td>{ele.date.toString()}</td>
                <td>{ele.timestamp.toString()}</td>
                <td>
                  <a target="_blank" href={ele.pdfuri.toString()}>
                    See Report
                  </a>
                </td>
              </tr>
            ) : (
              ""
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsDetail;
