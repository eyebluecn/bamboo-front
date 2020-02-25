import React from 'react';
import {Link, RouteComponentProps} from "react-router-dom";
import "./Login.less"
import BambooComponent from "../../common/component/BambooComponent";
import Form, {FormComponentProps} from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import {Col, Row, message as MessageBox} from 'antd';
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";

interface IProps extends RouteComponentProps, FormComponentProps {

}

interface IState {

}

class RawLogin extends BambooComponent<IProps, IState> {

  user: User = Moon.getSingleton().user

  constructor(props: IProps) {
    super(props);


    this.state = {};
  }


  componentDidMount() {

    this.initFormValue()

    //立即退出
    this.logout()
  }

  //退出登录
  logout() {

    this.user.httpLogout()

  }

  //初始化表单中的值
  initFormValue() {
    let that = this

    let user = that.user

    //基础字段统一填写
    let obj: any = user.getForm()

    this.props.form.setFieldsValue(obj);
  }


  handleSubmit(e: any) {
    e.preventDefault();

    let that = this

    let user = that.user

    this.props.form.validateFields((err, values) => {
      if (!err) {

        user.httpLogin(values["username"], values["password"], function () {
          MessageBox.success("登录成功！")

          that.props.history.push('/')

        })
      } else {
        MessageBox.error(err)
      }
    });
  };

  render() {

    let that = this

    //router中传入的路由相关对象
    let match = this.props.match;
    let location = this.props.location;
    let history = this.props.history;
    const {getFieldDecorator} = this.props.form;

    return (
      <div className="user-login">

        <Row>
          <Col span={8} offset={8}>

            <div className="welcome">
              欢迎登录
            </div>

            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
              <Form.Item hasFeedback>
                {getFieldDecorator('username', {
                  rules: [{required: true, message: '请输入用户名!'}],
                })(
                  <Input
                    prefix={<Icon type="user"/>}
                    placeholder="用户名"
                  />,
                )}
              </Form.Item>
              <Form.Item hasFeedback>
                {getFieldDecorator('password', {
                  rules: [{required: true, message: '请输入密码!'}],
                })(
                  <Input
                    prefix={<Icon type="lock"/>}
                    type="password"
                    placeholder="密码"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
                </Button>
                没有账号? <Link to="/user/register">立即注册</Link>
              </Form.Item>
            </Form>

          </Col>
        </Row>

      </div>
    );
  }
}


const Login = Form.create<IProps>({
  name: 'edit',
})(RawLogin);

export default Login;
