import React from 'react';
import {Link, RouteComponentProps} from "react-router-dom";
import "./ChangePasswordModal.less"
import BambooComponent from "../../common/component/BambooComponent";
import Form, {FormComponentProps} from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import {Col, Row, message as MessageBox, Modal} from 'antd';
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";

interface IProps extends FormComponentProps {

  onSuccess: () => void
  onClose: () => void
}

interface IState {

}

export default class ChangePasswordModal extends BambooComponent<IProps, IState> {

  user: User = Moon.getSingleton().user

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  static open(onSuccess: () => void) {

    let modal = Modal.success({
      okCancel: false,
      okButtonProps: {
        className: "display-none"
      },
      icon: null,
      content: <WrappedChangePasswordModal
        onSuccess={() => {

          onSuccess()
          modal.destroy()
        }}
        onClose={() => {
          modal.destroy()
        }}/>,
    })

  }

  componentDidMount() {

    this.initFormValue()

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


        let oldPassword: string = values["oldPassword"]
        let newPassword: string = values["newPassword"]
        let rePassword: string = values["rePassword"]

        if (newPassword !== rePassword) {
          MessageBoxUtil.error("两次密码输入不一致！")
          return
        }

        user.httpChangePassword(oldPassword, newPassword, function () {

          that.props.onSuccess()

        })
      } else {
        MessageBox.error(err)
      }
    });
  };

  render() {

    let that = this

    const {getFieldDecorator} = this.props.form;

    return (
      <div className="change-password-modal">

        <Row>
          <Col>

            <div className="title">
              修改密码
            </div>

            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">

              <Form.Item hasFeedback>
                {getFieldDecorator('oldPassword', {
                  rules: [{required: true, message: '请输入原密码!'}],
                })(
                  <Input
                    prefix={<Icon type="lock"/>}
                    type="password"
                    placeholder="请输入原密码"
                  />,
                )}
              </Form.Item>

              <Form.Item hasFeedback>
                {getFieldDecorator('newPassword', {
                  rules: [{required: true, message: '请输入新密码!'}],
                })(
                  <Input
                    prefix={<Icon type="lock"/>}
                    type="password"
                    placeholder="请输入新密码"
                  />,
                )}
              </Form.Item>

              <Form.Item hasFeedback>
                {getFieldDecorator('rePassword', {
                  rules: [{required: true, message: '请输入确认新密码!'}],
                })(
                  <Input
                    prefix={<Icon type="lock"/>}
                    type="password"
                    placeholder="请输入确认新密码"
                  />,
                )}
              </Form.Item>

              <Form.Item>
                <div className="btn-area">
                  <Button type="default" className="login-form-button" onClick={this.props.onClose.bind(this.props)}>
                    关闭
                  </Button>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    提交
                  </Button>
                </div>

              </Form.Item>
            </Form>

          </Col>
        </Row>

      </div>
    );
  }
}


const WrappedChangePasswordModal = Form.create<IProps>({
  name: 'ChangePasswordModal',
})(ChangePasswordModal);


