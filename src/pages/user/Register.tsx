import React from 'react';
import {Link, RouteComponentProps} from "react-router-dom";
import "./Register.less"
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
  confirmDirty: boolean
}


class RawRegister extends BambooComponent<IProps, IState> {

  user: User = Moon.getSingleton().user

  constructor(props: IProps) {
    super(props);


    this.state = {
      confirmDirty: false,
    };
  }


  componentDidMount() {


  }

  //初始化表单中的值
  initFormValue() {
    let that = this

    let user = that.user

    //基础字段统一填写
    let obj: any = user.getForm()

    obj["repassword"] = ""

    this.props.form.setFieldsValue(obj);
  }


  handleSubmit(e: any) {
    e.preventDefault();

    let that = this

    let user = that.user

    this.props.form.validateFields((err, values) => {
      if (!err) {

        user.httpRegister(values["username"], values["password"], function () {
          MessageBox.success("注册成功！")

          that.props.history.push('/')

        })
      } else {
        MessageBox.error(err)
      }
    });
  };

  handleConfirmBlur = (e: any) => {
    const {value} = e.target;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  };


  compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const {form} = this.props;
    console.log(rule, value, callback)
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule: any, value: any, callback: any) => {
    const {form} = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['repassword'], {force: true});
    }
    callback();
  };


  render() {

    let that = this

    //router中传入的路由相关对象
    let match = this.props.match;
    let location = this.props.location;
    let history = this.props.history;
    const {getFieldDecorator} = this.props.form;

    return (
      <div className="user-register">

        <Row>
          <Col span={8} offset={8}>

            <div className="welcome">
              欢迎注册
            </div>

            <Form onSubmit={this.handleSubmit.bind(this)} className="register-form">
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{required: true, message: '请输入用户名!'}],
                })(
                  <Input
                    prefix={<Icon type="user"/>}
                    placeholder="用户名"
                  />,
                )}
              </Form.Item>

              <Form.Item  hasFeedback>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码',
                    },
                    {
                      validator: this.validateToNextPassword,
                    },
                  ],
                })(<Input.Password prefix={<Icon type="lock"/>} placeholder="密码"/>)}
              </Form.Item>
              <Form.Item hasFeedback>
                {getFieldDecorator('repassword', {
                  rules: [
                    {
                      required: true,
                      message: '请再次输入密码!',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(<Input.Password
                  prefix={<Icon type="lock"/>}
                  onBlur={this.handleConfirmBlur}
                  placeholder="确认密码"
                />)}
              </Form.Item>


              <Form.Item>
                <Button type="primary" htmlType="submit" className="register-form-button">
                  注册
                </Button>
                已有账号? <Link to="/user/login">立即登录</Link>
              </Form.Item>
            </Form>

          </Col>
        </Row>

      </div>
    );
  }
}


const Register = Form.create<IProps>({
  name: 'edit',
})(RawRegister);

export default Register;
