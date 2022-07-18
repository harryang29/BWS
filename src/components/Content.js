import React, { useState } from 'react';
import './Content.css';
import FuturesTable from './FuturesTable.js';
import { Form, Button, Input, Select, Row, Col, Switch } from 'antd';

export default function Content() {
  const [form] = Form.useForm();
  const [submit, setSubmit] = useState(false);
  const [values, setValues] = useState('');
  const [running, setRunning] = useState(false);
  const [popupNotification, setPopupNotification] = useState(true);

  const onFinishHandler = (values) => {
    setValues(values);
    setSubmit(true);
    setRunning(true);
  };

  const abortOnClickHandler = () => {
    setSubmit(false);
    setRunning(false);
  };

  return (
    <div className="Content">
      <Row>
        <Col
          xs={12}
          sm={16}
          style={{
            padding: '12px',
          }}
        >
          <h2>Configuration</h2>
          <Form layout="inline" onFinish={onFinishHandler} form={form}>
            <Form.Item
              name="percentageChange"
              label="% Change"
              rules={[
                {
                  pattern: new RegExp(/^[0-9]\d*(\.\d+)?$/),
                  message: 'Please input a valid number',
                },
              ]}
              style={{
                marginTop: '10px',
              }}
            >
              <Input
                type="text"
                placeholder="Input % change"
                style={{
                  width: '180px',
                }}
              />
            </Form.Item>
            <Form.Item
              name="timeInterval"
              label="Time Interval"
              rules={[
                {
                  required: true,
                  message: 'Please select a time',
                },
              ]}
              style={{
                marginTop: '10px',
              }}
            >
              <Select
                placeholder="Select a time interval"
                style={{
                  width: '180px',
                }}
              >
                <Select.Option value="1m">1m</Select.Option>
                <Select.Option value="3m">3m</Select.Option>
                <Select.Option value="5m">5m</Select.Option>
                <Select.Option value="15m">15m</Select.Option>
                <Select.Option value="30m">30m</Select.Option>
                <Select.Option value="1h">1h</Select.Option>
                <Select.Option value="2h">2h</Select.Option>
                <Select.Option value="4h">4h</Select.Option>
                <Select.Option value="6h">6h</Select.Option>
                <Select.Option value="8h">8h</Select.Option>
                <Select.Option value="12h">12h</Select.Option>
                <Select.Option value="1d">1d</Select.Option>
                <Select.Option value="3d">3d</Select.Option>
                <Select.Option value="1w">1w</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              style={{
                marginTop: '10px',
              }}
            >
              <Button type="primary" htmlType="submit" loading={running}>
                Submit
              </Button>
              <Button
                type="abort"
                disabled={!running}
                onClick={abortOnClickHandler}
              >
                Abort
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col
          xs={{ span: 10, offset: 2 }}
          sm={{ span: 8, offset: 0 }}
          style={{
            padding: '12px',
          }}
        >
          <h2>Pop-up Notification</h2>
          <Switch
            onChange={() => {
              setPopupNotification(!popupNotification);
              console.log('notif is toggled');
            }}
            checked={popupNotification}
            style={{
              marginTop: '10px',
            }}
          />
        </Col>
        <Col
          span="24"
          style={{
            padding: '12px',
          }}
        >
          <h2>USDⓈ-M Futures</h2>
          <FuturesTable
            submit={submit}
            values={values}
            popupNotification={popupNotification}
          />
        </Col>
      </Row>
    </div>
  );
}
