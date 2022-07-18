import React, {useEffect} from 'react'
import Header from './components/Header'
import Content from './components/Content'
import 'antd/dist/antd.variable.min.css';
import { ConfigProvider } from 'antd';


export default function App() {
  ConfigProvider.config({
    theme: {
      primaryColor: '#F0B90B',
    },
  });

  useEffect(() => {
    document.title = 'BWS v1.4'
  }, [])

  return (
    <div className='App'>
      <Header />
      <Content />
    </div>
  )
}
