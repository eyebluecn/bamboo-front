import React from 'react';
import './App.less';
import {BrowserRouter as Router} from "react-router-dom";
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import BambooComponent from "./common/component/BambooComponent";
import Frame from "./pages/Frame";
import Sun from "./common/model/global/Sun";

interface IProps {


}

interface IState {

}

export default class App extends BambooComponent<IProps, IState> {


  constructor(props: IProps) {
    super(props);


    this.state = {};
  }


  componentDidMount() {




  }

  render() {

    let that = this

    return (
      <Router>
        <ConfigProvider locale={zhCN}>
          <Frame/>
        </ConfigProvider>

      </Router>
    );
  }
}

