import React from 'react';
import './Header.css';
import { Button } from 'antd';
import { BellFilled } from '@ant-design/icons';

export default function Header() {
  return (
    <div className="Header">
      <img
        src="https://www.logo.wine/a/logo/Binance/Binance-Icon-Logo.wine.svg"
        width="40"
        height="40"
      />
      BINANCE WEB SCRAPER
      {/* <Button type="primary" style={{ float: 'right', marginRight: '20px', color: '#1E2329'}} size='large' icon={<BellFilled />}>
        Notification
      </Button> */}
    </div>
  );
}