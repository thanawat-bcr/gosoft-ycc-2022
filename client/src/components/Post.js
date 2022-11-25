import React, { useState } from "react";
import Axios from "axios";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

function Post(props) {
  const url = "http://localhost:8080/product";
  //change url

  const [json, setJson] = useState(null)

  const [data, setData] = useState({
    cid: "",
    mode: "",
    member_id: "",
    storeid: "",
    posid: "",
    inv: "",
    saledate: "",
    products: [],
    mstamp: "",
    isApplyAccum: "",
    coupon: {
      barcode: "",
      quantity: "",
    },
    tender: {
      tenderno: "",
      amount: "",
    },
    redeems: {
      id: "",
      earn: "",
    },
    localSegments: { segId: "" },
  });

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
    } else if (e.id === "SEGMENT") {
      newdata.localSegments.segId = e.value;
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
  function submit(e) {
    e.preventDefault();
    const temp = { ...data };
    temp.posid = parseInt(temp.posid);
    temp.inv = parseInt(temp.inv);
    productArray.forEach((item) => {
      item.quantity = parseInt(item.quantity);
    });
    temp.products = productArray;
    temp.mstamp = temp.mstamp === "true";
    temp.isApplyAccum = temp.isApplyAccum === "true";
    temp.localSegments.segId = segId;
    temp.saledate = temp.saledate.concat(" 00:00:00");
    console.log('temp', temp)
    Axios.post(url, temp).then((res) => {
      console.log(res.data);
      setJson(res.data)
    });
    // console.log(temp);
    // console.log(productArray);
  }

  function reset() {
    setJson(null)
    setData({
      cid: "",
      mode: "",
      member_id: "",
      storeid: "",
      posid: "",
      inv: "",
      saledate: "",
      products: [],
      mstamp: "",
      isApplyAccum: "",
      coupon: {
        barcode: "",
        quantity: "",
      },
      tender: {
        tenderno: "",
        amount: "",
      },
      redeems: {
        id: "",
        earn: "",
      },
      localSegments: { segId: "" },
    })
  }
  return (
    <>
      <div className='title'>JSON Request Generator for UAT</div>
      <div className="container">
        {
          json ?
          (
            <>
              <div style={{ wordWrap: "break-word"}}>{JSON.stringify(json)}</div>
              <button className='block-button' onClick={reset}>Clear</button>
            </>
          ) :
          (
            <form onSubmit={(e) => submit(e)}>
          <p className="header">CID</p>
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

          <p className="header">Mode</p>
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

          <p className="header">Member ID</p>
          <input
            onChange={(e) => handle(e.target)}
            id="member_id"
            value={data.member_id}
            placeholder="Member ID"
            type="text"
          />

          <p className="header">Store ID</p>
          <input
            onChange={(e) => handle(e.target)}
            id="storeid"
            value={data.storeid}
            placeholder="Store ID"
            type="text"
          />

          <p className="header">POS ID</p>
          <input
            onChange={(e) => handle(e.target)}
            id="posid"
            value={data.posid}
            placeholder="POS ID"
            type="text"
          />

          <p className="header">INV</p>
          <input
            onChange={(e) => handle(e.target)}
            id="inv"
            value={data.inv}
            placeholder="Invoice No."
            type="text"
          />

          <div>
            <p className="header">Sale Date</p>
            <input
              onChange={(e) => handle(e.target)}
              id="saledate"
              value={data.saledate}
              placeholder="Sale Date (yyyy-mm-dd)"
              type="text"
            />
          </div>

          <div>
            <div className="product-list">
              <p className="header">Products List</p>
              <div className='button' onClick={() => productAddHandler()}>Add a product</div>
            </div>
            {
              productArray.length > 0 ?
                productArray.map((product, i) => {
                return (
                  <div key={i} style={{marginTop: "0.75rem"}}>
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
              <div className='empty-state' onClick={() => productAddHandler()}
              >There is no product yet, please add more.</div>
            }
          </div>

          <p className="header">M Stamp</p>
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

          <p className="header">Is Apply Accum</p>
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

          <div>
            <div className="product-list">
              <p className="header">Coupon List</p>
              <div className='button' onClick={() => couponAddHandler()}>Add a Coupon</div>
            </div>
            {
                couponArray.length > 0 ?
                  couponArray.map((coupon, i) => {
                    return (
                      <div key={i} style={{marginTop: "0.75rem"}}>
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
                  >There is no coupon yet, please add more.</div>
            }
          </div>

          <p className="header">Tender</p>
          <div  style={{display: "flex", gap: "8px"}}>
            <input
              onChange={(e) => handle(e.target)}
              id="TENDERNO"
              value={data.tender.tenderno}
              placeholder="Tender No."
              type="text"
              />
            <input
              onChange={(e) => handle(e.target)}
              id="AMOUNT"
              value={data.tender.amount}
              placeholder="Amount"
              type="text"
              />
            </div>

          <p className="header">Redeems</p>
          <div  style={{display: "flex", gap: "8px"}}>
            <input
              onChange={(e) => handle(e.target)}
              id="ID"
              value={data.redeems.id}
              placeholder="Redeem ID"
              type="text"
            />
            <input
              onChange={(e) => handle(e.target)}
              id="EARN"
              value={data.redeems.earn}
              placeholder="Redeem Earn"
              type="text"
            />
          </div>
          {/* <div>
            <p className="header">Local Segments</p>
            <input disabled value={segId} />
          </div> */}
          <button className='block-button'>Generate</button>
        </form>
          )
        }
        
      </div>
    </>
  );
}

export default Post;
