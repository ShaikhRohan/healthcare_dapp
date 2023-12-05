import React, { useState, useEffect , useContext } from "react";
import Web3 from "web3";

// export const MedicineDetail = (props) => {
//     const [medRes, setMedRes] = useState([]);
//     useEffect(() => {
//         async function init() {
//             console.log(props.contract)
//             let x = await props.contract.methods.getAllMedicines().call();
//             setMedRes(x);
//         }
//         init();
//     }, [])
//     return (
//         <div>
//             <h1>Medicine Details</h1>
//             <table className="table table-info table-hover table-striped-columns">
//                 <thead>
//                     <tr>
//                         <th scope="col">#</th>
//                         <th scope="col">Sender address</th>
//                         <th scope="col">RFID</th>
//                         <th scope="col">Lot No</th>
//                         <th scope="col">Medicine</th>
//                         <th scope="col">Qty</th>
//                         <th scope="col">Price Per Unit</th>
//                         <th scope="col">Manufacturer</th>
//                         <th scope="col">Expiry Date</th>
//                         <th scope="col">Block No</th>
//                         <th scope="col">Timestamp</th>
//                     </tr>
//                 </thead>
//                 <tbody className="table-hover">
//                     {medRes.map((ele, i) => {
//                         return (
//                             <tr key={i}>
//                                 <th scope="row">{i + 1}</th>
//                                 <td>{ele.sender}</td>
//                                 <td>{ele.rfid}</td>
//                                 <td>{ele.lotNo}</td>
//                                 <td>{ele.medName}</td>
//                                 <td>{ele.qty}</td>
//                                 <td>{ele.ppu}</td>
//                                 <td>{ele.manufacturer}</td>
//                                 <td>{ele.expiryDate}</td>
//                                 <td>{ele.blockNo}</td>
//                                 <td>{ele.timestamp}</td>
//                             </tr>
//                         )
//                     })}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

import contractABI from "../user/appointmentABI.json";
import { ethers } from "ethers";
import PharmacistContext from "../../context/pharmscists/pharmacistContext";

export const MedicineDetail = (props) => {
  const [details, setDetails] = useState(null);
  const PharmaContext = useContext(PharmacistContext);
  const { getPharmacist } = PharmaContext;
  const contractAddress = "0x31a3e125DaF2DAf9eD6f9eB3B11893035666ca1b";
  const [res, setRes] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  function filterDoctorsByName(doctorArray, targetDoctorName) {
    return doctorArray.filter(doctor => doctor.doctor === targetDoctorName);
  }
  useEffect(() => {
    async function init() {
        let json = {}
        const token = localStorage.getItem('pharmaToken');
        json = await getPharmacist(token);
        setDetails(json);
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
      const theFilterValue = filterDoctorsByName(getAllAppointments , json.name)
      setRes(theFilterValue);
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
