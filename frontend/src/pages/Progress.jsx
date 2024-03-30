import React, { useEffect, useState } from "react";
import { Steps } from "antd";
import Network from "../components/Network";
import GetSeed from "../components/GetSeed";
import Transaction from "../components/Transaction";
const description = "This is a description.";
const Progress = () => {
  const [form, setForm] = useState({
    network: "",
    seed: "",
    seed_type: "",
    coin: "",
    from_address: "",
    to_address: "",
    amount: "",
    number_of_addresses: "",
    continue: false,
  });
  const [step, setStep] = useState(0);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (form.network === "") {
      setStep(0);
    } else {
      setStep(1);
      setForm((prev) => {
        return {
          ...prev,
          seed_type: "",
          seed: "",
          number_of_addresses: "",
          coin: "",
          from_address: "",
          to_address: "",
          amount: "",
          continue: false,
        };
      });
      setAccounts([]);
    }
  }, [form.network]);

  useEffect(() => {
    if (form.continue === true) {
      setStep(2);
    }
  }, [form.continue]);

  return (
    <Steps
      direction="vertical"
      size="default"
      current={step}
      items={[
        {
          title: (
            <div
              className="px-3 m-1 rounded-md w-full"
              style={{
                boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
              }}
            >
              Select a Network
            </div>
          ),
          description: <Network form={form} setForm={setForm} />,
        },
        {
          title: (
            <div
              className="px-3 m-1 rounded-md w-full"
              style={{
                boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
              }}
            >
              Create wallet or use your existing wallet by entering your secret 12 words.
            </div>
          ),
          description: (
            <>
              {form.network !== "" ? (
                <GetSeed form={form} setForm={setForm} accounts={accounts} setAccounts={setAccounts} />
              ) : null}
            </>
          ),
        },
        {
          title: (
            <div
              className="px-3 m-1 rounded-md w-full"
              style={{
                boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
              }}
            >
              Transection Process
            </div>
          ),
          description: <>{form?.continue ? <Transaction form={form} setForm={setForm} /> : null}</>,
        },
      ]}
    />
  );
};
export default Progress;
