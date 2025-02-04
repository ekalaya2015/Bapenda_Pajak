import React, { useState, useEffect } from "react";
import * as moment from "moment";
import Widget from "components/Widget/index";
import "moment/locale/id";
import "../../../assets/styles/flip-card.css";
import jwtDecode from "jwt-decode";
import { Col, Row, Select, Typography } from "antd";
import { DatePicker, Space } from "antd";
import ChartYearToYear from "./chartYearToYear";
import TableYearToYear from "./tableYearToYear";

const { Option } = Select;
const { RangePicker } = DatePicker;

const data = [
  {
    key: "1",
    bulan: "Januari",
    lastYear: 280000,
    thisYear: 130000,
    selisih: 150000,
    growth: "53.57%",
  },
  {
    key: "2",
    bulan: "Februari",
    lastYear: 340000,
    thisYear: 450000,
    selisih: -110000,
    growth: "-32.35%",
  },
  {
    key: "3",
    bulan: "Maret",
    lastYear: 370000,
    thisYear: 130000,
    selisih: 240000,
    growth: "64.86%",
  },
  {
    key: "4",
    bulan: "April",
    lastYear: 1880000,
    thisYear: 1800000,
    selisih: 80000,
    growth: "4.26%",
  },
  {
    key: "5",
    bulan: "Mei",
    lastYear: 680000,
    thisYear: 980000,
    selisih: -300000,
    growth: "-44.12%",
  },
  {
    key: "6",
    bulan: "Juni",
    lastYear: 880000,
    thisYear: 137000,
    selisih: 743000,
    growth: "84.43%",
  },
  {
    key: "7",
    bulan: "Juli",
    lastYear: 1240000,
    thisYear: 890000,
    selisih: 350000,
    growth: "28.23%",
  },
  {
    key: "8",
    bulan: "Agustus",
    lastYear: 1180000,
    thisYear: 730000,
    selisih: 450000,
    growth: "38.14%",
  },
  {
    key: "9",
    bulan: "September",
    lastYear: 1790000,
    thisYear: 930000,
    selisih: 860000,
    growth: "48.04%",
  },
  {
    key: "10",
    bulan: "Oktober",
    lastYear: 1670000,
    thisYear: 793000,
    selisih: 877000,
    growth: "52.51%",
  },
  {
    key: "11",
    bulan: "November",
    lastYear: 978000,
    thisYear: 782600,
    selisih: 195400,
    growth: "19.98%",
  },
  {
    key: "12",
    bulan: "Desember",
    lastYear: 750000,
    thisYear: 955000,
    selisih: -205000,
    growth: "-27.33%",
  },
];

const dateFormat = "YYYY";

const YearToYear = (props) => {
  const bulanIni = moment().format("MM");
  const next = moment().add(6, "months").format("MM");
  const setBulan = bulanIni.replace(/^0+/, "");

  const [jenisChart, setJenisChart] = useState("Daily");
  const [bulanSelect, setBulanSelect] = useState(setBulan);

  const [monthly, setMonthly] = useState();
  const [yearly, setYearly] = useState();

  const [thisMonthly, setThisMonthly] = useState(moment().format("YYYY"));
  const [lastMonthly, setLastMonthly] = useState(
    moment().subtract(1, "year").format("YYYY")
  );

  const onChangeDateRange = (date, datesString) => {
    setLastMonthly(datesString[0]);
    setThisMonthly(datesString[1]);
    //More code
  };
  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.selisih));
    const dataMin = Math.min(...data.map((i) => i.selisih));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  const handleChangeSelect = (value) => {
    setJenisChart(value);
    setBulanSelect("1");
  };
  const handleChangeBulan = (value) => {
    setBulanSelect(value);
    getMonthly();
  };
  const handleThisMonthly = (date, dateString) => {
    setThisMonthly(dateString);
    setLastMonthly(dateString);
  };
  const handleLastMonthly = (date, dateString) => {
    setLastMonthly(dateString);
  };
  // useEffect(() => {
  //   if(jenisChart === "Monthly"){
  //   setBulanSelect("1");}
  // }, []);

  useEffect(() => {
    getMonthly();
  }, []);
  useEffect(() => {
    getMonthly();
  }, [bulanSelect]);

  const getMonthly = async () => {
    const decoded = jwtDecode(localStorage.token);
    const apiKey = decoded["api-key"];
    const headers = {
      "x-api-key": `${apiKey}`,
      "content-type": "application/json",
    };
    const response = await fetch(
      `https://api.raspi-geek.com/v1/daily?month=${bulanSelect}&year=${thisMonthly}`,

      { method: "GET", headers }
    );
    const res = await response.json();
    setMonthly(res.Records);
  };
  useEffect(() => {
    getYearly();
  }, []);

  const getYearly = async () => {
    const decoded = jwtDecode(localStorage.token);
    const apiKey = decoded["api-key"];
    const headers = {
      "x-api-key": `${apiKey}`,
      "content-type": "application/json",
    };
    const response = await fetch(
      `https://api.raspi-geek.com/v1/monthly?year=${thisMonthly}`,

      { method: "GET", headers }
    );
    const res = await response.json();
    setYearly(res.Records);
  };

  const getLastYearly = async () => {
    const decoded = jwtDecode(localStorage.token);
    const apiKey = decoded["api-key"];
    const headers = {
      "x-api-key": `${apiKey}`,
      "content-type": "application/json",
    };
    const response = await fetch(
      `https://api.raspi-geek.com/v1/monthly?year=${lastMonthly}`,

      { method: "GET", headers }
    );
    const res = await response.json();
    setYearly(res.Records);
  };

  const bulan = monthly?.map((row) => ({
    created_at: moment(row[0].stringValue).format("DD/MM"),
    total_value: Number(row[1].stringValue),
  }));

  let months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const tahun = yearly?.map((row) => ({
    created_at: months[row[0].longValue - 1],
    total_value: Number(row[1].stringValue),
  }));

  const disabledDate = (current) => {
    let customDate = "2022";
    return current && current < moment(customDate, "YYYY");
  };

  return (
    <Widget styleName="gx-order-history">
      <Row>
        <Col span={16}>
          <div style={{ width: "500px", height: "100px" }}>
            <div style={{ width: "100%", float: "left" }}>
              {" "}
              <Typography
                style={{
                  textAlign: "left",
                  margin: "0",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Year To Year
              </Typography>
            </div>
            {/* <div style={{ width: "25%", float: "left" }}>
              {" "}
              <Select
                style={{ margin: "10px 0 0 0", width: "90%" }}
                name="jenisChart"
                value={jenisChart}
                onChange={handleChangeSelect}
              >
                <Option value="Daily">Daily</Option>
                <Option value="Monthly">Monthly</Option>
              </Select>
            </div>
            <div style={{ width: "30%", float: "left" }}>
              {jenisChart === "Daily" ? (
                <Select
                  style={{ margin: "10px 0 0 0", width: "90%" }}
                  name="bulanSelect"
                  value={bulanSelect}
                  onChange={handleChangeBulan}
                >
                  <Option value="1">Januari</Option>
                  <Option value="2">Februari</Option>
                  <Option value="3">Maret</Option>
                  <Option value="4">April</Option>
                  <Option value="5">Mei</Option>
                  <Option value="6">Juni</Option>
                  <Option value="7">Juli</Option>
                  <Option value="8">Agustus</Option>
                  <Option value="9">September</Option>
                  <Option value="10">Oktober</Option>
                  <Option value="11">November</Option>
                  <Option value="12">Desember</Option>
                </Select>
              ) : (
                <div></div>
              )}
            </div> */}
            <div style={{ width: "20%", float: "left", paddingTop: "7px" }}>
              <DatePicker
                disabledDate={disabledDate}
                defaultValue={moment("2021", "YYYY")}
                disabled
                onChange={handleThisMonthly}
                picker="year"
              />
            </div>
            <div style={{ width: "20%", float: "left", paddingTop: "7px" }}>
              <DatePicker
                disabledDate={disabledDate}
                defaultValue={moment("2022", "YYYY")}
                disabled
                onChange={handleThisMonthly}
                picker="year"
              />
            </div>
          </div>
          <ChartYearToYear data={data} />
        </Col>
        <Col span={8}>
          <TableYearToYear data={data} />
        </Col>
      </Row>
    </Widget>
  );
};

export default YearToYear;
