import React, { useState } from "react";
import { Button, Divider, Flex, Radio } from "antd";

const GetSeed = ({ form, setForm }) => {
  const [isValid, setIsValid] = useState(true);
  return (
    <div
      className="p-5 mt-5 rounded-md mb-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset" }}
    >
      <div className="flex flex-col gap-5">
        <Radio.Group
          value={form.seed_type}
          onChange={(e) =>
            setForm((prev) => {
              return { ...prev, seed_type: e.target.value };
            })
          }
        >
          <Radio.Button value="existing_seed">Existing Seed</Radio.Button>
          <Radio.Button value="create_new_wallet">Create New Wallet</Radio.Button>
        </Radio.Group>
        {form.seed_type === "existing_seed" && (
          <div className="flex flex-row items-baseline gap-3">
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder="Enter 12 words"
                className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                value={form.seed}
                onChange={(e) =>
                  setForm((prev) => {
                    return { ...prev, seed: e.target.value };
                  })
                }
              />
              <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Enter 12 words
              </label>
            </div>
            <Button>Validate</Button>
          </div>
        )}
        {form.seed_type === "create_new_wallet" && (
          <div className="flex flex-row gap-3 items-baseline">
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder="Number of Addresses"
                className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                value={form.number_of_addresses}
                onChange={(e) =>
                  setForm((prev) => {
                    return { ...prev, number_of_addresses: e.target.value };
                  })
                }
              />
              <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Number of Addresses
              </label>
            </div>
            <Button>Create</Button>
          </div>
        )}
        <div className="details">
          <Divider />
          <div className="text-2xl font-bold text-center">Account Details</div>
          <div className="flex flex-col gap-5 pt-3">
            <div className="font-semibold">Balance : 35</div>
            <div>
              <div className="font-semibold">Private Keys : </div>
              <ol>
                <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque earum</li>
                <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque earum</li>
              </ol>
            </div>
            <div>
              <div className="font-semibold">Address:</div>
              <ol>
                <li>1</li>
                <li>2</li>
              </ol>
            </div>
          </div>
          <Divider />
        </div>
        <Button
          disabled={!isValid}
          onClick={() =>
            setForm((prev) => {
              return { ...prev, continue: true };
            })
          }
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default GetSeed;
