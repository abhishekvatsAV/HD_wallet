import React, { useState } from "react";
import { Button, Divider, Flex, Radio } from "antd";

const Network = ({ form, setForm, setStep }) => {
  return (
    <div className="p-5">
      <Radio.Group value={form.network} onChange={(e) => setForm((prev) => ({ ...prev, network: e.target.value }))}>
        <Radio.Button value="ethereum">ETHEREUM</Radio.Button>
        <Radio.Button value="bitcoin">BITCOIN</Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default Network;
