import { useEffect, useState } from "react";
import { Button, Divider, Flex, Radio } from "antd";

const Home = () => {
  const [seed, setSeed] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [etherAmount, setEtherAmount] = useState("");
  const [infoList, setInfoList] = useState([]);
  const [coin, setCoin] = useState("DogeCoin");

  useEffect(() => {
    console.log("🍭🍭🍭🍭🍭 coin : ", coin);
    console.log("seed : ", seed);
  }, [coin, seed]);

  const generateSeed = () => {
    // Implement generate_seed logic here
  };

  const generateAddresses = () => {
    // Implement generate_addresses logic here
  };

  const sendEther = () => {
    // Implement send_ether logic here
  };

  return (
    <div className="flex h-full mx-auto flex-col flex-1 items-center">
      <div className="flex flex-col gap-10">
        <h2 className="text-center font-bold text-3xl">MultiCurrency HD-WALLET</h2>
        <div>
          <Radio.Group value={coin} onChange={(e) => setCoin(e.target.value)}>
            <Radio.Button value="DogeCoin">DogeCoin</Radio.Button>
            <Radio.Button value="ETHEREUM">ETHEREUM</Radio.Button>
            <Radio.Button value="C98 Coin">C98 Coin</Radio.Button>
          </Radio.Group>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-[#D9EDF7] p-5 text-blue-500 rounded-lg">
            Create wallet or use your existing wallet by entering your secret 12 words.
          </div>
          <div class="relative h-11 w-full min-w-[200px]">
            <input
              placeholder="Enter 12 words"
              class="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
            <label class="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Enter 12 words
            </label>
          </div>
          <div className="flex gap-5">
            <Button>Create New Wallet</Button>
            <Button>Get Balance / Private-Key / Address </Button>
          </div>
          <Divider />
        </div>
        <div>
          <h1 className="text-center font-bold text-2xl">Send {coin}</h1>
          <div className="my-5 flex flex-col gap-6">
            <div class="relative h-11 w-full min-w-[200px]">
              <input
                placeholder="From Address"
                class="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
              />
              <label class="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                From Address
              </label>
            </div>
            <div class="relative h-11 w-full min-w-[200px]">
              <input
                placeholder="To Address"
                class="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
              />
              <label class="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                To Address
              </label>
            </div>
            <div class="relative h-11 w-full min-w-[200px]">
              <input
                placeholder="Amount"
                class="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
              />
              <label class="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Amount
              </label>
            </div>
            <Button className="text-center max-w-20 bg-blue-600" type="primary">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
