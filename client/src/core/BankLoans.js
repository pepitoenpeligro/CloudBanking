import React, {useState} from "react";
import Layout from "./Layout";
import axios from "axios";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import Table from "react-bootstrap/Table";
import * as RB from "react-bootstrap";
import Lottie from "react-lottie";

const BankLoans = ({ history }) => {
  const [values, setValues] = useState({
    loans: [],
    loansVisible: false,
    inputAmount: "",
    inputDuration: "",
  });

  const {
    loans,
    loansVisible,
    inputAmount,
    inputDuration,
  } = values;

  const animationOptions = {
    loop: true,
    autoplay: true,
    path: "https://assets8.lottiefiles.com/packages/lf20_4wDd2K.json"
    // height: 100,
    // rendererSettings: {
    //   preserveAspectRatio: "xMidYMid slice",
    // },
  };

  React.useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/loans`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(function (response) {
      console.log(response);
      console.log(response.data);
      setValues((values) => ({
        ...values,
        loans: response.data,
        loansVisible: true,
      }));
      console.log("Loans object");
      console.log(loans);
      toast.success("Your bank loans have been recovered");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processMicroserviceRequest = (event) => {
    setValues((values) => ({ ...values }));
    event.preventDefault();
    console.log(
      `For Microservice {id: ${
        "" + (parseInt(loans.slice(-1).pop().id) + 1)
      }, amount:${inputAmount}, duration:${inputDuration}}`
    );
    console.log(parseInt(loans.slice(-1).pop().id) + 1);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/loans`,
      data: {
        id: "" + (parseInt(loans.slice(-1).pop().id) + 1),
        amount: inputAmount,
        duration: inputDuration,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        setValues({ ...values });
        history.push("/bankloans");
        toast.success("Your loan is saved");
        return true;
      })
      .catch(function (error) {
        setValues({ ...values });
        toast.error("Something went wrong :(");
        console.log(error);
      })
      .finally(function (e) {
        setValues({ ...values });
        history.push("/bankloans");
        window.location.reload();
        return true;
      });
  };



  const generateNewLoanView = (event) => {
    return (
      <RB.Form onSubmit={processMicroserviceRequest}>
        <RB.Form.Row className="align-items-center">
          <RB.Col sm={3} className="my-1">
            <RB.Form.Label htmlFor="inputAmount" srOnly>
              Amount
            </RB.Form.Label>
            <RB.Form.Control
              id="inputAmount"
              onChange={(event) =>
                setValues({ ...values, inputAmount: event.target.value })
              }
              placeholder="1200"
            />
          </RB.Col>

          <RB.Col sm={3} className="my-1">
            <RB.Form.Label htmlFor="inputduration" srOnly>
              Duration
            </RB.Form.Label>
            <RB.Form.Control
              id="inputDuration"
              onChange={(event) =>
                setValues({ ...values, inputDuration: event.target.value })
              }
              placeholder="900"
            />
          </RB.Col>

          <RB.Col xs="auto" className="my-1">
            <RB.Button type="submit">RequestLoan</RB.Button>
          </RB.Col>
        </RB.Form.Row>
      </RB.Form>
    );
  };

  const generateBankLoansView = (event) => {
    if (!loansVisible) {
      return (
        <p>We are loading your loans, please wait until this message changes</p>
      );
    } else {
      console.log("Estare bien?");
      console.log(loans);
      return (
        <div>
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Duration</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((item) => (

                <tr key={item._id}>
                  <td>{item.id}</td>
                  <td>{item.amount + '\t€'}</td>
                  <td>{item.duration + '\tdays'}</td>

				  
                  <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="container mt-4 mb-4">
        <div className="row mb-4">
          <div className="col">
            <h1>Bank Loans</h1>

            <h3>Your Loans</h3>
            <div className="container">
              <Lottie
              options={animationOptions}
              height={400}
              width={400}
              isStopped={false}
              isPaused={false}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">{generateBankLoansView()}</div>
        </div>

        <div className="row mb-4 mt-4">
          <div className="col">
            <h3>Request a new loan</h3>

            
          </div>
        </div>

        <div className="row">
          <div className="col">{generateNewLoanView()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default BankLoans;
