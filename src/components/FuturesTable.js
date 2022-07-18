import React, { useState, useEffect } from 'react';
import './FuturesTable.css';
import { symbols } from '../symbols.js';
import { Table, Alert, notification } from 'antd';
import useSound from 'use-sound';

const axios = require('axios');

export default function FuturesTable(props) {
  let intervalID = 0;
  const percentageChange = parseFloat(props.values.percentageChange);
  const timeInterval = props.values.timeInterval;
  const [futuresData, setFuturesData] = useState('');
  const [error, setError] = useState(false);
  const soundUrl =
    'http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/intromusic.ogg';
  const [playSound] = useSound(soundUrl, { volume: 0.5 });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'symbol',
      key: 'symbol',
      sortOrder: 'ascend',
      render(text, record) {
        return {
          props: {
            style: { fontWeight: '700' },
          },
          children: <div>{text}</div>,
        };
      },
    },
    {
      title: 'Price',
      dataIndex: 'lastPrice',
      key: 'lastPrice',
      sorter: (a, b) => a.lastPrice - b.lastPrice,
      sortDirections: ['descend', 'ascend'],
      render(text, record) {
        return {
          children: <div>{parseFloat(text).toLocaleString('en-US')}</div>,
        };
      },
    },
    {
      title: timeInterval + ' Change',
      dataIndex: 'priceChangePercent',
      key: 'priceChangePercent',
      sorter: (a, b) => a.priceChangePercent - b.priceChangePercent,
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend', 'descend'],
      render(text, record) {
        const num = (Math.round(100 * text) / 100).toFixed(2);
        if (num != 0.0) {
          return {
            props: {
              style: { color: num > 0 ? '#03A66D' : '#CF304A' },
            },
            children:
              num > 0 ? <div>{'+' + num + '%'}</div> : <div>{num + '%'}</div>,
          };
        } else {
          return {
            children: <div>{num + '%'}</div>,
          };
        }
      },
    },
    {
      title: timeInterval + ' High / ' + timeInterval + ' Low',
      dataIndex: 'highLow',
      key: 'highLow',
      responsive: ['md'],
    },
    {
      title: timeInterval + ' Volume',
      dataIndex: 'quoteVolume',
      key: 'quoteVolume',
      responsive: ['sm'],
      sorter: (a, b) => a.quoteVolume - b.quoteVolume,
      sortDirections: ['descend', 'ascend'],
      render(text, record) {
        return {
          children: <div>{nFormatter(parseFloat(text))}</div>,
        };
      },
    },
    {
      title: timeInterval + ' Trade Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
      sortDirections: ['descend', 'ascend'],
      render(text, record) {
        return {
          children: <div>{nFormatter(parseFloat(text))}</div>,
        };
      },
    },
  ];

  const fetchData = (timeInterval, percentageChange, symbols) => {
    switch (timeInterval) {
      case '1m':
        const fetch1mData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1m&limit=1`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[0][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[0][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
                if (!isNaN(percentageChange) && percentageChange != 0) {
                  checkPercentageChange(
                    item.symbol,
                    item.priceChangePercent,
                    percentageChange
                  );
                }
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request1m = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch1mData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request1m();
        intervalID = setInterval(() => {
          request1m();
        }, 8000);
        break;
      case '3m':
        const fetch3mData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1m&limit=3`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[2][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[2][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
                if (!isNaN(percentageChange) && percentageChange != 0) {
                  checkPercentageChange(
                    item.symbol,
                    item.priceChangePercent,
                    percentageChange
                  );
                }
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request3m = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch3mData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request3m();
        intervalID = setInterval(() => {
          request3m();
        }, 8000);
        break;
      case '5m':
        const fetch5mData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1m&limit=5`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[4][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[4][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
                if (!isNaN(percentageChange) && percentageChange != 0) {
                  checkPercentageChange(
                    item.symbol,
                    item.priceChangePercent,
                    percentageChange
                  );
                }
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request5m = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch5mData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request5m();
        intervalID = setInterval(() => {
          request5m();
        }, 8000);
        break;
      case '15m':
        const fetch15mData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1m&limit=15`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[14][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[14][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
                if (!isNaN(percentageChange) && percentageChange != 0) {
                  checkPercentageChange(
                    item.symbol,
                    item.priceChangePercent,
                    percentageChange
                  );
                }
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request15m = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch15mData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request15m();
        intervalID = setInterval(() => {
          request15m();
        }, 8000);
        break;
      case '30m':
        const fetch30mData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1m&limit=30`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[29][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[29][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request30m = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch30mData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request30m();
        intervalID = setInterval(() => {
          request30m();
        }, 8000);
        break;
      case '1h':
        const fetch1hData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1m&limit=60`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[59][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[59][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request1h = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch1hData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request1h();
        intervalID = setInterval(() => {
          request1h();
        }, 8000);
        break;
      case '2h':
        const fetch2hData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=3m&limit=40`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[39][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[39][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request2h = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch2hData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request2h();
        intervalID = setInterval(() => {
          request2h();
        }, 8000);
        break;
      case '4h':
        const fetch4hData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=3m&limit=80`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[79][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[79][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request4h = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch4hData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request4h();
        intervalID = setInterval(() => {
          request4h();
        }, 8000);
        break;
      case '6h':
        const fetch6hData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=5m&limit=72`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[71][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[71][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request6h = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch6hData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request6h();
        intervalID = setInterval(() => {
          request6h();
        }, 8000);
        break;
      case '8h':
        const fetch8hData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=5m&limit=96`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[95][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[95][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request8h = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch8hData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request8h();
        intervalID = setInterval(() => {
          request8h();
        }, 8000);
        break;
      case '12h':
        const fetch12hData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=15m&limit=48`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[47][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[47][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request12h = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch12hData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request12h();
        intervalID = setInterval(() => {
          request12h();
        }, 8000);
        break;
      case '1d':
        const request1d = () => {
          axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr').then(
            (response) => {
              const data = response.data.map(selectFewerProps);
              setFuturesData(data);
            },
            (error) => {
              console.log(error);
              setError(true);
              clearInterval(intervalID);
            }
          );
        };
        request1d();
        intervalID = setInterval(() => {
          request1d();
        }, 3000);
        break;
      case '3d':
        const fetch3dData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1h&limit=72`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[71][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[71][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request3d = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch3dData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request3d();
        intervalID = setInterval(() => {
          request3d();
        }, 8000);
        break;
      case '1w':
        const fetch1wData = async (item) => {
          await axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=2h&limit=84`
            )
            .then(
              (response) => {
                item.lastPrice = response.data[83][4];
                item.priceChangePercent = (
                  ((parseFloat(response.data[83][4]) -
                    parseFloat(response.data[0][1])) /
                    parseFloat(response.data[0][1])) *
                  100
                ).toFixed(2);
                item.highLow = getHighLow(response.data);
                item.quoteVolume = getQuoteVolume(response.data);
                item.count = getCount(response.data);
              },
              (error) => {
                console.log(error);
                setError(true);
                clearInterval(intervalID);
              }
            );
          return Promise.resolve(item);
        };
        const request1w = async () => {
          const promises = symbols.map(async (item) => {
            const fetchedData = await fetch1wData(item);
            return fetchedData;
          });
          const data = await Promise.all(promises);
          setFuturesData(data);
        };
        request1w();
        intervalID = setInterval(() => {
          request1w();
        }, 8000);
        break;
    }
  };

  const selectFewerProps = (symbols) => {
    let {
      symbol,
      lastPrice,
      priceChangePercent,
      highPrice,
      lowPrice,
      quoteVolume,
      count,
    } = symbols;
    priceChangePercent = parseFloat(priceChangePercent).toFixed(2);
    const highLow =
      parseFloat(highPrice).toLocaleString('en-US') +
      ' / ' +
      parseFloat(lowPrice).toLocaleString('en-US');
    if (parseFloat(lastPrice) == parseFloat(highPrice)) {
      playSound();
      notification.open({
        message: symbol,
        description: 'ATH of ' + lastPrice,
        duration: 0,
      });
    } else if (parseFloat(lastPrice) == parseFloat(lowPrice)) {
      playSound();
      notification.open({
        message: symbol,
        description: 'ATL of ' + lastPrice,
        duration: 0,
      });
    }
    return {
      symbol,
      lastPrice,
      priceChangePercent,
      highLow,
      quoteVolume,
      count,
    };
  };

  const nFormatter = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'G';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else {
      return parseInt(num);
    }
  };

  const getHighLow = (data) => {
    return (
      parseFloat(
        Math.max.apply(
          Math,
          data.map((i) => {
            return i[2];
          })
        )
      ).toLocaleString('en-US') +
      ' / ' +
      parseFloat(
        Math.min.apply(
          Math,
          data.map((i) => {
            return i[3];
          })
        )
      ).toLocaleString('en-US')
    );
  };

  const getQuoteVolume = (data) => {
    let sumOfQuoteVolume = 0;
    data.map((i) => {
      sumOfQuoteVolume += parseFloat(i[7]);
    });
    return sumOfQuoteVolume;
  };

  const getCount = (data) => {
    let sumOfCount = 0;
    data.map((i) => {
      sumOfCount += i[8];
    });
    return sumOfCount;
  };

  const checkPercentageChange = (
    symbol,
    priceChangePercent,
    percentageChange
  ) => {
    if (priceChangePercent >= percentageChange) {
      playSound();
      if (props.popupNotification) {
        notification.open({
          message: symbol,
          description: 'has reached ' + priceChangePercent + '%',
          duration: 0,
        });
      }
    } else if (priceChangePercent <= -percentageChange) {
      playSound();
      if (props.popupNotification) {
        notification.open({
          message: symbol,
          description: 'has reached ' + priceChangePercent + '%',
          duration: 0,
        });
      }
    }
  };

  useEffect(() => {
    console.log('useEffect: ', props.submit);
    if (props.submit) {
      fetchData(timeInterval, percentageChange, symbols);
    }
    return () => {
      clearInterval(intervalID);
      setFuturesData('');
    };
  }, [props.submit]);

  if (error === true) {
    return (
      <Alert
        message="Error"
        description="Failed to fetch data from Binance API."
        type="error"
        showIcon
      />
    );
  } else if (props.submit) {
    return (
      <div className="FuturesTable">
        {console.log('Futures Data: ', futuresData)}
        <Table
          columns={columns}
          dataSource={futuresData}
          size="middle"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'],
          }}
          rowKey="symbol"
        />
      </div>
    );
  } else {
    return <div className="FuturesTable">No API is running.</div>;
  }
}
