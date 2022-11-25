import React, { useState } from "react";
import Axios from "axios";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import JsonFormatter from 'react-json-formatter';

function Post(props) {
  const url = "http://localhost:8080/product";
  //change url

  const [json, setJson] = useState(null)

  const [data, setData] = useState({
    cid: "7DELIVERY",
    mode: "submit",
    member_id: "",
    storeid: "",
    posid: "",
    inv: "",
    saledate: "",
    products: [],
    mstamp: "true",
    isApplyAccum: "true",
    coupon: [],
    tender: {
      tenderno: "",
      amount: "",
    },
    redeems: {
      id: "",
      earn: "",
    },
  });
  // const [data, setData] = useState({
  //   cid: "7DELIVERY",
  //   mode: "submit",
  //   member_id: "0876191414",
  //   storeid: "09988",
  //   posid: "99",
  //   inv: "701172",
  //   saledate: "2022-11-18",
  //   products: [],
  //   mstamp: "",
  //   isApplyAccum: "",
  //   coupon: [],
  //   tender: {
  //     tenderno: "000",
  //     amount: 0,
  //   },
  //   redeems: {
  //     id: "809",
  //     earn: 30,
  //   },
  // });
  
  const cidOptions = [
    { value: "7DELIVERY", label: "7DELIVERY" },
    { value: "POSONL", label: "POSONL" },
    {
      value: "VMACHINE",
      label: "VMACHINE",
      className: "myOptionClassName",
    },
  ];

  const [segId, setSegId] = useState("");

  function handle(e) {
    const newdata = { ...data };
    if (e.id === "BARCODE") {
      newdata.coupon.barcode = e.value;
    } else if (e.id === "QUANTITY") {
      newdata.coupon.quantity = e.value;
    } else if (e.id === "TENDERNO") {
      newdata.tender.tenderno = e.value;
    } else if (e.id === "AMOUNT") {
      newdata.tender.amount = e.value;
    } else if (e.id === "ID") {
      newdata.redeems.id = e.value;
    } else if (e.id === "EARN") {
      newdata.redeems.earn = e.value;
    } else if (e.id === "cid") {
      if (e.label === "7DELIVERY") {
        setSegId("106000003");
      } else if (e.label === "POSONL") {
        setSegId("106000004");
      } else {
        setSegId("106000005");
      }
      newdata[e.id] = e.label;
    } else {
      newdata[e.id] = e.value;
    }
    setData(newdata);
    // console.log(newdata);
  }


  // PRODUCTS HANDLER
  const [productArray, setProductArray] = useState([]);
  const productAddHandler = () => {
    const temp = [
      ...productArray,
      {
        code: "",
        quantity: 0,
      },
    ];
    setProductArray(temp);
  };
  const productHandler = (valueChange, i) => {
    const temp = [...productArray];
    temp[i][valueChange.target.id] = valueChange.target.value;
    setProductArray(temp);
  };
  const productDeleteHandler = (i) => {
    const temp = [...productArray];
    temp.splice(i, 1);
    setProductArray(temp);
  };

  // COUPONS HANDLER
  const [couponArray, setCouponArray] = useState([]);
  const couponAddHandler = () => {
    const temp = [
      ...couponArray,
      {
        barcode: "",
        quantity: 0,
      },
    ];
    setCouponArray(temp);
  };
  const couponHandler = (valueChange, i) => {
    const temp = [...couponArray];
    temp[i][valueChange.target.id] = valueChange.target.value;
    setCouponArray(temp);
  };
  const couponDeleteHandler = (i) => {
    const temp = [...couponArray];
    temp.splice(i, 1);
    setCouponArray(temp);
  };

  // SUBMIT & CLEAR
  const [empty, setEmpty] = useState([])
  function submit(e) {
    e.preventDefault();
    const tmpEmpty = [];
    const temp = { ...data };
    console.log(temp.products.length)
    if (!temp.member_id) tmpEmpty.push('member_id');
    if (!temp.storeid) tmpEmpty.push('storeid');
    if (!temp.posid) tmpEmpty.push('posid');
    if (!temp.inv) tmpEmpty.push('inv');
    if (!temp.saledate) tmpEmpty.push('saledate');
    if (productArray.length === 0) tmpEmpty.push('products');
    if (!temp.tender.tenderno || !temp.tender.amount) tmpEmpty.push('tender');
    if (!temp.redeems.id || !temp.redeems.earn) tmpEmpty.push('redeems');

    console.log(tmpEmpty)
    setEmpty(tmpEmpty)
    if (tmpEmpty.length === 0) {
      temp.posid = parseInt(temp.posid);
      temp.inv = parseInt(temp.inv);
      productArray.forEach((item) => {
        item.quantity = parseInt(item.quantity);
      });
      temp.products = productArray;
      temp.mstamp = temp.mstamp === "true";
      temp.isApplyAccum = temp.isApplyAccum === "true";
      temp.redeems = temp.redeems.id ? temp.redeems : [];
      temp.saledate = temp.saledate.concat(" 00:00:00");
      console.log('temp', temp)
      Axios.post(url, temp).then((res) => {
        console.log(res.data);
        setJson(res.data)
      });
    }
  }

  // COPY HANDLER

function copyHandler() {
  navigator.clipboard.writeText(JSON.stringify(json));
  alert("Copied to your clipboard!")
}

  function reset() {
    setJson(null)
    setData({
      cid: "7DELIVERY",
      mode: "submit",
      member_id: "",
      storeid: "",
      posid: "",
      inv: "",
      saledate: "",
      products: [],
      mstamp: "true",
      isApplyAccum: "true",
      coupon: [],
      tender: {
        tenderno: "",
        amount: "",
      },
      redeems: {
        id: "",
        earn: "",
      },
    })
  }

  const jsonStyle = {
    propertyStyle: { color: 'green' },
    stringStyle: { color: '#c92727' },
    numberStyle: { color: 'purple' },
    booleanStyle: { color: '#c92727' },
  }

  return (
    <>
      <div className='title'>JSON Request Generator</div>
      <div className="container">
        {
          json ?
          (
            <div className="json-formatted">
              {/* <div style={{ wordWrap: "break-word"}}>{JSON.stringify(json)}</div> */}
              <JsonFormatter json={JSON.stringify(json)} tabWith={4} jsonStyle={jsonStyle} />
              <button className='block-button outline' id='copy-button' onClick={copyHandler}>Copy to Clipboard</button>
              <button className='block-button' onClick={reset}>Clear</button>
            </div>
          ) :
          (
            <form onSubmit={(e) => submit(e)}>
          <p>CID</p>
          <Dropdown
            options={cidOptions}
            onChange={(e) => {
              e.id = "cid";
              // console.log(e);
              handle(e);
            }}
            value={data.cid}
            placeholder={"Select an Option"}
            type="text"
          />

          <p>Mode</p>
          <Dropdown
            options={[
              { value: "submit", label: "Submit" },
              {
                value: "cancel",
                label: "Cancel",
                className: "myOptionClassName",
              },
            ]}
            onChange={(e) => {
              e.id = "mode";
              handle(e);
            }}
            value={data.mode}
            placeholder={"Select an Option"}
            type="text"
          />
          <p className={` header ${empty.includes('member_id') ? "error" : ""}`}>Member ID</p>
          <input
            onChange={(e) => handle(e.target)}
            id="member_id"
            value={data.member_id}
            placeholder="Member ID"
            type="text"
            className={`${empty.includes('member_id') ? "error" : ""}`}
            />
          <p className={` warning ${empty.includes('member_id') ? "error" : ""}`}>Member ID is required</p>

          <p className={` header ${empty.includes('storeid') ? "error" : ""}`}>Store ID</p>
          <input
            onChange={(e) => handle(e.target)}
            id="storeid"
            value={data.storeid}
            placeholder="Store ID"
            type="text"
            className={`${empty.includes('storeid') ? "error" : ""}`}
          />
          <p className={` warning ${empty.includes('storeid') ? "error" : ""}`}>Store ID is required</p>

          <p className={` header ${empty.includes('posid') ? "error" : ""}`}>POS ID</p>
          <input
            onChange={(e) => handle(e.target)}
            id="posid"
            value={data.posid}
            placeholder="POS ID"
            type="text"
            className={`${empty.includes('posid') ? "error" : ""}`}
          />
          <p className={` warning ${empty.includes('posid') ? "error" : ""}`}>POS ID is required</p>

          <p className={` header ${empty.includes('inv') ? "error" : ""}`}>Invoice No.</p>
          <input
            onChange={(e) => handle(e.target)}
            id="inv"
            value={data.inv}
            placeholder="Invoice No."
            type="text"
            className={`${empty.includes('inv') ? "error" : ""}`}
          />
          <p className={` warning ${empty.includes('inv') ? "error" : ""}`}>Invoice No. is required</p>

          <p className={` header ${empty.includes('saledate') ? "error" : ""}`}>Sale Date</p>
          <input
            onChange={(e) => handle(e.target)}
            id="saledate"
            value={data.saledate}
            placeholder="Sale Date (yyyy-mm-dd)"
            type="text"
            className={`${empty.includes('saledate') ? "error" : ""}`}
          />
          <p className={` warning ${empty.includes('saledate') ? "error" : ""}`}>Sale Date is required</p>

          <div className="product-list">
            <p className={` header ${empty.includes('products') ? "error" : ""}`}>Products List</p>
            <div className='button' onClick={() => productAddHandler()}>Add a product</div>
          </div>
          {
            productArray.length > 0 ?
              productArray.map((product, i) => {
              return (
                <div key={i} style={{marginBottom: "0.75rem"}}>
                  <div style={{display: "flex", gap: "8px"}}>
                    <input
                      id="code"
                      onChange={(e) => productHandler(e, i)}
                      type="text"
                      placeholder="Product Code"
                    />
                    <input
                      id="quantity"
                      onChange={(e) => productHandler(e, i)}
                      type="number"
                      placeholder="Quantity"
                    />
                    <div className='close-button' onClick={() => productDeleteHandler(i)}></ div>
                  </div>
                </div>
              );
            }) :
            <>
              <div className={`empty-state ${empty.includes('products') ? "error" : ""}`} onClick={() => productAddHandler()}
              >There is no product yet, please add more.</div>
              <p className={` warning ${empty.includes('products') ? "error" : ""}`}>Products are required</p>
            </>
          }

          <p>M Stamp</p>
          <Dropdown
            options={[
              { value: "true", label: "true" },
              {
                value: "false",
                label: "false",
                className: "myOptionClassName",
              },
            ]}
            onChange={(e) => {
              e.id = "mstamp";
              handle(e);
            }}
            value={data.mstamp}
            placeholder={"Select an Option"}
            type="text"
          />

          <p>Is Apply Accum</p>
          <Dropdown
            options={[
              { value: "true", label: "true" },
              {
                value: "false",
                label: "false",
                className: "myOptionClassName",
              },
            ]}
            onChange={(e) => {
              e.id = "isApplyAccum";
              handle(e);
            }}
            value={data.isApplyAccum}
            placeholder={"Select an Option"}
            type="text"
          />

          <div className="product-list">
            <p className={` header ${empty.includes('coupons') ? "error" : ""}`}>Coupon List</p>
            <div className='button' onClick={() => couponAddHandler()}>Add a Coupon</div>
          </div>
          {
              couponArray.length > 0 ?
                couponArray.map((coupon, i) => {
                  return (
                    <div key={i} style={{marginBottom: "0.75rem"}}>
                      <div style={{display: "flex", gap: "8px"}}>
                        <input
                          id="barcode"
                          onChange={(e) => couponHandler(e, i)}
                          type="text"
                          placeholder="Coupon Barcode"
                        />
                        <input
                          id="quantity"
                          onChange={(e) => couponHandler(e, i)}
                          type="number"
                          placeholder="Coupon Quantity"
                        />
                        <div className='close-button' onClick={() => couponDeleteHandler(i)}></ div>
                      </div>
                    </div>
                  );
                }) :
                <div className='empty-state' onClick={() => couponAddHandler()}
                >There is no coupon yet.</div>
          }

          <p className={` header ${empty.includes('tender') ? "error" : ""}`}>Tender</p>
          <div  style={{display: "flex", gap: "8px"}}>
            <input
              onChange={(e) => handle(e.target)}
              id="TENDERNO"
              value={data.tender.tenderno}
              placeholder="Tender No."
              type="text"
              className={`${empty.includes('tender') ? "error" : ""}`}
              />
            <input
              onChange={(e) => handle(e.target)}
              id="AMOUNT"
              value={data.tender.amount}
              placeholder="Amount"
              type="text"
              className={`${empty.includes('tender') ? "error" : ""}`}
              />
            </div>
            <p className={` warning ${empty.includes('tender') ? "error" : ""}`}>Tender is required</p>

          <p className={` header ${empty.includes('redeems') ? "error" : ""}`}>Redeems</p>
          <div  style={{display: "flex", gap: "8px"}}>
            <input
              onChange={(e) => handle(e.target)}
              id="ID"
              value={data.redeems.id}
              placeholder="Redeem ID"
              type="text"
              className={`${empty.includes('redeems') ? "error" : ""}`}
            />
            <input
              onChange={(e) => handle(e.target)}
              id="EARN"
              value={data.redeems.earn}
              placeholder="Redeem Earn"
              type="text"
              className={`${empty.includes('redeems') ? "error" : ""}`}
            />
          </div>
          <p className={` warning ${empty.includes('redeems') ? "error" : ""}`}>Redeems are required</p>

          <button className='block-button' style={{marginTop: '1.5rem', marginBottom: '1rem'}}>Generate</button>
        </form>
          )
        }
        
      </div>
    </>
  );
}

export default Post;